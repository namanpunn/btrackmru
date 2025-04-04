"use client";
export const ssr = false;

import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  Filter,
  RefreshCw,
  Navigation,
  List,
  Map,
  X,
} from "lucide-react";

// Conditionally require Leaflet CSS only on the client.
if (typeof window !== "undefined") {
  require("leaflet/dist/leaflet.css");
}

/**
 * Define a LeafletMapComponent that uses react-leaflet.
 * We use require() inside this component so that the module is loaded only on the client.
 */
function LeafletMapComponent({ buses, centerMap, zoom, selectedBus, setSelectedBus }) {
  // Import react-leaflet modules on the client.
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require("react-leaflet");
  const [busIcon, setBusIcon] = useState(null);

  // Create the Leaflet Icon on the client side
  useEffect(() => {
    const L = require("leaflet");
    const icon = new L.Icon({
      iconUrl: "/images/bus2.png", // Make sure this image exists in your public folder
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
    setBusIcon(icon);
  }, []);

  // Component to update the map's view when a bus is selected
  function MapUpdater({ selectedBus, centerMap, zoom }) {
    const map = useMap();
    useEffect(() => {
      if (selectedBus) {
        map.setView([selectedBus.lat, selectedBus.lng], 15);
      } else {
        map.setView([centerMap.lat, centerMap.lng], zoom);
      }
    }, [selectedBus, centerMap, zoom, map]);
    return null;
  }

  // Component to render the popup for each bus
  function BusPopup({ bus }) {
    return (
      <div className="min-w-[200px]">
        <h3 className="font-bold">
          {bus.name} (#{bus.id})
        </h3>
        <div className="mt-2 text-sm">
          <p>
            <span className="font-semibold">Status:</span> {bus.status}
          </p>
          <p>
            <span className="font-semibold">Current Stop:</span> {bus.currentStop}
          </p>
          <p>
            <span className="font-semibold">Next Stop:</span> {bus.nextStop}
          </p>
          <p>
            <span className="font-semibold">Occupancy:</span> {bus.occupancy} students
          </p>
          <p>
            <span className="font-semibold">Driver:</span> {bus.driver}
          </p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer center={[centerMap.lat, centerMap.lng]} zoom={zoom} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {busIcon &&
        buses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={busIcon}
            eventHandlers={{
              click: () => setSelectedBus(bus),
            }}
          >
            <Popup>
              <BusPopup bus={bus} />
            </Popup>
          </Marker>
        ))}
      <MapUpdater selectedBus={selectedBus} centerMap={centerMap} zoom={zoom} />
    </MapContainer>
  );
}

// Wrap the LeafletMapComponent in a dynamic import to disable its SSR.
const LeafletMap = dynamic(() => Promise.resolve(LeafletMapComponent), { ssr: false });

// --- Mock Data ---
const MOCK_BUSES = [
  { id: "62654", name: "Shuttle 1", lat: 28.4595, lng: 77.3248, status: "On Time", currentStop: "Mewla Maharajpur", nextStop: "Badkal Mod", occupancy: 32, driver: "Raj Kumar", contact: "+91 9876543210" },
  { id: "62655", name: "Shuttle 2", lat: 28.4702, lng: 77.3089, status: "Delayed", currentStop: "Sector 28", nextStop: "Sector 29", occupancy: 28, driver: "Amit Singh", contact: "+91 9876543211" },
  { id: "62656", name: "Shuttle 3", lat: 28.4521, lng: 77.3178, status: "On Time", currentStop: "Sector 31", nextStop: "Sector 32", occupancy: 35, driver: "Vikram Yadav", contact: "+91 9876543212" },
  { id: "62657", name: "Express 1", lat: 28.4634, lng: 77.3312, status: "On Time", currentStop: "Sector 15", nextStop: "Sector 16", occupancy: 40, driver: "Suresh Kumar", contact: "+91 9876543213" },
  { id: "62658", name: "Express 2", lat: 28.4789, lng: 77.3154, status: "Early", currentStop: "Sector 12", nextStop: "Sector 14", occupancy: 22, driver: "Manoj Sharma", contact: "+91 9876543214" },
];

// --- Header Component ---
function Header({ onToggleSidebar, onToggleFilters }) {
  return (
    <header className="bg-yellow-400 text-black p-4 flex items-center justify-between shadow-md sticky top-0 z-10">
      <div className="flex items-center">
        <ChevronLeft className="mr-2" />
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>
      <div className="flex space-x-2">
        <button onClick={onToggleSidebar} className="p-2 rounded-full bg-white">
          <List size={20} />
        </button>
        <button onClick={onToggleFilters} className="p-2 rounded-full bg-white">
          <Filter size={20} />
        </button>
      </div>
    </header>
  );
}

// --- Filter Modal Component ---
function FilterModal({ show, onClose, filterStatus, setFilterStatus, searchQuery, setSearchQuery, onReset }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-start pt-16">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md m-4 p-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filter Buses</h2>
          <button onClick={onClose} className="p-1 rounded-full bg-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Bus</label>
          <input
            type="text"
            placeholder="Search by name or ID"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bus Status</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Early">Early</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button onClick={onReset} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
            Reset
          </button>
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Sidebar Component ---
function Sidebar({ show, buses, filteredBuses, onSelectBus, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-full md:w-80 bg-white shadow-lg transform transition-transform duration-300 z-20 ${
        show ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 mt-16`}
    >
      <div className="p-4 border-b flex justify-between items-center md:hidden">
        <h2 className="text-lg font-semibold">All Buses</h2>
        <button onClick={onClose} className="p-1 rounded-full bg-gray-200">
          <X size={20} />
        </button>
      </div>
      <div className="hidden md:block p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">All Buses</h1>
        <p className="text-sm text-gray-600">
          {filteredBuses.length} of {buses.length} buses
        </p>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
        <a href="/attendancePage">
        <div className="space-y-3">
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50"
              onClick={() => {
                onSelectBus(bus);
                onClose();
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    {bus.id.slice(-2)}
                  </div>
                  <h3 className="font-medium">{bus.name}</h3>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    bus.status === "On Time"
                      ? "bg-green-100 text-green-800"
                      : bus.status === "Delayed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {bus.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <p>
                  <span className="font-medium">Current:</span> {bus.currentStop}
                </p>
                <p>
                  <span className="font-medium">Next:</span> {bus.nextStop}
                </p>
                <p>
                  <span className="font-medium">Students:</span> {bus.occupancy}
                </p>
              </div>
            </div>
          ))}
        </div>
        </a>
      </div>
    </aside>
  );
}

// --- Main Component ---
export default function AdminBusTracking() {
  const [buses, setBuses] = useState(MOCK_BUSES);
  const [selectedBus, setSelectedBus] = useState(null);
  const [centerMap, setCenterMap] = useState({ lat: 28.4595, lng: 77.3178 });
  const [zoom, setZoom] = useState(13);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate bus movement every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter buses based on status and search query
  const filteredBuses = buses.filter((bus) => {
    const matchesStatus = filterStatus === "All" || bus.status === filterStatus;
    const matchesSearch =
      bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.id.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Head>
        <title>Admin Bus Tracking Dashboard</title>
        <meta name="description" content="Admin dashboard for tracking all school buses" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <FilterModal
        show={showFilters}
        onClose={() => setShowFilters(false)}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onReset={() => {
          setFilterStatus("All");
          setSearchQuery("");
        }}
      />

      <Sidebar
        show={showSidebar}
        buses={buses}
        filteredBuses={filteredBuses}
        onSelectBus={(bus) => setSelectedBus(bus)}
        onClose={() => setShowSidebar(false)}
      />

      <main className="md:ml-80 h-[90vh] relative">
        <LeafletMap
          buses={filteredBuses}
          centerMap={centerMap}
          zoom={zoom}
          selectedBus={selectedBus}
          setSelectedBus={setSelectedBus}
        />

        {/* Mobile Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 md:hidden">
          <button
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700"
            onClick={() => {
              setSelectedBus(null);
              setCenterMap({ lat: 28.4595, lng: 77.3178 });
              setZoom(13);
            }}
          >
            <Navigation size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700">
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Selected Bus Info - Mobile */}
        {selectedBus && (
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-lg shadow-lg md:hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {selectedBus.id.slice(-2)}
                </div>
                <h3 className="font-bold text-lg">{selectedBus.name}</h3>
              </div>
              <button className="text-gray-500 p-1" onClick={() => setSelectedBus(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 mb-3 text-xs text-gray-600">
              <div>
                <p className="font-semibold text-sm" style={{ color: selectedBus.status === "On Time" ? "#16a34a" : selectedBus.status === "Delayed" ? "#dc2626" : "#ca8a04" }}>
                  {selectedBus.status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{selectedBus.occupancy}</p>
                <p>Students</p>
              </div>
              <div>
                <p className="font-medium">{selectedBus.currentStop}</p>
                <p>Current</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{selectedBus.nextStop}</p>
                <p>Next</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium">
                Contact Driver
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm">
                View Route
              </button>
            </div>
          </div>
        )}

        {/* Selected Bus Info - Desktop */}
        {selectedBus && (
          <div className="hidden md:block absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {selectedBus.id.slice(-2)}
                </div>
                <h3 className="font-bold text-lg">{selectedBus.name}</h3>
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedBus(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Bus ID</p>
                <p className="font-medium">{selectedBus.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium" style={{ color: selectedBus.status === "On Time" ? "#16a34a" : selectedBus.status === "Delayed" ? "#dc2626" : "#ca8a04" }}>
                  {selectedBus.status}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Current Stop</p>
                <p className="font-medium">{selectedBus.currentStop}</p>
              </div>
              <div>
                <p className="text-gray-500">Next Stop</p>
                <p className="font-medium">{selectedBus.nextStop}</p>
              </div>
              <div>
                <p className="text-gray-500">Occupancy</p>
                <p className="font-medium">{selectedBus.occupancy} students</p>
              </div>
              <div>
                <p className="text-gray-500">Driver</p>
                <p className="font-medium">{selectedBus.driver}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition text-sm font-medium">
                Contact Driver
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm">
                View Route
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-11 left-0 right-0 bg-white border-t flex justify-around items-center p-2 md:hidden">
        <button className="flex flex-col items-center justify-center w-16 py-1">
          <Map size={20} />
          <span className="text-xs mt-1">Map</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 py-1" onClick={() => setShowSidebar(true)}>
          <List size={20} />
          <span className="text-xs mt-1">Buses</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 py-1">
          <RefreshCw size={20} />
          <span className="text-xs mt-1">Refresh</span>
        </button>
      </nav>
    </div>
  );
}
