// import React, { useState } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { API_URL } from '../../config'; // Update this if your config path is different

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
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           'Failed to cancel booking. Please check inputs or try again later.'
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


import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL } from '../../config'; // Adjust the path if needed

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
  const [bookingId, setBookingId] = useState('');
  const [khaltiNumber, setKhaltiNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleCancel = async (e) => {
    e.preventDefault();

    if (!bookingId.trim()) {
      toast.error('Please enter a Booking ID');
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
      await cancelBooking(bookingId.trim(), khaltiNumber.trim(), token);
      toast.success('Booking cancelled successfully!');
      setBookingId('');
      setKhaltiNumber('');
      setShowForm(false);

      setTimeout(() => {
        window.location.reload(); // Reload page after a short delay
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to cancel booking. Please check inputs or try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded shadow">
      <Toaster position="top-center" />
      
      {!showForm ? (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
          >
            Manual Cancellation
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">Manual Booking Cancellation</h2>
          <form onSubmit={handleCancel} className="space-y-4">
            <div>
              <label htmlFor="bookingId" className="block mb-1 font-medium text-gray-700">
                Booking ID
              </label>
              <input
                id="bookingId"
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Booking ID"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="khaltiNumber" className="block mb-1 font-medium text-gray-700">
                Khalti Wallet Number
              </label>
              <input
                id="khaltiNumber"
                type="text"
                value={khaltiNumber}
                onChange={(e) => setKhaltiNumber(e.target.value)}
                maxLength={10}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 10-digit Khalti Number"
                disabled={loading}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-white rounded ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Cancelling...' : 'Cancel Booking'}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowForm(false);
                  setBookingId('');
                  setKhaltiNumber('');
                }}
                disabled={loading}
              >
                Close
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ManualCancellationBookings;
