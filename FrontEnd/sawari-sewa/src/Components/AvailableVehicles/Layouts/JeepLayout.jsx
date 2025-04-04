// import React from 'react';
// import Seat from './Seat';
// import Driver from './Driver';

// const JeepLayout = ({ selectedSeats, bookedSeats, handleSeatSelection }) => {
//   // Generate seat data
//   const generateSeatData = () => {
//     let seatData = [];
    
//     // Front passenger
//     seatData.push("A1");
    
//     // Two rows of 4 seats in the back
//     seatData.push("B1", "B2", "B3", "B4");
//     seatData.push("C1", "C2", "C3", "C4");
    
//     return seatData;
//   };

//   const vehicleSeatData = generateSeatData();
  
//   // Get front passenger seat
//   const frontPassengerSeat = "A1";
  
//   // Filter out front passenger from grid
//   const gridSeats = vehicleSeatData.filter(seat => seat !== frontPassengerSeat);
  
//   // Group back seats by row
//   const backSeats = {
//     'B': gridSeats.filter(seat => seat.startsWith('B')),
//     'C': gridSeats.filter(seat => seat.startsWith('C'))
//   };
  
//   return (
//     <>
//       {/* Driver and front passenger */}
//       <div className="flex w-full items-center justify-between mb-3 px-2">
//         <Seat
//           seat={frontPassengerSeat}
//           isBooked={bookedSeats.includes(frontPassengerSeat)}
//           isSelected={selectedSeats.includes(frontPassengerSeat)}
//           onClick={() => handleSeatSelection(frontPassengerSeat)}
//           className="w-10 h-10"
//         />
//         <Driver className="w-10 h-10" />
//       </div>
      
//       {/* Divider */}
//       <div className="w-full border-b border-gray-400 border-dashed mb-3"></div>
      
//       {/* Back rows */}
//       {Object.keys(backSeats).map(row => (
//         <div key={row} className="grid grid-cols-4 gap-1 w-full px-1 mb-2">
//           {backSeats[row].map(seat => (
//             <Seat
//               key={seat}
//               seat={seat}
//               isBooked={bookedSeats.includes(seat)}
//               isSelected={selectedSeats.includes(seat)}
//               onClick={() => handleSeatSelection(seat)}
//               className="h-10"
//             />
//           ))}
//         </div>
//       ))}
//     </>
//   );
// };

// export default JeepLayout;

import React from 'react';
import JeepSeat from './JeepSeat';
import Driver from './Driver';

const JeepLayout = ({ totalSeats, selectedSeats, bookedSeats, handleSeatSelection }) => {
  const generateSeatData = () => {
    if (totalSeats === 7) {
      return ['A1', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2']; // 1 front, 4 middle, 2 back
    } else if (totalSeats === 9) {
      return ['A1', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4']; // 1 front, 4 middle, 4 back
    }
    return []; // default fallback
  };

  const seatData = generateSeatData();

  const frontPassengerSeat = seatData[0]; // A1
  const middleRowSeats = seatData.slice(1, 5); // B1–B4
  const backRowSeats = seatData.slice(5); // C1–C2 (for 7) or C1–C4 (for 9)

  return (
    <>
      {/* Driver and front passenger */}
      <div className="flex w-full items-center justify-between mb-3 px-2">
        <JeepSeat
          seat={frontPassengerSeat}
          isBooked={bookedSeats.includes(frontPassengerSeat)}
          isSelected={selectedSeats.includes(frontPassengerSeat)}
          onClick={() => handleSeatSelection(frontPassengerSeat)}
          className="w-10 h-10"
        />
        <Driver className="w-10 h-10" />
      </div>

      {/* Divider */}
      <div className="w-full border-b border-gray-400 border-dashed mb-3"></div>

      {/* Middle Row */}
      <div className="grid grid-cols-4 gap-1 w-full px-1 mb-2">
        {middleRowSeats.map((seat) => (
          <JeepSeat
            key={seat}
            seat={seat}
            isBooked={bookedSeats.includes(seat)}
            isSelected={selectedSeats.includes(seat)}
            onClick={() => handleSeatSelection(seat)}
            className="h-10"
          />
        ))}
      </div>

      {/* Back Row */}
      {backRowSeats.length > 0 && (
        <div
          className={`${
            totalSeats === 7 ? 'flex justify-around items-center' : 'grid grid-cols-4 gap-1'
          } w-full px-1 mt-2`}
        >
          {backRowSeats.map((seat, index) => (
            <JeepSeat
              key={seat}
              seat={seat}
              isBooked={bookedSeats.includes(seat)}
              isSelected={selectedSeats.includes(seat)}
              onClick={() => handleSeatSelection(seat)}
              className="w-12 h-10"
              isMirrored={totalSeats === 7 && index === 1} // Apply mirror effect only to the icon for the last seat in 7-seat configuration
            />
          ))}
        </div>
      )}
    </>
  );
};

export default JeepLayout;