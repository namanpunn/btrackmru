'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { X } from "react-feather";

const UserRoleCard = ({ role, imageSrc, altText, description }) => {
  return (
    <Link
      href="/tracking"
      className="bg-white w-full rounded-2xl p-4 flex items-center gap-5 transition-all hover:shadow-md hover:scale-102"
    >
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </Link>
  );
};

const User = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* App Header */}
      <header className="bg-[#FDD51A] px-6 pt-8 pb-12 rounded-b-[32px] shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
          >
            <ArrowLeft size={18} className="text-gray-800" />
          </Link>
          <div className="flex items-center space-x-3 pl-8">
            <Image 
              src="/images/bus2.png" 
              alt="School bus" 
              width={40} 
              height={40} 
              priority 
            />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Select Your Role</h1>
          </div>
          {/* Spacer to balance the left back button */}
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content - Role Cards */}
      <main className="px-5 -mt-5 mb-6 z-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="text-gray-500 text-sm mb-4">
            Please select your role to continue
          </p>

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
              description="Monitor your ward's bus"
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

        {/* Support Contact Section */}
        <div 
          className="bg-blue-50 rounded-xl p-4 flex items-center cursor-pointer"
          onClick={openModal}
        >
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="blue"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              Need help? Contact support for assistance
            </p>
          </div>
        </div>
      </main>

      {/* Modal for Contact Support */}
      {isModalOpen && (
        <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-xl shadow-2xl p-8 relative max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Support</h2>
          <div className="space-y-4">
          <p className="text-blue-700">
        <span className="font-medium text-gray-600">Email:</span>{" "}
        <a href="mailto:support@btrack.com" className="hover:underline">
          support@btrack.com
        </a>
      </p>
      <p className="text-blue-700">
        <span className="font-medium text-gray-600">Contact Number:</span>{" "}
        <a href="tel:+919354855980" className="hover:underline">
          +91-9354855980
        </a>
      </p>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default User;
