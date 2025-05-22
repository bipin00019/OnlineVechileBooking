

// import React, { useState, useEffect } from 'react';
// import BusLayout from '../../AvailableVehicles/Layouts/Buslayout';
// import { 
//   manualBookSeat, 
//   fetchDriverSeatStats, 
//   fetchBookedSeatNumbers, 
//   checkScheduleExists, 
//   checkAllSeatsAvailable,
//   manualReserveAllSeats
// } from '../../../services/DriverDashboardService';

// const ManualSeatBookingBus = () => {
//   const [passengerName, setPassengerName] = useState("");
//   const [passengerContact, setPassengerContact] = useState("");
//   const [bookingStatus, setBookingStatus] = useState(null);
//   const [isError, setIsError] = useState(false);
//   const [bookedSeats, setBookedSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isReserveLoading, setIsReserveLoading] = useState(false);
//   const [totalSeats, setTotalSeats] = useState(0);
//   const [vehicleData, setVehicleData] = useState(null);
//   const [isDataLoading, setIsDataLoading] = useState(true);
//   const [hasSchedule, setHasSchedule] = useState(null);
//   const [allSeatsAvailable, setAllSeatsAvailable] = useState(false);

//   // Function to check if all seats are available based on booked seats
//   const checkAndUpdateAllSeatsAvailable = () => {
//     // Consider all seats available if no seats are booked
//     const areAllSeatsAvailable = bookedSeats.length === 0;
//     setAllSeatsAvailable(areAllSeatsAvailable);
//     return areAllSeatsAvailable;
//   };

//   // Function to refresh booking data
//   const refreshBookingData = async () => {
//     try {
//       // Fetch booked seat numbers
//       const bookedSeatsResponse = await fetchBookedSeatNumbers();
//       if (bookedSeatsResponse && Array.isArray(bookedSeatsResponse)) {
//         const seatNumbers = bookedSeatsResponse.map(booking => booking.seatNumber);
//         setBookedSeats(seatNumbers);
        
//         // After updating booked seats, check availability
//         checkAndUpdateAllSeatsAvailable();
//       }
//     } catch (error) {
//       console.error("Error refreshing booking data:", error);
//     }
//   };

//   // Fetch schedule status and other data on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsDataLoading(true);
//       try {
//         // First check if schedule exists
//         const scheduleExists = await checkScheduleExists();
//         setHasSchedule(scheduleExists);
        
//         // Only fetch other data if schedule exists
//         if (scheduleExists) {
//           // Fetch booked seat numbers
//           const bookedSeatsResponse = await fetchBookedSeatNumbers();
//           if (bookedSeatsResponse && Array.isArray(bookedSeatsResponse)) {
//             const seatNumbers = bookedSeatsResponse.map(booking => booking.seatNumber);
//             setBookedSeats(seatNumbers);
//           }

//           // Fetch total seats from stats
//           const seatStatsResponse = await fetchDriverSeatStats();
//           if (seatStatsResponse && Array.isArray(seatStatsResponse) && seatStatsResponse.length > 0) {
//             const vehicleInfo = seatStatsResponse[0];
//             setTotalSeats(vehicleInfo.totalSeats);
//             setVehicleData(vehicleInfo);
//           }

//           // Check availability based on booked seats
//           checkAndUpdateAllSeatsAvailable();
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

//   const validateReservationForm = () => {
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
//       // Book multiple seats by creating a single booking request object
//       // We'll reuse this same object for each seat booking
//       const baseBookingData = {
//         passengerName,
//         passengerContact,
//         pickupPoint: vehicleData?.pickupPoint || "",
//         dropOffPoint: vehicleData?.dropOffPoint || ""
//       };
      
//       let successCount = 0;
//       let errorMessages = [];
      
//       // Process each seat booking sequentially (not in parallel)
//       // This ensures that seats are booked in order and prevents race conditions
//       for (const seatNumber of selectedSeats) {
//         try {
//           // Create booking data for this specific seat
//           const seatBookingData = {
//             ...baseBookingData,
//             seatNumber // Add the seat number for this specific booking
//           };
          
