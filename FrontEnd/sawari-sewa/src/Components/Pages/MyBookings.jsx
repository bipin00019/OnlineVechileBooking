
// import React, { useState, useEffect } from 'react';
// import { fetchMyBookings, cancelBooking } from '../../services/passengerService';
// import { useNavigate } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [walletNumbers, setWalletNumbers] = useState({});
//   const [showPolicy, setShowPolicy] = useState(false);
//   const [cancellingBookingIds, setCancellingBookingIds] = useState(new Set());

//   const navigate = useNavigate();

//   // Example: get token from localStorage (replace with your auth logic)
//   const token = localStorage.getItem('token');

//   const loadBookings = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchMyBookings();
//       setBookings(data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load bookings. Please try again later.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const handleCancel = async (bookingId) => {
//     const khaltiNumber = walletNumbers[bookingId];

//     if (!khaltiNumber || khaltiNumber.length !== 10 || !/^[0-9]{10}$/.test(khaltiNumber)) {
//       toast.error('Please enter a valid 10-digit Khalti number.');
//       return;
//     }

//     if (!token) {
//       toast.error('User not authenticated. Please login again.');
//       return;
//     }

//     try {
//       // Mark this booking as cancelling
//       setCancellingBookingIds(prev => new Set(prev).add(bookingId));

//       await cancelBooking(bookingId, khaltiNumber, token);

//       toast.success('Booking cancelled successfully');
//       setWalletNumbers(prev => ({ ...prev, [bookingId]: '' })); // Clear input after cancel
//       await loadBookings(); // Refresh the list without reloading the page
//     } catch (err) {
//       console.error("Error cancelling booking:", err?.response?.data || err.message);
//       toast.error(
//         err?.response?.data?.message ||
//         'Cancellation failed. Please check your Khalti number or try again.'
//       );
//     } finally {
//       // Remove from cancelling state
//       setCancellingBookingIds(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(bookingId);
//         return newSet;
//       });
//     }
//   };

//   const StatusBadge = ({ status }) => {
//     let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";
//     switch (status.toLowerCase()) {
//       case 'confirmed': badgeClass += "bg-green-100 text-green-800"; break;
//       case 'pending': badgeClass += "bg-yellow-100 text-yellow-800"; break;
//       case 'cancelled': badgeClass += "bg-red-100 text-red-800"; break;
//       default: badgeClass += "bg-gray-100 text-gray-800";
//     }
//     return <span className={badgeClass}>{status}</span>;
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
//         <div className="relative">
//           <button
//             onClick={() => setShowPolicy(!showPolicy)}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Cancellation Policy
//           </button>
//           {showPolicy && (
//             <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 p-4 rounded shadow z-10 text-sm text-gray-700">
//               <p className="mb-2 font-semibold">Cancellation Policy:</p>
//               <p>
//                 We understand that plans can change. If you cancel <strong>more than 24 hours in advance</strong>, you will receive a <strong>90% refund</strong>. For cancellations made <strong>between 3 to 24 hours before departure</strong>, a <strong>30% fee</strong> will be applied. If you cancel <strong>less than 3 hours before the trip</strong>, a <strong>50% fee</strong> will be charged.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
//           <p className="text-red-700">{error}</p>
//         </div>
//       )}

//       {!loading && !error && bookings.length === 0 && (
//         <div className="bg-gray-50 rounded-lg p-8 text-center">
//           <p className="text-lg text-gray-600">You don't have any bookings yet.</p>
//           <button
//             onClick={() => navigate('/')}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Book a Trip
//           </button>
//         </div>
//       )}

//       {!loading && bookings.length > 0 && (
//         <div className="space-y-6">
//           {bookings.map((booking, index) => (
//             <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//               <div className="p-6">
//                 <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-800 mb-1">
//                       {booking.pickupPoint} to {booking.dropOffPoint}
//                     </h2>
//                     <p className="text-gray-600">Departure Time: {booking.departureTime}</p>
//                   </div>
//                   <div className="mt-2 sm:mt-0">
//                     <StatusBadge status={booking.bookingStatus} />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Seat Information</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {booking.seatNumbers.map((seat) => (
//                       <div key={seat} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
//                         Seat {seat}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     onClick={() => setSelectedBooking(selectedBooking === index ? null : index)}
//                     className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
//                   >
//                     Cancel Bookings
//                   </button>
//                 </div>

