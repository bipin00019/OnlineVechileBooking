import React from 'react';
import Seat from './Seat';
import Driver from './Driver';

const BusLayout = ({ totalSeats, selectedSeats, bookedSeats, handleSeatSelection }) => {
  // Generate seat data
  const generateSeatData = () => {
    const seatData = [];
    
    // Calculate total seats excluding the last row's special layout
    let regularSeats = totalSeats - 6; // Subtract 5 seats for the last row + driver
    const rowsNeeded = Math.ceil(regularSeats / 4); // 4 seats per regular row (2 left + 2 right)
    
    // Group seats by row for better visualization
    const rowData = [];
    
    // Generate regular rows
    for (let row = 1; row <= rowsNeeded; row++) {
      const rowSeats = {
        left: [
          `A${(row - 1) * 2 + 1}`, 
          `A${(row - 1) * 2 + 2}`
        ],
        right: [
          `B${(row - 1) * 2 + 1}`, 
          `B${(row - 1) * 2 + 2}`
        ]
      };
      
      rowData.push(rowSeats);
      regularSeats -= 4;
      
      if (regularSeats <= 0) break;
    }
    
    // Add the last row seats
    const lastRowSeats = ["C1", "C2", "C3", "C4", "C5"];
    
    return { rowData, lastRowSeats };
  };

  const { rowData, lastRowSeats } = generateSeatData();
  
  return (
    <div className="bus-layout w-full">
      {/* Front section with driver */}
      <div className="front-section flex justify-between items-center mb-5">
        <div className="w-10 invisible">
          {/* Space for visual balance */}
        </div>
        <Driver className="w-12 h-12" />
      </div>
      
      {/* Main seating area */}
      <div className="seating-area w-full">
        {/* Regular rows with aisle in the middle */}
        {rowData.map((row, index) => (
          <div key={index} className="row flex justify-between mb-3">
            {/* Left side seats */}
            <div className="left-seats flex gap">
              {row.left.map(seat => (
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
            
            {/* Aisle */}
            <div className="aisle w-10"></div>
            
            {/* Right side seats */}
            <div className="right-seats flex gap">
              {row.right.map(seat => (
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
        ))}
        
       
        
        
        {/* Last row with continuous seats */}
        <div className="last-row flex justify-center  ">
          {lastRowSeats.map(seat => (
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
    </div>
  );
};

export default BusLayout;