//           // Make API call for this specific seat
//           const result = await manualBookSeat(seatBookingData);
          
//           if (result && result.success) {
//             successCount++;
//           } else {
//             const errorMessage = result?.message || `Failed to book seat ${seatNumber}`;
//             errorMessages.push(`Seat ${seatNumber}: ${errorMessage}`);
//           }
//         } catch (seatError) {
//           errorMessages.push(`Seat ${seatNumber}: ${seatError.message || "Unknown error"}`);
//         }
//       }
      
//       // All seats processed - show appropriate message
//       if (successCount === selectedSeats.length) {
//         // All seats were booked successfully
//         setBookingStatus(`Successfully booked ${successCount} seat(s)`);
//         setIsError(false);
        
//         // Show success message briefly before refreshing the page
//         setTimeout(() => {
//           window.location.reload(); // Refresh the entire page
//         }, 1000);
//       } else if (successCount > 0) {
//         // Some seats were booked, but not all
//         setBookingStatus(`Partially successful: Booked ${successCount} out of ${selectedSeats.length} seats. Errors: ${errorMessages.join('; ')}`);
//         setIsError(true);
        
//         // Refresh the page after a delay to show which seats were actually booked
//         setTimeout(() => {
//           window.location.reload();
//         }, 3000);
//       } else {
//         // No seats were booked
//         setBookingStatus(`Failed to book any seats: ${errorMessages.join('; ')}`);
//         setIsError(true);
//       }
//     } catch (error) {
//       console.error("Booking error:", error);
//       const errorMessage = error?.response?.data?.errors ? 
//         Object.entries(error.response.data.errors)
//           .map(([key, value]) => `${key}: ${value.join(', ')}`)
//           .join('; ') : 
//         "An error occurred while booking";
      
//       setBookingStatus(`Error: ${errorMessage}. Please try again.`);
//       setIsError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReserveAllSeats = async () => {
//     setIsError(false);
    
//     if (!validateReservationForm()) {
//       return;
//     }
    
//     setIsReserveLoading(true);
    
//     try {
//       // Ensure we're passing all required fields
//       // Make sure to pass strings, not undefined or null values
//       const result = await manualReserveAllSeats({
//         passengerName: passengerName.trim(),
//         passengerContact: passengerContact.trim(),
//         pickupPoint: vehicleData?.pickupPoint || "",
//         dropOffPoint: vehicleData?.dropOffPoint || ""
//       });
      
//       if (result && result.success) {
//         setBookingStatus(`Successfully reserved all seats`);
//         setIsError(false);
        
//         // Show success message briefly before refreshing the page
//         setTimeout(() => {
//           window.location.reload(); // Refresh the entire page
//         }, 1000);
//       } else {
//         const errorMessage = result?.message || "Unknown error";
//         setBookingStatus(`Failed to reserve all seats: ${errorMessage}`);
//         setIsError(true);
//       }
//     } catch (error) {
//       console.error("Reserve all seats error:", error);
//       const errorMessage = error?.response?.data?.errors ? 
//         Object.entries(error.response.data.errors)
//           .map(([key, value]) => `${key}: ${value.join(', ')}`)
//           .join('; ') : 
//         "An error occurred while reserving seats";
      
//       setBookingStatus(`Error: ${errorMessage}. Please try again.`);
//       setIsError(true);
//     } finally {
//       setIsReserveLoading(false);
//     }
//   };

//   // Calculate whether "Reserve All" should be enabled
//   // It should be enabled when there are no booked seats yet
//   const isReserveAllEnabled = bookedSeats.length === 0;

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

//   // Show message when no schedule exists
//   if (hasSchedule === false) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center bg-yellow-50 p-8 rounded-lg shadow-md max-w-md">
//           <div className="text-yellow-600 text-5xl mb-4">
//             <i className="fas fa-exclamation-triangle"></i>
//           </div>
//           <h2 className="text-xl font-semibold mb-2 text-yellow-700">No Active Schedule</h2>
//           <p className="text-gray-600 mb-4">
//             You don't have any active schedule. Manual booking is only available when a schedule exists.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row md:space-x-4 px-4 md:px-6 py-6 max-w-6xl mx-auto">
//       {/* Left Column - Bus Layout */}
//       <div className="flex-1 mb-6 md:mb-0">
//         <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
//           <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Select Seats</h2>
          
