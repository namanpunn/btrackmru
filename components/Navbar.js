import React from 'react';
import { Home, Wallet, Plus, Settings, User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center">
      <div className="z-50 w-full max-w-md bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-between px-2 py-2">
        <div className="grid grid-cols-5 w-full">
          <Link href="/">
            <button
              type="button"
              className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-gray-50  transition-colors"
            >
              <Home size={20} className="text-gray-500 " />
              <span className="text-xs mt-1 text-gray-500">Home</span>
            </button>
          </Link>

          <Link href="/user">
          <button
            type="button"
            className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-gray-50  transition-colors"
          >
            <Wallet size={20} className="text-gray-500" />
            <span className="text-xs mt-1 text-gray-500">Roles</span>
          </button>
          </Link>

          <div className="flex items-center justify-center">
          <Link href="/developing">
            <button
              type="button"
              className="inline-flex items-center justify-center w-12 h-12 font-medium bg-[#FDD51A] rounded-full hover:bg-[#FFE04A] shadow-md transition-colors"
            >
              <Plus size={24} className="text-gray-800" />
            </button>
            </Link>
          </div>

          <Link href="/developing">
          <button
            type="button"
            className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-gray-50  transition-colors"
          >
            <Settings size={20} className="text-gray-500 " />
            <span className="text-xs mt-1 text-gray-500">Settings</span>
          </button>
          </Link>

          <Link href="/developing">
          <button
            type="button"
            className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-gray-50  transition-colors"
          >
            <User size={20} className="text-gray-500 " />
            <span className="text-xs mt-1 text-gray-500">Profile</span>
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;