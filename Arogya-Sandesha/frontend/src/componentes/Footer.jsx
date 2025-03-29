import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        {/* ----- left section ----- */}
        <div>
            <img className='mb-5 w-40 ' src={assets.razorpay_logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>We aim to reduce waiting times, improve hospital workflow, and provide patients with a seamless registration and consultation process. By integrating modern IoT technology with healthcare services, we strive to make hospital visits more organized and efficient.</p>
        </div>

        {/* ----- center section ----- */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        {/* ----- right section ----- */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91-0000000000</li>
                <li>arogyasandesh@gmail.com</li>
            </ul>
        </div>
      </div>

      {/* ----- Copyright section ----- */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024 @ Greatstack.dev - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
