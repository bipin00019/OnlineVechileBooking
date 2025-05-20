import React, { useEffect, useState } from 'react';
import { fetchBookingStats } from '../../services/AdminDashboardService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BookingsPerDayChart = () => {
  const [bookingCounts, setBookingCounts] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { bookingCounts, revenue } = await fetchBookingStats();
        setBookingCounts(bookingCounts);
        setRevenue(revenue);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <p>Loading charts...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      
      {/* Daily Booking Count Chart */}
      <div className="bg-white p-4 shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Daily Booking Counts</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-white p-4 shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Daily Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs. ${value}`} />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default BookingsPerDayChart;
