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