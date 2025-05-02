import { API_URL } from "../config";

export const initiatePayment = async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/payment/initiate`, { // Update with actual backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user is authenticated
        },
        body: JSON.stringify(paymentData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }
  
      return await response.json(); // Expecting { paymentUrl: "https://khalti.com/payment/..." }
    } catch (error) {
      console.error("Error initiating payment:", error);
      return null;
    }
  };

  export const initiateReservationPayment = async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/payment/reservation-initiate`, { // Update with actual backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user is authenticated
        },
        body: JSON.stringify(paymentData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }
  
      return await response.json(); // Expecting { paymentUrl: "https://khalti.com/payment/..." }
    } catch (error) {
      console.error("Error initiating payment:", error);
      return null;
    }
  };

  export const verifyPayment = async (pidx, amount) => {
    try {
      const response = await fetch(`${API_URL}/verify?pidx=${pidx}&amount=${amount}`, {
        method: "GET",
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error verifying payment:", error);
      return { success: false };
    }
  };
  