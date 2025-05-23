import { API_URL } from "../config";
import axios from "axios";

export async function fetchBookingStats() {
  try {
    const [countsRes, revenueRes] = await Promise.all([
      axios.get(`${API_URL}/AdminDashboard/daily-booking-counts`),
      axios.get(`${API_URL}/AdminDashboard/daily-revenue`)
    ]);

    return {
      bookingCounts: countsRes.data,
      revenue: revenueRes.data
    };
  } catch (err) {
    console.error('Failed to fetch booking stats:', err);
    throw err; // re‑throw so callers can handle UI errors
  }
}

  export const fetchTotalSeatBookingCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/AdminDashboard/total-seat-booking-count`);
      console.log('Total Seat Bookings:', response.data.totalSeatBookings);
      return response.data.totalSeatBookings;
    } catch (error) {
      console.error('Error fetching total seat booking count:', error);
      return 0;
    }
  };

  export const fetchTotalCancelledBookingCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/AdminDashboard/total-cancelledBooking-count`);
      console.log('Total Seat Bookings:', response.data.totalCancelledBookings);
      return response.data.totalCancelledBookings;
    } catch (error) {
      console.error('Error fetching total seat booking count:', error);
      return 0;
    }
  };

  export const fetchAllUsersWithRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/AdminDashboard/GetAllUsersWithRoles`);
    //console.log('Users with Roles:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    return [];
  }
};

export const changeUserRole = async (targetUserId, newRole) => {
  try {
    const response = await axios.post(`${API_URL}/AdminDashboard/change-user-role`, {
      targetUserId,
      newRole
    });
    //console.log('User role updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};



export const fetchCancelledBookings = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/Booking/cancelled-bookings`, {
      params: { page }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching cancelled bookings:', error);
    throw error;
  }
};

export const fetchCancelledBookingsAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/AdminDashboard/cancelled-bookings`);
    console.log(response.data); // Use the data as needed
    return response.data;
  } catch (error) {
    console.error('Error fetching cancelled bookings:', error);
    throw error;
  }
};



export const processRefund = async (bookingId) => {
  try {
    const response = await axios.post(`${API_URL}/AdminDashboard/process-refund`, null, {
      params: { bookingId }
    });
    console.log('Refund processed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

