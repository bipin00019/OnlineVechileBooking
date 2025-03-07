import axios from "axios";
import { API_URL } from "../config";

export const fetchAvailableVehicles = async (startingPoint, destination, vehicleType) => {
  try {
    const response = await axios.get(`${API_URL}/Vehicle/available-vehicles`, {
      params: {
        startingPoint: startingPoint,
        destination: destination,
        vehicleType: vehicleType,
      },
    });
    console.log("Response data:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    return [];
  }
};
