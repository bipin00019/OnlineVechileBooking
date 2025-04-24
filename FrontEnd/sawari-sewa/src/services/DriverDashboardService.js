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
// export const fetchPassengerStats = async () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("User is not authenticated");
//   }

//   try {
//     const response = await axios.get(
//       `${API_URL}/DriverDashboard/vehicle/passenger-count`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching passenger stats:", error.response?.data || error.message);
//     throw new Error(error.response?.data || "Failed to fetch passenger stats");
//   }
// };
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

    // Return the data directly, now that our API returns a consistent structure
    return response.data;
  } catch (error) {
    console.error("Error fetching passenger stats:", error.response?.data || error.message);
    
    // For other errors, return a standardized object
    return {
      hasSchedule: false,
      message: error.response?.data || "Failed to fetch passenger stats"
    };
  }
};

// Fetch logged-in driver's schedule
export const fetchMySchedule = async () => {
  try {
    const response = await axios.get(`${API_URL}/Vehicle/my-schedule`); // Replace 'your-controller-name' with the actual one
    console.log("response of my schedule", response.data)
    return response.data; // List of schedules
    
  } catch (error) {
    console.error('Error fetching driver schedule:', error);
    return null;
  }
};

// Delete the driver's schedule
export const deleteMySchedule = async () => {
  try {
    const response = await axios.delete(`${API_URL}/Vehicle/delete-schedule`); // Replace with actual controller route
    return response.data; // Success message
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return null;
  }
};




export const setFareAndSchedule = async (fare, totalSeats, departureDate, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/Vehicle/set-fare-and-schedule`, // replace with your real API route
      {
        fare: parseFloat(fare),
        totalSeats: parseInt(totalSeats),
        bookedSeats: 0, // optional: backend already defaults this to 0
        departureDate: new Date(departureDate).toISOString()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "An error occurred.";
  }
};

export const editFareAndSchedule = async (fare, totalSeats, departureDate, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/Vehicle/edit-fare-and-schedule`, 
      {
        fare: parseFloat(fare),
        totalSeats: parseInt(totalSeats),
        bookedSeats: 0, // optional: backend already defaults this to 0
        departureDate: new Date(departureDate).toISOString()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "An error occurred.";
  }
};

export const manualBookSeat = async ({ seatNumber, passengerName, passengerContact }) => {
  try {
    const response = await axios.post(
      `${API_URL}/Booking/manual-book-seat`,
      null,
      {
        params: {
          seatNumber,
          passengerName,
          passengerContact
        }
      }
    );
    return { success: true, message: response.data };
  } catch (error) {
    const message = error.response?.data || "Booking failed.";
    return { success: false, message };
  }
};

export const fetchBookedSeatNumbers = async () => {
  try {
    const response = await axios.get(`${API_URL}/Vehicle/driver/booked-seatNumber`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Assumes token is stored in localStorage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    throw error;
  }
};

export const fetchDriverSeatStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/Vehicle/driver/seat-stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching driver seat stats:', error);
    throw error;
  }
};



export const checkScheduleExists = async () => {
  try {
    const response = await axios.get('/api/your-controller-name/check-schedule-exists'); // replace with actual controller route
    return response.data; // will return true or false
  } catch (error) {
    console.error('Error checking schedule:', error);
    return false; // or handle as needed
  }
};