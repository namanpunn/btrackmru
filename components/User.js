import React from "react";
import Image from "next/image";
import Link from 'next/link';

const UserRoleCard = ({ role, imageSrc, altText, description }) => {
  return (
    <Link href="/tracking" className="bg-white w-full rounded-2xl p-4 flex items-center gap-5 transition-all hover:shadow-md hover:scale-102">
      <div className="bg-gray-50 rounded-full p-2 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={altText}
          width={70}
          height={70}
          priority
          className="object-contain"
        />
      </div>
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{role}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="bg-[#FDD51A] rounded-full p-2 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </Link>
  );
};

const User = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* App Header */}
      <header className="bg-[#FDD51A] px-5 pt-6 pb-10 rounded-b-[32px]">
        <div className="flex items-center mb-2">
          <button className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <Image
              src="/images/bus2.png"
              alt="School bus"
              width={40}
              height={40}
              priority
            />
          <h1 className="text-xl font-bold flex-1 text-center">Select Your Role</h1>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
       
      </header>

      {/* Main Content - Role Cards */}
      <main className="px-5 -mt-5 mb-6 z-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="text-gray-500 text-sm mb-4">Please select your role to continue</p>
          
          <div className="space-y-4">
            <UserRoleCard
              role="Bus Driver"
              imageSrc="/images/driver.gif"
              altText="Bus Driver"
              description="Track & manage your route"
            />
            <div className="border-b border-gray-100"></div>
            
            <UserRoleCard
              role="Student"
              imageSrc="/images/student.gif"
              altText="Student"
              description="Track your school bus"
            />
            <div className="border-b border-gray-100"></div>
            
            <UserRoleCard
              role="Parent"
              imageSrc="/images/parent.gif"
              altText="Parent"
              description="Monitor your child's bus"
            />
            <div className="border-b border-gray-100"></div>
            
            <UserRoleCard
              role="Administrator"
              imageSrc="/images/administrator.gif"
              altText="Administrator"
              description="Manage the entire system"
            />
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800">Need help? Contact support for assistance</p>
          </div>
        </div>
      </main>
    
    </div>
  );
};

export default User;