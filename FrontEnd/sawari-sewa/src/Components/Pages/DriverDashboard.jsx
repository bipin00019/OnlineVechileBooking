import React, { useState, useEffect } from "react";
import { fetchVehicleType } from "../../services/DriverService";
import BusDriverDashboard from "../DriverDashboards/BusDriver/BusDriverDashboard";
import VanDriverDashboard from "../DriverDashboards/VanDriver/VanDriverDashboard";
import JeepDriverDashboard from "../DriverDashboards/JeepDriver/JeepDriverDashboard";
import BikeRiderDashboard from "../DriverDashboards/BikeRider/BikeRiderDashboard";
import { Loader2 } from "lucide-react"; // Loading spinner

const DriverDashboard = () => {
  const [vehicleType, setVehicleType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getVehicleType = async () => {
      try {
        const data = await fetchVehicleType();
        setVehicleType(data);
      } catch (error) {
        setError("Failed to fetch vehicle type. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getVehicleType();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Loader2 className="animate-spin" size={40} />
        <p>Loading vehicle type...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", padding: "10px", border: "1px solid red", margin: "10px" }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  switch (vehicleType) {
    case "Bike":
      return <BikeRiderDashboard />;
    case "Van":
      return <VanDriverDashboard />;
    case "Bus":
      return <BusDriverDashboard />;
      case "Sofa Seater Bus":
        return <BusDriverDashboard />;
    case "Jeep":
      return <JeepDriverDashboard />;
    default:
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h1>Unknown Vehicle Type</h1>
          <p>Please contact support.</p>
        </div>
      );
  }
};

export default DriverDashboard;


// export default DriverDashboard

// import React, { useState } from 'react';
// import { Bell, User, LogOut, MapPin, Clock, DollarSign, UserCheck, Star, Calendar, Settings, ChevronDown, ArrowRight, Edit, Check, X } from 'lucide-react';

// const DriverDashboard = () => {
//   // Static data
//   const [currentTrips] = useState([
//     { id: 1, from: 'Kathmandu', to: 'Pokhara', date: '2025-02-27', time: '14:30', passengers: 3, fare: 2500, status: 'pending' },
//     { id: 2, from: 'Pokhara', to: 'Kathmandu', date: '2025-02-28', time: '09:00', passengers: 4, fare: 2500, status: 'accepted' }
//   ]);
  
//   const [pastTrips] = useState([
//     { id: 3, from: 'Kathmandu', to: 'Chitwan', date: '2025-02-25', time: '08:00', passengers: 2, fare: 1800, rating: 4.8, status: 'completed' },
//     { id: 4, from: 'Chitwan', to: 'Kathmandu', date: '2025-02-26', time: '16:00', passengers: 3, fare: 1800, rating: 4.5, status: 'completed' }
//   ]);
  
//   const [earnings] = useState({
//     today: 2500,
//     week: 14500,
//     month: 42000,
//     pending: 1800
//   });
  
//   const [profile] = useState({
//     name: 'Ramesh Sharma',
//     phone: '+977 9801234567',
//     email: 'ramesh.sharma@example.com',
//     vehicle: 'Tata Sumo (BA 1 JA 2345)',
//     rating: 4.7,
//     tripCount: 156,
//     verified: true,
//     licenseNo: 'DL-012345678',
//     joinDate: '2023-08-15'
//   });
  
//   const [notifications] = useState([
//     { id: 1, message: 'New booking request from Kathmandu to Pokhara', time: '10 minutes ago', read: false },
//     { id: 2, message: 'Your scheduled trip to Bhaktapur is tomorrow', time: '2 hours ago', read: true },
//     { id: 3, message: 'Payment of Rs. 1800 has been deposited to your account', time: '1 day ago', read: true }
//   ]);

//   // Booking requests that need fare setting
//   const [bookingRequests, setBookingRequests] = useState([
//     { id: 101, from: 'Kathmandu', to: 'Bhaktapur', date: '2025-02-28', time: '10:00', passengers: 2, proposedFare: 0, distanceKm: 15 },
//     { id: 102, from: 'Patan', to: 'Nagarkot', date: '2025-02-29', time: '08:30', passengers: 3, proposedFare: 0, distanceKm: 28 },
//     { id: 103, from: 'Kathmandu', to: 'Dhulikhel', date: '2025-03-01', time: '09:15', passengers: 1, proposedFare: 0, distanceKm: 30 }
//   ]);



//   const [activeTab, setActiveTab] = useState('overview');


 


//   return (   
//     <div className="flex flex-col min-h-screen bg-gray-100">
      

//       {/* Main Content */}
//       <main className="flex-grow container mx-auto p-4 md:p-6">
//         {/* Dashboard Tabs */}
//         <div className="mb-6">
//           <div className="flex border-b">
//             <button 
//               onClick={() => setActiveTab('overview')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               Overview
//             </button>
//             <button 
//               onClick={() => setActiveTab('trips')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'trips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               My Trips
//             </button>
//             <button 
//               onClick={() => setActiveTab('bookings')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               Booking Requests
//             </button>
//             <button 
//               onClick={() => setActiveTab('earnings')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'earnings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               Earnings
//             </button>
//             <button 
//               onClick={() => setActiveTab('profile')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               Profile
//             </button>
//           </div>
//         </div>

//         {/* Dashboard Content */}
//         {activeTab === 'overview' && (
//           <div>
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <Calendar size={20} className="text-blue-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-gray-500 text-sm">Today's Trips</p>
//                     <p className="text-xl font-semibold">{currentTrips.length}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-green-100 rounded-lg">
//                     <DollarSign size={20} className="text-green-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-gray-500 text-sm">Today's Earnings</p>
//                     <p className="text-xl font-semibold">Rs. {earnings.today}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-yellow-100 rounded-lg">
//                     <Star size={20} className="text-yellow-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-gray-500 text-sm">Rating</p>
//                     <p className="text-xl font-semibold">{profile.rating}/5</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-purple-100 rounded-lg">
//                     <UserCheck size={20} className="text-purple-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-gray-500 text-sm">Total Trips</p>
//                     <p className="text-xl font-semibold">{profile.tripCount}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Booking Requests Alert */}
//             {bookingRequests.length > 0 && (
//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <Bell size={20} className="text-yellow-400" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-yellow-700">
//                       You have {bookingRequests.length} new booking requests that need your attention.
//                     </p>
//                     <div className="mt-2">
//                       <button
//                         onClick={() => setActiveTab('bookings')}
//                         className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
//                       >
//                         View Requests →
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Upcoming Trips */}
//             <div className="bg-white rounded-lg shadow mb-6">
//               <div className="p-4 border-b">
//                 <h2 className="text-lg font-semibold">Upcoming Trips</h2>
//               </div>
//               <div className="p-4">
//                 {currentTrips.length === 0 ? (
//                   <p className="text-gray-500 text-center py-4">No upcoming trips scheduled</p>
//                 ) : (
//                   <div className="divide-y">
//                     {currentTrips.map(trip => (
//                       <div key={trip.id} className="py-3">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <div className="flex items-center">
//                               <MapPin size={16} className="text-gray-400" />
//                               <span className="ml-1 font-medium">{trip.from} to {trip.to}</span>
//                             </div>
//                             <div className="mt-1 flex items-center text-sm text-gray-500">
//                               <Calendar size={14} className="mr-1" />
//                               <span>{trip.date}</span>
//                               <Clock size={14} className="ml-3 mr-1" />
//                               <span>{trip.time}</span>
//                               <UserCheck size={14} className="ml-3 mr-1" />
//                               <span>{trip.passengers} passengers</span>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-green-600 font-medium">Rs. {trip.fare}</div>
//                             <span className={`text-xs px-2 py-1 rounded-full ${
//                               trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                               trip.status === 'accepted' ? 'bg-green-100 text-green-800' : 
//                               'bg-gray-100 text-gray-800'
//                             }`}>
//                               {trip.status === 'pending' ? 'Pending' : 
//                                trip.status === 'accepted' ? 'Accepted' : 'Unknown'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Notifications */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-4 border-b flex justify-between items-center">
//                 <h2 className="text-lg font-semibold">Recent Notifications</h2>
//                 <button className="text-sm text-blue-600">View All</button>
//               </div>
//               <div className="p-4">
//                 {notifications.length === 0 ? (
//                   <p className="text-gray-500 text-center py-4">No notifications</p>
//                 ) : (
//                   <div className="divide-y">
//                     {notifications.map(notification => (
//                       <div key={notification.id} className={`py-3 ${!notification.read ? 'bg-blue-50' : ''}`}>
//                         <div className="flex justify-between">
//                           <p className={`${!notification.read ? 'font-medium' : 'text-gray-700'}`}>
//                             {notification.message}
//                           </p>
//                           <span className="text-xs text-gray-500">{notification.time}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'trips' && (
//           <div>
//             {/* Trip Categories */}
//             <div className="flex mb-4">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">Current Trips</button>
//               <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border">Past Trips</button>
//             </div>

//             {/* Current Trips */}
//             <div className="bg-white rounded-lg shadow mb-6">
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold mb-4">Current & Upcoming Trips</h2>
//                 {currentTrips.length === 0 ? (
//                   <p className="text-gray-500 text-center py-4">No current trips</p>
//                 ) : (
//                   <div className="space-y-4">
//                     {currentTrips.map(trip => (
//                       <div key={trip.id} className="border rounded-lg p-4">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <div className="flex items-center text-lg font-medium">
//                               {trip.from} <ArrowRight size={18} className="mx-2" /> {trip.to}
//                             </div>
//                             <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                               <div className="flex items-center text-gray-600">
//                                 <Calendar size={14} className="mr-2" /> {trip.date}
//                               </div>
//                               <div className="flex items-center text-gray-600">
//                                 <Clock size={14} className="mr-2" /> {trip.time}
//                               </div>
//                               <div className="flex items-center text-gray-600">
//                                 <User size={14} className="mr-2" /> {trip.passengers} Passengers
//                               </div>
//                               <div className="flex items-center text-gray-600">
//                                 <DollarSign size={14} className="mr-2" /> Rs. {trip.fare}
//                               </div>
//                             </div>
//                             <div className="mt-2">
//                               <span className={`text-xs px-2 py-1 rounded-full ${
//                                 trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                                 trip.status === 'accepted' ? 'bg-green-100 text-green-800' : 
//                                 'bg-gray-100 text-gray-800'
//                               }`}>
//                                 {trip.status === 'pending' ? 'Pending' : 
//                                  trip.status === 'accepted' ? 'Accepted' : 'Unknown'}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="space-y-2">
//                             <button className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm">
//                               Start Trip
//                             </button>
//                             <button className="w-full border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm">
//                               Contact Passengers
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Past Trips */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold mb-4">Past Trips</h2>
//                 {pastTrips.length === 0 ? (
//                   <p className="text-gray-500 text-center py-4">No past trips</p>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead>
//                         <tr>
//                           <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
//                           <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
//                           <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
//                           <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                           <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                           <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {pastTrips.map(trip => (
//                           <tr key={trip.id}>
//                             <td className="px-3 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 {trip.from} <ArrowRight size={14} className="mx-1" /> {trip.to}
//                               </div>
//                             </td>
//                             <td className="px-3 py-4 whitespace-nowrap">
//                               <div>{trip.date}</div>
//                               <div className="text-gray-500 text-sm">{trip.time}</div>
//                             </td>
//                             <td className="px-3 py-4 whitespace-nowrap">{trip.passengers}</td>
//                             <td className="px-3 py-4 whitespace-nowrap">Rs. {trip.fare}</td>
//                             <td className="px-3 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 <Star size={14} className="text-yellow-500 mr-1" />
//                                 <span>{trip.rating}</span>
//                               </div>
//                             </td>
//                             <td className="px-3 py-4 whitespace-nowrap">
//                               <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//                                 {trip.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default DriverDashboard;

        