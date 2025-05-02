


import React, { useEffect, useState } from "react";
import axios from "axios";
import { reserveWholeVehicle } from "../../services/vehicleService";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, HomeIcon } from "lucide-react";

const VerifyReservationPayment = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get("pidx");
    const amount = parseFloat(urlParams.get("amount"));
    const vehicleAvailabilityId = localStorage.getItem("vehicleAvailabilityIdNumber");

    const processedPayments = sessionStorage.getItem("processedPayments");
    const processedPaymentsArray = processedPayments ? JSON.parse(processedPayments) : [];

    if (!pidx || isNaN(amount)) {
      setErrorMessage("Invalid payment details.");
      setIsLoading(false);
      return;
    }

    if (!vehicleAvailabilityId) {
      setErrorMessage("No vehicle availability information found.");
      setIsLoading(false);
      return;
    }

    if (processedPaymentsArray.includes(pidx)) {
      setPaymentStatus("Payment already processed");
      setBookingStatus("Your booking is confirmed");
      setIsLoading(false);
      return;
    }

    processedPaymentsArray.push(pidx);
    sessionStorage.setItem("processedPayments", JSON.stringify(processedPaymentsArray));

    axios
      .post("https://localhost:7291/api/payment/verify-payment", {
        pidx,
        amount,
      })
      .then(async () => {
        setPaymentStatus("Payment successful, reserving your vehicle...");

        try {
          const result = await reserveWholeVehicle(vehicleAvailabilityId);

          if (result) {
            setBookingStatus("Booking successful 🎉! Check your email for confirmation.");
          } else {
            setErrorMessage("Booking failed. Vehicle might already be reserved.");
          }

          localStorage.removeItem("vehicleAvailabilityId");
        } catch (error) {
          setErrorMessage("Booking failed. " + (error.response?.data || error.message));
        }

        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "Payment verification failed.");
        setIsLoading(false);
      });
  }, []);

  const handleGoHome = () => {
    localStorage.removeItem("vehicleAvailabilityId");
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

export default VerifyReservationPayment;


