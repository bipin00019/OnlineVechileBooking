import { useState, useEffect } from "react";
import React from "react";
const SeatSelection = ({ 
  vehicleId, 
  bookedSeats = [], 
  onSeatSelect, 
  selectedSeats = [], 
  fare 
}) => {
  // Function to get seat status
  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  // Function to handle seat selection
  const handleSeatSelection = (seatId) => {
    if (!bookedSeats.includes(seatId)) {
      // Call the parent component's onSeatSelect function
      onSeatSelect(seatId);
    }
  };

  return (
    <div className="bg-white p-4 rounded border border-gray-200 mb-4 md:mb-0">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Select Seats</h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
        </div>
      </div>
      
      {/* Seat layout */}
      <div className="border border-gray-200 rounded p-4">
        {/* Driver section */}
        <div className="flex items-center justify-between mb-4 px-4">
          <button
            key="A1"
            className={`h-10 w-20 rounded flex items-center justify-center text-sm font-medium ${
              getSeatStatus("A1") === "booked"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : getSeatStatus("A1") === "selected"
                ? "bg-orange-500 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={getSeatStatus("A1") === "booked"}
            onClick={() => handleSeatSelection("A1")}
          >
            A1
          </button>

          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        
        {/* Seat grid */}
        <div className="grid gap-6">
          {/* Right side */}
          <div className="grid grid-cols-4 gap-10">
            {["B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"].map((seat) => (
              <button
                key={seat}
                className={`h-10 w-full rounded flex items-center justify-center text-sm font-medium ${
                  getSeatStatus(seat) === "booked"
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : getSeatStatus(seat) === "selected"
                    ? "bg-orange-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={getSeatStatus(seat) === "booked"}
                onClick={() => handleSeatSelection(seat)}
              >
                {seat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

