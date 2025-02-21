import axios from "axios";
import { API_URL } from "../config";

export const switchRole = async (userId) => {
    try {
        const token =localStorage.getItem("token");
        if (!token){
            console.log("No token found");
            alert("Session expired. Please log in again");
            return;
        } 

        const response = await axios.post(
            `${API_URL}/RoleManagement/switch-role/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        alert("Role switched successfully.");
        return response.data;
    } catch (error) {
        let errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "An unknown error occurred";
    alert("Role switch failed: " + errorMessage);
    throw errorMessage;
    }
};

// Function to fetch user profile data, including approved driver status
export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found");
            alert("Session expired. Please log in again");
            return;
        }

        const response = await axios.get(`${API_URL}/RoleManagement/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};