//           {/* Seats status */}
//           <div className="flex justify-around bg-gray-50 p-3 rounded-lg shadow-sm mb-4">
//             <div className="text-center">
//               <div className="text-lg font-semibold">{totalSeats}</div>
//               <div className="text-xs text-gray-600">Total</div>
//             </div>
//             <div className="text-center">
//               <div className="text-lg font-semibold">{bookedSeats.length}</div>
//               <div className="text-xs text-gray-600">Booked</div>
//             </div>
//             <div className="text-center">
//               <div className="text-lg font-semibold">{totalSeats - bookedSeats.length}</div>
//               <div className="text-xs text-gray-600">Available</div>
//             </div>
//           </div>

//           {/* Bus layout */}
//           <div className="w-600 mx-auto bus-layout border rounded-lg shadow-inner p-4 bg-gray-50 flex items-center justify-center">
//             <BusLayout 
//               totalSeats={totalSeats}
//               selectedSeats={selectedSeats}
//               bookedSeats={bookedSeats}
//               handleSeatSelection={handleSeatSelection}
//             />
//           </div>
          
//           <div className="mt-3 p-2 text-sm bg-blue-50 rounded-lg">
//             <span className="font-medium">Selected Seats: </span>
//             {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
//           </div>
//         </div>
//       </div>

//       {/* Right Column - Vehicle Info and Booking Form */}
//       <div className="flex-1 md:max-w-md">
//         <div className="flex flex-col space-y-4">
//           {/* Vehicle Information */}
//           {vehicleData && (
//             <div className="bg-white rounded-lg shadow-md p-4">
//               <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Vehicle Details</h2>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h3 className="font-semibold text-lg mb-2 text-blue-800">{vehicleData.vehicleType} ({vehicleData.vehicleNumber})</h3>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div className="col-span-2 p-2 bg-white rounded">
//                     <span className="font-medium">Route: </span> 
//                     <span className="text-blue-700">{vehicleData.location} to {vehicleData.destination}</span>
//                   </div>
//                   <div className="p-2 bg-white rounded">
//                     <span className="font-medium">Date: </span> 
//                     <span>{new Date(vehicleData.departureDate).toLocaleDateString()}</span>
//                   </div>
//                   <div className="p-2 bg-white rounded">
//                     <span className="font-medium">Time: </span> 
//                     <span>{vehicleData.departureTime}</span>
//                   </div>
//                   <div className="col-span-2 p-2 bg-white rounded">
//                     <span className="font-medium">Fare: </span> 
//                     <span className="text-green-700 font-semibold">Rs. {vehicleData.fare}</span>
//                   </div>
//                   <div className="col-span-2 p-2 bg-white rounded">
//                     <span className="font-medium">Pickup: </span> 
//                     <span>{vehicleData.pickupPoint || 'Not specified'}</span>
//                   </div>
//                   <div className="col-span-2 p-2 bg-white rounded">
//                     <span className="font-medium">Drop-off: </span> 
//                     <span>{vehicleData.dropOffPoint || 'Not specified'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Booking form */}
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Passenger Details</h2>
//             <div className="space-y-3">
//               <div>
//                 <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-1">
//                   Passenger Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="passengerName"
//                   type="text"
//                   placeholder="Enter passenger name"
//                   value={passengerName}
//                   onChange={(e) => setPassengerName(e.target.value)}
//                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="passengerContact" className="block text-sm font-medium text-gray-700 mb-1">
//                   Passenger Contact <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="passengerContact"
//                   type="text"
//                   placeholder="Enter passenger contact"
//                   value={passengerContact}
//                   onChange={(e) => setPassengerContact(e.target.value)}
//                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
//                 {/* Book Selected Seats Button */}
//                 <button
//                   onClick={handleBooking}
//                   disabled={isLoading || selectedSeats.length === 0}
//                   className={`sm:flex-1 py-3 px-4 rounded-md transition font-medium ${
//                     isLoading || selectedSeats.length === 0
//                       ? "bg-blue-400 cursor-not-allowed" 
//                       : "bg-blue-600 hover:bg-blue-700"
//                   } text-white`}
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
//                       Booking...
//                     </div>
//                   ) : `Book ${selectedSeats.length > 0 ? selectedSeats.length : ''} Seat(s)`}
//                 </button>
                
//                 {/* Reserve All Seats Button */}
//                 <button
//                   onClick={handleReserveAllSeats}
//                   disabled={isReserveLoading || !isReserveAllEnabled}
//                   className={`sm:flex-1 py-3 px-4 rounded-md transition font-medium ${
//                     isReserveLoading || !isReserveAllEnabled
//                       ? "bg-green-400 cursor-not-allowed" 
//                       : "bg-green-600 hover:bg-green-700"
//                   } text-white`}
//                   title={!isReserveAllEnabled ? "Some seats are already booked" : "Reserve all seats for one passenger"}
//                 >
//                   {isReserveLoading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
//                       Reserving...
//                     </div>
//                   ) : "Reserve All Seats"}
//                 </button>
//               </div>

//               {/* Reservation status info */}
//               {!isReserveAllEnabled && (
//                 <div className="text-xs text-center text-amber-600 bg-amber-50 p-2 rounded">
//                   Reserve All Seats option is disabled because some seats are already booked.
//                 </div>
//               )}

//               {bookingStatus && (
//                 <div className={`p-3 rounded-md text-center text-sm ${isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
//                   {bookingStatus}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManualSeatBookingBus;

import React, { useState, useEffect } from 'react';
import BusLayout from '../../AvailableVehicles/Layouts/Buslayout';
import { 
  manualBookSeat, 
  fetchDriverSeatStats, 
  fetchBookedSeatNumbers, 
  checkScheduleExists, 
  checkAllSeatsAvailable,
  manualReserveAllSeats
} from '../../../services/DriverDashboardService';

