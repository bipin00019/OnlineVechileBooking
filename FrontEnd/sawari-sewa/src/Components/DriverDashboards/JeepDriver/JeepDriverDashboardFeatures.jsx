

import React, { useState, useEffect } from 'react';
import { setFareAndSchedule, fetchPassengerStats, fetchMySchedule, deleteMySchedule } from '../../../services/DriverDashboardService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const JeepDriverDashboardFeatures = () => {
  // State for set fare form
  const [fare, setFare] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [bookedSeats, setBookedSeats] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  
  // State to control whether the form is open or not
  const [isFareFormOpen, setIsFareFormOpen] = useState(false);
  
  // State to track vehicle stats and schedule status
  const [passengerStats, setPassengerStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for current schedule
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
  
  // State to track schedule cancellation status
  const [isCancelling, setIsCancelling] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    
    // Add leading zeros if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    
    return `${year}-${month}-${day}`;
  };

  // Function to load passenger stats and schedule status
  const loadPassengerStats = async () => {
    try {
      setIsLoading(true);
      const stats = await fetchPassengerStats();
      setPassengerStats(stats);
      return stats;
    } catch (err) {
      console.error("Error loading stats:", err);
      return { hasSchedule: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load current schedule
  const loadCurrentSchedule = async () => {
    try {
      setIsLoadingSchedule(true);
      const schedule = await fetchMySchedule();
      if (schedule && schedule.length > 0) {
        setCurrentSchedule(schedule[0]);
      } else {
        setCurrentSchedule(null);
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
      setCurrentSchedule(null);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadPassengerStats();
    loadCurrentSchedule();
  }, []);

  // Handle deleting a schedule
  const handleDeleteSchedule = async () => {
    if (window.confirm('Are you sure you want to delete this schedule? This cannot be undone.')) {
      try {
        // Set cancelling status to true to show loading state
        setIsCancelling(true);
        
        await deleteMySchedule();
        
        toast.success("Schedule successfully deleted", {
          position: "top-right",
          autoClose: 3000
        });
        
        // Instead of immediately refreshing data, set a timeout to reload the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        
      } catch (err) {
        toast.error("Failed to delete schedule. Please try again.", {
          position: "top-right",
          autoClose: 5000
        });
        console.error("Error deleting schedule:", err);
        setIsCancelling(false); // Reset cancelling status on error
      }
      // Note: We don't set isCancelling to false here because the page will reload
    }
  };

  // Handle click on the "Set Fare and Schedule" card
  const handleCardClick = async () => {
    if (isLoading) return; // Prevent actions while loading
    
    // Re-check schedule status when card is clicked
    const stats = await loadPassengerStats();
    
    if (stats.hasSchedule) {
      // Show info message if schedule already exists
      toast.info("Vehicle is already scheduled. You cannot create another schedule.", {
        position: "top-right",
        autoClose: 5000
      });
    } else {
      // Open the form if no schedule exists
      setIsFareFormOpen(!isFareFormOpen);
    }
  };

  // Handle set fare form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const result = await setFareAndSchedule(fare, totalSeats, departureDate, token);
      
      // Close form on successful submission
      setIsFareFormOpen(false);
      
      // Refresh passenger stats and schedule
      await loadPassengerStats();
      await loadCurrentSchedule();
      
      // Clear form fields after successful submission
      setFare('');
      setTotalSeats('');
      setBookedSeats('');
      setDepartureDate('');
      
      // Show success toast
      toast.success("Fare and schedule successfully updated!", {
        position: "top-right",
        autoClose: 3000
      });
    } catch (err) {
      let rawMessage = typeof err?.response?.data === "string"
        ? err.response.data
        : err?.response?.data?.message || 
          err?.response?.data?.title || 
          err?.message || 
          "Failed to update fare and schedule. Please try again.";
    
      // Optional: Custom user-friendly translation for known messages
      if (rawMessage === "A schedule already exists for the current departure time.") {
        rawMessage = "You have already created a schedule.";
      }
    
      toast.error(rawMessage, {
        position: "top-right",
        autoClose: 5000
      });
    
      console.error("Backend error:", err);
    }    
  };

  // Determine if a schedule exists based on the passenger stats
  const scheduleExists = passengerStats?.hasSchedule === true || currentSchedule !== null;

  // Format departure date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Set Fare and Schedule Card */}
      <div className="relative">
        <div 
          className={`bg-gradient-to-r ${isFareFormOpen ? 'from-white to-blue-500' : 'from-white to-blue-400'} 
            p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
            hover:shadow-lg hover:from-blue-400 hover:to-blue-500 hover:shadow-blue-200
            ${isLoading ? 'opacity-50' : scheduleExists ? 'opacity-75' : ''}`}
          onClick={handleCardClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg 
                className="h-6 w-6 mr-2 text-blue-800" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold">Set Fare and Schedule</h3>
              {isLoading ? (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  Loading...
                </span>
              ) : scheduleExists ? (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Vehicle Scheduled
                </span>
              ) : (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  No Schedule
                </span>
              )}
            </div>
            <svg 
              className={`h-5 w-5 text-blue-800 transition-transform duration-300 ${isFareFormOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Show passenger stats if schedule exists */}
          {scheduleExists && passengerStats && (
            <div className="mt-3 text-sm bg-blue-50 p-2 rounded">
              <div className="flex justify-between">
                <span>Bookings:</span>
                <span className="font-semibold">{passengerStats.passengerCount} / {passengerStats.totalCapacity}</span>
              </div>
            </div>
          )}
        </div>
        
        {isFareFormOpen && !scheduleExists && !isLoading && (
          <div 
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-200 transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent the card from closing when clicking on the form
          >
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700">Fare (Rs)</label>
                  <input
                    type="number"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Total Seats</label>
                  <input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Booked Seats</label>
                  <input
                    type="number"
                    value={bookedSeats}
                    onChange={(e) => setBookedSeats(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={getTodayDate()} // Set minimum date to today
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFareFormOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center w-32 h-10"
                  >
                    <span>Submit</span>
                    <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Current Schedule Card */}
      <div className="relative">
        <div className="bg-gradient-to-r from-white to-green-400 p-4 rounded-lg shadow hover:shadow-lg hover:from-green-50 hover:to-green-500 hover:shadow-green-200 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg 
                className="h-6 w-6 mr-2 text-green-800" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="text-lg font-bold">Current Schedule</h3>
              {isLoadingSchedule ? (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  Loading...
                </span>
              ) : currentSchedule ? (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              ) : (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  No Schedule
                </span>
              )}
            </div>
          </div>

          {isLoadingSchedule ? (
            <div className="mt-4 flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          ) : currentSchedule ? (
            <div className="mt-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium text-gray-800">{currentSchedule.location} to {currentSchedule.destination}</span>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
                    {currentSchedule.departureTime}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">
                      <span className="font-medium">Departure:</span> {formatDate(currentSchedule.departureDate)}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">
                      <span className="font-medium">Pick-up:</span> {currentSchedule.pickupPoint}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">
                      <span className="font-medium">Drop-off:</span> {currentSchedule.dropOffPoint}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  {isCancelling ? (
                    <div className="flex items-center justify-center w-full bg-red-50 text-red-700 py-2 px-4 rounded">
                      <svg className="animate-spin h-4 w-4 mr-2 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling Schedule...
                    </div>
                  ) : (
                    <button
                      onClick={handleDeleteSchedule}
                      className="flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded transition duration-200"
                      disabled={isCancelling}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Cancel Schedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg mt-3">
              <div className="text-center text-gray-500">
                <svg className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No active schedule found.</p>
                <p className="text-sm">Create a schedule using the form on the left.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JeepDriverDashboardFeatures;