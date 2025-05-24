
// import React, { useState } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { API_URL } from '../../config'; // Adjust the path if needed

// const cancelBooking = async (bookingId, khaltiWalletNumber, token) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/Booking/cancel`,
//       {
//         bookingId: bookingId,
//         khaltiWalletNumber: khaltiWalletNumber,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('Booking cancelled:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error cancelling booking:', error.response?.data || error.message);
//     throw error;
//   }
// };

// const ManualCancellationBookings = () => {
//   const [bookingId, setBookingId] = useState('');
//   const [khaltiNumber, setKhaltiNumber] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const handleCancel = async (e) => {
//     e.preventDefault();

//     if (!bookingId.trim()) {
//       toast.error('Please enter a Booking ID');
//       return;
//     }
//     if (!khaltiNumber.trim() || khaltiNumber.length !== 10 || !/^[0-9]{10}$/.test(khaltiNumber)) {
//       toast.error('Please enter a valid 10-digit Khalti number');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('User not authenticated. Please login again.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await cancelBooking(bookingId.trim(), khaltiNumber.trim(), token);
//       toast.success('Booking cancelled successfully!');
//       setBookingId('');
//       setKhaltiNumber('');
//       setShowForm(false);

//       setTimeout(() => {
//         window.location.reload(); // Reload page after a short delay
//       }, 1000);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//         'Failed to cancel booking. Please check inputs or try again later.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded shadow">
//       <Toaster position="top-center" />
      
//       {!showForm ? (
//         <div className="text-center">
//           <button
//             onClick={() => setShowForm(true)}
//             className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
//           >
//             Manual Cancellation
//           </button>
//         </div>
//       ) : (
//         <>
//           <h2 className="text-2xl font-semibold mb-4 text-center">Manual Booking Cancellation</h2>
//           <form onSubmit={handleCancel} className="space-y-4">
//             <div>
//               <label htmlFor="bookingId" className="block mb-1 font-medium text-gray-700">
//                 Booking ID
//               </label>
//               <input
//                 id="bookingId"
//                 type="text"
//                 value={bookingId}
//                 onChange={(e) => setBookingId(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter Booking ID"
//                 disabled={loading}
//               />
//             </div>
//             <div>
//               <label htmlFor="khaltiNumber" className="block mb-1 font-medium text-gray-700">
//                 Khalti Wallet Number
//               </label>
//               <input
//                 id="khaltiNumber"
//                 type="text"
//                 value={khaltiNumber}
//                 onChange={(e) => setKhaltiNumber(e.target.value)}
//                 maxLength={10}
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter 10-digit Khalti Number"
//                 disabled={loading}
//               />
//             </div>
//             <div className="flex justify-between">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-4 py-2 text-white rounded ${
//                   loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {loading ? 'Cancelling...' : 'Cancel Booking'}
//               </button>
//               <button
//                 type="button"
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//                 onClick={() => {
//                   setShowForm(false);
//                   setBookingId('');
//                   setKhaltiNumber('');
//                 }}
//                 disabled={loading}
//               >
//                 Close
//               </button>
//             </div>
//           </form>
//         </>
//       )}
//     </div>
//   );
// };

// export default ManualCancellationBookings;

// import React, { useState } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { API_URL } from '../../config'; // Adjust the path if needed
// import { fetchMyBookings } from '../../services/passengerService';
// const cancelBooking = async (bookingId, khaltiWalletNumber, token) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/Booking/cancel`,
//       {
//         bookingId: bookingId,
//         khaltiWalletNumber: khaltiWalletNumber,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('Booking cancelled:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error cancelling booking:', error.response?.data || error.message);
//     throw error;
//   }
// };

// const ManualCancellationBookings = () => {
//   const [bookingId, setBookingId] = useState('');
//   const [khaltiNumber, setKhaltiNumber] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const handleCancel = async (e) => {
//     e.preventDefault();

//     if (!bookingId.trim()) {
//       toast.error('Please enter a Booking ID');
//       return;
//     }
//     if (!khaltiNumber.trim() || khaltiNumber.length !== 10 || !/^[0-9]{10}$/.test(khaltiNumber)) {
//       toast.error('Please enter a valid 10-digit Khalti number');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('User not authenticated. Please login again.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await cancelBooking(bookingId.trim(), khaltiNumber.trim(), token);
//       toast.success('Booking cancelled successfully!');
//       setBookingId('');
//       setKhaltiNumber('');
//       setShowForm(false);

//       setTimeout(() => {
//         window.location.reload(); // Reload page after a short delay
//       }, 1000);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//         'Failed to cancel booking. Please check inputs or try again later.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCardClick = () => {
//     if (!loading) {
//       setShowForm(!showForm);
//     }
//   };

//   return (
//     <div className="relative">
//       <Toaster position="top-center" />
      
