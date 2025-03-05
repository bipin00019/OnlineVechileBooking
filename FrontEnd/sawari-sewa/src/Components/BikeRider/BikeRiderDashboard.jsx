// // BikeRiderDashboard.js
// import React, { useState } from 'react';
// import TripsTab from './TripsTab';
// import BookingsTab from './BookingsTab';

// const BikeRiderDashboard = () => {
//   const [currentTrips] = useState([
//     { id: 1, from: 'Kathmandu', to: 'Pokhara', date: '2025-02-27', time: '14:30', passengers: 3, fare: 2500, status: 'pending' },
//     { id: 2, from: 'Pokhara', to: 'Kathmandu', date: '2025-02-28', time: '09:00', passengers: 4, fare: 2500, status: 'accepted' }
//   ]);

//   const [pastTrips] = useState([
//     { id: 3, from: 'Kathmandu', to: 'Chitwan', date: '2025-02-25', time: '08:00', passengers: 2, fare: 1800, rating: 4.8, status: 'completed' },
//     { id: 4, from: 'Chitwan', to: 'Kathmandu', date: '2025-02-26', time: '16:00', passengers: 3, fare: 1800, rating: 4.5, status: 'completed' }
//   ]);

//   const [bookingRequests] = useState([
//     { id: 1, from: 'Kathmandu', to: 'Pokhara', date: '2025-02-27', status: 'pending' }
//   ]);

//   const [activeTab, setActiveTab] = useState('overview');

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <main className="flex-grow container mx-auto p-4 md:p-6">
//         {/* Dashboard Tabs */}
//         <div className="mb-6">
//           <div className="flex border-b">
//             <button 
//               onClick={() => setActiveTab('overview')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               Overview
//             </button>
//             <button 
//               onClick={() => setActiveTab('trips')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'trips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               My Trips
//             </button>
//             <button 
//               onClick={() => setActiveTab('bookings')} 
//               className={`py-2 px-4 font-medium ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             >
//               Booking Requests
//             </button>
//           </div>
//         </div>
//         <h1>hello</h1>
//         {/* Content */}
//         {activeTab === 'trips' && <TripsTab currentTrips={currentTrips} pastTrips={pastTrips} />}
//         {activeTab === 'bookings' && <BookingsTab bookingRequests={bookingRequests} />}
        
//       </main>
//     </div>
//   );
// };

//export default BikeRiderDashboard;
import React, { useState } from 'react';
import { setDriverOnlineStatus } from '../../services/DriverService';
const BikeRiderDashboard = () => {
  // Sample data - In a real app, this would come from an API
  const [riderStats, setRiderStats] = useState({
    name: "Alex Rider",
    rating: 4.8,
    totalRides: 158,
    totalEarnings: 26790.50,
    available: true
  });

  const [currentTrips, setCurrentTrips] = useState([
    { id: 3, date: "2025-03-01", pickup: "Kathmandu-Chabahil", dropoff: "Solukhumbu-Salleri", fare: 3000.00, status: "Ongoing" }
  ]);

  const [recentRides, setRecentRides] = useState([
    { id: 1, date: "2025-02-28", pickup: "Pokhara", dropoff: "Kathmandu", fare: 3012.50, status: "Completed", rating: 5 },
    { id: 2, date: "2025-02-28", pickup: "Kathmandu", dropoff: "Pokhara", fare: 4008.75, status: "Completed", rating: 5 },
    { id: 3, date: "2025-02-27", pickup: "Butwal", dropoff: "Kathmandu", fare: 2290.30, status: "Completed", rating: 4 },
    { id: 4, date: "2025-02-26", pickup: "Lalitpur", dropoff: "Okhaldhunga", fare: 2687.20, status: "Completed", rating: 5 }
  ]);

  const [upcomingRides, setUpcomingRides] = useState([
    { id: 5, date: "2025-03-01", time: "14:30", pickup: "Solukhumbu", dropoff: "Kathmandu", fare: 4115.80, status: "Scheduled" },
    { id: 6, date: "2025-03-02", time: "09:15", pickup: "Pokhara", dropoff: "Bhaktapur", fare: 4013.25, status: "Scheduled" }
  ]);

  // Toggle availability status
  const toggleAvailability = () => {
    setRiderStats({
      ...riderStats,
      available: !riderStats.available
    });
  };

  // Calculate earnings for different time periods
  const todayEarnings = 2221.25; // Would be calculated from API data
  const weekEarnings = 14445.80;
  const monthEarnings = 40684.50;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bike Rider Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${riderStats.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span>{riderStats.available ? 'Available' : 'Offline'}</span>
            </div>
            <button 
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-md ${riderStats.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {riderStats.available ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Rating</h3>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold">{riderStats.rating}</span>
              <span className="text-yellow-500 ml-2">★</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Rides</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">{riderStats.totalRides}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Earnings</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold"> Rs {riderStats.totalEarnings.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Today's Earnings</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">Rs {todayEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-600">Rs {todayEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Today</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-600">Rs {weekEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-500">This Week</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-600">Rs {monthEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
          </div>
        </div>

        {/* Current Rides */}

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Current Trips</h2>
          {currentTrips.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTrips.map(trip => (
                  <tr key={trip.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropoff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.fare.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{trip.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No ongoing trips.</p>
          )}
        </div>
        {/* Upcoming Rides */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Rides</h2>
          {upcomingRides.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingRides.map(ride => (
                    <tr key={ride.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ride.date}</div>
                        <div className="text-sm text-gray-500">{ride.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickup}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropoff}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">Details</button>
                        <button className="text-red-600 hover:text-red-800">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming rides scheduled.</p>
          )}
        </div>

        {/* Recent Rides */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRides.map(ride => (
                  <tr key={ride.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.pickup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ride.dropoff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {ride.fare.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-gray-900">{ride.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
        © 2025 Online Vehicle Ticket App. All rights reserved.
      </footer>
    </div>
  );
};

export default BikeRiderDashboard;
