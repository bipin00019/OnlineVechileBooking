
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { bookSeat } from "../../services/vehicleService";
// import { useNavigate } from "react-router-dom";
// import { CheckCircleIcon, XCircleIcon, HomeIcon } from "lucide-react";

// const VerifyPayment = () => {
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [bookingStatus, setBookingStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const pidx = urlParams.get("pidx");
//     const amount = parseFloat(urlParams.get("amount"));

//     // Fetch the stored values from localStorage
//     const vehicleAvailabilityId = localStorage.getItem("vehicleAvailabilityId");

//     const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
//     console.log("Selected Seats:", selectedSeats);
//     // Clear localStorage immediately to prevent duplicate processing
//     // localStorage.removeItem("vehicleAvailabilityId");
//     // localStorage.removeItem("selectedSeats");
//     if (!pidx || isNaN(amount)) {
//       setErrorMessage("Invalid payment details.");
//       setIsLoading(false);
//       return;
//     }

//     if (vehicleAvailabilityId && selectedSeats.length > 0) {
//       // Send the payment verification and seat booking request to the backend
//       axios
//         .post("https://localhost:7291/api/payment/verify-payment", {
//           pidx, // Send as JSON body
//           amount,
//         })
//         .then(async (response) => {
//           setPaymentStatus("Payment successful, your seat is booked!");

//           try {
//             // Book each seat asynchronously
//             for (const seat of selectedSeats) {
//               await bookSeat(vehicleAvailabilityId, seat);
//             }

//             // After booking, clear the stored values from localStorage
//             localStorage.removeItem("vehicleAvailabilityId");
//             localStorage.removeItem("selectedSeats");

//             setBookingStatus("Booking successful🎉! Check email address for booking confirmation.");
//             setErrorMessage(""); // Clear error message if booking is successful
//           } catch (error) {
//             setErrorMessage("Booking failed. " + (error.response?.data || error.message));
//           }
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           setErrorMessage(error.response?.data?.message || "Payment verification failed.");
//           setIsLoading(false);
//         });
//     } else {
//       setErrorMessage("No seat or vehicle availability found.");
//       setIsLoading(false);
//     }
//   }, []);

//   const handleGoHome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
//         {isLoading ? (
//           <div className="animate-pulse">
//             <div className="h-12 bg-gray-300 rounded mb-4"></div>
//             <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
//           </div>
//         ) : (
//           <>
//             {errorMessage ? (
//               <div className="text-red-600 mb-6">
//                 <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
//                 <p className="text-lg font-semibold">{errorMessage}</p>
//               </div>
//             ) : (
//               <div className="text-green-600 mb-6">
//                 <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
//                 <p className="text-xl font-bold mb-2">{paymentStatus}</p>
//                 <p className="text-lg">{bookingStatus}</p>
                
//               </div>
//             )}

//             <button 
//               onClick={handleGoHome}
//               className="mt-6 w-full flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
//             >
//               <HomeIcon className="mr-2 h-5 w-5" />
//               Go to Home
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyPayment;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { bookSeat } from "../../services/vehicleService";
// import { useNavigate } from "react-router-dom";
// import { CheckCircleIcon, XCircleIcon, HomeIcon } from "lucide-react";

// const VerifyPayment = () => {
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [bookingStatus, setBookingStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if this payment was already processed
//     const urlParams = new URLSearchParams(window.location.search);
//     const pidx = urlParams.get("pidx");
    
//     // Use sessionStorage to track processed payments
//     const processedPayments = sessionStorage.getItem("processedPayments");
//     const processedPaymentsArray = processedPayments ? JSON.parse(processedPayments) : [];
    
//     // If this payment was already processed, don't process again
//     if (pidx && processedPaymentsArray.includes(pidx)) {
//       setPaymentStatus("Payment already processed");
//       setBookingStatus("Your booking is confirmed");
//       setIsLoading(false);
//       return;
//     }
    
//     const amount = parseFloat(urlParams.get("amount"));
    
//     // Get data from localStorage
//     const vehicleAvailabilityId = localStorage.getItem("vehicleAvailabilityId");
//     const selectedSeatsJSON = localStorage.getItem("selectedSeats");
//     const selectedSeats = selectedSeatsJSON ? JSON.parse(selectedSeatsJSON) : [];
    
//     if (!pidx || isNaN(amount)) {
//       setErrorMessage("Invalid payment details.");
//       setIsLoading(false);
//       return;
//     }

//     if (!vehicleAvailabilityId || selectedSeats.length === 0) {
//       setErrorMessage("No seat or vehicle availability found.");
//       setIsLoading(false);
//       return;
//     }

//     // Save this payment as processed before making API call
//     if (pidx) {
//       processedPaymentsArray.push(pidx);
//       sessionStorage.setItem("processedPayments", JSON.stringify(processedPaymentsArray));
//     }

//     // Process the payment verification
//     axios
//       .post("https://localhost:7291/api/payment/verify-payment", {
//         pidx,
//         amount,
//       })
//       .then(async (response) => {
//         setPaymentStatus("Payment successful, your seat is being booked...");

//         try {
//           // Book seats one by one
//           const bookingPromises = selectedSeats.map(seat => 
//             bookSeat(vehicleAvailabilityId, seat)
//               .catch(error => {
//                 console.log(`Error booking seat ${seat}: ${error.message}`);
//                 return null; // Return null for failed bookings
//               })
//           );
          
//           const results = await Promise.all(bookingPromises);
//           const successfulBookings = results.filter(result => result !== null);
          
//           // Clear localStorage ONLY after attempting all bookings
//           localStorage.removeItem("vehicleAvailabilityId");
//           localStorage.removeItem("selectedSeats");

//           if (successfulBookings.length === selectedSeats.length) {
//             setBookingStatus("Booking successful🎉! Check email address for booking confirmation.");
//           } else if (successfulBookings.length > 0) {
//             setBookingStatus(`Partially successful booking. ${successfulBookings.length} of ${selectedSeats.length} seats booked.`);
//           } else {
//             setErrorMessage("Booking failed. Seats may already be booked.");
//           }
//         } catch (error) {
//           setErrorMessage("Booking failed. " + (error.response?.data || error.message));
//         }
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         // Even if payment verification fails, mark it as processed
//         setErrorMessage(error.response?.data?.message || "Payment verification failed.");
//         setIsLoading(false);
//       });
//   }, []);

//   const handleGoHome = () => {
//     // Clear any remaining payment data
//     localStorage.removeItem("vehicleAvailabilityId");
//     localStorage.removeItem("selectedSeats");
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
//         {isLoading ? (
//           <div className="animate-pulse">
//             <div className="h-12 bg-gray-300 rounded mb-4"></div>
//             <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
//           </div>
//         ) : (
//           <>
//             {errorMessage ? (
//               <div className="text-red-600 mb-6">
//                 <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
//                 <p className="text-lg font-semibold">{errorMessage}</p>
//               </div>
//             ) : (
//               <div className="text-green-600 mb-6">
//                 <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
//                 <p className="text-xl font-bold mb-2">{paymentStatus}</p>
//                 <p className="text-lg">{bookingStatus}</p>
//               </div>
//             )}

//             <button 
//               onClick={handleGoHome}
//               className="mt-6 w-full flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
//             >
//               <HomeIcon className="mr-2 h-5 w-5" />
//               Go to Home
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyPayment;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { bookSeat } from "../../services/vehicleService";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, HomeIcon } from "lucide-react";

const VerifyPayment = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this payment was already processed
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get("pidx");
    
    // Use sessionStorage to track processed payments
    const processedPayments = sessionStorage.getItem("processedPayments");
    const processedPaymentsArray = processedPayments ? JSON.parse(processedPayments) : [];
    
    // If this payment was already processed, don't process again
    if (pidx && processedPaymentsArray.includes(pidx)) {
      setPaymentStatus("Payment already processed");
      setBookingStatus("Your booking is confirmed");
      setIsLoading(false);
      return;
    }
    
    const amount = parseFloat(urlParams.get("amount"));
    
    // Get data from localStorage
    const vehicleAvailabilityId = localStorage.getItem("vehicleAvailabilityId");
    const selectedSeatsJSON = localStorage.getItem("selectedSeats");
    const selectedSeats = selectedSeatsJSON ? JSON.parse(selectedSeatsJSON) : [];
    
    if (!pidx || isNaN(amount)) {
      setErrorMessage("Invalid payment details.");
      setIsLoading(false);
      return;
    }

    if (!vehicleAvailabilityId || selectedSeats.length === 0) {
      setErrorMessage("No seat or vehicle availability found.");
      setIsLoading(false);
      return;
    }

    // Save this payment as processed before making API call
    if (pidx) {
      processedPaymentsArray.push(pidx);
      sessionStorage.setItem("processedPayments", JSON.stringify(processedPaymentsArray));
    }

    const processPaymentAndBookSeats = async () => {
      try {
        // First verify payment
        const paymentResponse = await axios.post("https://localhost:7291/api/payment/verify-payment", {
          pidx,
          amount,
        });
        
        setPaymentStatus("Payment successful, your seats are being booked...");
        
        // Book all seats with one request if your API supports it
        // If not, handle seat booking sequentially to ensure all seats are booked
        
        // Option 1: Sequential booking to ensure all are processed
        let successfulBookings = 0;
        let failedSeats = [];
        
        for (const seat of selectedSeats) {
          try {
            await bookSeat(vehicleAvailabilityId, seat);
            successfulBookings++;
          } catch (error) {
            console.log(`Error booking seat ${seat}: ${error.message}`);
            failedSeats.push(seat);
          }
        }
        
        // Clear localStorage after booking attempts
        localStorage.removeItem("vehicleAvailabilityId");
        localStorage.removeItem("selectedSeats");

        if (successfulBookings === selectedSeats.length) {
          setBookingStatus("Booking successful🎉! Check email address for booking confirmation.");
        } else if (successfulBookings > 0) {
          setBookingStatus(`Partially successful booking. ${successfulBookings} of ${selectedSeats.length} seats booked. Failed seats: ${failedSeats.join(', ')}`);
        } else {
          setErrorMessage("Booking failed. Seats may already be booked.");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Payment verification failed.");
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentAndBookSeats();
  }, [navigate]);

  const handleGoHome = () => {
    // Clear any remaining payment data
    localStorage.removeItem("vehicleAvailabilityId");
    localStorage.removeItem("selectedSeats");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        ) : (
          <>
            {errorMessage ? (
              <div className="text-red-600 mb-6">
                <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
                <p className="text-lg font-semibold">{errorMessage}</p>
              </div>
            ) : (
              <div className="text-green-600 mb-6">
                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <p className="text-xl font-bold mb-2">{paymentStatus}</p>
                <p className="text-lg">{bookingStatus}</p>
              </div>
            )}

            <button 
              onClick={handleGoHome}
              className="mt-6 w-full flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              <HomeIcon className="mr-2 h-5 w-5" />
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;