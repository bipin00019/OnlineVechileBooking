
// import React, { useState, useEffect } from 'react';
// import BusLayout from '../../AvailableVehicles/Layouts/Buslayout';
// import { manualBookSeat, fetchDriverSeatStats, fetchBookedSeatNumbers } from '../../../services/DriverDashboardService';

// const ManualSeatBookingBus = () => {
//   const [passengerName, setPassengerName] = useState("");
//   const [passengerContact, setPassengerContact] = useState("");
//   const [bookingStatus, setBookingStatus] = useState(null);
//   const [isError, setIsError] = useState(false);
//   const [bookedSeats, setBookedSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalSeats, setTotalSeats] = useState(0);
//   const [vehicleData, setVehicleData] = useState(null);
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // Fetch booked seats and total seats on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsDataLoading(true);
//       try {
//         // Fetch booked seat numbers
//         const bookedSeatsResponse = await fetchBookedSeatNumbers();
//         if (bookedSeatsResponse && Array.isArray(bookedSeatsResponse)) {
//           const seatNumbers = bookedSeatsResponse.map(booking => booking.seatNumber);
//           setBookedSeats(seatNumbers);
//         }

//         // Fetch total seats from stats
//         const seatStatsResponse = await fetchDriverSeatStats();
//         if (seatStatsResponse && Array.isArray(seatStatsResponse) && seatStatsResponse.length > 0) {
//           const vehicleInfo = seatStatsResponse[0];
//           setTotalSeats(vehicleInfo.totalSeats);
//           setVehicleData(vehicleInfo);
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setBookingStatus("Failed to load vehicle data. Please refresh the page.");
//         setIsError(true);
//       } finally {
//         setIsDataLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const validateForm = () => {
//     if (!selectedSeats.length) {
//       setBookingStatus("Please select at least one seat");
//       setIsError(true);
//       return false;
//     }
    
//     if (!passengerName.trim()) {
//       setBookingStatus("Passenger name is required");
//       setIsError(true);
//       return false;
//     }
    
//     if (!passengerContact.trim()) {
//       setBookingStatus("Passenger contact is required");
//       setIsError(true);
//       return false;
//     }
    
//     return true;
//   };

//   const handleSeatSelection = (seat) => {
//     setSelectedSeats(prev => {
//       if (prev.includes(seat)) {
//         return prev.filter(s => s !== seat);
//       } else {
//         return [...prev, seat];
//       }
//     });
//   };

//   const handleBooking = async () => {
//     setIsError(false);
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       // Book multiple seats if selected
//       const bookingPromises = selectedSeats.map(seatNumber => {
//         return manualBookSeat({
//           seatNumber,
//           passengerName,
//           passengerContact,
//           // Include pickup and dropoff points if available from vehicle data
//           pickupPoint: vehicleData?.pickupPoint,
//           dropOffPoint: vehicleData?.dropOffPoint
//         });
//       });
      
//       const results = await Promise.all(bookingPromises);
//       const allSuccessful = results.every(result => result.success);
      
//       if (allSuccessful) {
//         setBookingStatus(`Successfully booked ${selectedSeats.length} seat(s)`);
//         setIsError(false);
//         setBookedSeats(prev => [...prev, ...selectedSeats]);
//         setSelectedSeats([]);
//         // Reset form after successful booking
//         setPassengerName("");
//         setPassengerContact("");
        
//         // Refresh booked seats data after successful booking
//         const refreshedSeats = await fetchBookedSeatNumbers();
//         if (refreshedSeats && Array.isArray(refreshedSeats)) {
//           const seatNumbers = refreshedSeats.map(booking => booking.seatNumber);
//           setBookedSeats(seatNumbers);
//         }
//       } else {
//         const failedSeats = results
//           .map((result, index) => !result.success ? selectedSeats[index] : null)
//           .filter(Boolean);
        
