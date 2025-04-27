
  // import { useState,useEffect } from "react";
  // import { initiatePayment } from "../../services/paymentAndBooking";
  // import { fetchUserProfile } from "../../services/roleManagement";
  // const BookingDetails = ({ 
  //   selectedSeats = [], 
  //   totalFare, 
  //   pickupPoint, 
  //   fare, 
  //   showLoginMessage,
  //   onLogin,
  //   vehicleAvailabilityId
  // }) => {
  //   const [errorMessage, setErrorMessage] = useState("");
  //   const [bookingStatus, setBookingStatus] = useState("");
  //   const [user, setUser] = useState(null);

  //   // Function to store data in localStorage
  //   const storeInLocalStorage = (key, value) => {
  //     localStorage.setItem(key, value);
  //   };
    
  //   useEffect(() => {
  //       const loadUserProfile = async () => {
  //         const token = localStorage.getItem("token"); // Check if user is logged in
  //         if (!token) {
  //           setUser(null); // Ensure the user state is reset
  //           return;
  //         }
  //         try {
  //           const profile = await fetchUserProfile();
  //           //console.log("Fetched User Profile:", profile);
  //           setUser(profile.user);
            
    
      
    
  //         } catch (error) {
  //           console.error("Failed to fetch user profile", error);
  //         }
  //       };
  //       loadUserProfile();
  //     }, []);

  //   const handlePaymentAndBooking = async () => {
  //     try {
  //       // Step 1: Initiate payment
  //       const paymentResponse = await initiatePayment({
  //         amount: totalFare,
  //         orderId: `order_${Date.now()}`,
  //         orderName: "Seat Booking",
  //         customerName:`${user.firstName} ${user.lastName}`,
  //         customerEmail: user.email,
  //         customerPhone: user.phoneNumber
  //       });

  //       if (paymentResponse && paymentResponse.paymentUrl) {
  //         // Store the vehicleAvailabilityId as an integer and selectedSeats as an array
  //         storeInLocalStorage("vehicleAvailabilityId", vehicleAvailabilityId); // Store as integer
  //         storeInLocalStorage("selectedSeats", JSON.stringify(selectedSeats)); // Store selectedSeats as an array
  //         // Redirect to Khalti for payment
  //         window.location.href = paymentResponse.paymentUrl;
          
  //       } else {
  //         setErrorMessage("Payment initiation failed. Please try again.");
  //       }
  //     } catch (error) {
  //       setErrorMessage("An error occurred while processing payment.");
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
  //           Selected Seats : {selectedSeats.join(", ")}
  //         </label>
  //       </div>
        
  //       <div className="mb-4">
  //         <label className="block text-gray-700 text-sm font-medium mb-2">
  //           Total Amount :
  //         </label>
  //         <div className="text-gray-800 font-bold">
  //           Rs. {totalFare}
  //         </div>
  //       </div>
        
  //       {errorMessage && <p className="text-red-500">{errorMessage}</p>}
  //       {bookingStatus && <p className="text-green-500">{bookingStatus}</p>}
        
  //       <button
  //         onClick={handlePaymentAndBooking}
  //         className={`w-full py-3 rounded font-medium ${
  //           selectedSeats.length > 0 
  //             ? "bg-green-500 text-white hover:bg-green-600"
  //             : "bg-gray-300 text-gray-500 cursor-not-allowed"
  //         }`}
  //         disabled={!(selectedSeats.length > 0)}
  //       >
  //         Proceed to Payment
  //       </button>
  //     </div>
  //   );
  // };

  // export default BookingDetails;

  
  import { useState, useEffect } from "react";
import { initiatePayment } from "../../services/paymentAndBooking";
import { fetchUserProfile } from "../../services/roleManagement";

const BookingDetails = ({
  selectedSeats = [],
  totalFare,
  pickupPoint,
  fare,
  showLoginMessage,
  onLogin,
  vehicleAvailabilityId
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [user, setUser] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const profile = await fetchUserProfile();
        setUser(profile.user);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    loadUserProfile();
  }, []);

  const handlePaymentAndBooking = async () => {
    // Prevent double-clicks or multiple submissions
    if (isProcessingPayment) {
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      setErrorMessage("");
      
      // Validate required data
      if (!vehicleAvailabilityId || selectedSeats.length === 0) {
        setErrorMessage("Missing vehicle or seat information");
        setIsProcessingPayment(false);
        return;
      }
      
      // Step 1: Initiate payment
      const paymentResponse = await initiatePayment({
        amount: totalFare,
        orderId: `order_${Date.now()}`,
        orderName: "Seat Booking",
        customerName: user ? `${user.firstName} ${user.lastName}` : "Guest",
        customerEmail: user ? user.email : "",
        customerPhone: user ? user.phoneNumber : ""
      });
      
      if (paymentResponse && paymentResponse.paymentUrl) {
        // Clear existing stored data first
        localStorage.removeItem("vehicleAvailabilityId");
        localStorage.removeItem("selectedSeats");
        
        // Store the vehicleAvailabilityId and selectedSeats in localStorage
        localStorage.setItem("vehicleAvailabilityId", vehicleAvailabilityId);
        localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
        
        // Redirect to Khalti for payment
        window.location.href = paymentResponse.paymentUrl;
      } else {
        setErrorMessage("Payment initiation failed. Please try again.");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      setErrorMessage("An error occurred while processing payment.");
      setIsProcessingPayment(false);
      console.error(error);
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
          Selected Seats : {selectedSeats.join(", ")}
        </label>
      </div>
     
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Total Amount :
        </label>
        <div className="text-gray-800 font-bold">
          Rs. {totalFare}
        </div>
      </div>
     
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {bookingStatus && <p className="text-green-500">{bookingStatus}</p>}
     
      <button
        onClick={handlePaymentAndBooking}
        className={`w-full py-3 rounded font-medium ${
          selectedSeats.length > 0 && !isProcessingPayment
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!(selectedSeats.length > 0) || isProcessingPayment}
      >
        {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default BookingDetails;