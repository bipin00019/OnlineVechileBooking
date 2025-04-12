import { API_URL } from "../config";
import axios from "axios";

export const fetchDriverCurrentTrips = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      throw new Error("User is not authenticated");
    }
  
    try {
      const response = await axios.get(
        `${API_URL}/DriverDashboard/driver/current-trips`, // Replace with the correct API endpoint for current trips
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // If response contains trips data, return them
      return response.data;
    } catch (error) {
      console.error("Error fetching current trips:", error.response?.data || error.message);
      throw new Error(error.response?.data || "Failed to fetch current trips");
    }
  };

  export const fetchDriverGroupedCurrentTrips = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      throw new Error("User is not authenticated");
    }
  
    try {
      const response = await axios.get(
        `${API_URL}/DriverDashboard/driver/current-grouped-trips`, // Replace with the correct API endpoint for current trips
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // If response contains trips data, return them
      return response.data;
    } catch (error) {
      console.error("Error fetching current trips:", error.response?.data || error.message);
      throw new Error(error.response?.data || "Failed to fetch current trips");
    }
  };

  export const fetchDriverUpcomingTrips = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      throw new Error("User is not authenticated");
    }
  
    try {
      const response = await axios.get(
        `${API_URL}/DriverDashboard/driver/upcoming-trips`, // Replace with the correct API endpoint for upcoming trips
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // If response contains trips data, return them
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming trips:", error.response?.data || error.message);
      throw new Error(error.response?.data || "Failed to fetch upcoming trips");
    }
  };
  
  export const fetchDriverGroupedUpcomingTrips = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      throw new Error("User is not authenticated");
    }
  
    try {
      const response = await axios.get(
        `${API_URL}/DriverDashboard/driver/upcoming-grouped-trips`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // If response contains trips data, return them
      return response.data;
    } catch (error) {
      console.error("Error fetching current trips:", error.response?.data || error.message);
      throw new Error(error.response?.data || "Failed to fetch current trips");
    }
  };
// Fetch driver stats for the currently logged-in driver
export const fetchDriverStats = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axios.get(
      `${API_URL}/DriverDashboard/driver/stats`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching driver stats:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch driver stats");
  }
};

// Fetch passenger stats for the currently logged-in driver
export const fetchPassengerStats = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axios.get(
      `${API_URL}/DriverDashboard/vehicle/passenger-count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching passenger stats:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch passenger stats");
  }
};
