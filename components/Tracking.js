'use client'
import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Bus, Route, Navigation, MoreVertical } from "lucide-react";
import Link from "next/link";

const Tracking = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef({});

  // Sample coordinates - replace these with your actual coordinates
  const busLocation = [28.4356, 77.1040]; // Bus location [lat, lng]
  const userLocation = [28.4336, 77.1036]; // User location [lat, lng]
  const stopLocation = [28.4306, 77.10345]; // Stop location [lat, lng]
  
  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || leafletMapRef.current || !window.L) return;

    // Initialize map
    leafletMapRef.current = L.map(mapRef.current, {
      center: busLocation,
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMapRef.current);

    // Create markers
    createMarkers();
  };

  const createMarkers = () => {
    if (!leafletMapRef.current || !window.L) return;
    const map = leafletMapRef.current;

    // Create custom icon for bus
    const busIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="bus-marker">
          <div class="pulse-circle"></div>
          <div class="bus-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v.01"></path>
              <path d="M16 6v.01"></path>
              <path d="M4 10h16"></path>
              <path d="M19 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"></path>
              <path d="M6 15v2"></path>
              <path d="M18 15v2"></path>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Create custom icon for user
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="user-marker">
          <div class="user-pulse"></div>
          <div class="user-dot"></div>
          <div class="user-label">You</div>
        </div>
      `,
      iconSize: [60, 40],
      iconAnchor: [30, 20]
    });

    // Create custom icon for stop
    const stopIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="stop-marker">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div class="stop-label">Your Stop</div>
        </div>
      `,
      iconSize: [80, 50],
      iconAnchor: [40, 35]
    });

    // Add markers to map
    markersRef.current.bus = L.marker(busLocation, { icon: busIcon }).addTo(map);
    markersRef.current.user = L.marker(userLocation, { icon: userIcon }).addTo(map);
    markersRef.current.stop = L.marker(stopLocation, { icon: stopIcon }).addTo(map);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#FDD51A] px-5 py-3 flex items-center sticky top-0 z-30 shadow-sm">
        <Link href="/user" className="p-2 -ml-2 bg-white/20 rounded-full">
          <ArrowLeft size={18} className="text-gray-800" />
        </Link>
        
        <div className="flex items-center ml-2">
          <div className="bg-white rounded-full h-7 w-7 flex items-center justify-center shadow-sm overflow-hidden">
            <img
              src="images/profile.gif"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="font-bold text-gray-900 leading-tight">Naman Punn</p>
            <p className="text-xs text-gray-700 leading-tight">Student • Shuttle 1</p>
          </div>
        </div>

        <div className="ml-auto flex gap-2">
          <a href="tel:9354855980">
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200">
            <Phone size={16} className="text-gray-700" />
          </button>
          </a>
          <a href="https://wa.me/+919354855980" target="_blank">
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200">
            <img src="/images/whatsapp.png" alt="" className="w-4 h-4 flex justify-center items-center" />
          </button>
          </a>
          {/* <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200">
            <MoreVertical size={16} className="text-gray-700" />
          </button> */}
        </div>
      </header>

      {/* Map Section */}
      <div className="relative w-full z-10">
        <div 
          ref={mapRef}
          style={{ 
            height: isExpanded ? "65vh" : "38vh",
            width: "100%",
            filter: "contrast(1.05) saturate(1.1)"
          }}
          className="transition-all duration-300"
        />

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button 
            onClick={() => {
              setIsExpanded(!isExpanded);
              // Trigger a resize event to make Leaflet adjust its container
              setTimeout(() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.invalidateSize();
                }
              }, 350);
            }} 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            aria-label={isExpanded ? "Collapse map" : "Expand map"}
          >
            {isExpanded ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-black  ">
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            }
          </button>
          <button 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            onClick={() => {
              if (leafletMapRef.current && markersRef.current.bus) {
                leafletMapRef.current.setView(busLocation, 15);
              }
            }}
          >
            <img src="/images/currentlocation.png" alt="" className="w-4 h-4 flex justify-center items-center"/>
          </button>
        </div>

        {/* ETA Display */}
        <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center z-20">
          <div className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center">
            <Bus size={20} className="text-gray-900" />
          </div>
          <div className="ml-3">
            <p className="text-xs text-gray-600">Arriving in</p>
            <p className="text-lg font-bold text-gray-900">5 min</p>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div 
        className={`bg-white rounded-t-3xl -mt-8 flex-1 z-20 shadow-lg px-5 pt-4 pb-20 transition-all duration-300 ${isInfoExpanded ? 'max-h-[800px]' : 'max-h-24 overflow-hidden'}`}
      >
        {/* Handle for expanding/collapsing */}
        <div 
          className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3 cursor-pointer"
          onClick={() => setIsInfoExpanded(!isInfoExpanded)}
        ></div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Track Your Bus</h2>
          <div className="flex items-center gap-1 bg-red-100 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-medium text-red-700">connecting</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center border border-gray-100 shadow-sm">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Bus size={20} className="text-yellow-700" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs text-gray-500 uppercase">Bus Route</p>
              <p className="font-medium text-gray-800">Shuttle 1</p>
            </div>
            <div className="bg-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
              #B2854
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center border border-gray-100 shadow-sm">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock size={20} className="text-blue-700" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs text-gray-500 uppercase">Arrival Time</p>
              <p className="font-medium text-gray-800">5 minutes</p>
            </div>
            <div className="text-sm font-medium text-blue-600">
              09:42 AM
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center border border-gray-100 shadow-sm">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin size={20} className="text-green-700" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs text-gray-500 uppercase">Your Stop</p>
              <p className="font-medium text-gray-800">Badkal Mod</p>
            </div>
            <button className="text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors duration-200">
              View
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center border border-gray-100 shadow-sm">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Route size={20} className="text-purple-700" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs text-gray-500 uppercase">Current Stop</p>
              <div className="flex items-center">
                <p className="font-medium text-gray-800">Maewla Maharaj</p>
                <div className="w-1 h-1 bg-gray-400 rounded-full mx-2"></div>
                <p className="text-xs text-gray-500">2 stops away</p>
              </div>
            </div>
            <div className="bg-purple-100 px-3 py-1 rounded-full text-xs font-medium text-purple-700">
              2/8
            </div>
          </div>
        </div>
        
        {/* Journey progress */}
        <div className="mt-5 px-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Journey Progress</span>
            <span className="text-xs font-medium text-gray-700">25%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-1/4"></div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>

      {/* Global styles for map markers */}
      <style jsx global>{`
        /* Bus marker styles */
        .bus-marker {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .pulse-circle {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(253, 213, 26, 0.3);
          animation: pulse 1.5s infinite;
        }
        .bus-icon {
          position: relative;
          width: 36px;
          height: 36px;
          background-color: #FDD51A;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .bus-icon svg {
          color: #1f2937;
        }

        /* User marker styles */
        .user-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .user-pulse {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.3);
          animation: pulse 1.5s infinite;
        }
        .user-dot {
          position: relative;
          width: 8px;
          height: 8px;
          background-color: #3B82F6;
          border-radius: 50%;
          border: 2px solid white;
        }
        .user-label {
          margin-top: 2px;
          padding: 1px 8px;
          background-color: white;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Stop marker styles */
        .stop-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stop-label {
          margin-top: -5px;
          padding: 1px 8px;
          background-color: white;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Animation keyframes */
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }

        /* Hide Leaflet attribution but still make it accessible */
        .leaflet-control-attribution {
          font-size: 8px;
          background: rgba(255,255,255,0.7);
          padding: 0 3px;
        }
        
        /* Custom div icon */
        .custom-div-icon {
          background: none;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Tracking;