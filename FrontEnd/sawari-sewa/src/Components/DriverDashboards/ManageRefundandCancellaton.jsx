// import React, { useState, useEffect } from 'react';
// import { fetchCancelledBookingsAdmin, processRefund } from "../../services/AdminDashboardService";

// const ManageRefundandCancellation = () => {
//   const [cancelledBookings, setCancelledBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadCancelledBookings = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchCancelledBookingsAdmin();
//         setCancelledBookings(data);
//       } catch (err) {
//         setError('Failed to fetch cancelled bookings');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCancelledBookings();
//   }, []);

//   const handleRefund = async (bookingId) => {
//     // Add your refund logic here
//     // This would typically make an API call to process the refund
//     try {
//       // Example: await processRefund(bookingId);
//       // Update the local state to reflect the refund
//       setCancelledBookings(prev => 
//         prev.map(booking => 
//           booking.bookingId === bookingId 
//             ? { ...booking, isRefunded: true }
//             : booking
//         )
//       );
//       alert(`Refund processed for booking ${bookingId}`);
//     } catch (err) {
//       alert('Failed to process refund');
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-96">
//         <div className="text-lg">Loading cancelled bookings...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
//         <div className="text-red-800">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//           Manage Refunds and Cancellations
//         </h1>
        
//         {cancelledBookings.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <div className="text-gray-500 text-lg">No cancelled bookings found</div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Booking ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Khalti Wallet
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Fare
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Cancelled At
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {cancelledBookings.map((booking) => (
//                     <tr key={booking.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         #{booking.bookingId}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {booking.firstName} {booking.lastName}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {booking.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {booking.khaltiWalletNumber}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         Rs. {booking.fare.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(booking.cancelledAt).toLocaleDateString()} <br />
//                         <span className="text-xs text-gray-400">
//                           {new Date(booking.cancelledAt).toLocaleTimeString()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {booking.isRefunded ? (
//                           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             Refunded
//                           </span>
//                         ) : (
//                           <button
//                             onClick={() => handleRefund(booking.bookingId)}
//                             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                           >
//                             Process Refund
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
        
//         <div className="mt-6 bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <div className="text-2xl font-bold text-blue-600">
//                 {cancelledBookings.length}
//               </div>
//               <div className="text-sm text-blue-600">Total Cancellations</div>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg">
//               <div className="text-2xl font-bold text-green-600">
//                 {cancelledBookings.filter(b => b.isRefunded).length}
//               </div>
//               <div className="text-sm text-green-600">Refunded</div>
//             </div>
//             <div className="bg-orange-50 p-4 rounded-lg">
//               <div className="text-2xl font-bold text-orange-600">
//                 {cancelledBookings.filter(b => !b.isRefunded).length}
//               </div>
//               <div className="text-sm text-orange-600">Pending Refunds</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageRefundandCancellation;

import React, { useState, useEffect } from 'react';
import { fetchCancelledBookingsAdmin, processRefund } from "../../services/AdminDashboardService";

const ManageRefundandCancellation = () => {
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRefunds, setProcessingRefunds] = useState(new Set());

  useEffect(() => {
    const loadCancelledBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchCancelledBookingsAdmin();
        setCancelledBookings(data);
      } catch (err) {
        setError('Failed to fetch cancelled bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCancelledBookings();
  }, []);

  const handleRefund = async (bookingId) => {
    try {
      // Add the booking ID to processing set
      setProcessingRefunds(prev => new Set(prev).add(bookingId));
      
      // Call the API to process refund
      await processRefund(bookingId);
      
      // Update the local state to reflect the refund
      setCancelledBookings(prev => 
        prev.map(booking => 
          booking.bookingId === bookingId 
            ? { ...booking, isRefunded: true }
            : booking
        )
      );
      
      alert(`Refund processed successfully for booking #${bookingId}`);
    } catch (err) {
      alert('Failed to process refund. Please try again.');
      console.error(err);
    } finally {
      // Remove the booking ID from processing set
      setProcessingRefunds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Loading cancelled bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Manage Refunds and Cancellations
        </h1>
        
        {cancelledBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-500 text-lg">No cancelled bookings found</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khalti Wallet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fare
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancelled At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cancelledBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.firstName} {booking.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.khaltiWalletNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rs. {booking.fare.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.cancelledAt).toLocaleDateString()} <br />
                        <span className="text-xs text-gray-400">
                          {new Date(booking.cancelledAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.isRefunded ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Refunded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRefund(booking.bookingId)}
                            disabled={processingRefunds.has(booking.bookingId)}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 ${
                              processingRefunds.has(booking.bookingId)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                          >
                            {processingRefunds.has(booking.bookingId) ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              'Process Refund'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {cancelledBookings.length}
              </div>
              <div className="text-sm text-blue-600">Total Cancellations</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {cancelledBookings.filter(b => b.isRefunded).length}
              </div>
              <div className="text-sm text-green-600">Refunded</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {cancelledBookings.filter(b => !b.isRefunded).length}
              </div>
              <div className="text-sm text-orange-600">Pending Refunds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRefundandCancellation;