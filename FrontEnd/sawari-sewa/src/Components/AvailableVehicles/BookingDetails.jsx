import { useState } from "react";
import { bookSeat } from "../../services/vehicleService";

const BookingDetails = ({ 
  selectedSeats = [], 
  totalFare, 
  pickupPoint, 
  fare, 
  showLoginMessage,
  onContinue,
  onLogin,
  vehicleAvailabilityId
}) => {
  const [bookingStatus, setBookingStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");


  const handleBooking = async() => {
    if (!token) {
      // Show login message if token doesn't exist
      setShowLoginMessage(true);
    }
    if (!vehicleAvailabilityId || selectedSeats.length ===0) {
      setErrorMessage("Please select a seat before booking");
      return;
    }
    try {
      for (const seat of selectedSeats){
        await bookSeat(vehicleAvailabilityId, seat);
      }
      setBookingStatus("Booking successful! 🎉");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Booking failed. " + (error.response?.data || error.message));

    }
  };
  return (
    <div className="bg-white p-4 rounded border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Boarding Point : {pickupPoint}
        </label>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          VehicleAvailabilty number : {vehicleAvailabilityId}
        </label>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          selected seats : {selectedSeats.join(", ")}
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Seat(s) :
        </label>
        <div className="text-gray-800">
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Fare :
        </label>
        <div className="text-gray-800">
          Rs. {fare} x {selectedSeats.length} = Rs. {fare * selectedSeats.length}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Total Amount :
        </label>
        <div className="text-gray-800 font-bold">
          Rs. {totalFare}
        </div>
      </div>
      
      {/* Login Message Box */}
      {showLoginMessage && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-yellow-800">You need to login to continue</p>
              <button 
                onClick={onLogin}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Go to login page
              </button>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {bookingStatus && <p className="text-green-500">{bookingStatus}</p>}
      <button
        onClick={handleBooking}
        className={`w-full py-3 rounded font-medium ${
          selectedSeats.length > 0 
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!(selectedSeats.length > 0)}
      >
        Book seat
      </button>
    </div>
  );
};

export default BookingDetails;


// import { useState } from "react";
// import { bookSeat } from "../../services/vehicleService";

// const BookingDetails = ({ 
//   selectedSeats = [], 
//   totalFare, 
//   pickupPoint, 
//   fare, 
//   showLoginMessage,
//   onLogin,
//   vehicleAvailabilityId
// }) => {
//   const [bookingStatus, setBookingStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleBooking = async () => {
//     if (!vehicleAvailabilityId || selectedSeats.length === 0) {
//       setErrorMessage("Please select a seat before booking.");
//       return;
//     }

//     try {
//       for (const seat of selectedSeats) {
//         await bookSeat(vehicleAvailabilityId, seat);
//       }
//       setBookingStatus("Booking successful! 🎉");
//       setErrorMessage("");
//     } catch (error) {
//       setErrorMessage("Booking failed. " + (error.response?.data || error.message));
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded border border-gray-200">
//       <h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>
      
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Boarding Point : {pickupPoint}
//         </label>
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Vehicle Availability ID : {vehicleAvailabilityId}
//         </label>
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Selected Seats : {selectedSeats.join(", ")}
//         </label>
//       </div>
      
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Fare :
//         </label>
//         <div className="text-gray-800">
//           Rs. {fare} x {selectedSeats.length} = Rs. {fare * selectedSeats.length}
//         </div>
//       </div>
      
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Total Amount :
//         </label>
//         <div className="text-gray-800 font-bold">
//           Rs. {totalFare}
//         </div>
//       </div>
      
//       {/* Login Message Box */}
//       {showLoginMessage && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
//           <div className="flex items-start">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//             <div>
//               <p className="font-medium text-yellow-800">You need to login to continue</p>
//               <button 
//                 onClick={onLogin}
//                 className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Go to login page
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//       {bookingStatus && <p className="text-green-500">{bookingStatus}</p>}

//       <button
//         onClick={handleBooking}
//         className={`w-full py-3 rounded font-medium ${
//           selectedSeats.length > 0 
//             ? "bg-green-500 text-white hover:bg-green-600"
//             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//         }`}
//         disabled={selectedSeats.length === 0}
//       >
//         Book Seat
//       </button>
//     </div>
//   );
// };

// export default BookingDetails;
