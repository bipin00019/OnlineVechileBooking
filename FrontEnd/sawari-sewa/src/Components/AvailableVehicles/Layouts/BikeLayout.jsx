import React from 'react';
import Seat from './Seat';
import Driver from './Driver';

const BikeLayout = ({ selectedSeats, bookedSeats, handleSeatSelection }) => {
  // For a bike, we typically have a driver seat and a passenger seat
  const seatData = ["A1"];  // Just the passenger seat, driver is represented separately
  
  return (
    <div className="bike-layout w-full">
      {/* Main structure */}
      <div className="flex flex-col items-center">
        {/* Front section with handlebar */}
        <div className="handlebar w-24 h-6 bg-gray-700 rounded-full mb-3"></div>
        
        {/* Driver and passenger section */}
        <div className="seating-section flex flex-col items-center">
          {/* Driver seat */}
          <div className="driver-section mb-1">
            <Driver className="w-12 h-12" />
          </div>
          
          {/* Passenger seat */}
          <div className="passenger-section">
            {seatData.map(seat => (
              <Seat
                key={seat}
                seat={seat}
                isBooked={bookedSeats.includes(seat)}
                isSelected={selectedSeats.includes(seat)}
                onClick={() => handleSeatSelection(seat)}
                className="h-10 w-12"
              />
            ))}
          </div>
        </div>
        
        {/* Wheels representation */}
        <div className="wheels flex justify-between w-full mt-4">
          <div className="wheel w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
          <div className="wheel w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default BikeLayout;