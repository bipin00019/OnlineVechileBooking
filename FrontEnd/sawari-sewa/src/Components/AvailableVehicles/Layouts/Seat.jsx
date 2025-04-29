// import React from 'react';
// import { MdAirlineSeatReclineNormal } from 'react-icons/md';

// const Seat = ({ seat, isBooked, isSelected, onClick, className = '' }) => {
//   return (
//     <div 
//       className={`flex flex-col items-center justify-center ${
//         isBooked ? 'bg-gray-200' : 'bg-white'
//       } border ${
//         isSelected ? 'border-orange-500' : 'border-gray-400'
//       } rounded-md shadow-sm ${
//         isBooked ? 'cursor-not-allowed' : 'cursor-pointer'
//       } ${className}`}
//       onClick={onClick}
//     >
//       <h6 className="text-xs font-semibold text-gray-700">{seat}</h6>
//       <MdAirlineSeatReclineNormal className={`text-sm ${
//         isBooked ? 'text-gray-700' : isSelected ? 'text-orange-500' : 'text-blue-500'
//       }`} />
//     </div>
//   );
// };

// export default Seat;

import React from 'react';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

const Seat = ({ seat, isBooked, isSelected, onClick, className = '' }) => {
  // Create a click handler that only calls the original onClick when the seat is not booked
  const handleClick = (e) => {
    if (isBooked) {
      // Prevent the click event for booked seats
      e.preventDefault();
      return;
    }
    // Call onClick for non-booked seats
    onClick();
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center ${
        isBooked ? 'bg-gray-200' : 'bg-white'
      } border ${
        isSelected ? 'border-orange-500' : 'border-gray-400'
      } rounded-md shadow-sm ${
        isBooked ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onClick={handleClick} // Use our conditional handler
      // Don't use pointerEvents: 'none' to allow hover effects
    >
      <h6 className="text-xs font-semibold text-gray-700">{seat}</h6>
      <MdAirlineSeatReclineNormal className={`text-sm ${
        isBooked ? 'text-gray-700' : isSelected ? 'text-orange-500' : 'text-blue-500'
      }`} />
    </div>
  );
};

export default Seat;