//       <div 
//         className={`bg-gradient-to-r ${showForm ? 'from-white to-red-500' : 'from-white to-red-400'} 
//           p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
//           hover:shadow-lg hover:from-red-400 hover:to-red-500 hover:shadow-red-200
//           ${loading ? 'opacity-50' : ''}`}
//         onClick={handleCardClick}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <svg 
//               className="h-6 w-6 mr-2 text-red-800" 
//               fill="none" 
//               viewBox="0 0 24 24" 
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             <h3 className="text-lg font-bold text-gray-800">Manual Cancellation</h3>
//             {loading && (
//               <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
//                 Processing...
//               </span>
//             )}
//           </div>
//           <svg 
//             className={`h-5 w-5 text-red-800 transition-transform duration-300 ${showForm ? 'transform rotate-180' : ''}`} 
//             fill="none" 
//             viewBox="0 0 24 24" 
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>

//         {/* Quick stats or info when collapsed */}
//         {!showForm && (
//           <div className="mt-3 text-sm bg-red-50 p-2 rounded">
//             <p className="text-red-700">Click to cancel bookings manually</p>
//           </div>
//         )}
//       </div>
      
//       {showForm && (
//         <div 
//           className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-red-200 transition-all duration-300 ease-in-out"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="p-4">
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="bookingId" className="block font-semibold text-gray-700 mb-1">
//                   Booking ID
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="bookingId"
//                     type="text"
//                     value={bookingId}
//                     onChange={(e) => setBookingId(e.target.value)}
//                     className="w-full p-2 pl-10 rounded border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition"
//                     placeholder="Enter Booking ID"
//                     disabled={loading}
//                   />
//                   <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="khaltiNumber" className="block font-semibold text-gray-700 mb-1">
//                   Khalti Wallet Number
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="khaltiNumber"
//                     type="text"
//                     value={khaltiNumber}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, '');
//                       setKhaltiNumber(value);
//                     }}
//                     maxLength={10}
//                     className="w-full p-2 pl-10 rounded border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition"
//                     placeholder="Enter 10-digit Khalti Number"
//                     disabled={loading}
//                   />
//                   <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                   </svg>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {khaltiNumber.length}/10 digits entered
//                 </p>
//               </div>

//               <div className="flex items-center justify-between pt-2 space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     setBookingId('');
//                     setKhaltiNumber('');
//                   }}
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition flex-1"
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
                
//                 <button
//                   onClick={handleCancel}
//                   disabled={loading || !bookingId.trim() || khaltiNumber.length !== 10}
//                   className={`px-6 py-2 rounded-md transition flex items-center justify-center flex-1 ${
//                     loading || !bookingId.trim() || khaltiNumber.length !== 10
//                       ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
//                       : 'bg-red-600 text-white hover:bg-red-700'
//                   }`}
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       <span>Cancelling...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Cancel Booking</span>
//                       <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                       </svg>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Help text */}
//             <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-red-400">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <div>
//                   <p className="text-sm text-gray-700 font-medium">Important:</p>
//                   <p className="text-xs text-gray-600 mt-1">
//                     Ensure the Booking ID and Khalti number are correct. Refunds will be processed to the provided Khalti wallet.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManualCancellationBookings;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL } from '../../config'; // Adjust the path if needed
import { fetchMyBookings } from '../../services/passengerService';

