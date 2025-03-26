import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import { fetchUserDetails } from '../../services/userService';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [processingBooking, setProcessingBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Extract booking details from location state
  const {
    selectedSeats,
    totalFare,
    vehicleDetails,
    startingPoint,
    destination
  } = location.state || {};

  useEffect(() => {
    // Redirect if no booking details found
    if (!selectedSeats || !vehicleDetails) {
      navigate('/');
      return;
    }

    // Fetch user details
    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = await fetchUserDetails(token);
        setUserDetails(userData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user details. Please try again.');
        setLoading(false);
      }
    };

    getUserDetails();
  }, [navigate, selectedSeats, vehicleDetails]);

  const handleCompleteBooking = async () => {
    setProcessingBooking(true);
    try {
      // Here you would integrate with your booking API
      // const response = await createBooking({
      //   vehicleId: vehicleDetails.id,
      //   seats: selectedSeats,
      //   userId: userDetails.id,
      //   totalAmount: totalFare,
      //   departureDate: vehicleDetails.departureDate,
      //   departureTime: vehicleDetails.departureTime
      // });

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBookingComplete(true);
      // You could navigate to a booking success page or show a success message
    } catch (err) {
      setError('Failed to complete booking. Please try again.');
    } finally {
      setProcessingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="spinner-border text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Error</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Booking Confirmed!</h2>
          </div>
          <p className="text-gray-700 mb-4">Your booking has been confirmed. A confirmation email has been sent to your registered email address.</p>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="font-medium">Booking Reference: <span className="text-blue-600">{`BK${Math.floor(100000 + Math.random() * 900000)}`}</span></p>
          </div>
          <button
            onClick={() => navigate('/my-bookings')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold">Booking Confirmation</h1>
            <p className="mt-1">Please review your booking details before confirming</p>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Journey Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">From</p>
                    <p className="font-medium">{startingPoint}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">To</p>
                    <p className="font-medium">{destination}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p className="font-medium">{new Date(vehicleDetails.departureDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Time</p>
                    <p className="font-medium">{vehicleDetails.departureTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Vehicle Type</p>
                    <p className="font-medium">{vehicleDetails.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Vehicle No</p>
                    <p className="font-medium">{vehicleDetails.vehicleNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Pickup Point</p>
                    <p className="font-medium">{vehicleDetails.pickupPoint}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Drop-off Point</p>
                    <p className="font-medium">{vehicleDetails.dropPoint || destination}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-medium">{userDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{userDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="font-medium">{userDetails.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Selected Seats</p>
                  <p className="font-medium">{selectedSeats.join(", ")}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Number of Seats</p>
                  <p className="font-medium">{selectedSeats.length}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Price per Seat</p>
                  <p className="font-medium">Rs. {vehicleDetails.fare}</p>
                </div>
                <div className="border-t border-gray-300 my-2 pt-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <p>Total</p>
                    <p>Rs. {totalFare}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <input
                    id="payment-cash"
                    type="radio"
                    name="payment-method"
                    className="h-4 w-4 text-blue-600"
                    checked
                    readOnly
                  />
                  <label htmlFor="payment-cash" className="ml-2 text-gray-700">Pay at pickup</label>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600"
                checked
                readOnly
              />
              <label htmlFor="terms" className="ml-2 text-gray-700">
                I agree to the <a href="#" className="text-blue-600">terms and conditions</a>
              </label>
            </div>

            <button
              onClick={handleCompleteBooking}
              disabled={processingBooking}
              className={`w-full py-3 rounded font-medium ${
                processingBooking
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {processingBooking ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;