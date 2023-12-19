/* eslint-disable no-unused-vars */
import React from 'react'

const Profile = () => {
  return (
    <div className='bg-gray-100 min-h-min'>
      {/* Cover Photo */}
      <div
        className='h-80 bg-cover bg-center relative'
        style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/ledvgumQmauwI-C2mKr31nAJ4rVLkNz3GAz8fpufS2HdNXVOKVQ1bLOuqYg_kJ8XWiYW9fovz298cBjknYB0sMwpiu6uG8tlpw=w1200-h600-pp-rj-s365)'}}
      >
        {/* Profile Picture */}
        <div className='h-44 w-44 bg-white rounded-full border-4 border-white absolute -bottom-10 left-36 transform translate-x-1/2 -trnaslate-y-1/2'>
          {/*can add profile Picture here */}
        </div>
      </div>

      {/* User Information */}
      <div className='max-w-2xl mx-auto px-5 mt-4'>
        <h1 className='text-3xl font-bold text-gray-800'>Jorz Tandog</h1>
        <p className='text-gray-500'>Web Developer | Kodego | Web Designer</p>
      </div>
    </div>
  )
}

export default Profile;