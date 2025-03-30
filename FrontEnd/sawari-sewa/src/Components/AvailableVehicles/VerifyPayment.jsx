// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { verifyPayment } from "../../services/paymentAndBooking";
// import { bookSeat } from "../../services/vehicleService";

// const VerifyPayment = () => {
//   const [message, setMessage] = useState("Verifying payment...");
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyAndBookSeat = async () => {
//       const pidx = searchParams.get("pidx");
//       const transactionId = searchParams.get("transaction_id");
//       const amount = searchParams.get("amount");
//       const status = searchParams.get("status");
//       const vehicleAvailabilityId = localStorage.getItem("vehicleAvailabilityId");
//       const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

//       if (!pidx || !status) {
//         setMessage("Invalid payment data received.");     
//         return;
//       }

//       if (status.toLowerCase() !== "completed") {
//         setMessage("Payment was not successful.");
//         return;
//       }

//       try {
//         // Step 1: Verify payment
//         const verifyResponse = await verifyPayment(pidx, amount);
//         if (!verifyResponse.success) {
//           setMessage("Payment verification failed.");
//           return;
//         }

//         // Step 2: Book seat after successful payment
//         const bookingResponse = await bookSeat({
//           vehicleAvailabilityId,
//           selectedSeats
//         });

//         if (bookingResponse.success) {
//           setMessage("Your seat has been successfully booked! ✅");
//         } else {
//           setMessage("Payment succeeded, but seat booking failed. ❌");
//         }

//         // Step 3: Clear local storage after booking
//         localStorage.removeItem("vehicleAvailabilityId");
//         localStorage.removeItem("selectedSeats");

//       } catch (error) {
//         setMessage("Error processing payment or booking. Please try again.");
//       }
//     };

//     verifyAndBookSeat();
//   }, [searchParams]);

//   return (
//     <div className="p-6 bg-white rounded shadow-md text-center">
//       <h2 className="text-lg font-semibold">{message}</h2>
//       <button
//         onClick={() => navigate("/")}
//         className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
//       >
//         Go to Home
//       </button>
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
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get("pidx");
    const amount = parseFloat(urlParams.get("amount"));

    // Fetch the stored values from localStorage
    const vehicleAvailabilityId = localStorage.getItem("vehicleAvailabilityId");

    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
    console.log("Selected Seats:", selectedSeats);
    if (!pidx || isNaN(amount)) {
      setErrorMessage("Invalid payment details.");
      setIsLoading(false);
      return;
    }

    if (vehicleAvailabilityId && selectedSeats.length > 0) {
      // Send the payment verification and seat booking request to the backend
      axios
        .post("https://localhost:7291/api/payment/verify-payment", {
          pidx, // Send as JSON body
          amount,
        })
        .then(async (response) => {
          setPaymentStatus("Payment successful, your seat is booked!");

          try {
            // Book each seat asynchronously
            for (const seat of selectedSeats) {
              await bookSeat(vehicleAvailabilityId, seat);
            }

            // After booking, clear the stored values from localStorage
            localStorage.removeItem("vehicleAvailabilityId");
            localStorage.removeItem("selectedSeats");

            setBookingStatus("Booking successful🎉! Check email address for booking confirmation.");
            setErrorMessage(""); // Clear error message if booking is successful
          } catch (error) {
            setErrorMessage("Booking failed. " + (error.response?.data || error.message));
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setErrorMessage(error.response?.data?.message || "Payment verification failed.");
          setIsLoading(false);
        });
    } else {
      setErrorMessage("No seat or vehicle availability found.");
      setIsLoading(false);
    }
  }, []);

  const handleGoHome = () => {
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