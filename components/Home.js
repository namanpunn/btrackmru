import Image from "next/image"

const page = () => {
  return (
    <>
      <section className="flex flex-col items-center gap-7 h-screen p-6 mt-16">
        {/* Skip button */}
        <div className="flex justify-end w-full pt-5 p-3">
          <p className="font-semibold">Skip</p>
        </div>

        {/* Image */}
        <div className="flex justify-center items-center my-6">
          <Image 
            src="/images/bus.jpg" 
            alt="School bus" 
            width={350} 
            height={300} 
          />
        </div>

        {/* Heading and description */}
        <div className="text-center">
          <h1 className="text-lg font-semibold">We Provide School Bus GPS Tracking System</h1>
          <p className="text-gray-500">Tracking your child during traveling in school bus</p>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center my-3">
          <span className="h-2 w-2 bg-gray-300 rounded-full mx-1"></span>
          <span className="h-2 w-2 bg-blue-500 rounded-full mx-1"></span>
          <span className="h-2 w-2 bg-gray-300 rounded-full mx-1"></span>
        </div>

        {/* Get Started button */}
        <button className="bg-blue-600 text-white text-lg py-2 px-10 rounded-full mt-4">
          Get Started
        </button>
      </section>
    </>
  )
}

export default page
