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



export const fetchViewVehicleSchedule = async (pageNumber = 1, pageSize = 8) => {
  try {
    const response = await axios.get(
      `${API_URL}/Vehicle/view-vehicle-schedules?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle schedule", error);
    throw new Error(error.response?.data?.message || "Failed to fetch vehicle schedules");
  }
};


// Function to fetch booked seats for a specific vehicle availability
export const fetchBookedSeats = async (vehicleAvailabilityId) => {
  try {
    if (!vehicleAvailabilityId) throw new Error("Vehicle ID is required");

    const response = await axios.get(
      `${API_URL}/Booking/GetBookedSeats/${vehicleAvailabilityId}`
    );
    console.log("Booked seats:",response.data.bookedSeats)
    return response.data.bookedSeats; // Return booked seats array
    

  } catch (error) {
    console.error("Error fetching booked seats:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch booked seats");
  }
};

// Function to book a seat
export const bookSeat = async (vehicleAvailabilityId, seatNumber) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axios.post(
      `${API_URL}/Booking/book-seat`,
      null, // Since the API expects query parameters, body is null
      {
        params: { vehicleAvailabilityId, seatNumber },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error booking seat:", error.response?.data || error.message);
    throw error;
  }
};

export const reserveWholeVehicle = async (vehicleAvailabilityId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axios.post(
      `${API_URL}/Booking/reserve-whole-vehicle`,
      null,
      {
        params: { vehicleAvailabilityId },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error reserving whole vehicle:", error.response?.data || error.message);
    throw error;
  }
};

export const canReserveWholeVehicle = async (vehicleAvailabilityId) => {
  try {
    const response = await axios.get(
      `${API_URL}/Booking/can-reserve-whole-vehicle`,
      {
        params: { vehicleAvailabilityId },
      }
    );

    return response.data; // { canReserve: boolean, message: string }
  } catch (error) {
    console.error("Error checking whole vehicle reservation status:", error.response?.data || error.message);
    throw error;
  }
};