//         setBookingStatus(`Failed to book seats: ${failedSeats.join(', ')}`);
//         setIsError(true);
//       }
//     } catch (error) {
//       setBookingStatus("An error occurred while booking. Please try again.");
//       setIsError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isDataLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//           <p className="mt-2 text-gray-600">Loading vehicle data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="manual-booking-container flex flex-col items-center mt-6">
//       {/* Vehicle Information */}
//       {vehicleData && (
//         <div className="w-full max-w-md mb-4 bg-blue-50 p-4 rounded-lg shadow">
//           <h3 className="font-semibold text-lg mb-2">{vehicleData.vehicleType} ({vehicleData.vehicleNumber})</h3>
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div>
//               <span className="font-medium">Route:</span> {vehicleData.location} to {vehicleData.destination}
//             </div>
//             <div>
//               <span className="font-medium">Date:</span> {new Date(vehicleData.departureDate).toLocaleDateString()}
//             </div>
//             <div>
//               <span className="font-medium">Time:</span> {vehicleData.departureTime}
//             </div>
//             <div>
//               <span className="font-medium">Fare:</span> Rs. {vehicleData.fare}
//             </div>
//             <div className="col-span-2">
//               <span className="font-medium">Pickup:</span> {vehicleData.pickupPoint}
//             </div>
//             <div className="col-span-2">
//               <span className="font-medium">Drop-off:</span> {vehicleData.dropOffPoint}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Seats status */}
//       <div className="w-full max-w-md mb-4 flex justify-around bg-gray-50 p-3 rounded-lg shadow">
//         <div className="text-center">
//           <div className="text-lg font-semibold">{totalSeats}</div>
//           <div className="text-sm text-gray-600">Total Seats</div>
//         </div>
//         <div className="text-center">
//           <div className="text-lg font-semibold">{bookedSeats.length}</div>
//           <div className="text-sm text-gray-600">Booked</div>
//         </div>
//         <div className="text-center">
//           <div className="text-lg font-semibold">{totalSeats - bookedSeats.length}</div>
//           <div className="text-sm text-gray-600">Available</div>
//         </div>
//       </div>

//       {/* Bus layout */}
//       <div className="bus-layout w-600 max-w-md border p-4 rounded-lg shadow">
//         <BusLayout 
//           totalSeats={totalSeats}
//           selectedSeats={selectedSeats}
//           bookedSeats={bookedSeats}
//           handleSeatSelection={handleSeatSelection}
//         />
//       </div>

//       {/* Booking form */}
//       <div className="mt-6 w-full max-w-md">
//         <div className="mb-3">
//           <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-1">
//             Passenger Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="passengerName"
//             type="text"
//             placeholder="Enter passenger name"
//             value={passengerName}
//             onChange={(e) => setPassengerName(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="passengerContact" className="block text-sm font-medium text-gray-700 mb-1">
//             Passenger Contact <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="passengerContact"
//             type="text"
//             placeholder="Enter passenger contact"
//             value={passengerContact}
//             onChange={(e) => setPassengerContact(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>
        
//         <div className="mb-3">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Selected Seats:
//           </label>
//           <div className="p-2 min-h-8 border rounded bg-gray-50">
//             {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
//           </div>
//         </div>
        
//         <button
//           onClick={handleBooking}
//           disabled={isLoading || selectedSeats.length === 0}
//           className={`w-full py-2 rounded transition ${
//             isLoading || selectedSeats.length === 0
//               ? "bg-blue-400 cursor-not-allowed" 
//               : "bg-blue-600 hover:bg-blue-700"
//           } text-white`}
//         >
//           {isLoading ? "Booking..." : `Book ${selectedSeats.length} Seat(s)`}
//         </button>

//         {bookingStatus && (
//           <div className={`mt-4 text-center text-sm ${isError ? "text-red-600" : "text-green-600"}`}>
//             {bookingStatus}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManualSeatBookingBus;

import React, { useState, useEffect } from 'react';
import BusLayout from '../../AvailableVehicles/Layouts/Buslayout';
import { manualBookSeat, fetchDriverSeatStats, fetchBookedSeatNumbers } from '../../../services/DriverDashboardService';

