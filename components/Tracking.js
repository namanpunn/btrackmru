import React from "react";
import Bottomnavbar from  "./Bottomnavbar";


const Tracking = () => {
  return (
    <div>
      <section className="flex bg-[#FDD51A] h-20 px-7 items-center font-extrabold p-4">
        {/* Next Image */}
        <div className="mr-4">
          <img
            src="images/next.png"
            alt="Previous"
            className="z-10 w-6 h-6 transform rotate-180"
          />
        </div>

        <div className="mr-4 bg-slate-100 rounded-full h-9 w-9 flex items-center justify-center">
          <img
            src="images/profile.gif"
            alt="Previous"
            className="z-10 w-6 h-6 transform"
          />
        </div>

        {/* User Name */}
        <p className="text-2xl text-gray-900">Naman Punn</p>
      </section>

      <section className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.97715720201!2d77.28283372549413!3d28.450104975764862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce0ab6fec0aab%3A0x87c9e10e1ae0b0fc!2sManav%20Rachna%20International%20Institute%20Of%20Research%20And%20Studies!5e0!3m2!1sen!2sin!4v1729111045578!5m2!1sen!2sin&zoom=14&scrollwheel=false&gestureHandling=none&disableDefaultUI=true"
          width="600"
          height="450"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          className="h-72 w-full"
          zoom ="14"
          scrollwheel="false"
          gestureHandling="none"
          disableDefaultUI="true"
        ></iframe>

        <img
          src="images/bus2.png"
          alt=""
          className="z-50 h-8 w-12 relative -top-28 left-20"
        />
      </section>

      <section className="bg-slate-100 -mt-8 h-[27rem] p-5 flex flex-col gap-6 rounded-lg shadow-md ">
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between shadow hover:shadow-lg transition-shadow duration-300 ease-in-out mt-5">
          <span className="font-medium">BUS Route No.</span>
          <span className="font-semibold">Shuttle 1</span>
        </div>
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <span className="font-medium">ETA:</span>
          <span className="font-semibold">5 minutes</span>
        </div>
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <span className="font-medium">My Stopage:</span>
          <span className="font-semibold">Badkal Mod</span>
        </div>
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <span className="font-medium">Current Stopage:</span>
          <span className="font-semibold">Maewla Maharaj</span>
        </div>
      </section>

      <section>
        <Bottomnavbar/>
      </section>
    </div>
  );
};

export default Tracking;
