import React from 'react'
import Image from 'next/image'

const Home = () => {
  return (
    <div>
      <section className="flex flex-col h-screen p-4 justify-center">
        {/* Skip button */}
        <div className="flex justify-end w-full mb-4">
          <p className="font-semibold">Skip</p>
        </div>

        {/* Image */}
        <div className="flex justify-center mb-4">
          <Image 
            src="/images/bus.jpg" 
            alt="School bus" 
            width={350} 
            height={300} 
          />
        </div>

        {/* Heading and description */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-semibold">We Provide School Bus GPS Tracking System</h1>
          <p className="text-gray-500">Tracking your child during travel in the school bus</p>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mb-4">
          <span className="h-2 w-2 bg-gray-300 rounded-full mx-1"></span>
          <span className="h-2 w-2 bg-blue-500 rounded-full mx-1"></span>
          <span className="h-2 w-2 bg-gray-300 rounded-full mx-1"></span>
        </div>

        {/* Get Started button */}
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white text-lg py-2 px-10 rounded-full">
            Get Started
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
