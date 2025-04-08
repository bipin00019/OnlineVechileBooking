// // TripsTab.js
// import React, { useState } from 'react';
// import { ArrowRight, Calendar, Clock, DollarSign, User, MapPin, UserCheck } from 'lucide-react';

// const TripsTab = ({ currentTrips, pastTrips }) => {
//   return (
//     <div>
//       {/* Trip Categories */}
//       <div className="flex mb-4">
//         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">Current Trips</button>
//         <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border">Past Trips</button>
//       </div>

//       {/* Current Trips */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4">
//           <h2 className="text-lg font-semibold mb-4">Current & Upcoming Trips</h2>
//           {currentTrips.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No current trips</p>
//           ) : (
//             <div className="space-y-4">
//               {currentTrips.map(trip => (
//                 <div key={trip.id} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <div className="flex items-center text-lg font-medium">
//                         {trip.from} <ArrowRight size={18} className="mx-2" /> {trip.to}
//                       </div>
//                       <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                         <div className="flex items-center text-gray-600">
//                           <Calendar size={14} className="mr-2" /> {trip.date}
//                         </div>
//                         <div className="flex items-center text-gray-600">
//                           <Clock size={14} className="mr-2" /> {trip.time}
//                         </div>
//                         <div className="flex items-center text-gray-600">
//                           <User size={14} className="mr-2" /> {trip.passengers} Passengers
//                         </div>
//                         <div className="flex items-center text-gray-600">
//                           <DollarSign size={14} className="mr-2" /> Rs. {trip.fare}
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <span className={`text-xs px-2 py-1 rounded-full ${
//                           trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           trip.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {trip.status === 'pending' ? 'Pending' :
//                            trip.status === 'accepted' ? 'Accepted' : 'Unknown'}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <button className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm">
//                         Start Trip
//                       </button>
//                       <button className="w-full border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm">
//                         Contact Passengers
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Past Trips */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-4">
//           <h2 className="text-lg font-semibold mb-4">Past Trips</h2>
//           {pastTrips.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No past trips</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
//                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
//                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
//                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
//                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {pastTrips.map(trip => (
//                     <tr key={trip.id}>
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {trip.from} <ArrowRight size={14} className="mx-1" /> {trip.to}
//                         </div>
//                       </td>
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <div>{trip.date}</div>
//                         <div className="text-gray-500 text-sm">{trip.time}</div>
//                       </td>
//                       <td className="px-3 py-4 whitespace-nowrap">{trip.passengers}</td>
//                       <td className="px-3 py-4 whitespace-nowrap">Rs. {trip.fare}</td>
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <Star size={14} className="text-yellow-500 mr-1" />
//                           <span>{trip.rating}</span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//                           {trip.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TripsTab;
import React from 'react'

const TripsTab = () => {
  return (
    <div>
      <h1>Trips</h1>
    </div>
  )
}

export default TripsTab
