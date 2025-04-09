'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Configure the API base URL - adjust to your ESP8266's IP address
const API_BASE_URL = 'http://192.168.10.182/api';

// Map of student IDs to names - defined at frontend
const STUDENT_NAMES = {
  1: "Naman Punn",
  2: "Testing",
  3: "Amit Singh",
  4: "Sneha Patel",
  5: "Vikram Mehta",
  6: "Anjali Gupta",
  7: "Rohan Verma",
  8: "Neha Mishra",
  9: "Rahul Joshi",
  10: "Pooja Agarwal",
  // Add more students as needed
};

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [lastScan, setLastScan] = useState({ result: 'Waiting for scan data...', seconds_ago: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState({ status: 'checking...' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attendance`);
      // Add local system time in IST and student names to the data
      const processedData = response.data.map(entry => {
        // Convert the timestamp to IST (UTC+5:30)
        const localTime = new Date();
        return {
          ...entry,
          localTime: localTime,
          studentName: STUDENT_NAMES[entry.id] || `Unknown Student ${entry.id}`
        };
      });
      setAttendanceData(processedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to load attendance data. Check your connection to the device.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch last scan result
  const fetchLastScan = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scan-data`);
      setLastScan(response.data);
    } catch (err) {
      console.error('Error fetching scan data:', err);
    }
  };

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status`);
      setSystemStatus(response.data);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setSystemStatus({ status: 'offline' });
    }
  };

  // Clear attendance data
  const clearAttendance = async () => {
    try {
      console.log('Clearing attendance data...');
      // Log the full URL to debug
      console.log(`Sending DELETE request to: ${API_BASE_URL}/attendance`);
      
      const response = await axios.delete(`${API_BASE_URL}/attendance`);
      console.log('Clear response:', response);
      
      setShowConfirmModal(false);
      fetchAttendanceData(); // Reload data after clearing
      showToast('Attendance data cleared successfully');
    } catch (err) {
      console.error('Error clearing attendance data:', err);
      console.error('Error details:', err.response || err.message);
      showToast('Failed to clear attendance data', 'error');
    }
  };

  // Export attendance as CSV
  const exportAttendanceCSV = () => {
    // Create CSV data with the current table format (ID, Name, Time)
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Student ID,Student Name,Time (IST)\n";
    
    // Add data rows
    attendanceData.forEach(entry => {
      const row = [
        entry.id,
        STUDENT_NAMES[entry.id] || `Unknown Student ${entry.id}`,
        formatDateTime(entry.localTime)
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
    showToast('Downloading CSV file...');
  };

  // Manual refresh function with animation
  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAttendanceData(), fetchLastScan(), fetchSystemStatus()]);
    setTimeout(() => setIsRefreshing(false), 500); // Ensure animation plays fully
    showToast('Data refreshed');
  };

  // Simple toast notification system
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } transition-opacity duration-300 flex items-center`;
    
    const icon = document.createElement('span');
    icon.className = 'mr-2';
    icon.innerHTML = type === 'error' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>';
    
    toast.appendChild(icon);
    toast.appendChild(document.createTextNode(message));
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // Load data on component mount
  useEffect(() => {
    fetchAttendanceData();
    fetchSystemStatus();
    fetchLastScan();
    
    // Set up intervals for polling data
    const attendanceInterval = setInterval(fetchAttendanceData, 5000);
    const scanInterval = setInterval(fetchLastScan, 2000);
    const statusInterval = setInterval(fetchSystemStatus, 10000);
    
    // Clean up intervals on component unmount
    return () => {
      clearInterval(attendanceInterval);
      clearInterval(scanInterval);
      clearInterval(statusInterval);
    };
  }, []);

  // Filter attendance data based on search term (by ID or name)
  const filteredAttendance = attendanceData.filter(entry => 
    entry.id.toString().includes(searchTerm) || 
    (STUDENT_NAMES[entry.id] || `Unknown Student ${entry.id}`).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to format the date/time nicely in IST
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const options = { 
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleTimeString('en-IN', options);
  };

  // Status indicator class based on system status
  const getStatusClass = () => {
    if (systemStatus.status === 'online') return 'bg-green-500';
    if (systemStatus.status === 'offline') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  // Scan result class based on result text
  const getScanResultClass = () => {
    if (lastScan.result.includes('Found ID')) return 'text-green-500';
    if (lastScan.result.includes('not find a match')) return 'text-red-500';
    return 'text-yellow-500';
  };

  // Format time since last scan
  const formatTimeSince = (seconds) => {
    if (!seconds) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-yellow-400 px-4 py-3 flex items-center shadow-md sticky top-0 z-10">
        <a href="/adminstrator" className="flex items-center text-black font-bold hover:text-yellow-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          
        </a>
        <h1 className="ml-4 text-lg font-bold hidden sm:block">Student Attendance System - H1</h1>
        <div className="ml-auto flex">
          <button 
            onClick={refreshData}
            className="p-2 rounded-full hover:bg-yellow-500 transition flex items-center justify-center"
            title="Refresh Data"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="hidden sm:flex items-center ml-4">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusClass()}`}></div>
            <span className="text-sm font-medium">
              System: {systemStatus.status}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Cards - Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Records Card */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-400">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">Total Records</p>
                <p className="text-2xl font-bold">{attendanceData.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-400">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">System Status</p>
                <p className={`text-lg font-bold capitalize ${
                  systemStatus.status === 'online' ? 'text-green-500' : 
                  systemStatus.status === 'offline' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {systemStatus.status}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                systemStatus.status === 'online' ? 'bg-green-100' : 
                systemStatus.status === 'offline' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                  systemStatus.status === 'online' ? 'text-green-500' : 
                  systemStatus.status === 'offline' ? 'text-red-500' : 'text-yellow-500'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-400">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">Quick Actions</p>
                <div className="flex mt-2 space-x-2">
                  <button 
                    onClick={exportAttendanceCSV} 
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal(true)} 
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear
                  </button>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Last scan result - enhanced card */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="border-b px-4 py-3 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z" clipRule="evenodd" />
              </svg>
              <h2 className="font-semibold">Last Fingerprint Scan</h2>
            </div>
            {lastScan.seconds_ago !== null && (
              <div className="text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-500">{formatTimeSince(lastScan.seconds_ago)}</span>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-5 ${
                lastScan.result.includes('Found ID') ? 'bg-green-100' : 
                lastScan.result.includes('not find a match') ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                  lastScan.result.includes('Found ID') ? 'text-green-500' : 
                  lastScan.result.includes('not find a match') ? 'text-red-500' : 'text-blue-500'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <div>
                <div className={`text-lg font-medium ${getScanResultClass()}`}>
                  {lastScan.result}
                </div>
                {lastScan.fingerprint_id && (
                  <div className="mt-1">
                    <span className="text-gray-600">Student ID:</span>
                    <span className="ml-2 bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 font-medium">{lastScan.fingerprint_id}</span>
                    <span className="ml-2 text-gray-600">Name:</span>
                    <span className="ml-2 bg-blue-100 px-3 py-1 rounded-full text-blue-800 font-medium">
                      {STUDENT_NAMES[lastScan.fingerprint_id] || `Unknown Student ${lastScan.fingerprint_id}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance log - modified to show only ID, Name, and Time */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b gap-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="font-semibold">Attendance Log</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={exportAttendanceCSV}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
                <button 
                  onClick={() => setShowConfirmModal(true)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Log
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-10 w-10 mx-auto text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-3 text-gray-500">Loading attendance data...</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                onClick={refreshData}
                className="mt-4 px-4 py-2 bg-yellow-400 rounded-md hover:bg-yellow-500 transition flex items-center mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No attendance records found</p>
              <p className="text-gray-400 text-sm mt-1">Records will appear here after students scan their fingerprints</p>
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No matching records found</p>
              <p className="text-gray-500 mt-1">Try a different search term</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-3 px-4 py-1 bg-yellow-400 text-sm rounded hover:bg-yellow-500 transition"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600 text-sm">
                    <th className="py-3 px-4 font-medium">ID</th>
                    <th className="py-3 px-4 font-medium">Student Name</th>
                    <th className="py-3 px-4 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((entry, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                            {entry.id}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {entry.studentName}
                      </td>
                      <td className="py-3 px-4">
                        {formatDateTime(entry.localTime)}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
{showConfirmModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
      <h3 className="text-lg font-medium mb-3">Confirm Clear Log</h3>
      <p className="text-gray-600 mb-5">Are you sure you want to clear all attendance data? This action cannot be undone.</p>
      <div className="flex justify-end space-x-3">
        <button 
          onClick={() => setShowConfirmModal(false)} 
          className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button 
          onClick={clearAttendance} 
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Clear Data
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}