import React from 'react';
import Seat from './Seat';
import Driver from './Driver';

const GenericLayout = ({ totalSeats, vehicleType, selectedSeats, bookedSeats, handleSeatSelection }) => {
  // Generate generic seat data
  const generateSeatData = () => {
    let seatData = [];
    let remainingSeats = totalSeats - 1; // minus driver
    
    for (let row = 0; row < Math.ceil(remainingSeats / 4); row++) {
      const rowChar = String.fromCharCode(65 + row); // A, B, C, etc.
      for (let col = 1; col <= 4; col++) {
        // Skip driver position (typically A2)
        if (rowChar === 'A' && col === 2) continue;
        if (remainingSeats > 0) {
          seatData.push(`${rowChar}${col}`);
          remainingSeats--;
        }
      }
    }
    
    return seatData;
  };

  const vehicleSeatData = generateSeatData();
  
  return (
    <>
      {/* Driver seat */}
      <div className="flex w-full items-center justify-end mb-3 px-2">
        <Driver className="w-10 h-10" />
      </div>
      
      {/* Divider */}
      <div className="w-full border-b border-gray-400 border-dashed mb-3"></div>
      
      {/* Generic seat layout in a 4-column grid */}
      <div className="grid grid-cols-4 gap-1 w-full px-1">
        {vehicleSeatData.map((seat) => (
          <Seat
            key={seat}
            seat={seat}
            isBooked={bookedSeats.includes(seat)}
            isSelected={selectedSeats.includes(seat)}
            onClick={() => handleSeatSelection(seat)}
            className="h-10"
          />
        ))}
      </div>
    </>
  );
};

export default GenericLayout;