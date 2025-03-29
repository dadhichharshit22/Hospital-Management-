import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";
import QRCode from "qrcode";
import dotenv from 'dotenv';
dotenv.config();
import cron from "node-cron";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary Object:", cloudinary);
console.log("Cloudinary Config:", cloudinary.config());


//API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }

    //validating a strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashdPassord = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashdPassord,
    };

    const newUser = new UserModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not Exit " });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: true, message: "Invalid credentails " });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await UserModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imagefile = req.file;
    if (!name || !phone || !gender || !dob) {
      return res.json({ success: false, message: "Data Missing" });
    }
    await UserModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      address: JSON.parse(address),
      gender,
    });
    if (imagefile) {
      //upload image  to cloudinary
      const imageupload = await cloudinary.uploader.upload(imagefile.path, {
        resource_type: "image",
      });
      const imageURL = imageupload.secure_url;
      await UserModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/////whtsap
 
// 📌 **Updated Booking API with Same-Day Booking & Dynamic Token**
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await UserModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Generate Unique QR Code Data (Timestamp-Date)
    const qrText = `Appointment-${Date.now()}-${slotDate}`;
    
    // Generate QR Code
    const qrImageBuffer = await QRCode.toBuffer(qrText);

    // Upload QR Code to Cloudinary
    const qrUpload = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.log("QR Upload Error:", error);
          return res.json({ success: false, message: "QR Code upload failed" });
        }

        // Update appointment with QR Image URL
        await appointmentModel.findByIdAndUpdate(newAppointment._id, {
          qrCodeUrl: result.secure_url,
        });

        // Save new slots data in doctor model
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Booked",qrCodeUrl: result.secure_url });
      }
    );

    qrUpload.end(qrImageBuffer);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};







// 📌 **QR Code Generation Logic (Runs Every Minute)**
const generateQRCodeForAppointments = async () => {
  try {
    const currentTime = new Date();
    console.log(`🟢 Running QR Code Generation Job at: ${currentTime.toLocaleString()}`);

    const formattedDate = `${currentTime.getDate()}_${currentTime.getMonth() + 1}_${currentTime.getFullYear()}`;
    const upcomingAppointments = await appointmentModel.find({
      slotDate: formattedDate,
      qrCodeUrl: null,  });

    console.log(`📢 Appointments Found: ${upcomingAppointments.length}`);

    for (let appointment of upcomingAppointments) {
      // 🔄 Fetch the latest data for this appointment
      const freshAppointment = await appointmentModel.findById(appointment._id);

      console.log(`📌 Appointment ID: ${freshAppointment._id}, Serial Number: ${freshAppointment.serialNumber}`);

      if (!freshAppointment.serialNumber) {
        console.log("❌ Error: Serial number is undefined!");
        continue; // Skip this appointment
      }

      const [day, month, year] = freshAppointment.slotDate.split("_");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const appointmentTime = new Date(`${formattedDate} ${freshAppointment.slotTime}`);

      const qrGenerationTime = new Date(appointmentTime);
      qrGenerationTime.setMinutes(qrGenerationTime.getMinutes() - 30);

      if (currentTime >= qrGenerationTime && currentTime < appointmentTime) {
        console.log(`⚡ Generating QR Code for Appointment ID: ${freshAppointment._id}...`);

        // 📌 **Fix: Use freshAppointment.serialNumber**
        const qrText = `Token-${freshAppointment.serialNumber}`;
        const qrImageBuffer = await QRCode.toBuffer(qrText);

        console.log("📤 Uploading QR Code to Cloudinary...");
        const qrUrl = await uploadToCloudinary(qrImageBuffer);

        await appointmentModel.findByIdAndUpdate(freshAppointment._id, { qrCodeUrl: qrUrl });
        console.log(`✅ QR Code Generated Successfully for Appointment ID: ${freshAppointment._id}`);
      } else {
        console.log(`🚫 Skipping Appointment ID: ${freshAppointment._id} (Not within QR Generation Time Window)`);
      }
    }
  } catch (error) {
    console.error("❌ Error in QR Code Generation:", error);
  }
};




// 🕒 Run the function every minute
cron.schedule("* * * * *", generateQRCodeForAppointments);

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          reject(error);
        } else {
          console.log("✅ QR Code Uploaded:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
};
import Razorpay from 'razorpay'; // Ensure it's imported


//// 📌 API to List User Appointments for "My Appointments" Page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 📌 API to Cancel Appointment (Handles Slot Release & Token Reordering)
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentData._id, { cancelled: true });

    // 📌 **Release Doctor's Slot**
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // 📌 **Reorder Tokens After Cancellation**
    const remainingAppointments = await appointmentModel.find({ docId, slotDate }).sort("slotTime");
    remainingAppointments.forEach(async (appt, index) => {
      await appointmentModel.findByIdAndUpdate(appt._id, { serialNumber: index + 1 });
    });

    res.json({ success: true, message: "Appointment Cancelled and Token Numbers Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Fix: Capitalized "Razorpay" Constructor
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 📌 API to Make Payment for Appointment
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // ✅ Fix: `appointmentId.cancelled` → `appointmentData.cancelled`
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment cancelled or not found" });
    }

    // ✅ Fix: `receipt` should be a string, so convert ObjectId
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentData._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 📌 API to Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Export Functions
export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};

