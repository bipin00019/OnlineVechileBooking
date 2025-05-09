import React, { useState, useEffect } from 'react';
import { fetchPassengerBookingHistory, submitReview } from '../../services/passengerService';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    historyId: null,
    driverId: null,
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    loadBookingHistory();
  }, []);

  const loadBookingHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchPassengerBookingHistory();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Failed to load booking history. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (historyId, driverId) => {
    console.log('Opening review modal with:', { historyId, driverId });
    setReviewModal({
      isOpen: true,
      historyId,
      driverId,
      rating: 0,
      comment: ''
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      historyId: null,
      driverId: null,
      rating: 0,
      comment: ''
    });
  };

  const handleRatingChange = (rating) => {
    setReviewModal({
      ...reviewModal,
      rating
    });
  };

  const handleCommentChange = (e) => {
    setReviewModal({
      ...reviewModal,
      comment: e.target.value
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (reviewModal.rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      console.log('Submitting review with data:', {
        historyId: reviewModal.historyId,
        driverId: reviewModal.driverId,
        rating: reviewModal.rating,
        comment: reviewModal.comment
      });

      await submitReview({
        historyId: reviewModal.historyId,
        driverId: reviewModal.driverId,
        rating: reviewModal.rating,
        comment: reviewModal.comment
      });

      setBookings(bookings.map(booking =>
        booking.historyId === reviewModal.historyId
          ? { ...booking, reviewed: true, canGiveReview: false }
          : booking
      ));

      closeReviewModal();
      alert('Review submitted successfully!');
    } catch (err) {
      alert(`Failed to submit review: ${err.response?.data?.message || err.message}`);
      console.error('Review submission error details:', err.response?.data || err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg">Loading booking history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Booking History</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">You don't have any booking history yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.historyId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{booking.vehicleType}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.completedAt ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {booking.completedAt ? 'Completed' : 'Active'}
                </span>
              </div>

              <div className="md:flex md:gap-6">
                <div className="relative mb-6 md:mb-0 md:w-1/3">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                    <p className="text-gray-700">{booking.pickupPoint}</p>
                  </div>
                  <div className="absolute left-1.5 top-3 h-full w-0.5 bg-gray-300"></div>
                  <div className="flex items-center mt-8">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                    <p className="text-gray-700">{booking.dropOffPoint}</p>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    <div>
                      <span className="text-gray-500 font-medium">Driver:</span>
                      <span className="ml-2">{booking.driverName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Phone:</span>
                      <span className="ml-2">{booking.driverPhoneNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Vehicle:</span>
                      <span className="ml-2">{booking.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Booked:</span>
                      <span className="ml-2">{formatDate(booking.bookingDate)}</span>
                    </div>
                    {booking.completedAt && (
                      <div>
                        <span className="text-gray-500 font-medium">Completed:</span>
                        <span className="ml-2">{formatDate(booking.completedAt)}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500 font-medium">Fare:</span>
                      <span className="ml-2">Rs. {booking.fare}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center mt-4 pt-4 border-t">
                {booking.canGiveReview && (
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium"
                    onClick={() => openReviewModal(booking.historyId, booking.driverId)}
                  >
                    Give Review
                  </button>
                )}
                {booking.reviewed && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Reviewed ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Leave a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <p className="font-medium mb-2">Rating:</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="text-4xl focus:outline-none"
                      onClick={() => handleRatingChange(star)}
                    >
                      <span className={reviewModal.rating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="block font-medium mb-2">
                  Comment:
                </label>
                <textarea
                  id="comment"
                  value={reviewModal.comment}
                  onChange={handleCommentChange}
                  placeholder="Share your experience..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-300 font-medium"
                  onClick={closeReviewModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300 font-medium"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
