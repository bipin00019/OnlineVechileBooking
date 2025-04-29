


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { setDriverOnlineStatus } from '../../../services/DriverService';
// import { setDriverOfflineStatus, fetchDriverStatus } from '../../../services/DriverService';
// import { fetchDriverGroupedCurrentTrips, fetchDriverGroupedUpcomingTrips, fetchDriverStats } from '../../../services/DriverDashboardService';
// import { toast } from 'react-toastify';
// import { fetchPassengerStats } from '../../../services/DriverDashboardService';

// const BusDriverDashboard = () => {
//   // State for rider information
//   const [riderStats, setRiderStats] = useState({
//     name: "Alex Rider",
//     rating: 4.8,
//     available: true, // Added missing default value
    
//   });


//   const [passengerStats, setPassengerStats] = useState({
//     passengerCount: 0,
//     totalCapacity: 0
//   })
  
  
//   const [currentTrips, setCurrentTrips] = useState([]);
//   const [upcomingTrips, setUpcomingTrips] = useState([]);
//   const [message, setMessage] = useState('');
//   const [rideStarted, setRideStarted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [todaysEarnings, setTodaysEarnings] = useState(0);
//   const [totalRides, setTotalRides] = useState(0);
//   const [totalEarnings, setTotalEarnings] = useState(0);
  
//   // Sample data for recent rides
//   const [recentRides, setRecentRides] = useState([
//     { id: 1, date: "2025-02-28", pickup: "Pokhara", dropoff: "Kathmandu", fare: 3012.50, status: "Completed", rating: 5 },
//     { id: 2, date: "2025-02-28", pickup: "Kathmandu", dropoff: "Pokhara", fare: 4008.75, status: "Completed", rating: 5 },
//     { id: 3, date: "2025-02-27", pickup: "Butwal", dropoff: "Kathmandu", fare: 2290.30, status: "Completed", rating: 4 },
//     { id: 4, date: "2025-02-26", pickup: "Lalitpur", dropoff: "Okhaldhunga", fare: 2687.20, status: "Completed", rating: 5 }
//   ]);

//   // Fetch trips data on component mount
//   useEffect(() => {
//     loadTripsData();
//   }, []);

//   useEffect(() => {
//     const getPassengerStats = async () => {
//       try {
//         const data = await fetchPassengerStats();
//         setPassengerStats({
//           passengerCount: data.passengerCount,
//           totalCapacity: data.totalCapacity,
//         });
//       } catch (error) {
//         console.error("Error fetching passenger stats:", error.message);
//       }
//     };

//     getPassengerStats();
//   }, []); 

//   useEffect(() => {
//     const initializeDashboard = async () => {
//       await loadTripsData();
  
//       try {
//         const status = await fetchDriverStatus();
//         setRiderStats(prev => ({
//           ...prev,
//           available: status.isOnline
//         }));
//       } catch (error) {
//         console.error("Error fetching driver status:", error);
//       }
//     };
  
//     initializeDashboard();
//   }, []);
  
//   // Function to load trips data
//   const loadTripsData = async () => {
//     try {
//       const currentTripsData = await fetchDriverGroupedCurrentTrips();
//       if (currentTripsData.message) {
//         setMessage(currentTripsData.message);
//       } else {
//         setCurrentTrips(currentTripsData);
//       }

//       const upcomingTripsData = await fetchDriverGroupedUpcomingTrips();
//       if (upcomingTripsData.message) {
//         // Keep previous message if it exists
//         if (!currentTripsData.message) {
//           setMessage(upcomingTripsData.message);
//         }
//       } else {
//         setUpcomingTrips(upcomingTripsData);
//       }
//     } catch (error) {
//       setMessage("Error fetching trips");
//       console.error("Error fetching trips:", error);
//     }
//   };

//   // Updated toggle driver availability status function
//   const toggleAvailability = async () => {
//     try {
//       if (riderStats.available) {
//         // Driver is currently online, call API to set offline
//         await setDriverOfflineStatus();
//         toast.info("You are now offline", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       } else {
//         // Driver is currently offline, call API to set online
//         await setDriverOnlineStatus();
//         toast.success("You are now online and available for trips", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       }
      
//       // Update local state
//       setRiderStats(prev => ({
//         ...prev,
//         available: !prev.available
//       }));
//     } catch (error) {
//       const statusAction = riderStats.available ? "offline" : "online";
//       toast.error(`Failed to go ${statusAction}. Please try again.`, {
//         position: "top-right",
//         autoClose: 5000
//       });
//       setMessage(`Failed to update status to ${statusAction}. Please try again.`);
//       console.error(`Error updating driver status to ${statusAction}:`, error);
//     }
//   };

//   // Handle starting or completing a ride
//   const handleRideToggle = async () => {
//     if (rideStarted) {
//       // Complete the trip
//       await completeTrip();
//     } else {
//       // Just mark the ride as started in UI
//       setRideStarted(true);
      
//       // Update trip status in the UI
//       setCurrentTrips(prevTrips =>
//         prevTrips.map(trip => ({
//           ...trip,
//           rideStatus: "In Progress",
//         }))
//       );
//     }
//   };

//   // Function to complete a trip by calling the backend API
//   const completeTrip = async () => {
//     if (currentTrips.length === 0) return;
    
//     // Get the vehicleAvailabilityId from the first current trip
//     const vehicleAvailabilityId = currentTrips[0].vehicleAvailabilityId;
    
//     setIsLoading(true);
//     try {
//       // Call the API endpoint to complete the trip
//       const response = await axios.post(`https://localhost:7291/api/DriverDashboard/complete-trip/${vehicleAvailabilityId}`);
      
//       // Show success toast message
//       toast.success("Your ride has been completed!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
      
//       // Reload the page after showing toast
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
      
//     } catch (error) {
//       // Handle error with toast
//       toast.error("Failed to complete trip. Please try again.", {
//         position: "top-right",
//         autoClose: 5000
//       });
//       console.error("Error completing trip:", error);
//       setIsLoading(false);
//     }
//   };

//   // Load driver stats
//   useEffect(() => {
//     const loadDriverStats = async () => {
//       try {
//         const stats = await fetchDriverStats(); 
//         setTodaysEarnings(stats.todaysIncome);
//         setTotalRides(stats.totalRides);
//         setTotalEarnings(stats.totalIncome);
//       } catch (error) {
//         console.error("Failed to load driver stats:", error.message);
//         setMessage("Failed to load driver statistics.");
//       }
//     };
  