//                 {selectedBooking === index && (
//                   <div className="mt-4 bg-gray-50 rounded-md p-4 border border-gray-200">
//                     <h4 className="text-sm font-semibold mb-3 text-gray-700">Booking List:</h4>
//                     <ul className="space-y-2">
//                       {(booking.bookingIds || []).map((bookingId, i) => {
//                         const isCancelling = cancellingBookingIds.has(bookingId);
//                         return (
//                           <li
//                             key={`${bookingId}-${booking.seatNumbers[i]}`}
//                             className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white shadow-sm px-3 py-2 rounded"
//                           >
//                             <div>
//                               <p>Booking ID: <span className="font-medium">{bookingId}</span></p>
//                               <p className="text-xs text-gray-500">Seat: {booking.seatNumbers[i]}</p>
//                             </div>
//                             <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                               <input
//                                 type="text"
//                                 maxLength="10"
//                                 placeholder="Khalti Number"
//                                 className="border px-2 py-1 rounded text-sm w-40"
//                                 value={walletNumbers[bookingId] || ''}
//                                 onChange={(e) =>
//                                   setWalletNumbers(prev => ({ ...prev, [bookingId]: e.target.value }))
//                                 }
//                                 disabled={isCancelling}
//                               />
//                               <button
//                                 className={`text-sm px-3 py-1 rounded text-white ${isCancelling ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
//                                 onClick={() => handleCancel(bookingId)}
//                                 disabled={isCancelling}
//                               >
//                                 {isCancelling ? 'Cancelling...' : 'Cancel'}
//                               </button>
//                             </div>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;


