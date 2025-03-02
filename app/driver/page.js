'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ----------------------
// DYNAMIC IMPORTS (avoid SSR issues with Leaflet)
// ----------------------
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

// ----------------------
// EXAMPLE DATA NEAR SRM UNIVERSITY
// ----------------------

// 1) Coordinates for the route polyline
const routeCoordinates = [
  [12.8846, 80.0815], // Vandalur Zoo
  [12.8446, 80.0587], // Guduvancheri
  [12.8237, 80.0450], // SRM University
];

// 2) Official route stops (markers)
const routeStops = [
  {
    id: 'r1',
    name: 'Vandalur Zoo',
    position: [12.8846, 80.0815],
    time: '7:30 AM',
    status: 'completed'
  },
  {
    id: 'r2',
    name: 'Guduvancheri Bus Terminus',
    position: [12.8446, 80.0587],
    time: '7:45 AM',
    status: 'next'
  },
  {
    id: 'r3',
    name: 'SRM University',
    position: [12.8237, 80.0450],
    time: '8:00 AM',
    status: 'upcoming'
  },
];

// 3) Student stops (where students board)
const studentStops = [
  {
    id: 's1',
    name: 'John Student',
    position: [12.8226, 80.0423], // near Potheri Railway Station
    pickup: '7:55 AM',
    phone: '+91 9876543210'
  },
  {
    id: 's2',
    name: 'Jane Student',
    position: [12.8312, 80.0467], // near Estancia Township
    pickup: '7:50 AM',
    phone: '+91 9876543211'
  },
  {
    id: 's3',
    name: 'Sam Student',
    position: [12.8302, 80.0460], // near SRM Tech Park
    pickup: '7:52 AM',
    phone: '+91 9876543212'
  },
];

