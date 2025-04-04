import React from 'react';
import Seat from './Seat';
import Driver from './Driver';

const VanLayout = ({ totalSeats, selectedSeats, bookedSeats, handleSeatSelection }) => {
  // Generate seat data
  const generateSeatData = () => {
    const seatData = [];
    
    // Calculate remaining seats after accounting for driver and additional seats next to driver
    let remainingSeats = totalSeats - 3; // Subtract 1 for the driver and 2 for seats next to driver
    const rowsNeeded = Math.ceil(remainingSeats / 3); // 3 seats per row (left, middle, right)
    
    // Group seats by row for better visualization
    const rowData = [];
    
    // Generate regular rows (3 seats per row)
    for (let row = 1; row <= rowsNeeded; row++) {
      const rowSeats = {
        left: [`A${(row - 1) * 3 + 1}`],
        middle: [`A${(row - 1) * 3 + 2}`],
        right: [`A${(row - 1) * 3 + 3}`]
      };
      
      rowData.push(rowSeats);
      remainingSeats -= 3;
      
      if (remainingSeats <= 0) break;
    }
    
    return { rowData };
  };

  const { rowData } = generateSeatData();
  
  return (
    <div className="van-layout w-full">
      {/* Front section with driver and two seats next to driver */}
      <div className="front-section flex justify-between items-center mb-5">
        <div className="left-seats flex gap-2">
          {/* Two seats alongside the driver */}
          <Seat
            seat="D1"
            isBooked={bookedSeats.includes('D1')}
            isSelected={selectedSeats.includes('D1')}
            onClick={() => handleSeatSelection('D1')}
            className="h-10 w-12"
          />
          <Seat
            seat="D2"
            isBooked={bookedSeats.includes('D2')}
            isSelected={selectedSeats.includes('D2')}
            onClick={() => handleSeatSelection('D2')}
            className="h-10 w-12"
          />
        </div>
        <div className="driver w-12">
          <Driver className="w-12 h-12" />
        </div>
      </div>
      
      {/* Main seating area */}
      <div className="seating-area w-full">
        {/* Regular rows with aisle in the middle */}
        {rowData.map((row, index) => (
          <div key={index} className="row flex justify-between mb-3">
            {/* Left side seat */}
            <div className="left-seat flex justify-center">
              <Seat
                seat={row.left[0]}
                isBooked={bookedSeats.includes(row.left[0])}
                isSelected={selectedSeats.includes(row.left[0])}
                onClick={() => handleSeatSelection(row.left[0])}
                className="h-10 w-12"
              />
            </div>
            
            {/* Aisle */}
            <div className="aisle w-10"></div>
            
            {/* Middle seat */}
            <div className="middle-seat flex justify-center">
              <Seat
                seat={row.middle[0]}
                isBooked={bookedSeats.includes(row.middle[0])}
                isSelected={selectedSeats.includes(row.middle[0])}
                onClick={() => handleSeatSelection(row.middle[0])}
                className="h-10 w-12"
              />
            </div>
            
            {/* Aisle */}
            <div className="aisle w-10"></div>
            
            {/* Right side seat */}
            <div className="right-seat flex justify-center">
              <Seat
                seat={row.right[0]}
                isBooked={bookedSeats.includes(row.right[0])}
                isSelected={selectedSeats.includes(row.right[0])}
                onClick={() => handleSeatSelection(row.right[0])}
                className="h-10 w-12"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VanLayout;
