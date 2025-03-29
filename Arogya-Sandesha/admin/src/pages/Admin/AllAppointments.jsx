import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllappointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  
  const [selectedQR, setSelectedQR] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllappointments();
    }
  }, [aToken]);

  // Function to open modal
  const openQRModal = (qrUrl, patientName) => {
    setSelectedQR(qrUrl);
    setSelectedPatient(patientName);
  };

  // Function to close modal
  const closeQRModal = () => {
    setSelectedQR(null);
    setSelectedPatient("");
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>QR Code</p>
          <p>Actions</p>
        </div>

        {appointments &&
          appointments.reverse().map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 h-8 rounded-full" src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 h-8 rounded-full bg-gray-200" src={item.docData.image} alt="" />
                <p>{item.docData.name}</p>
              </div>
              <p>{currency}{item.amount}</p>

              {/* QR Code Display */}
              {item.qrCodeUrl ? (
                <img
                  src={item.qrCodeUrl}
                  alt="QR Code"
                  className="w-10 h-10 cursor-pointer border rounded"
                  onClick={() => openQRModal(item.qrCodeUrl, item.userData.name)}
                />
              ) : (
                <p className="text-gray-400 text-xs">No QR</p>
              )}

              {/* Cancel or Completed Status */}
              {item.cancelled ? (
                <p className="text-red-400 text-sm font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-sm font-medium">Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
              )}
            </div>
          ))}
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeQRModal}
        >
          <div
            className="bg-white p-5 rounded-lg shadow-lg text-center relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-lg"
              onClick={closeQRModal}
            >
              ✖
            </button>
            <p className="text-lg font-semibold mb-3">{selectedPatient}</p>
            <img src={selectedQR} alt="QR Code" className="w-48 h-48 mx-auto border rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