import React, { useState, useEffect } from 'react';
import { fetchMyBookings, cancelBooking } from '../../services/passengerService';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [walletNumbers, setWalletNumbers] = useState({});
  const [showPolicy, setShowPolicy] = useState(false);
  const [cancellingBookingIds, setCancellingBookingIds] = useState(new Set());
  const [cancellingAllBookings, setCancellingAllBookings] = useState(new Set());
  const [showCancelAllInput, setShowCancelAllInput] = useState(new Set());
  const [cancelAllKhaltiNumbers, setCancelAllKhaltiNumbers] = useState({});

  const navigate = useNavigate();

  // Example: get token from localStorage (replace with your auth logic)
  const token = localStorage.getItem('token');

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchMyBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const khaltiNumber = walletNumbers[bookingId];

    if (!khaltiNumber || khaltiNumber.length !== 10 || !/^[0-9]{10}$/.test(khaltiNumber)) {
      toast.error('Please enter a valid 10-digit Khalti number.');
      return;
    }

    if (!token) {
      toast.error('User not authenticated. Please login again.');
      return;
    }

    try {
      // Mark this booking as cancelling
      setCancellingBookingIds(prev => new Set(prev).add(bookingId));

      await cancelBooking(bookingId, khaltiNumber, token);

      toast.success('Booking cancelled successfully');
      setWalletNumbers(prev => ({ ...prev, [bookingId]: '' })); // Clear input after cancel
      await loadBookings(); // Refresh the list without reloading the page
    } catch (err) {
      console.error("Error cancelling booking:", err?.response?.data || err.message);
      toast.error(
        err?.response?.data?.message ||
        'Cancellation failed. Cancellation unavailable for the same day or after departure..'
      );
    } finally {
      // Remove from cancelling state
      setCancellingBookingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleCancelAllClick = (bookingIndex) => {
    setShowCancelAllInput(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingIndex)) {
        newSet.delete(bookingIndex);
        // Clear the khalti number when hiding input
        setCancelAllKhaltiNumbers(prevNumbers => {
          const updated = { ...prevNumbers };
          delete updated[bookingIndex];
          return updated;
        });
      } else {
        newSet.add(bookingIndex);
      }
      return newSet;
    });
  };

  const handleCancelAll = async (bookingIndex) => {
    const booking = bookings[bookingIndex];
    const bookingIds = booking.bookingIds || [];
    const khaltiNumber = cancelAllKhaltiNumbers[bookingIndex];
    
    if (bookingIds.length === 0) {
      toast.error('No bookings to cancel.');
      return;
    }

    if (!khaltiNumber || khaltiNumber.length !== 10 || !/^[0-9]{10}$/.test(khaltiNumber)) {
      toast.error('Please enter a valid 10-digit Khalti number.');
      return;
    }

    if (!token) {
      toast.error('User not authenticated. Please login again.');
      return;
    }

    try {
      // Mark all bookings as cancelling
      setCancellingAllBookings(prev => new Set(prev).add(bookingIndex));
      setCancellingBookingIds(prev => {
        const newSet = new Set(prev);
        bookingIds.forEach(id => newSet.add(id));
        return newSet;
      });

      let successCount = 0;
      let failedBookings = [];

      // Cancel all bookings one by one using the same khalti number
      for (const bookingId of bookingIds) {
        try {
          await cancelBooking(bookingId, khaltiNumber, token);
          successCount++;
        } catch (err) {
          console.error(`Error cancelling booking ${bookingId}:`, err?.response?.data || err.message);
          failedBookings.push(bookingId);
        }
      }

      // Show results
      if (successCount === bookingIds.length) {
        toast.success(`All ${successCount} bookings cancelled successfully!`);
        // Clear the khalti number and hide input
        setCancelAllKhaltiNumbers(prev => {
          const updated = { ...prev };
          delete updated[bookingIndex];
          return updated;
        });
        setShowCancelAllInput(prev => {
          const newSet = new Set(prev);
          newSet.delete(bookingIndex);
          return newSet;
        });
      } else if (successCount > 0) {
        toast.success(`${successCount} bookings cancelled successfully.`);
        if (failedBookings.length > 0) {
          toast.error(`Failed to cancel ${failedBookings.length} booking(s). Please try again for failed bookings.`);
        }
      } else {
        toast.error('Failed to cancel all bookings. Please try again.');
      }

      await loadBookings(); // Refresh the list

    } catch (err) {
      console.error("Error in cancel all:", err);
      toast.error('An error occurred while cancelling bookings. Please try again.');
    } finally {
      // Remove from cancelling states
      setCancellingAllBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingIndex);
        return newSet;
      });
      setCancellingBookingIds(prev => {
        const newSet = new Set(prev);
        bookingIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    }
  };

  const StatusBadge = ({ status }) => {
    let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";
    switch (status.toLowerCase()) {
      case 'confirmed': badgeClass += "bg-green-100 text-green-800"; break;
      case 'pending': badgeClass += "bg-yellow-100 text-yellow-800"; break;
      case 'cancelled': badgeClass += "bg-red-100 text-red-800"; break;
      default: badgeClass += "bg-gray-100 text-gray-800";
    }
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
        <div className="relative">
          <button
            onClick={() => setShowPolicy(!showPolicy)}
            className="text-sm text-blue-600 hover:underline"
          >
            Cancellation Policy
          </button>
          {showPolicy && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 p-4 rounded shadow z-10 text-sm text-gray-700">
              <p className="mb-2 font-semibold">Cancellation Policy:</p>
              <p>
                At Sawari Sewa, bookings cannot be cancelled on the same day of departure or after the departure date. Cancellations made 3 or more days in advance are eligible for a 90% refund, 2 days before get 50%, and 1 day before receive only 10%. Refunds are processed to your Khalti wallet, and a confirmation email will be sent after successful cancellation.
              </p>            
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-600">You don't have any bookings yet.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Book a Trip
          </button>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((booking, index) => {
            const isCancellingAll = cancellingAllBookings.has(index);
            const showCancelAllInputField = showCancelAllInput.has(index);
            return (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {booking.pickupPoint} to {booking.dropOffPoint}
                      </h2>
                      <p className="text-gray-600">Departure Time: {booking.departureTime}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <StatusBadge status={booking.bookingStatus} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Seat Information</h3>
                    <div className="flex flex-wrap gap-2">
                      {booking.seatNumbers.map((seat) => (
                        <div key={seat} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                          Seat {seat}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedBooking(selectedBooking === index ? null : index)}
                      className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                      disabled={isCancellingAll}
                    >
                      Cancel Bookings
                    </button>
                    <button
                      onClick={() => handleCancelAllClick(index)}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                        isCancellingAll 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      disabled={isCancellingAll}
                    >
                      {isCancellingAll ? 'Cancelling All...' : 'Cancel All Bookings'}
                    </button>
                  </div>

                  {showCancelAllInputField && (
                    <div className="mt-4 bg-yellow-50 rounded-md p-4 border border-yellow-200">
                      <h4 className="text-sm font-semibold mb-3 text-gray-700">Cancel All Bookings</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Enter Khalti Number (10 digits) for all bookings:
                          </label>
                          <input
                            type="text"
                            maxLength="10"
                            placeholder="Enter 10-digit Khalti number"
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={cancelAllKhaltiNumbers[index] || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                              setCancelAllKhaltiNumbers(prev => ({ 
                                ...prev, 
                                [index]: value 
                              }));
                            }}
                            disabled={isCancellingAll}
                          />
                          {cancelAllKhaltiNumbers[index] && cancelAllKhaltiNumbers[index].length !== 10 && (
                            <p className="text-xs text-red-500 mt-1">
                              Please enter exactly 10 digits
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCancelAll(index)}
                            className={`px-4 py-2 rounded text-sm font-medium text-white ${
                              isCancellingAll || !cancelAllKhaltiNumbers[index] || cancelAllKhaltiNumbers[index].length !== 10
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                            disabled={isCancellingAll || !cancelAllKhaltiNumbers[index] || cancelAllKhaltiNumbers[index].length !== 10}
                          >
                            {isCancellingAll ? 'Processing...' : 'Confirm Cancel All'}
                          </button>
                          <button
                            onClick={() => handleCancelAllClick(index)}
                            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                            disabled={isCancellingAll}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600">
                        <p>This will cancel all {booking.bookingIds?.length || 0} bookings in this group using the same Khalti number.</p>
                      </div>
                    </div>
                  )}

                  {selectedBooking === index && (
                    <div className="mt-4 bg-gray-50 rounded-md p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold mb-3 text-gray-700">Booking List:</h4>
                      <ul className="space-y-2">
                        {(booking.bookingIds || []).map((bookingId, i) => {
                          const isCancelling = cancellingBookingIds.has(bookingId);
                          return (
                            <li
                              key={`${bookingId}-${booking.seatNumbers[i]}`}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white shadow-sm px-3 py-2 rounded"
                            >
                              <div>
                                <p>Booking ID: <span className="font-medium">{bookingId}</span></p>
                                <p className="text-xs text-gray-500">Seat: {booking.seatNumbers[i]}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <input
                                  type="text"
                                  maxLength="10"
                                  placeholder="Khalti Number"
                                  className="border px-2 py-1 rounded text-sm w-40"
                                  value={walletNumbers[bookingId] || ''}
                                  onChange={(e) =>
                                    setWalletNumbers(prev => ({ ...prev, [bookingId]: e.target.value }))
                                  }
                                  disabled={isCancelling || isCancellingAll}
                                />
                                <button
                                  className={`text-sm px-3 py-1 rounded text-white ${
                                    isCancelling || isCancellingAll 
                                      ? 'bg-gray-400 cursor-not-allowed' 
                                      : 'bg-red-600 hover:bg-red-700'
                                  }`}
                                  onClick={() => handleCancel(bookingId)}
                                  disabled={isCancelling || isCancellingAll}
                                >
                                  {isCancelling ? 'Cancelling...' : 'Cancel'}
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;