//     loadDriverStats();
//   }, []); 
  

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Bike Rider Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <span className={`h-3 w-3 rounded-full mr-2 ${riderStats.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
//               <span>{riderStats.available ? 'Available' : 'Offline'}</span>
//             </div>
//             <button 
//               onClick={toggleAvailability}
//               className={`px-4 py-2 rounded-md ${riderStats.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
//             >
//               {riderStats.available ? 'Go Offline' : 'Go Online'}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto p-4 flex-grow">
//         {/* Status message */}
//         {message && (
//           <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
//             <p>{message}</p>
//           </div>
//         )}
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Rating</h3>
//             <div className="flex items-center mt-2">
//               <span className="text-2xl font-bold">{riderStats.rating}</span>
//               <span className="text-yellow-500 ml-2">★</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Rides</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">{totalRides}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {totalEarnings}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Today's Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {todaysEarnings}</span>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Passenger Count</h3>
//             <div className="mt-2 flex items-center justify-between">
//               <span className="text-2xl font-bold">{passengerStats.passengerCount}/{passengerStats.totalCapacity}</span>             
//             </div>
//             <div className="mt-1 relative pt-1">
//               <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
//                 <div style={{ width: `${(passengerStats.passengerCount / passengerStats.totalCapacity) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
//               </div>
//             </div>
//           </div>
//         </div>

        

//         {/* Current Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Current Trips</h2>
//             {currentTrips.length > 0 && (
//               <button
//                 className={`px-4 py-2 rounded ${
//                   rideStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
//                 } text-white transition duration-300`}
//                 onClick={handleRideToggle}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Processing..." : rideStarted ? "Complete Ride" : "Start Ride"}
//               </button>
//             )}
//           </div>
          
//           {currentTrips.length === 0 ? (
//             <p className="text-gray-500">No current trips.</p>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentTrips.map((trip,index) => (
//                   <tr key={trip.bookingId || index}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickupPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropOffPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.departureTime}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.totalFare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{trip.status}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Upcoming Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <h2 className="text-lg font-semibold mb-4">Upcoming Rides</h2>
//           {upcomingTrips.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fare</th>
                    
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {upcomingTrips.map((ride, index) => (
//                     <tr key={ride.bookingId || index}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.departureDate}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickupPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropOffPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.departureTime}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.totalFare.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No upcoming rides scheduled.</p>
//           )}
//         </div>

//         {/* Recent Rides */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentRides.map(ride => (
//                   <tr key={ride.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.date}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickup}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropoff}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="text-yellow-500 mr-1">★</span>
//                         <span className="text-sm text-gray-900">{ride.rating}</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
//         © 2025 Online Vehicle Ticket App. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default BusDriverDashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { setDriverOnlineStatus, setDriverOfflineStatus, fetchDriverStatus } from '../../../services/DriverService';
// import { fetchDriverCurrentTrips, fetchDriverUpcomingTrips, fetchDriverStats } from '../../../services/DriverDashboardService';
// import { setFareAndSchedule } from '../../../services/DriverDashboardService';
// import { toast } from 'react-toastify';


// const BikeRiderDashboard = () => {
//   // State for rider information
//   const [riderStats, setRiderStats] = useState({
//     name: "Alex Rider",
//     rating: 4.8,
//     available: true // Added missing default value
//   });
  
//   const [currentTrips, setCurrentTrips] = useState([]);
//   const [upcomingTrips, setUpcomingTrips] = useState([]);
//   const [message, setMessage] = useState('');
//   const [rideStarted, setRideStarted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [todaysEarnings, setTodaysEarnings] = useState(0);
//   const [totalRides, setTotalRides] = useState(0);
//   const [totalEarnings, setTotalEarnings] = useState(0);

//   const [fare, setFare] = useState('');
//   const [totalSeats, setTotalSeats] = useState('');
//   const [bookedSeats, setBookedSeats] = useState('');
//   const [departureDate, setDepartureDate] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token"); // or use context/auth system
//     try {
//       const result = await setFareAndSchedule(fare, totalSeats, departureDate, token);
//       setMessage(result.message);
//     } catch (err) {
//       setMessage(err);
//     }
//   };
  
//   // Sample data for recent rides
//   const [recentRides, setRecentRides] = useState([
//     { id: 1, date: "2025-02-28", pickup: "Pokhara", dropoff: "Kathmandu", fare: 3012.50, status: "Completed", rating: 5 },
//     { id: 2, date: "2025-02-28", pickup: "Kathmandu", dropoff: "Pokhara", fare: 4008.75, status: "Completed", rating: 5 },
//     { id: 3, date: "2025-02-27", pickup: "Butwal", dropoff: "Kathmandu", fare: 2290.30, status: "Completed", rating: 4 },
//     { id: 4, date: "2025-02-26", pickup: "Lalitpur", dropoff: "Okhaldhunga", fare: 2687.20, status: "Completed", rating: 5 }
//   ]);

//   // Fetch trips data on component mount
//   useEffect(() => {
//     loadTripsData();
//   }, []);

//   useEffect(() => {
//     const initializeDashboard = async () => {
//       await loadTripsData();
  
//       try {
//         const status = await fetchDriverStatus();
//         setRiderStats(prev => ({
//           ...prev,
//           available: status.isOnline
//         }));
//       } catch (error) {
//         console.error("Error fetching driver status:", error);
//       }
//     };
  
//     initializeDashboard();
//   }, []);
  
//   // Function to load trips data
//   const loadTripsData = async () => {
//     try {
//       const currentTripsData = await fetchDriverCurrentTrips();
//       if (currentTripsData.message) {
//         setMessage(currentTripsData.message);
//       } else {
//         setCurrentTrips(currentTripsData);
//       }

//       const upcomingTripsData = await fetchDriverUpcomingTrips();
//       if (upcomingTripsData.message) {
//         // Keep previous message if it exists
//         if (!currentTripsData.message) {
//           setMessage(upcomingTripsData.message);
//         }
//       } else {
//         setUpcomingTrips(upcomingTripsData);
//       }
//     } catch (error) {
//       setMessage("Error fetching trips");
//       console.error("Error fetching trips:", error);
//     }
//   };

//   // Updated toggle driver availability status function
//   const toggleAvailability = async () => {
//     try {
//       if (riderStats.available) {
//         // Driver is currently online, call API to set offline
//         await setDriverOfflineStatus();
//         toast.info("You are now offline", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       } else {
//         // Driver is currently offline, call API to set online
//         await setDriverOnlineStatus();
//         toast.success("You are now online and available for trips", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       }
      
//       // Update local state
//       setRiderStats(prev => ({
//         ...prev,
//         available: !prev.available
//       }));
//     } catch (error) {
//       const statusAction = riderStats.available ? "offline" : "online";
//       toast.error(`Failed to go ${statusAction}. Please try again.`, {
//         position: "top-right",
//         autoClose: 5000
//       });
//       setMessage(`Failed to update status to ${statusAction}. Please try again.`);
//       console.error(`Error updating driver status to ${statusAction}:`, error);
//     }
//   };

//   // Handle starting or completing a ride
//   const handleRideToggle = async () => {
//     if (rideStarted) {
//       // Complete the trip
//       await completeTrip();
//     } else {
//       // Just mark the ride as started in UI
//       setRideStarted(true);
      
//       // Update trip status in the UI
//       setCurrentTrips(prevTrips =>
//         prevTrips.map(trip => ({
//           ...trip,
//           rideStatus: "In Progress",
//         }))
//       );
//     }
//   };

//   // Function to complete a trip by calling the backend API
//   const completeTrip = async () => {
//     if (currentTrips.length === 0) return;
    
//     // Get the vehicleAvailabilityId from the first current trip
//     const vehicleAvailabilityId = currentTrips[0].vehicleAvailabilityId;
    
//     setIsLoading(true);
//     try {
//       // Call the API endpoint to complete the trip
//       const response = await axios.post(`https://localhost:7291/api/DriverDashboard/complete-trip/${vehicleAvailabilityId}`);
      
//       // Show success toast message
//       toast.success("Your ride has been completed!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
      
//       // Reload the page after showing toast
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
      
//     } catch (error) {
//       // Handle error with toast
//       toast.error("Failed to complete trip. Please try again.", {
//         position: "top-right",
//         autoClose: 5000
//       });
//       console.error("Error completing trip:", error);
//       setIsLoading(false);
//     }
//   };

//   // Load driver stats
//   useEffect(() => {
//     const loadDriverStats = async () => {
//       try {
//         const stats = await fetchDriverStats(); 
//         setTodaysEarnings(stats.todaysIncome);
//         setTotalRides(stats.totalRides);
//         setTotalEarnings(stats.totalIncome);
//       } catch (error) {
//         console.error("Failed to load driver stats:", error.message);
//         setMessage("Failed to load driver statistics.");
//       }
//     };
  
//     loadDriverStats();
//   }, []); 
  

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Bike Rider Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <span className={`h-3 w-3 rounded-full mr-2 ${riderStats.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
//               <span>{riderStats.available ? 'Available' : 'Offline'}</span>
//             </div>
//             <button 
//               onClick={toggleAvailability}
//               className={`px-4 py-2 rounded-md ${riderStats.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
//             >
//               {riderStats.available ? 'Go Offline' : 'Go Online'}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto p-4 flex-grow">
//         {/* Status message */}
//         {/* {message && (
//           <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
//             <p>{message}</p>
//           </div>
//         )} */}
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Rating</h3>
//             <div className="flex items-center mt-2">
//               <span className="text-2xl font-bold">{riderStats.rating}</span>
//               <span className="text-yellow-500 ml-2">★</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Rides</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">{totalRides}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {totalEarnings}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Today's Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {todaysEarnings}</span>
//             </div>
//           </div>
//           <div className="bg-blue-200 p-4 rounded-lg shadow">
//             <h3 className="text-2x1 font-bold">Set Fare and Schedule</h3> 
//             <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-semibold">Fare</label>
//           <input
//             type="number"
//             value={fare}
//             onChange={(e) => setFare(e.target.value)}
//             className="w-full p-2 rounded border"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-semibold">Total Seats</label>
//           <input
//             type="number"
//             value={totalSeats}
//             onChange={(e) => setTotalSeats(e.target.value)}
//             className="w-full p-2 rounded border"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-semibold">Booked Seats</label>
//           <input
//             type="number"
//             value={bookedSeats}
//             onChange={(e) => setBookedSeats(e.target.value)}
//             className="w-full p-2 rounded border"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-semibold">Departure Date</label>
//           <input
//             type="date"
//             value={departureDate}
//             onChange={(e) => setDepartureDate(e.target.value)}
//             className="w-full p-2 rounded border"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Submit
//         </button>
//       </form>
//       {message && (
//         <div className="mt-4 p-2 bg-white text-black rounded">{message}</div>
//       )}                   
//           </div>
//           <div className="bg-blue-200 p-4 rounded-lg shadow">
//             <h3 className="text-2x1 font-bold">Edit Fare and Schedule</h3>  
            
//           </div>
//         </div>

//         {/* Current Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Current Trips</h2>
//             {currentTrips.length > 0 && (
//               <button
//                 className={`px-4 py-2 rounded ${
//                   rideStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
//                 } text-white transition duration-300`}
//                 onClick={handleRideToggle}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Processing..." : rideStarted ? "Complete Ride" : "Start Ride"}
//               </button>
//             )}
//           </div>
          
//           {currentTrips.length === 0 ? (
//             <p className="text-gray-500">No current trips.</p>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentTrips.map(trip => (
//                   <tr key={trip.bookingId}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickupPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropOffPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.departureTime}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.fare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{trip.rideStatus}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Upcoming Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <h2 className="text-lg font-semibold mb-4">Upcoming Rides</h2>
//           {upcomingTrips.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {upcomingTrips.map(ride => (
//                     <tr key={ride.bookingId}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{ride.departureDate}</div>
//                         <div className="text-sm text-gray-500">{ride.time}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickupPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropOffPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.departureTime}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.phoneNumber}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No upcoming rides scheduled.</p>
//           )}
//         </div>

//         {/* Recent Rides */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentRides.map(ride => (
//                   <tr key={ride.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.date}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickup}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropoff}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="text-yellow-500 mr-1">★</span>
//                         <span className="text-sm text-gray-900">{ride.rating}</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
//         © 2025 Online Vehicle Ticket App. All rights reserved.
//       </footer>
//     </div>
//   );
// };

//export default BikeRiderDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { setDriverOnlineStatus, setDriverOfflineStatus, fetchDriverStatus } from '../../../services/DriverService';
// import { fetchDriverCurrentTrips, fetchDriverUpcomingTrips, fetchDriverStats } from '../../../services/DriverDashboardService';
// import { setFareAndSchedule, editFareAndSchedule } from '../../../services/DriverDashboardService';
// import { toast } from 'react-toastify';


// const BikeRiderDashboard = () => {
//   // State for rider information
//   const [riderStats, setRiderStats] = useState({
//     name: "Alex Rider",
//     rating: 4.8,
//     available: true
//   });
  
//   const [currentTrips, setCurrentTrips] = useState([]);
//   const [upcomingTrips, setUpcomingTrips] = useState([]);
//   const [message, setMessage] = useState('');
//   const [rideStarted, setRideStarted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [todaysEarnings, setTodaysEarnings] = useState(0);
//   const [totalRides, setTotalRides] = useState(0);
//   const [totalEarnings, setTotalEarnings] = useState(0);

//   // State for set fare form
//   const [fare, setFare] = useState('');
//   const [totalSeats, setTotalSeats] = useState('');
//   const [bookedSeats, setBookedSeats] = useState('');
//   const [departureDate, setDepartureDate] = useState('');
  
//   // State for edit fare form
//   const [editFare, setEditFare] = useState('');
//   const [editTotalSeats, setEditTotalSeats] = useState('');
//   const [editBookedSeats, setEditBookedSeats] = useState('');
//   const [editDepartureDate, setEditDepartureDate] = useState('');
//   const [editScheduleId, setEditScheduleId] = useState('');
  
//   // State to control whether the forms are open or not
//   const [isFareFormOpen, setIsFareFormOpen] = useState(false);
//   const [isEditFareFormOpen, setIsEditFareFormOpen] = useState(false);
  
//   // State for schedules list that can be edited
//   const [schedules, setSchedules] = useState([]);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);

//   // Add a function to fetch all schedules
//   // const fetchSchedules = async () => {
//   //   try {
//   //     // This is a placeholder - you'll need to implement this API function
//   //     // in your DriverDashboardService
//   //     const response = await axios.get('https://localhost:7291/api/DriverDashboard/schedules');
//   //     setSchedules(response.data);
//   //   } catch (error) {
//   //     console.error("Error fetching schedules:", error);
//   //     toast.error("Failed to load schedules. Please try again.");
//   //   }
//   // };

//   // Populate edit form with selected schedule
//   const selectScheduleForEdit = (schedule) => {
//     setSelectedSchedule(schedule);
//     setEditFare(schedule.fare);
//     setEditTotalSeats(schedule.totalSeats);
//     setEditBookedSeats(schedule.bookedSeats);
//     setEditDepartureDate(schedule.departureDate.split('T')[0]); // Format date
//     setEditScheduleId(schedule.id);
//     setIsEditFareFormOpen(true);
//   };

//   // Handle set fare form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token"); // or use context/auth system
//     try {
//       const result = await setFareAndSchedule(fare, totalSeats, departureDate, token);
//       setMessage(result.message);
      
//       // Close form on successful submission
//       setIsFareFormOpen(false);
      
//       // Clear form fields after successful submission
//       setFare('');
//       setTotalSeats('');
//       setBookedSeats('');
//       setDepartureDate('');
      
//       // Refresh schedules list
//       fetchSchedules();
      
//       // Show success toast
//       toast.success("Fare and schedule successfully updated!", {
//         position: "top-right",
//         autoClose: 3000
//       });
//     } catch (err) {
//       setMessage(err);
//       toast.error("Failed to update fare and schedule. Please try again.", {
//         position: "top-right",
//         autoClose: 5000
//       });
//     }
//   };
  
//   // Handle edit fare form submission
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token"); // or use context/auth system
//     try {
//       const result = await editFareAndSchedule(
//         editScheduleId,
//         editFare, 
//         editTotalSeats, 
//         editDepartureDate, 
//         token
//       );
      
//       // Close form on successful submission
//       setIsEditFareFormOpen(false);
      
//       // Clear form fields after successful submission
//       setEditFare('');
//       setEditTotalSeats('');
//       setEditBookedSeats('');
//       setEditDepartureDate('');
//       setEditScheduleId('');
//       setSelectedSchedule(null);
      
//       // Refresh schedules list
//       //fetchSchedules();
      
//       // Show success toast
//       toast.success("Fare and schedule successfully edited!", {
//         position: "top-right",
//         autoClose: 3000
//       });
//     } catch (err) {
//       toast.error("Failed to edit fare and schedule. Please try again.", {
//         position: "top-right",
//         autoClose: 5000
//       });
//     }
//   };
  
//   // Sample data for recent rides
//   const [recentRides, setRecentRides] = useState([
//     { id: 1, date: "2025-02-28", pickup: "Pokhara", dropoff: "Kathmandu", fare: 3012.50, status: "Completed", rating: 5 },
//     { id: 2, date: "2025-02-28", pickup: "Kathmandu", dropoff: "Pokhara", fare: 4008.75, status: "Completed", rating: 5 },
//     { id: 3, date: "2025-02-27", pickup: "Butwal", dropoff: "Kathmandu", fare: 2290.30, status: "Completed", rating: 4 },
//     { id: 4, date: "2025-02-26", pickup: "Lalitpur", dropoff: "Okhaldhunga", fare: 2687.20, status: "Completed", rating: 5 }
//   ]);

//   // Fetch trips data and schedules on component mount
//   useEffect(() => {
//     loadTripsData();
//     //fetchSchedules(); // Load schedules for editing
//   }, []);

//   useEffect(() => {
//     const initializeDashboard = async () => {
//       await loadTripsData();
  
//       try {
//         const status = await fetchDriverStatus();
//         setRiderStats(prev => ({
//           ...prev,
//           available: status.isOnline
//         }));
//       } catch (error) {
//         console.error("Error fetching driver status:", error);
//       }
//     };
  
//     initializeDashboard();
//   }, []);
  
//   // Function to load trips data
//   const loadTripsData = async () => {
//     try {
//       const currentTripsData = await fetchDriverCurrentTrips();
//       if (currentTripsData.message) {
//         setMessage(currentTripsData.message);
//       } else {
//         setCurrentTrips(currentTripsData);
//       }

//       const upcomingTripsData = await fetchDriverUpcomingTrips();
//       if (upcomingTripsData.message) {
//         // Keep previous message if it exists
//         if (!currentTripsData.message) {
//           setMessage(upcomingTripsData.message);
//         }
//       } else {
//         setUpcomingTrips(upcomingTripsData);
//       }
//     } catch (error) {
//       setMessage("Error fetching trips");
//       console.error("Error fetching trips:", error);
//     }
//   };

//   // Updated toggle driver availability status function
//   const toggleAvailability = async () => {
//     try {
//       if (riderStats.available) {
//         // Driver is currently online, call API to set offline
//         await setDriverOfflineStatus();
//         toast.info("You are now offline", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       } else {
//         // Driver is currently offline, call API to set online
//         await setDriverOnlineStatus();
//         toast.success("You are now online and available for trips", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       }
      
//       // Update local state
//       setRiderStats(prev => ({
//         ...prev,
//         available: !prev.available
//       }));
//     } catch (error) {
//       const statusAction = riderStats.available ? "offline" : "online";
//       toast.error(`Failed to go ${statusAction}. Please try again.`, {
//         position: "top-right",
//         autoClose: 5000
//       });
//       setMessage(`Failed to update status to ${statusAction}. Please try again.`);
//       console.error(`Error updating driver status to ${statusAction}:`, error);
//     }
//   };

//   // Handle starting or completing a ride
//   const handleRideToggle = async () => {
//     if (rideStarted) {
//       // Complete the trip
//       await completeTrip();
//     } else {
//       // Just mark the ride as started in UI
//       setRideStarted(true);
      
//       // Update trip status in the UI
//       setCurrentTrips(prevTrips =>
//         prevTrips.map(trip => ({
//           ...trip,
//           rideStatus: "In Progress",
//         }))
//       );
//     }
//   };

//   // Function to complete a trip by calling the backend API
//   const completeTrip = async () => {
//     if (currentTrips.length === 0) return;
    
//     // Get the vehicleAvailabilityId from the first current trip
//     const vehicleAvailabilityId = currentTrips[0].vehicleAvailabilityId;
    
//     setIsLoading(true);
//     try {
//       // Call the API endpoint to complete the trip
//       const response = await axios.post(`https://localhost:7291/api/DriverDashboard/complete-trip/${vehicleAvailabilityId}`);
      
//       // Show success toast message
//       toast.success("Your ride has been completed!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
      
//       // Reload the page after showing toast
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
      
//     } catch (error) {
//       // Handle error with toast
//       toast.error("Failed to complete trip. Please try again.", {
//         position: "top-right",
//         autoClose: 5000
//       });
//       console.error("Error completing trip:", error);
//       setIsLoading(false);
//     }
//   };

//   // Load driver stats
//   useEffect(() => {
//     const loadDriverStats = async () => {
//       try {
//         const stats = await fetchDriverStats(); 
//         setTodaysEarnings(stats.todaysIncome);
//         setTotalRides(stats.totalRides);
//         setTotalEarnings(stats.totalIncome);
//       } catch (error) {
//         console.error("Failed to load driver stats:", error.message);
//         setMessage("Failed to load driver statistics.");
//       }
//     };
  
//     loadDriverStats();
//   }, []); 
  

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Bike Rider Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <span className={`h-3 w-3 rounded-full mr-2 ${riderStats.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
//               <span>{riderStats.available ? 'Available' : 'Offline'}</span>
//             </div>
//             <button 
//               onClick={toggleAvailability}
//               className={`px-4 py-2 rounded-md ${riderStats.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
//             >
//               {riderStats.available ? 'Go Offline' : 'Go Online'}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto p-4 flex-grow">
//         {/* Status message */}
//         {/* {message && (
//           <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
//             <p>{message}</p>
//           </div>
//         )} */}
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Rating</h3>
//             <div className="flex items-center mt-2">
//               <span className="text-2xl font-bold">{riderStats.rating}</span>
//               <span className="text-yellow-500 ml-2">★</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Rides</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">{totalRides}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {totalEarnings}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Today's Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {todaysEarnings}</span>
//             </div>
//           </div>
          
//           {/* Set Fare and Schedule Card - More attractive with better hover effect */}
//           <div className="relative">
//             <div 
//               className={`bg-gradient-to-r ${isFareFormOpen ? 'from-white to-blue-500' : 'from-white to-blue-400'} 
//                 p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
//                 hover:shadow-lg hover:from-blue-400 hover:to-blue-500 hover:shadow-blue-200`}
//               onClick={() => {
//                 setIsFareFormOpen(!isFareFormOpen);
//                 setIsEditFareFormOpen(false); // Close edit form when opening set form
//               }}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <svg 
//                     className="h-6 w-6 mr-2 text-blue-800" 
//                     fill="none" 
//                     viewBox="0 0 24 24" 
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h3 className="text-lg font-bold">Set Fare and Schedule</h3>
//                 </div>
//                 <svg 
//                   className={`h-5 w-5 text-blue-800 transition-transform duration-300 ${isFareFormOpen ? 'transform rotate-180' : ''}`} 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>
            
//             {isFareFormOpen && (
//               <div 
//                 className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-200 transition-all duration-300 ease-in-out"
//                 onClick={(e) => e.stopPropagation()} // Prevent the card from closing when clicking on the form
//               >
//                 <div className="p-4">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                       <label className="block font-semibold text-gray-700">Fare (Rs)</label>
//                       <input
//                         type="number"
//                         value={fare}
//                         onChange={(e) => setFare(e.target.value)}
//                         className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-semibold text-gray-700">Total Seats</label>
//                       <input
//                         type="number"
//                         value={totalSeats}
//                         onChange={(e) => setTotalSeats(e.target.value)}
//                         className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-semibold text-gray-700">Booked Seats</label>
//                       <input
//                         type="number"
//                         value={bookedSeats}
//                         onChange={(e) => setBookedSeats(e.target.value)}
//                         className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-semibold text-gray-700">Departure Date</label>
//                       <input
//                         type="date"
//                         value={departureDate}
//                         onChange={(e) => setDepartureDate(e.target.value)}
//                         className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                         required
//                       />
//                     </div>
//                     <div className="flex items-center justify-between pt-2">
//                       <button
//                         type="button"
//                         onClick={() => setIsFareFormOpen(false)}
//                         className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center"
//                       >
//                         <span>Submit</span>
//                         <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                         </svg>
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Edit Fare and Schedule Card - With hover effect but separate styling from Set Fare */}
//           <div className="relative">
//             <div 
//               className={`bg-gradient-to-r ${isEditFareFormOpen ? 'from-white to-purple-500' : 'from-white to-purple-400'} 
//                 p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
//                 hover:shadow-lg hover:from-purple-400 hover:to-purple-500 hover:shadow-purple-200`}
//               onClick={() => {
//                 setIsEditFareFormOpen(!isEditFareFormOpen);
//                 setIsFareFormOpen(false); // Close set form when opening edit form
//               }}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <svg 
//                     className="h-6 w-6 mr-2 text-purple-800" 
//                     fill="none" 
//                     viewBox="0 0 24 24" 
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                   <h3 className="text-lg font-bold">Edit Fare and Schedule</h3>
//                 </div>
//                 <svg 
//                   className={`h-5 w-5 text-purple-800 transition-transform duration-300 ${isEditFareFormOpen ? 'transform rotate-180' : ''}`} 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>
            
//             {isEditFareFormOpen && (
//               <div 
//                 className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-purple-200 transition-all duration-300 ease-in-out"
//                 onClick={(e) => e.stopPropagation()} // Prevent the card from closing when clicking on the form
//               >
//                 <div className="p-4">
//                   {/* Select a schedule to edit */}
//                   {!selectedSchedule ? (
//                     <div className="mb-4">
//                       <h4 className="font-semibold text-purple-700 mb-2">Select a schedule to edit:</h4>
//                       {schedules.length > 0 ? (
//                         <div className="max-h-60 overflow-y-auto">
//                           <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                               <tr>
//                                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
//                                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Fare</th>
//                                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Seats</th>
//                                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Action</th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {schedules.map(schedule => (
//                                 <tr key={schedule.id}>
//                                   <td className="px-3 py-2 whitespace-nowrap text-sm">{new Date(schedule.departureDate).toLocaleDateString()}</td>
//                                   <td className="px-3 py-2 whitespace-nowrap text-sm">Rs {schedule.fare}</td>
//                                   <td className="px-3 py-2 whitespace-nowrap text-sm">{schedule.bookedSeats}/{schedule.totalSeats}</td>
//                                   <td className="px-3 py-2 whitespace-nowrap">
//                                     <button
//                                       onClick={() => selectScheduleForEdit(schedule)}
//                                       className="text-purple-600 hover:text-purple-900 text-sm font-medium"
//                                     >
//                                       Edit
//                                     </button>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <p className="text-gray-500">No schedules available to edit.</p>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => setIsEditFareFormOpen(false)}
//                         className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   ) : (
//                     <form onSubmit={handleEditSubmit} className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-semibold text-purple-700">Editing Schedule for {new Date(selectedSchedule.departureDate).toLocaleDateString()}</h4>
//                         <button
//                           type="button"
//                           onClick={() => setSelectedSchedule(null)}
//                           className="text-gray-500 hover:text-gray-700"
//                         >
//                           <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       </div>
//                       <div>
//                         <label className="block font-semibold text-gray-700">Fare (Rs)</label>
//                         <input
//                           type="number"
//                           value={editFare}
//                           onChange={(e) => setEditFare(e.target.value)}
//                           className="w-full p-2 rounded border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block font-semibold text-gray-700">Total Seats</label>
//                         <input
//                           type="number"
//                           value={editTotalSeats}
//                           onChange={(e) => setEditTotalSeats(e.target.value)}
//                           className="w-full p-2 rounded border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block font-semibold text-gray-700">Booked Seats</label>
//                         <input
//                           type="number"
//                           value={editBookedSeats}
//                           onChange={(e) => setEditBookedSeats(e.target.value)}
//                           className="w-full p-2 rounded border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition"
//                           disabled
//                           title="Booked seats cannot be modified"
//                         />
//                         <p className="text-sm text-gray-500 mt-1">Booked seats cannot be modified directly</p>
//                       </div>
//                       <div>
//                         <label className="block font-semibold text-gray-700">Departure Date</label>
//                         <input
//                           type="date"
//                           value={editDepartureDate}
//                           onChange={(e) => setEditDepartureDate(e.target.value)}
//                           className="w-full p-2 rounded border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition"
//                           required
//                         />
//                       </div>
//                       <div className="flex items-center justify-between pt-2">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setSelectedSchedule(null);
//                             setIsEditFareFormOpen(false);
//                           }}
//                           className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition flex items-center"
//                         >
//                           <span>Update</span>
//                           <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                           </svg>
//                         </button>
//                       </div>
//                     </form>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Current Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Current Trips</h2>
//             {currentTrips.length > 0 && (
//               <button
//                 className={`px-4 py-2 rounded ${
//                   rideStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
//                 } text-white transition duration-300`}
//                 onClick={handleRideToggle}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Processing..." : rideStarted ? "Complete Ride" : "Start Ride"}
//               </button>
//             )}
//           </div>
          
//           {currentTrips.length === 0 ? (
//             <p className="text-gray-500">No current trips.</p>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentTrips.map(trip => (
//                   <tr key={trip.bookingId}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickupPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropOffPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.departureTime}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.fare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{trip.rideStatus}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Upcoming Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <h2 className="text-lg font-semibold mb-4">Upcoming Rides</h2>
//           {upcomingTrips.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {upcomingTrips.map(ride => (
//                     <tr key={ride.bookingId}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{ride.departureDate}</div>
//                         <div className="text-sm text-gray-500">{ride.time}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickupPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropOffPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.departureTime}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.phoneNumber}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No upcoming rides scheduled.</p>
//           )}
//         </div>

//         {/* Recent Rides */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentRides.map(ride => (
//                   <tr key={ride.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.date}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickup}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropoff}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="text-yellow-500 mr-1">★</span>
//                         <span className="text-sm text-gray-900">{ride.rating}</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
//         © 2025 Online Vehicle Ticket App. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default BikeRiderDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { setDriverOnlineStatus, setDriverOfflineStatus, fetchDriverStatus } from '../../../services/DriverService';
// import { fetchDriverCurrentTrips, fetchDriverUpcomingTrips, fetchDriverStats } from '../../../services/DriverDashboardService';
// import { setFareAndSchedule, editFareAndSchedule } from '../../../services/DriverDashboardService';
// import { toast } from 'react-toastify';
// import BikeRiderDashboardFeatures from './BikeRiderDashboardFeatures';
// import ManualSeatBookingBike from './ManualSeatBookingBike';

// const BikeRiderDashboard = () => {
//   // State for rider information
//   const [riderStats, setRiderStats] = useState({
//     name: "Alex Rider",
//     rating: 4.8,
//     available: true
//   });
  
//   const [currentTrips, setCurrentTrips] = useState([]);
//   const [upcomingTrips, setUpcomingTrips] = useState([]);
//   const [message, setMessage] = useState('');
//   const [rideStarted, setRideStarted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [todaysEarnings, setTodaysEarnings] = useState(0);
//   const [totalRides, setTotalRides] = useState(0);
//   const [totalEarnings, setTotalEarnings] = useState(0);

  
  
//   // Sample data for recent rides
//   const [recentRides, setRecentRides] = useState([
//     { id: 1, date: "2025-02-28", pickup: "Pokhara", dropoff: "Kathmandu", fare: 3012.50, status: "Completed", rating: 5 },
//     { id: 2, date: "2025-02-28", pickup: "Kathmandu", dropoff: "Pokhara", fare: 4008.75, status: "Completed", rating: 5 },
//     { id: 3, date: "2025-02-27", pickup: "Butwal", dropoff: "Kathmandu", fare: 2290.30, status: "Completed", rating: 4 },
//     { id: 4, date: "2025-02-26", pickup: "Lalitpur", dropoff: "Okhaldhunga", fare: 2687.20, status: "Completed", rating: 5 }
//   ]);

//   // Fetch trips data and schedules on component mount
//   useEffect(() => {
//     loadTripsData();
//     //fetchSchedules(); // Load schedules for editing
//   }, []);

//   useEffect(() => {
//     const initializeDashboard = async () => {
//       await loadTripsData();
  
//       try {
//         const status = await fetchDriverStatus();
//         setRiderStats(prev => ({
//           ...prev,
//           available: status.isOnline
//         }));
//       } catch (error) {
//         console.error("Error fetching driver status:", error);
//       }
//     };
  
//     initializeDashboard();
//   }, []);
  
//   // Function to load trips data
//   const loadTripsData = async () => {
//     try {
//       const currentTripsData = await fetchDriverCurrentTrips();
//       if (currentTripsData.message) {
//         setMessage(currentTripsData.message);
//       } else {
//         setCurrentTrips(currentTripsData);
//       }

//       const upcomingTripsData = await fetchDriverUpcomingTrips();
//       if (upcomingTripsData.message) {
//         // Keep previous message if it exists
//         if (!currentTripsData.message) {
//           setMessage(upcomingTripsData.message);
//         }
//       } else {
//         setUpcomingTrips(upcomingTripsData);
//       }
//     } catch (error) {
//       setMessage("Error fetching trips");
//       console.error("Error fetching trips:", error);
//     }
//   };

//   // Updated toggle driver availability status function
//   const toggleAvailability = async () => {
//     try {
//       if (riderStats.available) {
//         // Driver is currently online, call API to set offline
//         await setDriverOfflineStatus();
//         toast.info("You are now offline", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       } else {
//         // Driver is currently offline, call API to set online
//         await setDriverOnlineStatus();
//         toast.success("You are now online and available for trips", {
//           position: "top-right",
//           autoClose: 3000
//         });
//       }
      
//       // Update local state
//       setRiderStats(prev => ({
//         ...prev,
//         available: !prev.available
//       }));
//     } catch (error) {
//       const statusAction = riderStats.available ? "offline" : "online";
//       toast.error(`Failed to go ${statusAction}. Please try again.`, {
//         position: "top-right",
//         autoClose: 5000
//       });
//       setMessage(`Failed to update status to ${statusAction}. Please try again.`);
//       console.error(`Error updating driver status to ${statusAction}:`, error);
//     }
//   };

//   // Handle starting or completing a ride
//   const handleRideToggle = async () => {
//     if (rideStarted) {
//       // Complete the trip
//       await completeTrip();
//     } else {
//       // Just mark the ride as started in UI
//       setRideStarted(true);
      
//       // Update trip status in the UI
//       setCurrentTrips(prevTrips =>
//         prevTrips.map(trip => ({
//           ...trip,
//           rideStatus: "In Progress",
//         }))
//       );
//     }
//   };

//   // Function to complete a trip by calling the backend API
//   const completeTrip = async () => {
//     if (currentTrips.length === 0) return;
    
//     // Get the vehicleAvailabilityId from the first current trip
//     const vehicleAvailabilityId = currentTrips[0].vehicleAvailabilityId;
    
//     setIsLoading(true);
//     try {
//       // Call the API endpoint to complete the trip
//       const response = await axios.post(`https://localhost:7291/api/DriverDashboard/complete-trip/${vehicleAvailabilityId}`);
      
//       // Show success toast message
//       toast.success("Your ride has been completed!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
      
//       // Reload the page after showing toast
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
      
//     } catch (error) {
//       // Handle error with toast
//       toast.error("Failed to complete trip. Please try again.", {
//         position: "top-right",
//         autoClose: 5000
//       });
//       console.error("Error completing trip:", error);
//       setIsLoading(false);
//     }
//   };

//   // Load driver stats
//   useEffect(() => {
//     const loadDriverStats = async () => {
//       try {
//         const stats = await fetchDriverStats(); 
//         setTodaysEarnings(stats.todaysIncome);
//         setTotalRides(stats.totalRides);
//         setTotalEarnings(stats.totalIncome);
//       } catch (error) {
//         console.error("Failed to load driver stats:", error.message);
//         setMessage("Failed to load driver statistics.");
//       }
//     };
  
//     loadDriverStats();
//   }, []); 
  

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Bike Rider Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <span className={`h-3 w-3 rounded-full mr-2 ${riderStats.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
//               <span>{riderStats.available ? 'Available' : 'Offline'}</span>
//             </div>
//             <button 
//               onClick={toggleAvailability}
//               className={`px-4 py-2 rounded-md ${riderStats.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
//             >
//               {riderStats.available ? 'Go Offline' : 'Go Online'}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto p-4 flex-grow">
//         {/* Status message */}
//         {/* {message && (
//           <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
//             <p>{message}</p>
//           </div>
//         )} */}
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Rating</h3>
//             <div className="flex items-center mt-2">
//               <span className="text-2xl font-bold">{riderStats.rating}</span>
//               <span className="text-yellow-500 ml-2">★</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Rides</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">{totalRides}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Total Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {totalEarnings}</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-gray-500 text-sm">Today's Earnings</h3>
//             <div className="mt-2">
//               <span className="text-2xl font-bold">Rs {todaysEarnings}</span>
//             </div>
//           </div>
          
//           {/* Set Fare and Schedule Card */}
        
          
//         </div>
//         <BikeRiderDashboardFeatures/>
//         <ManualSeatBookingBike/>
//         {/* Current Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Current Trips</h2>
//             {currentTrips.length > 0 && (
//               <button
//                 className={`px-4 py-2 rounded ${
//                   rideStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
//                 } text-white transition duration-300`}
//                 onClick={handleRideToggle}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Processing..." : rideStarted ? "Complete Ride" : "Start Ride"}
//               </button>
//             )}
//           </div>
          
//           {currentTrips.length === 0 ? (
//             <p className="text-gray-500">No current trips.</p>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentTrips.map(trip => (
//                   <tr key={trip.bookingId}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickupPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropOffPoint}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.departureTime}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.fare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{trip.rideStatus}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Upcoming Rides */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <h2 className="text-lg font-semibold mb-4">Upcoming Rides</h2>
//           {upcomingTrips.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {upcomingTrips.map(ride => (
//                     <tr key={ride.bookingId}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{ride.departureDate}</div>
//                         <div className="text-sm text-gray-500">{ride.time}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickupPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropOffPoint}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.departureTime}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.phoneNumber}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No upcoming rides scheduled.</p>
//           )}
//         </div>

//         {/* Recent Rides */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentRides.map(ride => (
//                   <tr key={ride.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.date}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickup}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropoff}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="text-yellow-500 mr-1">★</span>
//                         <span className="text-sm text-gray-900">{ride.rating}</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
//         © 2025 Online Vehicle Ticket App. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default BikeRiderDashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setDriverOnlineStatus, setDriverOfflineStatus, fetchDriverStatus } from '../../../services/DriverService';
import { fetchDriverGroupedCurrentTrips, fetchDriverGroupedUpcomingTrips, fetchDriverStats } from '../../../services/DriverDashboardService';
import { toast } from 'react-toastify';
import { fetchPassengerStats } from '../../../services/DriverDashboardService';
import BusDriverDashboardFeatures from './BusDriverDashboardFeatuers';
import ManualSeatBookingBus from './ManualSeatBookingBus';

const BusDriverDashboard = () => {
  // State for rider information
  const [riderStats, setRiderStats] = useState({
    name: "Alex Rider",
    rating: 4.8,
    available: true
  });
  
  const [currentTrips, setCurrentTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [message, setMessage] = useState('');
  const [rideStarted, setRideStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false); // State for toggle

  const [todaysEarnings, setTodaysEarnings] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const [passengerStats, setPassengerStats] = useState({
      passengerCount: 0,
      totalCapacity: 0
    });

    
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
  
  
  // Sample data for recent rides
  const [recentRides, setRecentRides] = useState([
    { id: 1, date: "2025-02-28", pickup: "Pokhara", dropoff: "Kathmandu", fare: 3012.50, status: "Completed", rating: 5 },
    { id: 2, date: "2025-02-28", pickup: "Kathmandu", dropoff: "Pokhara", fare: 4008.75, status: "Completed", rating: 5 },
    { id: 3, date: "2025-02-27", pickup: "Butwal", dropoff: "Kathmandu", fare: 2290.30, status: "Completed", rating: 4 },
    { id: 4, date: "2025-02-26", pickup: "Lalitpur", dropoff: "Okhaldhunga", fare: 2687.20, status: "Completed", rating: 5 }
  ]);

  // Fetch trips data and schedules on component mount
  useEffect(() => {
    loadTripsData();
    //fetchSchedules(); // Load schedules for editing
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
        // Driver is currently online, call API to set online
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
          <h1 className="text-2xl font-bold">Bus Driver Dashboard</h1>
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
        {/* {message && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
            <p>{message}</p>
          </div>
        )} */}
        
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
          {/* <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Passenger Count</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold">{passengerStats.passengerCount}/{passengerStats.totalCapacity}</span>             
            </div>
            <div className="mt-1 relative pt-1">
              <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${(passengerStats.passengerCount / passengerStats.totalCapacity) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </div> */}
        </div>

        <BusDriverDashboardFeatures/>
        
        {/* Manual Seat Booking Toggle - Similar to BikeRiderDashboardFeatures */}
        <div className="relative mb-6">
          <div 
            className={`bg-gradient-to-r ${isManualBookingOpen ? 'from-white to-blue-500' : 'from-white to-blue-400'} 
              p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
              hover:shadow-lg hover:from-blue-400 hover:to-blue-500 hover:shadow-blue-200`}
            onClick={() => setIsManualBookingOpen(!isManualBookingOpen)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg 
                  className="h-6 w-6 mr-2 text-blue-800" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-bold">Book Seat Manually</h3>
              </div>
              <svg 
                className={`h-5 w-5 text-blue-800 transition-transform duration-300 ${isManualBookingOpen ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {isManualBookingOpen && (
            <div 
              className="mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-200 transition-all duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()} // Prevent the card from closing when clicking inside
            >
              <div className="p-4">
                <ManualSeatBookingBus />
              </div>
            </div>
          )}
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

export default BusDriverDashboard;