const ManualSeatBookingBus = () => {
  const [passengerName, setPassengerName] = useState("");
  const [passengerContact, setPassengerContact] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isError, setIsError] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSeats, setTotalSeats] = useState(0);
  const [vehicleData, setVehicleData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch booked seats and total seats on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsDataLoading(true);
      try {
        // Fetch booked seat numbers
        const bookedSeatsResponse = await fetchBookedSeatNumbers();
        if (bookedSeatsResponse && Array.isArray(bookedSeatsResponse)) {
          const seatNumbers = bookedSeatsResponse.map(booking => booking.seatNumber);
          setBookedSeats(seatNumbers);
        }

        // Fetch total seats from stats
        const seatStatsResponse = await fetchDriverSeatStats();
        if (seatStatsResponse && Array.isArray(seatStatsResponse) && seatStatsResponse.length > 0) {
          const vehicleInfo = seatStatsResponse[0];
          setTotalSeats(vehicleInfo.totalSeats);
          setVehicleData(vehicleInfo);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setBookingStatus("Failed to load vehicle data. Please refresh the page.");
        setIsError(true);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const validateForm = () => {
    if (!selectedSeats.length) {
      setBookingStatus("Please select at least one seat");
      setIsError(true);
      return false;
    }
    
    if (!passengerName.trim()) {
      setBookingStatus("Passenger name is required");
      setIsError(true);
      return false;
    }
    
    if (!passengerContact.trim()) {
      setBookingStatus("Passenger contact is required");
      setIsError(true);
      return false;
    }
    
    return true;
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeats(prev => {
      if (prev.includes(seat)) {
        return prev.filter(s => s !== seat);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleBooking = async () => {
    setIsError(false);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Book multiple seats if selected
      const bookingPromises = selectedSeats.map(seatNumber => {
        return manualBookSeat({
          seatNumber,
          passengerName,
          passengerContact,
          // Include pickup and dropoff points if available from vehicle data
          pickupPoint: vehicleData?.pickupPoint,
          dropOffPoint: vehicleData?.dropOffPoint
        });
      });
      
      const results = await Promise.all(bookingPromises);
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        setBookingStatus(`Successfully booked ${selectedSeats.length} seat(s)`);
        setIsError(false);
        setBookedSeats(prev => [...prev, ...selectedSeats]);
        setSelectedSeats([]);
        // Reset form after successful booking
        setPassengerName("");
        setPassengerContact("");
        
        // Refresh booked seats data after successful booking
        const refreshedSeats = await fetchBookedSeatNumbers();
        if (refreshedSeats && Array.isArray(refreshedSeats)) {
          const seatNumbers = refreshedSeats.map(booking => booking.seatNumber);
          setBookedSeats(seatNumbers);
        }
      } else {
        const failedSeats = results
          .map((result, index) => !result.success ? selectedSeats[index] : null)
          .filter(Boolean);
        
        setBookingStatus(`Failed to book seats: ${failedSeats.join(', ')}`);
        setIsError(true);
      }
    } catch (error) {
      setBookingStatus("An error occurred while booking. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 px-4 md:px-6 py-6 max-w-6xl mx-auto">
      {/* Left Column - Bus Layout */}
      <div className="flex-1 mb-6 md:mb-0">
        <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Select Seats</h2>
          
          {/* Seats status */}
          <div className="flex justify-around bg-gray-50 p-3 rounded-lg shadow-sm mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{totalSeats}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{bookedSeats.length}</div>
              <div className="text-xs text-gray-600">Booked</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{totalSeats - bookedSeats.length}</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
          </div>

          {/* Bus layout with fixed width of 600px */}
          <div className="w-600 mx-auto bus-layout border rounded-lg shadow-inner p-4 bg-gray-50 flex items-center justify-center">
            <BusLayout 
              totalSeats={totalSeats}
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              handleSeatSelection={handleSeatSelection}
            />
          </div>
          
          <div className="mt-3 p-2 text-sm bg-blue-50 rounded-lg">
            <span className="font-medium">Selected Seats: </span>
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
          </div>
        </div>
      </div>

      {/* Right Column - Vehicle Info and Booking Form */}
      <div className="flex-1 md:max-w-md">
        <div className="flex flex-col space-y-4">
          {/* Vehicle Information */}
          {vehicleData && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Vehicle Details</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-blue-800">{vehicleData.vehicleType} ({vehicleData.vehicleNumber})</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="col-span-2 p-2 bg-white rounded">
                    <span className="font-medium">Route: </span> 
                    <span className="text-blue-700">{vehicleData.location} to {vehicleData.destination}</span>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <span className="font-medium">Date: </span> 
                    <span>{new Date(vehicleData.departureDate).toLocaleDateString()}</span>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <span className="font-medium">Time: </span> 
                    <span>{vehicleData.departureTime}</span>
                  </div>
                  <div className="col-span-2 p-2 bg-white rounded">
                    <span className="font-medium">Fare: </span> 
                    <span className="text-green-700 font-semibold">Rs. {vehicleData.fare}</span>
                  </div>
                  <div className="col-span-2 p-2 bg-white rounded">
                    <span className="font-medium">Pickup: </span> 
                    <span>{vehicleData.pickupPoint}</span>
                  </div>
                  <div className="col-span-2 p-2 bg-white rounded">
                    <span className="font-medium">Drop-off: </span> 
                    <span>{vehicleData.dropOffPoint}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking form */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Passenger Details</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="passengerName"
                  type="text"
                  placeholder="Enter passenger name"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="passengerContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Contact <span className="text-red-500">*</span>
                </label>
                <input
                  id="passengerContact"
                  type="text"
                  placeholder="Enter passenger contact"
                  value={passengerContact}
                  onChange={(e) => setPassengerContact(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <button
                onClick={handleBooking}
                disabled={isLoading || selectedSeats.length === 0}
                className={`w-full py-3 rounded-md transition font-medium ${
                  isLoading || selectedSeats.length === 0
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Booking...
                  </div>
                ) : `Book ${selectedSeats.length > 0 ? selectedSeats.length : ''} Seat(s)`}
              </button>

              {bookingStatus && (
                <div className={`p-3 rounded-md text-center text-sm ${isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                  {bookingStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualSeatBookingBus;