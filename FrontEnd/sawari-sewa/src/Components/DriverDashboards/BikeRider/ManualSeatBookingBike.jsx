import React, { useState } from 'react';
import Seat from '../../AvailableVehicles/Layouts/Seat';
import Driver from '../../AvailableVehicles/Layouts/Driver';
import { manualBookSeat } from '../../../services/DriverDashboardService';

const ManualSeatBookingBike = () => {
  const [seatNumber] = useState("A1"); // A1 is fixed for bike
  const [passengerName, setPassengerName] = useState("");
  const [passengerContact, setPassengerContact] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isError, setIsError] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(["A1"]);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!passengerName.trim()) {
      setBookingStatus("Passenger name is required");
      setIsError(true);
      return false;
    }
    
    if (!passengerContact.trim()) {
      setBookingStatus("Passenger contact is required");
      setIsError(true);
      return false;
    }
    
    return true;
  };

  const handleBooking = async () => {
    setIsError(false);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, message } = await manualBookSeat({
        seatNumber,
        passengerName,
        passengerContact
      });

      setBookingStatus(message);
      setIsError(!success);
      
      if (success) {
        setBookedSeats(prev => [...prev, seatNumber]);
        // Reset form after successful booking
        setPassengerName("");
        setPassengerContact("");
      }
    } catch (error) {
      setBookingStatus("An error occurred while booking. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="manual-booking-container flex flex-col items-center mt-6">
      {/* Bike layout */}
      <div className="bike-layout w-full max-w-sm border p-4 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <div className="handlebar w-24 h-6 bg-gray-700 rounded-full mb-3"></div>
          <div className="driver-section mb-1">
            <Driver className="w-12 h-12" />
          </div>
          <div className="passenger-section">
            <Seat
              seat="A1"
              isBooked={bookedSeats.includes("A1")}
              isSelected={selectedSeats.includes("A1")}
              onClick={() => setSelectedSeats(["A1"])}
              className="h-10 w-12"
            />
          </div>
          <div className="wheels flex justify-between w-full mt-4">
            <div className="wheel w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            <div className="wheel w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Booking form */}
      <div className="mt-6 w-full max-w-sm">
        <div className="mb-3">
          <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-1">
            Passenger Name <span className="text-red-500">*</span>
          </label>
          <input
            id="passengerName"
            type="text"
            placeholder="Enter passenger name"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="passengerContact" className="block text-sm font-medium text-gray-700 mb-1">
            Passenger Contact <span className="text-red-500">*</span>
          </label>
          <input
            id="passengerContact"
            type="text"
            placeholder="Enter passenger contact"
            value={passengerContact}
            onChange={(e) => setPassengerContact(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <button
          onClick={handleBooking}
          disabled={isLoading}
          className={`w-full py-2 rounded transition ${
            isLoading 
              ? "bg-blue-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isLoading ? "Booking..." : "Book Seat"}
        </button>

        {bookingStatus && (
          <div className={`mt-4 text-center text-sm ${isError ? "text-red-600" : "text-green-600"}`}>
            {bookingStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualSeatBookingBike;

