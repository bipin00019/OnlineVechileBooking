// import { useState, useEffect } from "react";
// import React from "react";
// const SeatSelection = ({ 
//   vehicleId, 
//   bookedSeats = [], 
//   onSeatSelect, 
//   selectedSeats = [], 
//   fare 
// }) => {
//   // Function to get seat status
//   const getSeatStatus = (seatId) => {
//     if (bookedSeats.includes(seatId)) return "booked";
//     if (selectedSeats.includes(seatId)) return "selected";
//     return "available";
//   };

//   // Function to handle seat selection
//   const handleSeatSelection = (seatId) => {
//     if (!bookedSeats.includes(seatId)) {
//       // Call the parent component's onSeatSelect function
//       onSeatSelect(seatId);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded border border-gray-200 mb-4 md:mb-0">
//       <div className="mb-4 flex justify-between items-center">
//         <h3 className="font-semibold text-gray-800">Select Seats</h3>
//         <div className="flex space-x-4">
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
//             <span className="text-sm text-gray-600">Available</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
//             <span className="text-sm text-gray-600">Booked</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
//             <span className="text-sm text-gray-600">Selected</span>
//           </div>
//         </div>
//       </div>
      
//       {/* Seat layout */}
//       <div className="border border-gray-200 rounded p-4">
//         {/* Driver section */}
//         <div className="flex items-center justify-between mb-4 px-4">
//           <button
//             key="A1"
//             className={`h-10 w-20 rounded flex items-center justify-center text-sm font-medium ${
//               getSeatStatus("A1") === "booked"
//                 ? "bg-gray-400 text-white cursor-not-allowed"
//                 : getSeatStatus("A1") === "selected"
//                 ? "bg-orange-500 text-white"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//             disabled={getSeatStatus("A1") === "booked"}
//             onClick={() => handleSeatSelection("A1")}
//           >
//             A1
//           </button>

//           <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </div>
//         </div>
        
//         {/* Seat grid */}
//         <div className="grid gap-6">
//           {/* Right side */}
//           <div className="grid grid-cols-4 gap-10">
//             {["B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"].map((seat) => (
//               <button
//                 key={seat}
//                 className={`h-10 w-full rounded flex items-center justify-center text-sm font-medium ${
//                   getSeatStatus(seat) === "booked"
//                     ? "bg-gray-400 text-white cursor-not-allowed"
//                     : getSeatStatus(seat) === "selected"
//                     ? "bg-orange-500 text-white"
//                     : "bg-blue-500 text-white hover:bg-blue-600"
//                 }`}
//                 disabled={getSeatStatus(seat) === "booked"}
//                 onClick={() => handleSeatSelection(seat)}
//               >
//                 {seat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatSelection;

// import React from 'react';
// import { GiSteeringWheel } from "react-icons/gi";
// import { MdOutlineChair, MdAirlineSeatReclineNormal } from 'react-icons/md';
// import { FaBus } from 'react-icons/fa';

// const SeatSelection = ({vehicleType, totalSeats, selectedSeats = [], bookedSeats = [], onSeatSelect }) => {
//   // Function to handle seat selection
//   const handleSeatSelection = (seatId) => {
//     if (!bookedSeats.includes(seatId)) {
//       onSeatSelect(seatId);
//     }
//   };

//   // Function to get seat status
//   const getSeatStatus = (seatId) => {
//     if (bookedSeats.includes(seatId)) {
//       return 'text-gray-700 cursor-not-allowed';
//     }
//     if (selectedSeats.includes(seatId)) {
//       return "text-orange-500 cursor-pointer";
//     }
//     return 'text-blue-500 cursor-pointer';
//   };

//   const vehicleSeatData = [
//     "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"
//   ];

//   return (
//     <div className='w-full grid grid-cols-5 gap-10'>
      
