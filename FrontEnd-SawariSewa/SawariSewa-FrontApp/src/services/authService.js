import axios from "axios";
import { API_URL } from "../config";

const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${API_URL}/Admin/Account/Login`,
        credentials
      );
      if (response.data.success && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const authService = {
    login,
    
  };
  
  export default authService;

