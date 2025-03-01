"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    src: "/images/busy.png",
    alt: "Slide 1",
    title: "School Bus GPS Tracking",
    description: "Real-time monitoring to ensure your child's safe journey.",
    width: "350",
    height: "350"
  },
  {
    src: "/images/homelocation.png",
    alt: "Slide 2",
    title: "Live Location Updates",
    description: "Stay informed with live updates of your bus location.",
    width: "280",
    height: "300"
  },
  {
    src: "/images/homealert.png",
    alt: "Slide 3",
    title: "Safety Alerts",
    description: "Receive instant alerts for any delays or emergencies.",
    width: "220",
    height: "150"
  },
];

export default function Home() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance && currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push("/user");
    }
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header with Skip Button */}
      <header className="w-full px-6 py-5 flex justify-end">
        <button
          onClick={() => router.push("/user")}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
        >
          Skip <ChevronRight size={16} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Carousel Container */}
        <div
          className="relative w-full max-w-lg mx-auto overflow-hidden "
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div key={idx} className="w-full flex-none flex flex-col items-center">
                {/* Image Section */}
                <div className="relative w-full h-64 md:h-80 flex justify-center items-center">
  <Image
    src={slide.src}
    alt={slide.alt}
    height={slide.height}
    width={slide.width}
    priority
    className="object-contain"
  />
</div>

                {/* Text Section */}
                <div className="text-center mt-6 px-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {slide.title}
                  </h1>
                  <p className="text-gray-600 text-lg">{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 mb-6">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-2.5 mx-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-8 bg-yellow-400" : "w-2.5 bg-gray-300"
              }`}
            ></span>
          ))}
        </div>

        {/* Conditional Next / Get Started Button */}
        <button
          type="button"
          onClick={handleNextClick}
          className="group flex items-center gap-2 bg-yellow-400 text-gray-900 font-semibold text-lg py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all transform hover:scale-105"
        >
          {currentIndex < slides.length - 1 ? (
            <>
              Next{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          ) : (
            "Get Started"
          )}
        </button>
      </main>
    </section>
  );
}
