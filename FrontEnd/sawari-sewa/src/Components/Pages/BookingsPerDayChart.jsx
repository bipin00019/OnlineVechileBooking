import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { API_URL } from '../../config';

const BookingsPerDayChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
  try {
    const response = await axios.get(`${API_URL}/AdminDashboard/daily-booking-counts`);
    
    // Adjust this line based on your API's response structure
    const bookingArray = Array.isArray(response.data) 
      ? response.data 
      : response.data.data; // fallback if the actual array is nested inside `data`

    const formattedData = bookingArray.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      bookings: item.count
    }));

    setData(formattedData);
  } catch (error) {
    console.error("Error fetching booking data:", error);
  }
};

    

    fetchBookingData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Bookings Per Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingsPerDayChart;


