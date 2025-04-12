
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setDriverOnlineStatus } from '../../../services/DriverService';
import { setDriverOfflineStatus, fetchDriverStatus } from '../../../services/DriverService';
import { fetchDriverGroupedCurrentTrips, fetchDriverGroupedUpcomingTrips, fetchDriverStats } from '../../../services/DriverDashboardService';
import { toast } from 'react-toastify';
import { fetchPassengerStats } from '../../../services/DriverDashboardService';

const VanDriverDashboard = () => {
  // State for rider information
  const [riderStats, setRiderStats] = useState({
    name: "Alex Rider",
    rating: 4.8,
    available: true, // Added missing default value
    
  });


  const [passengerStats, setPassengerStats] = useState({
    passengerCount: 0,
    totalCapacity: 0
  })
  
  
  const [currentTrips, setCurrentTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [message, setMessage] = useState('');
  const [rideStarted, setRideStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [todaysEarnings, setTodaysEarnings] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  
  // Sample data for recent rides
  const [recentRides, setRecentRides] = useState([
    { id: 1, date: "2025-02-28", pickup: "Pokhara", dropoff: "Kathmandu", fare: 3012.50, status: "Completed", rating: 5 },
    { id: 2, date: "2025-02-28", pickup: "Kathmandu", dropoff: "Pokhara", fare: 4008.75, status: "Completed", rating: 5 },
    { id: 3, date: "2025-02-27", pickup: "Butwal", dropoff: "Kathmandu", fare: 2290.30, status: "Completed", rating: 4 },
    { id: 4, date: "2025-02-26", pickup: "Lalitpur", dropoff: "Okhaldhunga", fare: 2687.20, status: "Completed", rating: 5 }
  ]);

  // Fetch trips data on component mount
  useEffect(() => {
    loadTripsData();
  }, []);

  useEffect(() => {
    const getPassengerStats = async () => {
      try {
        const data = await fetchPassengerStats();
        setPassengerStats({
          passengerCount: data.passengerCount,
          totalCapacity: data.totalCapacity,
        });
      } catch (error) {
        console.error("Error fetching passenger stats:", error.message);
      }
    };

    getPassengerStats();
  }, []); 

  useEffect(() => {
    const initializeDashboard = async () => {
      await loadTripsData();
  
      try {
        const status = await fetchDriverStatus();
        setRiderStats(prev => ({
          ...prev,
          available: status.isOnline
        }));
      } catch (error) {
        console.error("Error fetching driver status:", error);
      }
    };
  
    initializeDashboard();
  }, []);
  
  // Function to load trips data
  const loadTripsData = async () => {
    try {
      const currentTripsData = await fetchDriverGroupedCurrentTrips();
      if (currentTripsData.message) {
        setMessage(currentTripsData.message);
      } else {
        setCurrentTrips(currentTripsData);
      }

      const upcomingTripsData = await fetchDriverGroupedUpcomingTrips();
      if (upcomingTripsData.message) {
        // Keep previous message if it exists
        if (!currentTripsData.message) {
          setMessage(upcomingTripsData.message);
        }
      } else {
        setUpcomingTrips(upcomingTripsData);
      }
    } catch (error) {
      setMessage("Error fetching trips");
      console.error("Error fetching trips:", error);
    }
  };

  // Updated toggle driver availability status function
  const toggleAvailability = async () => {
    try {
      if (riderStats.available) {
        // Driver is currently online, call API to set offline
        await setDriverOfflineStatus();
        toast.info("You are now offline", {
          position: "top-right",
          autoClose: 3000
        });
      } else {
        // Driver is currently offline, call API to set online
        await setDriverOnlineStatus();
        toast.success("You are now online and available for trips", {
          position: "top-right",
          autoClose: 3000
        });
      }
      
      // Update local state
      setRiderStats(prev => ({
        ...prev,
        available: !prev.available
      }));
    } catch (error) {
      const statusAction = riderStats.available ? "offline" : "online";
      toast.error(`Failed to go ${statusAction}. Please try again.`, {
        position: "top-right",
        autoClose: 5000
      });
      setMessage(`Failed to update status to ${statusAction}. Please try again.`);
      console.error(`Error updating driver status to ${statusAction}:`, error);
    }
  };

  // Handle starting or completing a ride
  const handleRideToggle = async () => {
    if (rideStarted) {
      // Complete the trip
      await completeTrip();
    } else {
      // Just mark the ride as started in UI
      setRideStarted(true);
      
      // Update trip status in the UI
      setCurrentTrips(prevTrips =>
        prevTrips.map(trip => ({
          ...trip,
          rideStatus: "In Progress",
        }))
      );
    }
  };

  // Function to complete a trip by calling the backend API
  const completeTrip = async () => {
    if (currentTrips.length === 0) return;
    
    // Get the vehicleAvailabilityId from the first current trip
    const vehicleAvailabilityId = currentTrips[0].vehicleAvailabilityId;
    
    setIsLoading(true);
    try {
      // Call the API endpoint to complete the trip
      const response = await axios.post(`https://localhost:7291/api/DriverDashboard/complete-trip/${vehicleAvailabilityId}`);
      
      // Show success toast message
      toast.success("Your ride has been completed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Reload the page after showing toast
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      // Handle error with toast
      toast.error("Failed to complete trip. Please try again.", {
        position: "top-right",
        autoClose: 5000
      });
      console.error("Error completing trip:", error);
      setIsLoading(false);
    }
  };

  // Load driver stats
  useEffect(() => {
    const loadDriverStats = async () => {
      try {
        const stats = await fetchDriverStats(); 
        setTodaysEarnings(stats.todaysIncome);
        setTotalRides(stats.totalRides);
        setTotalEarnings(stats.totalIncome);
      } catch (error) {
        console.error("Failed to load driver stats:", error.message);
        setMessage("Failed to load driver statistics.");
      }
    };
  
    loadDriverStats();
  }, []); 
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bike Rider Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${riderStats.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span>{riderStats.available ? 'Available' : 'Offline'}</span>
            </div>
            <button 
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-md ${riderStats.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {riderStats.available ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        {/* Status message */}
        {message && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
            <p>{message}</p>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Rating</h3>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold">{riderStats.rating}</span>
              <span className="text-yellow-500 ml-2">★</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Rides</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">{totalRides}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Earnings</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">Rs {totalEarnings}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Today's Earnings</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">Rs {todaysEarnings}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Passenger Count</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold">{passengerStats.passengerCount}/{passengerStats.totalCapacity}</span>             
            </div>
            <div className="mt-1 relative pt-1">
              <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${(passengerStats.passengerCount / passengerStats.totalCapacity) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Current Rides */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current Trips</h2>
            {currentTrips.length > 0 && (
              <button
                className={`px-4 py-2 rounded ${
                  rideStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white transition duration-300`}
                onClick={handleRideToggle}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : rideStarted ? "Complete Ride" : "Start Ride"}
              </button>
            )}
          </div>
          
          {currentTrips.length === 0 ? (
            <p className="text-gray-500">No current trips.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fare</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTrips.map((trip,index) => (
                  <tr key={trip.bookingId || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickupPoint}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropOffPoint}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.departureTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.totalFare.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{trip.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upcoming Rides */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Rides</h2>
          {upcomingTrips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fare</th>
                    
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingTrips.map((ride, index) => (
                    <tr key={ride.bookingId || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.departureDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickupPoint}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropOffPoint}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.departureTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.totalFare.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming rides scheduled.</p>
          )}
        </div>

        {/* Recent Rides */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRides.map(ride => (
                  <tr key={ride.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropoff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-gray-900">{ride.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
        © 2025 Online Vehicle Ticket App. All rights reserved.
      </footer>
    </div>
  );
};

export default VanDriverDashboard;