//       <div className="col-span-3 flex justify-center">
//         <div className="w-64 bg-gradient-to-b from-gray-100 to-gray-200 p-4 rounded-lg shadow-md border border-gray-300 flex flex-col items-center">
//           <div className="flex items-center justify-center mb-2 w-full">
//             <FaBus className="text-lg text-blue-600 mr-1" />
//             <h4 className="text-sm font-bold text-gray-800">Jeep Layout </h4>
//           </div>
          
//           <div className="w-full border-b border-gray-400 border-dashed mb-3 pb-1 flex justify-center">
//             <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Front</span>
//           </div>
          
//           {/* Driver Area */}
//           <div className="flex w-full justify-between items-center mb-3 px-2">
            
            
//             {/* A1 Seat */}
//             <div 
//               className={`w-10 h-10 flex flex-col items-center justify-center ${
//                 bookedSeats.includes("A1") ? 'bg-gray-200' : 'bg-white'
//               } border ${
//                 selectedSeats.includes("A1") ? 'border-orange-500' : 'border-gray-400'
//               } rounded-md shadow-sm ${
//                 bookedSeats.includes("A1") ? 'cursor-not-allowed' : 'cursor-pointer'
//               }`}
//               onClick={() => handleSeatSelection("A1")}
//             >
//               <h6 className="text-xs font-semibold text-gray-700">A1</h6>
//               <MdAirlineSeatReclineNormal className={`text-sm ${getSeatStatus("A1")}`} />
//             </div>
//             <div className="w-10 h-10 flex flex-col items-center justify-center bg-gray-300 border border-gray-500 rounded-md shadow-sm">
//               <GiSteeringWheel className="text-sm text-black" />
//               <span className="text-xs font-semibold text-gray-700">Driver</span>
//             </div>
//           </div>

//           {/* Seat Layout Grid */}
//           <div className="grid grid-cols-4 gap-1 w-full px-1">
//             {/* Remaining Seats */}
//             {vehicleSeatData.map((seat) => (
//               <div 
//                 key={seat} 
//                 className={`h-10 flex flex-col items-center justify-center ${
//                   bookedSeats.includes(seat) ? 'bg-gray-200' : 'bg-white'
//                 } border ${
//                   selectedSeats.includes(seat) ? 'border-orange-500' : 'border-gray-400'
//                 } rounded-md shadow-sm ${
//                   bookedSeats.includes(seat) ? 'cursor-not-allowed' : 'cursor-pointer'
//                 }`}
//                 onClick={() => handleSeatSelection(seat)}
//               >
//                 <h6 className="text-xs font-semibold text-gray-700">{seat}</h6>
//                 <MdAirlineSeatReclineNormal className={`text-sm ${getSeatStatus(seat)}`} />
//               </div>
//             ))}
//           </div>
          
//           <div className="w-full border-t border-gray-300 mt-3 pt-1 flex justify-center">
//             <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Rear</span>
//           </div>
//         </div>
//       </div>

//       {/* Seat selection legend - kept exactly as in the original */}
//       <div className="col-span-2 w-full space-y-5 bg-neutral rounded-xl py-4 px-6 border border-neutral-200 shadow-sm">
//         <div className="flex flex-col space-y-4">
//           <h3 className="font-semibold text-gray-800">Select Seats</h3>
//           <div className="flex flex-col space-y-3">
//             <div className="flex items-center">
//               <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
//               <span className="text-sm text-gray-600">Available</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
//               <span className="text-sm text-gray-600">Booked</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
//               <span className="text-sm text-gray-600">Selected</span>
//             </div>
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatSelection;

// import React from 'react';
// import { GiSteeringWheel } from "react-icons/gi";
// import { MdOutlineChair, MdAirlineSeatReclineNormal } from 'react-icons/md';
// import { FaBus, FaCar, FaShuttleVan } from 'react-icons/fa';
// import { IoBoat } from 'react-icons/io5';

// const SeatSelection = ({
//   vehicleType ,
//   totalSeats ,
//   selectedSeats = [],
//   bookedSeats = [],
//   onSeatSelect
// }) => {
//   // Function to handle seat selection
//   const handleSeatSelection = (seatId) => {
//     if (!bookedSeats.includes(seatId)) {
//       onSeatSelect(seatId);
//     }
//   };