const cancelBooking = async (bookingId, khaltiWalletNumber, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/Booking/cancel`,
      {
        bookingId: bookingId,
        khaltiWalletNumber: khaltiWalletNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Booking cancelled:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error.response?.data || error.message);
    throw error;
  }
};

const ManualCancellationBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState('');
  const [khaltiNumber, setKhaltiNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  // Fetch bookings when form is shown
  useEffect(() => {
    if (showForm) {
      fetchBookingsData();
    }
  }, [showForm]);

  const fetchBookingsData = async () => {
    setFetchingBookings(true);
    setBookingsError('');
    try {
      const bookingsData = await fetchMyBookings();
      
      if (!bookingsData || bookingsData.length === 0) {
        setBookingsError('No bookings found');
        setBookings([]);
        return;
      }

      // Transform bookings data to include all booking IDs with seat numbers
      const transformedBookings = [];
      bookingsData.forEach(booking => {
        booking.bookingIds.forEach((bookingId, index) => {
          transformedBookings.push({
            bookingId: bookingId,
            seatNumber: booking.seatNumbers[index] || 'N/A',
            vehicleNumber: booking.vehicleNumber,
            route: `${booking.location} → ${booking.destination}`,
            pickupPoint: booking.pickupPoint,
            dropOffPoint: booking.dropOffPoint,
            departureDate: booking.departureDate,
            departureTime: booking.departureTime,
            bookingStatus: booking.bookingStatus,
            fare: booking.fare
          });
        });
      });

      // Filter only confirmed bookings that can be cancelled
      const cancellableBookings = transformedBookings.filter(
        booking => booking.bookingStatus === 'Confirmed'
      );

      setBookings(cancellableBookings);
      
      if (cancellableBookings.length === 0) {
        setBookingsError('No cancellable bookings found');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          'Failed to fetch bookings. Please try again.';
      setBookingsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFetchingBookings(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();

    if (!selectedBooking) {
      toast.error('Please select a booking to cancel');
      return;
    }
    if (!khaltiNumber.trim() || khaltiNumber.length !== 10 || !/^[0-9]{10}$/.test(khaltiNumber)) {
      toast.error('Please enter a valid 10-digit Khalti number');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('User not authenticated. Please login again.');
      return;
    }

    setLoading(true);
    try {
      await cancelBooking(parseInt(selectedBooking), khaltiNumber.trim(), token);
      toast.success('Booking cancelled successfully!');
      setSelectedBooking('');
      setKhaltiNumber('');
      setShowForm(false);

      setTimeout(() => {
        window.location.reload(); // Reload page after a short delay
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data ||
                          error.message ||
                          'Failed to cancel booking. Please check inputs or try again later.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!loading) {
      setShowForm(!showForm);
    }
  };

  const getSelectedBookingDetails = () => {
    return bookings.find(booking => booking.bookingId.toString() === selectedBooking);
  };

  return (
    <div className="relative">
      <Toaster position="top-center" />
      
      <div 
        className={`bg-gradient-to-r ${showForm ? 'from-white to-red-500' : 'from-white to-red-400'} 
          p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
          hover:shadow-lg hover:from-red-400 hover:to-red-500 hover:shadow-red-200
          ${loading ? 'opacity-50' : ''}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg 
              className="h-6 w-6 mr-2 text-red-800" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h3 className="text-lg font-bold text-gray-800">Manual Cancellation</h3>
            {loading && (
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Processing...
              </span>
            )}
          </div>
          <svg 
            className={`h-5 w-5 text-red-800 transition-transform duration-300 ${showForm ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Quick stats or info when collapsed */}
        {!showForm && (
          <div className="mt-3 text-sm bg-red-50 p-2 rounded">
            <p className="text-red-700">Click to cancel bookings manually</p>
          </div>
        )}
      </div>
      
      {showForm && (
        <div 
          className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-red-200 transition-all duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="space-y-4">
              {/* Booking Selection */}
              <div>
                <label htmlFor="bookingSelect" className="block font-semibold text-gray-700 mb-1">
                  Select Booking to Cancel
                </label>
                <div className="relative">
                  {fetchingBookings ? (
                    <div className="flex items-center justify-center p-3 border border-gray-300 rounded bg-gray-50">
                      <svg className="animate-spin h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-600">Loading bookings...</span>
                    </div>
                  ) : bookingsError ? (
                    <div className="p-3 border border-red-300 rounded bg-red-50">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-700 text-sm">{bookingsError}</span>
                      </div>
                      <button
                        onClick={fetchBookingsData}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    <select
                      id="bookingSelect"
                      value={selectedBooking}
                      onChange={(e) => setSelectedBooking(e.target.value)}
                      className="w-full p-2 pl-10 rounded border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition"
                      disabled={loading || bookings.length === 0}
                    >
                      <option value="">Select a booking...</option>
                      {bookings.map((booking) => (
                        <option key={booking.bookingId} value={booking.bookingId}>
                          Booking #{booking.bookingId} - Seat {booking.seatNumber} ({booking.route})
                        </option>
                      ))}
                    </select>
                  )}
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              {/* Booking Details */}
              {selectedBooking && getSelectedBookingDetails() && (
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">Booking Details</h4>
                  {(() => {
                    const details = getSelectedBookingDetails();
                    return (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Seat:</span> {details.seatNumber}</div>
                        <div><span className="font-medium">Vehicle:</span> {details.vehicleNumber}</div>
                        <div><span className="font-medium">Pickup:</span> {details.pickupPoint}</div>
                        <div><span className="font-medium">Drop-off:</span> {details.dropOffPoint}</div>
                        <div><span className="font-medium">Date:</span> {new Date(details.departureDate).toLocaleDateString()}</div>
                        <div><span className="font-medium">Time:</span> {details.departureTime}</div>
                        <div><span className="font-medium">Fare:</span> Rs. {details.fare}</div>
                        <div><span className="font-medium">Status:</span> 
                          <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {details.bookingStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Khalti Number Input */}
              <div>
                <label htmlFor="khaltiNumber" className="block font-semibold text-gray-700 mb-1">
                  Khalti Wallet Number
                </label>
                <div className="relative">
                  <input
                    id="khaltiNumber"
                    type="text"
                    value={khaltiNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setKhaltiNumber(value);
                    }}
                    maxLength={10}
                    className="w-full p-2 pl-10 rounded border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition"
                    placeholder="Enter 10-digit Khalti Number"
                    disabled={loading}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {khaltiNumber.length}/10 digits entered
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedBooking('');
                    setKhaltiNumber('');
                    setBookingsError('');
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={loading || !selectedBooking || khaltiNumber.length !== 10}
                  className={`px-6 py-2 rounded-md transition flex items-center justify-center flex-1 ${
                    loading || !selectedBooking || khaltiNumber.length !== 10
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <span>Cancel Booking</span>
                      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Help text */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-red-400">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700 font-medium">Important:</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Only confirmed bookings can be cancelled. Refunds will be processed to the provided Khalti wallet within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualCancellationBookings;