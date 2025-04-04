import React from 'react';
import { GiSteeringWheel } from "react-icons/gi";

const Driver = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-300 border border-gray-500 rounded-md shadow-sm ${className}`}>
      <GiSteeringWheel className="text-sm text-black" />
      <span className="text-xs font-semibold text-gray-700">Driver</span>
    </div>
  );
};

export default Driver;