//   // Function to get seat status
//   const getSeatStatus = (seatId) => {
//     if (bookedSeats.includes(seatId)) {
//       return 'text-gray-700 cursor-not-allowed';
//     }
//     if (selectedSeats.includes(seatId)) {
//       return "text-orange-500 cursor-pointer";
//     }
//     return 'text-blue-500 cursor-pointer';
//   };
  
//   // Generate seat data based on vehicle type and total seats
//   const generateSeatData = () => {
//     let seatData = [];
    
//     // Different vehicles have different seating layouts
//     switch(vehicleType.toLowerCase()) {
//       case 'jeep':
        
//         seatData.push("A1"); // Front passenger
        
//         // Two rows of 4 seats in the back
//         seatData.push("B1", "B2", "B3", "B4");
//         seatData.push("C1", "C2", "C3", "C4");
//         break;
        
//         case 'sofa seater bus':
//     let remainingSofaSeats = totalSeats;
//     let rowIndex = 1; // Start from 'A' for the first row
    
//     while (remainingSofaSeats > 0) {
//         const rowChar = String.fromCharCode(64 + rowIndex); // 'A', 'B', 'C', etc.
        
//         // Each row has **2 spacious seats** in a sofa seater layout
//         for (let col = 1; col <= 2; col++) {
//             if (remainingSofaSeats > 0) {
//                 seatData.push(`${rowChar}${col}`);
//                 remainingSofaSeats--;
//             }
//         }
//         rowIndex++; // Move to the next row
//     }
//     break;
    
//     case 'sofa seater bus':
//   // Calculate total seats excluding the last row's special layout
//   let regularSeats = totalSeats - 5; // Subtract 5 seats for the last row
//   const rowsNeeded = Math.ceil(regularSeats / 4); // 4 seats per regular row (2 left + 2 right)
  
//   // Generate the regular rows (2 seats on left, 2 on right)
//   for (let row = 1; row <= rowsNeeded; row++) {
//     // Left side uses A prefix (A1, A2, etc.)
//     const leftSeatStart = (row - 1) * 2 + 1;
//     seatData.push(`A${leftSeatStart}`, `A${leftSeatStart + 1}`);
    
//     // Right side uses B prefix (B1, B2, etc.)
//     const rightSeatStart = (row - 1) * 2 + 1;
//     seatData.push(`B${rightSeatStart}`, `B${rightSeatStart + 1}`);
    
//     regularSeats -= 4;
    
//     // Stop if we've assigned all regular seats
//     if (regularSeats <= 0) break;
//   }
  
//   // Add the last row with 5 continuous seats
//   // Last row has A15, A16, A17, B17, B18 pattern
//   const lastLeftSeatStart = rowsNeeded * 2 + 1;
//   const lastRightSeatStart = rowsNeeded * 2 + 1;
  
//   // Left part of last row (A15, A16, A17)
//   seatData.push(`A${lastLeftSeatStart}`, `A${lastLeftSeatStart + 1}`, `A${lastLeftSeatStart + 2}`);
  
//   // Right part of last row (B17, B18)
//   seatData.push(`B${lastRightSeatStart}`, `B${lastRightSeatStart + 1}`);
  
//   break;
      
      
//       case 'van':
//         // Add front passenger seat
//         seatData.push("A1");
        
//         // Add middle row (typically 3 seats)
//         seatData.push("B1", "B2", "B3");
        
//         // Add back rows
//         let vanRemainingSeats = totalSeats - 4; // minus driver, front passenger, and 3 middle seats
//         for (let row = 0; row < Math.ceil(vanRemainingSeats / 3); row++) {
//           const rowChar = String.fromCharCode(67 + row); // C, D, etc.
//           for (let col = 1; col <= Math.min(vanRemainingSeats, 3); col++) {
//             seatData.push(`${rowChar}${col}`);
//             vanRemainingSeats--;
//             if (vanRemainingSeats <= 0) break;
//           }
//           if (vanRemainingSeats <= 0) break;
//         }
//         break;
        
//       case 'car':
//         // Standard 5-seat car layout
//         // Driver + 1 front passenger + 3 rear passengers
//         seatData.push("A1"); // Front passenger
//         seatData.push("B1", "B2", "B3"); // Back row
//         break;
        
//       default:
//         // Generic layout for any other vehicle type
//         let remainingSeats = totalSeats - 1; // minus driver
//         for (let row = 0; row < Math.ceil(remainingSeats / 4); row++) {
//           const rowChar = String.fromCharCode(65 + row); // A, B, C, etc.
//           for (let col = 1; col <= 4; col++) {
//             // Skip driver position (typically A2)
//             if (rowChar === 'A' && col === 2) continue;
//             if (remainingSeats > 0) {
//               seatData.push(`${rowChar}${col}`);
//               remainingSeats--;
//             }
//           }
//         }
//     }
    
//     return seatData;
//   };

//   // Generate vehicle seat data
//   const vehicleSeatData = generateSeatData();
  
//   // Get the vehicle icon based on vehicle type
//   const getVehicleIcon = () => {
//     switch(vehicleType.toLowerCase()) {
//       case 'bus':
//         return <FaBus className="text-lg text-blue-600 mr-1" />;
//       case 'sofa seater bus':
//         return <FaBus className="text-lg text-blue-600 mr-1" />;
//       case 'van':
//         return <FaShuttleVan className="text-lg text-blue-600 mr-1" />;
//       case 'boat':
//         return <IoBoat className="text-lg text-blue-600 mr-1" />;
//       case 'jeep':
//       default:
//         return <FaBus className="text-lg text-blue-600 mr-1" />;
//     }
//   };
  
//   // Determine the layout grid based on vehicle type
//   const getGridLayout = () => {
//     switch(vehicleType.toLowerCase()) {
//       case 'bus':
//         return 'grid-cols-4';
//       case ' sofa seater bus':
//         return 'grid-cols-4'
//       case 'car':
//         return 'grid-cols-3';
//       case 'van':
//         return 'grid-cols-3';
//       case 'jeep':
//       default:
//         return 'grid-cols-4';
//     }
//   };
  
//   // Determine if we need to show front passenger seat separately
//   const showFrontPassenger = ['jeep', 'car', 'van'].includes(vehicleType.toLowerCase());
  
//   // Get front passenger seat if it exists
//   const frontPassengerSeat = vehicleSeatData.find(seat => seat === 'A1');
  
//   // Filter out front passenger from grid if shown separately
//   const gridSeats = showFrontPassenger && frontPassengerSeat 
//     ? vehicleSeatData.filter(seat => seat !== 'A1') 
//     : vehicleSeatData;

//   return (
//     <div className='w-full grid grid-cols-5 gap-10'>
      
//       <div className="col-span-3 flex justify-center">
//         <div className="w-64 bg-gradient-to-b from-gray-100 to-gray-200 p-4 rounded-lg shadow-md border border-gray-300 flex flex-col items-center">
//           <div className="flex items-center justify-center mb-2 w-full">
//             {getVehicleIcon()}
//             <h4 className="text-sm font-bold text-gray-800">
//               {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} Layout
//             </h4>
//           </div>
          
//           <div className="w-full border-b border-gray-400 border-dashed mb-3 pb-1 flex justify-center">
//             <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Front</span>
//           </div>
          
//           {/* Driver Area */}
//           <div className={`flex w-full items-center mb-3 px-2 ${vehicleType.toLowerCase() === 'sofa seater bus' ? 'justify-end' : 'justify-between'}`}>
//             {showFrontPassenger && frontPassengerSeat && (
//               <div 
//                 className={`w-10 h-10 flex flex-col items-center justify-center ${
//                   bookedSeats.includes(frontPassengerSeat) ? 'bg-gray-200' : 'bg-white'
//                 } border ${
//                   selectedSeats.includes(frontPassengerSeat) ? 'border-orange-500' : 'border-gray-400'
//                 } rounded-md shadow-sm ${
//                   bookedSeats.includes(frontPassengerSeat) ? 'cursor-not-allowed' : 'cursor-pointer'
//                 }`}
//                 onClick={() => handleSeatSelection(frontPassengerSeat)}
//               >
//                 <h6 className="text-xs font-semibold text-gray-700">{frontPassengerSeat}</h6>
//                 <MdAirlineSeatReclineNormal className={`text-sm ${getSeatStatus(frontPassengerSeat)}`} />
//               </div>
//             )}
            
//             <div className="w-10 h-10 flex flex-col items-center justify-center bg-gray-300 border border-gray-500 rounded-md shadow-sm">
//               <GiSteeringWheel className="text-sm text-black" />
//               <span className="text-xs font-semibold text-gray-700">Driver</span>
//             </div>
//           </div>
//           <div className="w-full border-b border-gray-400 border-dashed mb-3 pb-1 flex justify-center"></div>

//           {/* Seat Layout Grid */}
//           <div className={`grid ${getGridLayout()} gap-1 w-full px-1`}>
//             {/* Remaining Seats */}
//             {gridSeats.map((seat) => (
//               <div 
//                 key={seat} 
//                 className={`h-10 flex flex-col items-center justify-center ${
//                   bookedSeats.includes(seat) ? 'bg-gray-200' : 'bg-white'
//                 } border ${
//                   selectedSeats.includes(seat) ? 'border-orange-500' : 'border-gray-400'
//                 } rounded-md shadow-sm ${
//                   bookedSeats.includes(seat) ? 'cursor-not-allowed' : 'cursor-pointer'
//                 }`}
//                 onClick={() => handleSeatSelection(seat)}
//               >
//                 <h6 className="text-xs font-semibold text-gray-700">{seat}</h6>
//                 <MdAirlineSeatReclineNormal className={`text-sm ${getSeatStatus(seat)}`} />
//               </div>
//             ))}
//           </div>
          
//           <div className="w-full border-t border-gray-300 mt-3 pt-1 flex justify-center">
//             <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Back</span>
//           </div>
//         </div>
//       </div>

//       {/* Seat selection legend */}
//       <div className="col-span-2 w-full space-y-5 bg-neutral rounded-xl py-4 px-6 border border-neutral-200 shadow-sm">
//         <div className="flex flex-col space-y-4">
//           <h3 className="font-semibold text-gray-800">Select Seats</h3>
//           <div className="flex flex-col space-y-3">
//             <div className="flex items-center">
//               <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
//               <span className="text-sm text-gray-600">Available</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
//               <span className="text-sm text-gray-600">Booked</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
//               <span className="text-sm text-gray-600">Selected</span>
//             </div>
//             <div className="mt-3">
//               <span className="text-sm text-gray-700 font-medium">Vehicle Type: {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}</span>
//               <br />
//               <span className="text-sm text-gray-700 font-medium">Total Seats: {vehicleSeatData.length }</span> 
//               <br />
//               <span className="text-sm text-gray-700 font-medium">Selected: {selectedSeats.length} seat(s)</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatSelection;

import React from 'react';
import { FaBus, FaCar, FaShuttleVan,FaBicycle } from 'react-icons/fa';


// Import all layout components
import BusLayout from './Layouts/Buslayout';
import SofaSeaterBusLayout from './Layouts/SofaSeatBusLayout';
import VanLayout from './Layouts/VanLayout';
import BikeLayout from './Layouts/BikeLayout';
import JeepLayout from './Layouts/JeepLayout';
import GenericLayout from './Layouts/GenericLayout';

const SeatSelection = ({
  vehicleType,
  totalSeats,
  selectedSeats = [],
  bookedSeats = [],
  onSeatSelect
}) => {
  // Get the vehicle icon based on vehicle type
  const getVehicleIcon = () => {
    switch(vehicleType.toLowerCase()) {
      case 'bus':
        return <FaBus className="text-lg text-blue-600 mr-1" />;
      case 'sofa seater bus':
        return <FaBus className="text-lg text-blue-600 mr-1" />;
      case 'van':
        return <FaShuttleVan className="text-lg text-blue-600 mr-1" />;
      
      case 'bike':
        return <FaBicycle className="text-lg text-blue-600 mr-1" />;
      case 'jeep':
      default:
        return <FaCar className="text-lg text-blue-600 mr-1" />;
    }
  };

  // Function to handle seat selection
  const handleSeatSelection = (seatId) => {
    if (!bookedSeats.includes(seatId)) {
      onSeatSelect(seatId);
    }
  };

  // Function to get seat status classes
  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      return 'text-gray-700 cursor-not-allowed';
    }
    if (selectedSeats.includes(seatId)) {
      return "text-orange-500 cursor-pointer";
    }
    return 'text-blue-500 cursor-pointer';
  };

  // Render the appropriate layout based on vehicle type
  const renderVehicleLayout = () => {
    switch(vehicleType.toLowerCase()) {
      case 'bus':
        return <BusLayout 
          totalSeats={totalSeats}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
          handleSeatSelection={handleSeatSelection}
          getSeatStatus={getSeatStatus}
        />;
      case 'sofa seater bus':
        return <BusLayout 
          totalSeats={totalSeats}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
          handleSeatSelection={handleSeatSelection}
          getSeatStatus={getSeatStatus}
        />;
      case 'van':
        return <VanLayout 
          totalSeats={totalSeats}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
          handleSeatSelection={handleSeatSelection}
          getSeatStatus={getSeatStatus}
        />;
      case 'bike':
        return <BikeLayout 
          totalSeats={totalSeats}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
          handleSeatSelection={handleSeatSelection}
          getSeatStatus={getSeatStatus}
        />;
      case 'jeep':
        return <JeepLayout 
          totalSeats={totalSeats}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
          handleSeatSelection={handleSeatSelection}
          getSeatStatus={getSeatStatus}
        />;
        case 'deluxe_bus':
          return <BusLayout 
            totalSeats={totalSeats}
            selectedSeats={selectedSeats}
            bookedSeats={bookedSeats}
            handleSeatSelection={handleSeatSelection}
            getSeatStatus={getSeatStatus}
          />;
      default:
        return <GenericLayout 
          totalSeats={totalSeats}
          vehicleType={vehicleType}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
          handleSeatSelection={handleSeatSelection}
          getSeatStatus={getSeatStatus}
        />;
    }
  };

  // Count total seats from the current layout
  const getVehicleSeatCount = () => {
    switch(vehicleType.toLowerCase()) {
      case 'bus':
        return totalSeats ; 
      case 'sofa seater bus':
        return totalSeats;
      case 'deluxe_bus':
        return totalSeats; 
      case 'van':
        return totalSeats; 
      case 'car':
        return totalSeats; 
      case 'jeep':
        return totalSeats; 
      default:
        return totalSeats ; 
    }
  };

  return (
    <div className='w-full grid grid-cols-5 gap-10'>
      
      <div className="col-span-3 flex justify-center">
        <div className="w-64 bg-gradient-to-b from-gray-100 to-gray-200 p-4 rounded-lg shadow-md border border-gray-300 flex flex-col items-center">
          <div className="flex items-center justify-center mb-2 w-full">
            {getVehicleIcon()}
            <h4 className="text-sm font-bold text-gray-800">
              {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} Layout
            </h4>
          </div>
          
          <div className="w-full border-b border-gray-400 border-dashed mb-3 pb-1 flex justify-center">
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Front</span>
          </div>
          
          {/* Render vehicle-specific layout */}
          {renderVehicleLayout()}
          
          <div className="w-full border-t border-gray-300 mt-3 pt-1 flex justify-center">
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Back</span>
          </div>
        </div>
      </div>

      {/* Seat selection legend */}
      <div className="col-span-2 w-full space-y-5 bg-neutral rounded-xl py-4 px-6 border border-neutral-200 shadow-sm">
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-gray-800">Select Seats</h3>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;