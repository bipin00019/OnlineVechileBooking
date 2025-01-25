import axios from "axios"
import { API_URL } from "../config"

const sendVerificationCode = async (email) => {
  console.log("sendVerificationCode called with email:", email);
    try {
        const response = await axios.post(
            `${API_URL}/Otp/send-code`,
            email,
            {
              headers: {
                "Content-Type": "application/json", // Ensure this is set
              },
            }
        );
        return response.data;
    } catch (error){
        throw error.response?.data || error.message;
    }
};

const verifyCode = async (email, code) => {
    try {
      const response = await axios.post(
        `${API_URL}/Otp/verify-code`,
        { Email: email, Code: code }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  
  export { sendVerificationCode, verifyCode };