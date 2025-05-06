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
    const response = await axios.delete(`${API_URL}/Vehicle/delete-schedule`); 
    return response.data; // Success message
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return null;
  }
};




export const setFareAndSchedule = async (fare, totalSeats, departureDate, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/Vehicle/set-fare-and-schedule`,
      {
        fare: parseFloat(fare),
        totalSeats: parseInt(totalSeats),
        bookedSeats: 0, 
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
        bookedSeats: 0, 
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
        Authorization: `Bearer ${localStorage.getItem('token')}` 
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
    const response = await axios.get(`${API_URL}/Vehicle/check-schedule-exists`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` 
      }
    });
    console.log("Schedule exists:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking schedule:", error.response?.data || error.message);
    return null;
  }
};

// export const checkAllSeatsAvailable = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/Vehicle/are-all-seats-available`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`, 
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Error:", errorText);
//       return false;
//     }

//     const result = await response.json();
//     console.log("Are all seats available?", result);
//     return result; // true or false
//   } catch (error) {
//     console.error("Request failed:", error);
//     return false;
//   }
// };

// export const manualReserveAllSeats = async (passengerName, passengerContact) => {
//   try {
//     const response = await fetch(`${API_URL}/Booking/manual-reserve-all-seats`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`, 
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         passengerName,
//         passengerContact
//       })
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       console.error("Reservation failed:", result.message);
//       return { success: false, message: result.message };
//     }

//     console.log("Reservation success:", result.message);
//     return { success: true, message: result.message };

//   } catch (error) {
//     console.error("Network error:", error);
//     return { success: false, message: "Network error occurred." };
//   }
// };

export const checkAllSeatsAvailable = async () => {
  try {
    const response = await fetch(`${API_URL}/Vehicle/are-all-seats-available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check if response can be parsed as JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      // Return true or false based on response data structure
      return data.allSeatsAvailable || false;
    } else {
      // If not JSON, try to get text and parse as boolean
      const textData = await response.text();
      // If the text is "true" string, return true, otherwise false
      return textData.trim().toLowerCase() === "true";
    }
  } catch (error) {
    console.error('Request failed:', error);
    // Default to false on error
    return false;
  }
};


export const manualReserveAllSeats = async (bookingData) => {
  const { passengerName, passengerContact } = bookingData;

  try {
    const response = await fetch(
      `${API_URL}/Booking/manual-reserve-all-seats?passengerName=${encodeURIComponent(passengerName)}&passengerContact=${encodeURIComponent(passengerContact)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // 'Content-Type' is not needed here since there's no body
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${response.status} - ${errorText}`);
      return {
        success: false,
        message: `Server error: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data
    };

  } catch (error) {
    console.error('Reservation failed:', error);
    return {
      success: false,
      message: error.message || "Failed to reserve seats"
    };
  }
};


export const fetchRecentRides = async (pageNumber = 1, pageSize = 8) => {
  try {
    const response = await fetch(
      `${API_URL}/DriverDashboard/recent-rides?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token method
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recent rides");
    }

    const data = await response.json();
    console.log("Paginated Recent Rides:", data);
    return data; // contains Rides, TotalPages, etc.
  } catch (error) {
    console.error("Error fetching recent rides:", error.message);
    return null;
  }
};



export const fetchAverageRating = async () => {
  try {
    const token = localStorage.getItem('token'); // or however you store your auth token
    const response = await axios.get(`${API_URL}/Review/my-average-rating`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { averageRating, totalReviews } = response.data;
    console.log('Average Rating:', averageRating);
    console.log('Total Reviews:', totalReviews);
    return { averageRating, totalReviews };
  } catch (error) {
    console.error('Error fetching average rating:', error);
    throw error;
  }
};

export const fetchDriverReviews = async () => {
  try {
    const token = localStorage.getItem('token'); // Or use your auth context/provider
    const response = await axios.get(`${API_URL}/Review/my-reviews`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const reviews = response.data;
    console.log('Driver Reviews:', reviews);
    return reviews;
  } catch (error) {
    console.error('Error fetching driver reviews:', error);
    throw error;
  }
};
