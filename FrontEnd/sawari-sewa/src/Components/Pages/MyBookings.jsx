import React, { useState, useEffect } from 'react';
import { fetchMyBookings } from '../../services/passengerService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
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

    getBookings();
  }, []);

  // Format date from ISO to readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component with color coding
  const StatusBadge = ({ status }) => {
    let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";
    
    switch(status.toLowerCase()) {
      case 'confirmed':
        badgeClass += "bg-green-100 text-green-800";
        break;
      case 'pending':
        badgeClass += "bg-yellow-100 text-yellow-800";
        break;
      case 'cancelled':
        badgeClass += "bg-red-100 text-red-800";
        break;
      default:
        badgeClass += "bg-gray-100 text-gray-800";
    }
    
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
      
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
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Book a Trip
          </button>
        </div>
      )}
      
      {!loading && bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {booking.pickupPoint} to {booking.dropOffPoint}
                    </h2>
                    <p className="text-gray-600">Departure Time : {booking.departureTime}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <StatusBadge status={booking.bookingStatus} />
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Seat Information</h3>
                  <div className="flex flex-wrap gap-2">
                    {booking.seatNumbers.map((seat, i) => (
                      <div key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                        Seat {seat}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    View Details
                  </button>
                  {booking.bookingStatus.toLowerCase() === 'confirmed' && (
                    <button className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                      Cancel Booking
                    </button>
                  )}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;