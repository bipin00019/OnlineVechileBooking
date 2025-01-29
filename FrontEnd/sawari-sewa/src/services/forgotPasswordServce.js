import axios from "axios";
import { API_URL } from "../config";

const resetPassword = async (userData) => {
    console.log("Sending Reset Password Request:", userData); // Log the request data
    try {
        const completeUserData = {  // Fixed variable name
            email: userData.email,
            newPassword: userData.newPassword, // Fixed property mapping
            confirmPassword: userData.confirmPassword, // Fixed typo
        };

        const response = await axios.post(
            `${API_URL}/ResetPassword/forgot-password`,
            completeUserData, {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Password reset success",response.data)
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export { resetPassword };