// ----------------------
// CUSTOM MARKER ICONS
// ----------------------
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  
  // Base icon settings
  const createCustomIcon = (color) => {
    return new L.Icon({
      iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Define specific icons
  const blueIcon = createCustomIcon('blue');    // Default
  const greenIcon = createCustomIcon('green');  // Completed stops
  const redIcon = createCustomIcon('red');      // Next stop
  const orangeIcon = createCustomIcon('orange');// Students
  const greyIcon = createCustomIcon('grey');    // Upcoming stops
  
  // Export for use in component
  L.Icons = {
    blue: blueIcon,
    green: greenIcon,
    red: redIcon,
    orange: orangeIcon,
    grey: greyIcon
  };
}

// Get icon based on stop status
const getStopIcon = (status) => {
  if (typeof window === 'undefined') return null;
  
  switch (status) {
    case 'completed': return L.Icons.green;
    case 'next': return L.Icons.red;
    case 'upcoming': return L.Icons.grey;
    default: return L.Icons.blue;
  }
};

// ----------------------
// MAIN COMPONENT
// ----------------------
export default function DriverPage() {
  // Only render map on the client side
  const [isClient, setIsClient] = useState(false);
  const [selectedTab, setSelectedTab] = useState('route');
  const [currentLocation, setCurrentLocation] = useState([12.8646, 80.0715]); // Simulated current location
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  
  // Time left calculation (simulated)
  const timeToNextStop = "12 mins";
  const distanceToNextStop = "3.2 km";
  
  useEffect(() => {
    setIsClient(true);
    
    // Simulate location updates
    const locationInterval = setInterval(() => {
      // Move slightly towards the next stop
      setCurrentLocation(prev => [
        prev[0] - 0.0005,
        prev[1] - 0.0003
      ]);
    }, 3000);
    
    return () => clearInterval(locationInterval);
  }, []);

  // Find the next stop
  const nextStop = routeStops.find(stop => stop.status === 'next') || routeStops[0];
  
  // Calculate progress percentage (simulated)
  const routeProgress = 35; // Percent complete
  
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 bg-yellow-500 shadow-md border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-yellow-600 rounded-full h-10 w-10 flex items-center justify-center mr-3">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-black">Driver: John Doe</h1>
            <div className="flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <p className="text-xs text-black">Active · Shuttle #1</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowEmergencyPanel(!showEmergencyPanel)}
            className="p-2 bg-white rounded-full shadow hover:bg-red-50 transition"
          >
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </button>
          <button className="p-2 bg-white rounded-full shadow hover:bg-blue-50 transition">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* EMERGENCY PANEL (conditionally shown) */}
      {showEmergencyPanel && (
        <div className="bg-red-50 p-4 border-b border-red-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-red-700">Emergency Options</h3>
            <button 
              onClick={() => setShowEmergencyPanel(false)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-red-100 hover:bg-red-200 text-red-800 p-3 rounded-lg text-sm font-medium flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Vehicle Breakdown
            </button>
            <button className="bg-red-100 hover:bg-red-200 text-red-800 p-3 rounded-lg text-sm font-medium flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Medical Emergency
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT: MAP */}
      <main className="flex-1 relative">
        {isClient ? (
          <MapContainer
            center={currentLocation}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline
              positions={routeCoordinates}
              color="#2563eb"
              weight={4}
              dashArray="5, 10"
              opacity={0.7}
            />
            
            {/* Current location marker */}
            <Marker position={currentLocation} icon={L.Icons?.blue}>
              <Popup>
                <div className="font-semibold">Current Location</div>
                <div className="text-xs text-gray-600">Shuttle #1</div>
              </Popup>
            </Marker>
            
            {/* Route stops with custom icons based on status */}
            {routeStops.map((stop) => (
              <Marker 
                key={stop.id} 
                position={stop.position} 
                icon={getStopIcon(stop.status)}
              >
                <Popup>
                  <div className="font-semibold">{stop.name}</div>
                  <div className="text-xs text-gray-600">Scheduled: {stop.time}</div>
                  <div className={`text-xs ${stop.status === 'completed' ? 'text-green-600' : stop.status === 'next' ? 'text-red-600' : 'text-gray-600'}`}>
                    {stop.status === 'completed' ? 'Completed' : stop.status === 'next' ? 'Next Stop' : 'Upcoming'}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Student markers */}
            {studentStops.map((stop) => (
              <Marker key={stop.id} position={stop.position} icon={L.Icons?.orange}>
                <Popup>
                  <div className="font-semibold">{stop.name}</div>
                  <div className="text-xs text-gray-600">Pickup: {stop.pickup}</div>
                  <div className="text-xs text-blue-600">{stop.phone}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        )}

        {/* FLOATING STATUS CARD */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-lg max-w-xs w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
              <h3 className="font-semibold text-gray-800">Next Stop</h3>
            </div>
            <span className="text-sm font-bold text-red-600">{timeToNextStop}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-700 font-medium">{nextStop.name}</p>
            <span className="text-xs text-gray-500">{distanceToNextStop}</span>
          </div>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${routeProgress}%` }}></div>
          </div>
        </div>
      </main>

      {/* FOOTER TABS AND INFO */}
      <footer className="bg-white border-t border-gray-200">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'route' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setSelectedTab('route')}
          >
            Route Details
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setSelectedTab('students')}
          >
            Students
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-4">
          {selectedTab === 'route' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Morning Shuttle #1</h3>
                  <p className="text-sm text-gray-600">Vandalur Zoo → SRM University</p>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  7:30 AM - 8:00 AM
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mt-3">
                {routeStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start mb-2 last:mb-0">
                    <div className="flex flex-col items-center mr-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        stop.status === 'completed' ? 'bg-green-500' : 
                        stop.status === 'next' ? 'bg-red-500' : 'bg-gray-300'
                      }`}>
                        {stop.status === 'completed' && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {index < routeStops.length - 1 && (
                        <div className={`h-8 w-0.5 ${
                          stop.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                    <div className="pt-0.5">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">{stop.name}</span>
                        <span className="ml-2 text-xs text-gray-500">{stop.time}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {stop.status === 'completed' ? 'Completed' : 
                         stop.status === 'next' ? `Arriving in ${timeToNextStop}` : 'Upcoming'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Student Pickups</h3>
              <div className="space-y-3">
                {studentStops.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-xs text-gray-500">Pickup: {student.pickup}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-green-100 rounded-full hover:bg-green-200">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="p-2 bg-blue-100 rounded-full hover:bg-blue-200">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}