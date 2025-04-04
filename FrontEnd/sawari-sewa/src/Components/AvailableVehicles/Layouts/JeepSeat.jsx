import React from 'react';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

const JeepSeat = ({ seat, isBooked, isSelected, onClick, className = '', isMirrored = false }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center ${
        isBooked ? 'bg-gray-200' : 'bg-white'
      } border ${
        isSelected ? 'border-orange-500' : 'border-gray-400'
      } rounded-md shadow-sm ${
        isBooked ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onClick={onClick}
    >
      <h6 className="text-xs font-semibold text-gray-700">{seat}</h6>
      <MdAirlineSeatReclineNormal 
        className={`text-sm ${
          isBooked ? 'text-gray-700' : isSelected ? 'text-orange-500' : 'text-blue-500'
        } ${isMirrored ? 'transform scale-x-[-1]' : ''}`} 
      />
    </div>
  );
};

export default JeepSeat;