import React from "react";
import Image from "next/image";
import Link from 'next/link';

const UserRoleCard = ({ role, imageSrc, altText }) => {
  return (
    <Link href="/tracking" className="bg-white h-32 w-full rounded-2xl p-4 flex items-center gap-7 transition-transform transform hover:scale-105">
      <Image
        src={imageSrc}
        alt={altText}
        width={90}
        height={90}
        layout="intrinsic"
        priority
      />
      <p className="text-lg font-semibold text-gray-800">{role}</p>
      <img src="/images/next.png" alt="Next" className="w-5 ml-auto mr-2" />
    </Link>
  );
};

const User = () => {
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <section className="flex bg-[#FDD51A] h-28 rounded-b-[42px] mb-8 justify-center items-center font-extrabold p-4">
        <div className="flex items-center justify-center mr-4">
          <Image
            src="/images/bus2.png"
            alt="School bus"
            width={50}
            height={50}
            priority
          />
        </div>
        <div className="text-3xl text-gray-900">You are?</div>
      </section>

      <section className="flex flex-col items-center my-4 px-4 gap-4">
        <UserRoleCard
          role="Bus Driver"
          imageSrc="/images/driver.gif"
          altText="Bus Driver"
        />
        <UserRoleCard
          role="Student"
          imageSrc="/images/student.gif"
          altText="Student"
        />
        <UserRoleCard
          role="Parent"
          imageSrc="/images/parent.gif"
          altText="Parent"
        />
        <UserRoleCard
          role="Administrator"
          imageSrc="/images/administrator.gif"
          altText="Administrator"
        />
      </section>
    </div>
  );
};

export default User;
