import axios from "axios";
import { API_URL } from "../config";

export const fetchAvailableVehicles = async (location, destination, vehicleType, date) => {
  try {
    // Ensure the inputs are valid and properly trimmed
    if (!location || !destination || !vehicleType || !date) {
      throw new Error("All search parameters are required.");
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const requestData = {
      location: location.trim(),
      destination: destination.trim(),
      vehicleType: vehicleType.trim(),
      date: formattedDate,
    };

    const response = await axios.post(`${API_URL}/Vehicle/search-available-vehicles`, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Available vehicles:", response.data);
    return response.data; // Return fetched data

  } catch (error) {
    console.error("Error fetching available vehicles:", error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : "Failed to fetch available vehicles");
  }
};

export const createVehicleSchedule = async (scheduleData) => {
  try {
    const response = await axios.post(`${API_URL}/Vehicle/create-vehicle-schedule`, scheduleData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating vehicle schedule:", error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : "Failed to create vehicle schedule");
  }
};