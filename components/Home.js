import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";

const Home = () => {
  const router = useRouter();
  
  return (
    <section className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header with skip button */}
      <header className="w-full px-6 py-5 flex justify-end">
        <button
          onClick={() => router.push("/user")}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
          aria-label="Skip introduction"
        >
          Skip <ChevronRight size={16} />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Image with subtle shadow and improved container */}
        <div className="w-full max-w-md mb-10 relative">
          <div className="absolute inset-0  opacity-10 rounded-3xl transform translate-y-4"></div>
          <div className="relative  rounded-2xl p-6  overflow-hidden ">
            <Image
              src="/images/busy.png"
              alt="School bus tracking system"
              width={400}
              height={300}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Heading and description with improved typography */}
        <div className="text-center max-w-md mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            School Bus GPS Tracking
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time monitoring to ensure your child&apos;s safe journey to and from school.
          </p>
        </div>

        {/* Pagination dots with subtle animation */}
        <div className="flex justify-center mb-12">
          <span className="h-2.5 w-2.5 bg-gray-300 rounded-full mx-1.5 transition-all duration-300"></span>
          <span className="h-2.5 w-8 bg-[#FDD51A] rounded-full mx-1.5 transition-all duration-300"></span>
          <span className="h-2.5 w-2.5 bg-gray-300 rounded-full mx-1.5 transition-all duration-300"></span>
        </div>

        {/* Get Started button with refined animation */}
        <button
          type="button"
          onClick={() => router.push("/user")}
          className="group flex items-center gap-2 bg-[#FDD51A] text-gray-900 font-semibold text-lg py-4 px-10 rounded-full shadow-md hover:shadow-lg hover:bg-[#FFE04A] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all transform hover:scale-105"
        >
          Get Started
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </main>
    </section>
  );
};

export default Home;