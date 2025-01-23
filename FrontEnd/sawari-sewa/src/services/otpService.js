import axios from "axios"
import { API_URL } from "../config"

const sendVerificationCode = async (email) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/Otp/send-code`,
            email
        );
        return response.data;
    } catch (error){
        throw error.response?.data || error.message;
    }
};

const verifyCode = async (email, code) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/Otp/verify-code`,
        { Email: email, Code: code }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  
  export { sendVerificationCode, verifyCode };