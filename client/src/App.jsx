import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Doctors from './pages/Doctors.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MyProfile from './pages/MyProfile.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import Appointment from './pages/Appointment.jsx'
import Navbar from './componentes/Navbar.jsx'
import Footer from './componentes/Footer.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  console.log("in app");
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/> 
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
