import axios from 'axios';
import { API_URL } from '../config';

export const fetchPassengerBookingHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/Passenger/Passenger/booking-history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const bookingHistory = response.data;
    console.log(bookingHistory); // handle the data as needed
    return bookingHistory;
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return [];
  }
};


export const submitReview = async (reviewData) => {
  try {
    console.log('In submitReview function, sending data:', reviewData);
    
    const response = await axios.post(`${API_URL}/Review/add-reviews`, {
      historyId: reviewData.historyId,
      approvedDriverId: reviewData.driverId,
      rating: reviewData.rating,
      comment: reviewData.comment
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('Review submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchMyBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/Passenger/Passenger/my-bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // or however you store your JWT
      }
    });

    console.log(response.data); // or set this to state if using React
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};