const ManualSeatBookingBus = () => {
  const [passengerName, setPassengerName] = useState("");
  const [passengerContact, setPassengerContact] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isError, setIsError] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReserveLoading, setIsReserveLoading] = useState(false);
  const [totalSeats, setTotalSeats] = useState(0);
  const [vehicleData, setVehicleData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [hasSchedule, setHasSchedule] = useState(null);
  const [allSeatsAvailable, setAllSeatsAvailable] = useState(false);

  // Function to check if all seats are available based on booked seats
  const checkAndUpdateAllSeatsAvailable = () => {
    // Consider all seats available if no seats are booked
    const areAllSeatsAvailable = bookedSeats.length === 0;
    setAllSeatsAvailable(areAllSeatsAvailable);
    return areAllSeatsAvailable;
  };

  // Function to refresh booking data
  const refreshBookingData = async () => {
    try {
      // Fetch booked seat numbers
      const bookedSeatsResponse = await fetchBookedSeatNumbers();
      if (bookedSeatsResponse && Array.isArray(bookedSeatsResponse)) {
        const seatNumbers = bookedSeatsResponse.map(booking => booking.seatNumber);
        setBookedSeats(seatNumbers);
        
        // After updating booked seats, check availability
        checkAndUpdateAllSeatsAvailable();
      }
    } catch (error) {
      console.error("Error refreshing booking data:", error);
    }
  };

  // Fetch schedule status and other data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsDataLoading(true);
      try {
        // First check if schedule exists
        const scheduleExists = await checkScheduleExists();
        setHasSchedule(scheduleExists);
        
        // Only fetch other data if schedule exists
        if (scheduleExists) {
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

          // Check availability based on booked seats
          checkAndUpdateAllSeatsAvailable();
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

  // Handle passenger name input with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    
    // Clear previous error
    setNameError("");
    
    // Prevent spaces at the beginning
    if (value.startsWith(" ")) {
      setNameError("Name should not contain spaces at the beginning");
      return;
    }
    
    // Update the state with the new value
    setPassengerName(value);
  };

  // Handle passenger contact input with validation
  const handleContactChange = (e) => {
    const value = e.target.value;
    
    // Only allow numeric input with no spaces
    if (value === "" || (/^\d+$/.test(value) && !value.includes(" "))) {
      setPassengerContact(value);
      
      // Clear previous error
      setContactError("");
      
      // Validate for exactly 10 digits
      if (value !== "" && value.length !== 10) {
        setContactError("Contact number must be exactly 10 digits");
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError("");
    setContactError("");
    setIsError(false);
    setBookingStatus(null);
    
    if (!selectedSeats.length) {
      setBookingStatus("Please select at least one seat");
      setIsError(true);
      isValid = false;
    }
    
    // Validate name (required and no leading spaces)
    const trimmedName = passengerName.trim();
    if (!trimmedName) {
      setNameError("Passenger name is required");
      isValid = false;
    } else if (passengerName !== trimmedName) {
      setNameError("Name should not have leading or trailing spaces");
      isValid = false;
    }
    
    // Validate contact (required and exactly 10 digits)
    if (!passengerContact) {
      setContactError("Passenger contact is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(passengerContact)) {
      setContactError("Contact number must be exactly 10 digits");
      isValid = false;
    }
    
    return isValid;
  };

  const validateReservationForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError("");
    setContactError("");
    setIsError(false);
    setBookingStatus(null);
    
    // Validate name (required and no leading spaces)
    const trimmedName = passengerName.trim();
    if (!trimmedName) {
      setNameError("Passenger name is required");
      isValid = false;
    } else if (passengerName !== trimmedName) {
      setNameError("Name should not have leading or trailing spaces");
      isValid = false;
    }
    
    // Validate contact (required and exactly 10 digits)
    if (!passengerContact) {
      setContactError("Passenger contact is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(passengerContact)) {
      setContactError("Contact number must be exactly 10 digits");
      isValid = false;
    }
    
    return isValid;
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
      // Book multiple seats by creating a single booking request object
      // We'll reuse this same object for each seat booking
      const baseBookingData = {
        passengerName: passengerName.trim(),
        passengerContact,
        pickupPoint: vehicleData?.pickupPoint || "",
        dropOffPoint: vehicleData?.dropOffPoint || ""
      };
      
      let successCount = 0;
      let errorMessages = [];
      
      // Process each seat booking sequentially (not in parallel)
      // This ensures that seats are booked in order and prevents race conditions
      for (const seatNumber of selectedSeats) {
        try {
          // Create booking data for this specific seat
          const seatBookingData = {
            ...baseBookingData,
            seatNumber // Add the seat number for this specific booking
          };
          
          // Make API call for this specific seat
          const result = await manualBookSeat(seatBookingData);
          
          if (result && result.success) {
            successCount++;
          } else {
            const errorMessage = result?.message || `Failed to book seat ${seatNumber}`;
            errorMessages.push(`Seat ${seatNumber}: ${errorMessage}`);
          }
        } catch (seatError) {
          errorMessages.push(`Seat ${seatNumber}: ${seatError.message || "Unknown error"}`);
        }
      }
      
      // All seats processed - show appropriate message
      if (successCount === selectedSeats.length) {
        // All seats were booked successfully
        setBookingStatus(`Successfully booked ${successCount} seat(s)`);
        setIsError(false);
        
        // Show success message briefly before refreshing the page
        setTimeout(() => {
          window.location.reload(); // Refresh the entire page
        }, 1000);
      } else if (successCount > 0) {
        // Some seats were booked, but not all
        setBookingStatus(`Partially successful: Booked ${successCount} out of ${selectedSeats.length} seats. Errors: ${errorMessages.join('; ')}`);
        setIsError(true);
        
        // Refresh the page after a delay to show which seats were actually booked
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        // No seats were booked
        setBookingStatus(`Failed to book any seats: ${errorMessages.join('; ')}`);
        setIsError(true);
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage = error?.response?.data?.errors ? 
        Object.entries(error.response.data.errors)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('; ') : 
        "An error occurred while booking";
      
      setBookingStatus(`Error: ${errorMessage}. Please try again.`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserveAllSeats = async () => {
    setIsError(false);
    
    if (!validateReservationForm()) {
      return;
    }
    
    setIsReserveLoading(true);
    
    try {
      // Ensure we're passing all required fields
      // Make sure to pass strings, not undefined or null values
      const result = await manualReserveAllSeats({
        passengerName: passengerName.trim(),
        passengerContact,
        pickupPoint: vehicleData?.pickupPoint || "",
        dropOffPoint: vehicleData?.dropOffPoint || ""
      });
      
      if (result && result.success) {
        setBookingStatus(`Successfully reserved all seats`);
        setIsError(false);
        
        // Show success message briefly before refreshing the page
        setTimeout(() => {
          window.location.reload(); // Refresh the entire page
        }, 1000);
      } else {
        const errorMessage = result?.message || "Unknown error";
        setBookingStatus(`Failed to reserve all seats: ${errorMessage}`);
        setIsError(true);
      }
    } catch (error) {
      console.error("Reserve all seats error:", error);
      const errorMessage = error?.response?.data?.errors ? 
        Object.entries(error.response.data.errors)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('; ') : 
        "An error occurred while reserving seats";
      
      setBookingStatus(`Error: ${errorMessage}. Please try again.`);
      setIsError(true);
    } finally {
      setIsReserveLoading(false);
    }
  };

  // Calculate whether "Reserve All" should be enabled
  // It should be enabled when there are no booked seats yet
  const isReserveAllEnabled = bookedSeats.length === 0;

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

  // Show message when no schedule exists
  if (hasSchedule === false) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center bg-yellow-50 p-8 rounded-lg shadow-md max-w-md">
          <div className="text-yellow-600 text-5xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-yellow-700">No Active Schedule</h2>
          <p className="text-gray-600 mb-4">
            You don't have any active schedule. Manual booking is only available when a schedule exists.
          </p>
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

          {/* Bus layout */}
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
                    <span>{vehicleData.pickupPoint || 'Not specified'}</span>
                  </div>
                  <div className="col-span-2 p-2 bg-white rounded">
                    <span className="font-medium">Drop-off: </span> 
                    <span>{vehicleData.dropOffPoint || 'Not specified'}</span>
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
                  onChange={handleNameChange}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    nameError ? "border-red-500" : ""
                  }`}
                  required
                  onKeyDown={(e) => {
                    // Prevent space key at the beginning of input
                    if (e.key === " " && e.target.selectionStart === 0) {
                      e.preventDefault();
                    }
                  }}
                />
                {nameError && (
                  <p className="mt-1 text-sm text-red-600">{nameError}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="passengerContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Contact <span className="text-red-500">*</span>
                </label>
                <input
                  id="passengerContact"
                  type="text"
                  placeholder="Enter 10-digit contact number"
                  value={passengerContact}
                  onChange={handleContactChange}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    contactError ? "border-red-500" : ""
                  }`}
                  required
                  maxLength={10}
                  onKeyDown={(e) => {
                    // Prevent space key from being entered
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                />
                {contactError && (
                  <p className="mt-1 text-sm text-red-600">{contactError}</p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                {/* Book Selected Seats Button */}
                <button
                  onClick={handleBooking}
                  disabled={isLoading || selectedSeats.length === 0}
                  className={`sm:flex-1 py-3 px-4 rounded-md transition font-medium ${
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
                
                {/* Reserve All Seats Button */}
                <button
                  onClick={handleReserveAllSeats}
                  disabled={isReserveLoading || !isReserveAllEnabled}
                  className={`sm:flex-1 py-3 px-4 rounded-md transition font-medium ${
                    isReserveLoading || !isReserveAllEnabled
                      ? "bg-green-400 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                  title={!isReserveAllEnabled ? "Some seats are already booked" : "Reserve all seats for one passenger"}
                >
                  {isReserveLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Reserving...
                    </div>
                  ) : "Reserve All Seats"}
                </button>
              </div>

              {/* Reservation status info */}
              {!isReserveAllEnabled && (
                <div className="text-xs text-center text-amber-600 bg-amber-50 p-2 rounded">
                  Reserve All Seats option is disabled because some seats are already booked.
                </div>
              )}

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