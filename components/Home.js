import Image from "next/image";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center gap-7 h-screen p-6 mt-6">
      {/* Skip button */}
      <div className="flex justify-end w-full pt-5 p-3">
        <button
          className="font-semibold hover:text-blue-500 transition-colors"
          aria-label="Skip introduction"
        >
          Skip
        </button>
      </div>

      {/* Image */}
      <div className="flex justify-center items-center my-6">
        <Image
          src="/images/bus.jpg"
          alt="School bus"
          width={350}
          height={300}
          layout="responsive"
          priority
        />
      </div>

      {/* Heading and description */}
      <div className="text-center px-4">
        <h1 className="text-xl font-bold text-gray-900">
          We Provide School Bus GPS Tracking System
        </h1>
        <p className="text-gray-500 mt-2">
          Track your child during travel in the school bus.
        </p>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center my-3">
        <span className="h-3 w-3 bg-gray-300 rounded-full mx-1"></span>
        <span className="h-3 w-3 bg-[#FDD51A] rounded-full mx-1"></span>
        <span className="h-3 w-3 bg-gray-300 rounded-full mx-1"></span>
      </div>

      {/* Get Started button */}
      <button
        type="button"
        onClick={() => router.push("/user")}
        className="bg-[#FDD51A] border-black border-1 text-white text-lg py-3 px-12 rounded-full mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition "
      >
        Get Started
      </button>
    </section>
  );
};

export default Home;
