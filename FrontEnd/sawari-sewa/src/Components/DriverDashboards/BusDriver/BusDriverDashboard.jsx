import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusDriverDashboard = () => {
  // Sample data - In a real app, this would come from an API
  const [driverStats, setDriverStats] = useState({
    name: "Michael Johnson",
    rating: 4.7,
    totalTrips: 523,
    totalEarnings: 85450.75,
    available: true,
    currentBus: "KTM-5472 (Deluxe)",
    fuelLevel: 75,
    passengerCount: 28,
    totalCapacity: 40
  });

  const [currentTrip, setCurrentTrip] = useState({
    id: 101,
    date: "2025-04-06",
    departureTime: "09:30",
    arrivalTime: "16:45",
    route: "Kathmandu - Pokhara",
    departureLocation: "New Bus Park, Kathmandu",
    destination: "Tourist Bus Park, Pokhara",
    fare: 8500.00,
    bookings: 28,
    status: "En Route",
    progress: 45, // percentage complete of journey
    currentLocation: "Damauli",
    estimatedArrival: "16:45",
    stops: [
      { name: "Kathmandu", time: "09:30", status: "Completed" },
      { name: "Malekhu", time: "11:15", status: "Completed" },
      { name: "Mugling", time: "12:30", status: "Completed" },
      { name: "Damauli", time: "14:00", status: "Current" },
      { name: "Pokhara", time: "16:45", status: "Pending" }
    ]
  });

  const [scheduledTrips, setScheduledTrips] = useState([
    { id: 102, date: "2025-04-07", departureTime: "08:00", arrivalTime: "15:30", route: "Kathmandu - Pokhara", bookings: 32, status: "Scheduled" },
    { id: 103, date: "2025-04-08", departureTime: "07:30", arrivalTime: "18:00", route: "Pokhara - Kathmandu", bookings: 18, status: "Scheduled" }
  ]);

  const [completedTrips, setCompletedTrips] = useState([
    { id: 98, date: "2025-04-05", route: "Pokhara - Kathmandu", passengers: 38, fare: 7980.00, status: "Completed", rating: 5 },
    { id: 97, date: "2025-04-04", route: "Kathmandu - Pokhara", passengers: 40, fare: 8500.00, status: "Completed", rating: 4 },
    { id: 96, date: "2025-04-03", route: "Pokhara - Kathmandu", passengers: 35, fare: 7350.00, status: "Completed", rating: 5 },
    { id: 95, date: "2025-04-02", route: "Kathmandu - Pokhara", passengers: 37, fare: 7775.00, status: "Completed", rating: 5 }
  ]);

  // Toggle availability status
  const toggleAvailability = () => {
    setDriverStats({
      ...driverStats,
      available: !driverStats.available
    });
  };

  // Calculate earnings for different time periods
  const todayEarnings = 8500.00; // Would be calculated from API data
  const weekEarnings = 39605.00;
  const monthEarnings = 165450.75;

  // Trip status management
  const [isTripStarted, setIsTripStarted] = useState(true);
  const [nextStopIndex, setNextStopIndex] = useState(4); // Index of next stop in the stops array

  const handleNextStop = () => {
    if (nextStopIndex < currentTrip.stops.length) {
      // Update stops status
      const updatedStops = [...currentTrip.stops];
      if (nextStopIndex > 0) {
        updatedStops[nextStopIndex - 1].status = "Completed";
      }
      updatedStops[nextStopIndex].status = "Current";
      
      // Update current trip
      setCurrentTrip({
        ...currentTrip,
        currentLocation: updatedStops[nextStopIndex].name,
        progress: ((nextStopIndex + 1) / updatedStops.length) * 100,
        stops: updatedStops,
        status: nextStopIndex === updatedStops.length - 1 ? "Arrived" : "En Route"
      });
      
      setNextStopIndex(nextStopIndex + 1);
    }
    
    // Complete trip if at final destination
    if (nextStopIndex === currentTrip.stops.length - 1) {
      setTimeout(() => {
        setIsTripStarted(false);
        // In a real app, would send trip completion to backend
      }, 2000);
    }
  };

  const handleTripToggle = () => {
    if (!isTripStarted) {
      // Start trip logic
      setIsTripStarted(true);
    } else {
      // Emergency stop or complete trip logic
      if (window.confirm("Are you sure you want to end this trip?")) {
        setIsTripStarted(false);
        setCurrentTrip({
          ...currentTrip,
          status: "Completed"
        });
      }
    }
  };

  // Report maintenance issue
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceIssue, setMaintenanceIssue] = useState("");

  const handleMaintenanceReport = (e) => {
    e.preventDefault();
    alert(`Maintenance issue reported: ${maintenanceIssue}`);
    setMaintenanceIssue("");
    setShowMaintenanceForm(false);
    // In real app, would send to backend
  };

  // Update passenger count
  const [passengerUpdate, setPassengerUpdate] = useState(driverStats.passengerCount);
  const [showPassengerForm, setShowPassengerForm] = useState(false);

  const handlePassengerUpdate = (e) => {
    e.preventDefault();
    setDriverStats({
      ...driverStats,
      passengerCount: passengerUpdate
    });
    setShowPassengerForm(false);
    // In real app, would send to backend
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bus Driver Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${driverStats.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span>{driverStats.available ? 'On Duty' : 'Off Duty'}</span>
            </div>
            <button 
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-md ${driverStats.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {driverStats.available ? 'End Shift' : 'Start Shift'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        {/* Driver & Bus Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Driver Rating</h3>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold">{driverStats.rating}</span>
              <span className="text-yellow-500 ml-2">★</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Trips</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">{driverStats.totalTrips}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Assigned Bus</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">{driverStats.currentBus}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Earnings</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold">Rs {driverStats.totalEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Bus Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Fuel Level</h3>
            <div className="mt-2 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    {driverStats.fuelLevel}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div style={{ width: `${driverStats.fuelLevel}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
            </div>
          </div> */}
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Passenger Count</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold">{driverStats.passengerCount}/{driverStats.totalCapacity}</span>
              <button 
                onClick={() => setShowPassengerForm(true)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Update
              </button>
            </div>
            <div className="mt-1 relative pt-1">
              <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${(driverStats.passengerCount / driverStats.totalCapacity) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </div>
          
          {/* <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Maintenance Status</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-green-500 text-lg font-medium">Good Condition</span>
              <button 
                onClick={() => setShowMaintenanceForm(true)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Report Issue
              </button>
            </div>
          </div> */}
        </div>

        {/* Maintenance Form Modal */}
        {showMaintenanceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Report Maintenance Issue</h3>
              <form onSubmit={handleMaintenanceReport}>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  rows="4"
                  placeholder="Describe the issue..."
                  value={maintenanceIssue}
                  onChange={(e) => setMaintenanceIssue(e.target.value)}
                  required
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowMaintenanceForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Passenger Update Form Modal */}
        {showPassengerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Update Passenger Count</h3>
              <form onSubmit={handlePassengerUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Current Passengers</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    max={driverStats.totalCapacity}
                    value={passengerUpdate}
                    onChange={(e) => setPassengerUpdate(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowPassengerForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Earnings Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-600">Rs {todayEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Today</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-600">Rs {weekEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-500">This Week</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-600">Rs {monthEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
          </div>
        </div>

        {/* Current Trip */}
        {/* <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current Trip</h2>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded ${
                  isTripStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white transition duration-300`}
                onClick={handleTripToggle}
              >
                {isTripStarted ? "Emergency Stop" : "Start Trip"}
              </button>
              {isTripStarted && (
                <button
                  className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleNextStop}
                  disabled={nextStopIndex >= currentTrip.stops.length}
                >
                  Arrived at Next Stop
                </button>
              )}
            </div>
          </div>

          {currentTrip ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-semibold">{currentTrip.route}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{currentTrip.date}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="font-semibold">{currentTrip.bookings}/{driverStats.totalCapacity}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-blue-600">{currentTrip.status}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1 text-xs text-gray-500">
                  <span>{currentTrip.departureLocation}</span>
                  <span>{currentTrip.destination}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded">
                  <div 
                    className="h-full bg-green-500 rounded" 
                    style={{ width: `${currentTrip.progress}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-gray-500">Progress: {currentTrip.progress}%</span>
                  <span className="text-gray-500">Current: {currentTrip.currentLocation}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Route Stops</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stop</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Scheduled Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTrip.stops.map((stop, index) => (
                        <tr key={index} className={stop.status === "Current" ? "bg-green-50" : ""}>
                          <td className="px-4 py-2 text-sm">{stop.name}</td>
                          <td className="px-4 py-2 text-sm">{stop.time}</td>
                          <td className="px-4 py-2">
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              stop.status === "Completed" ? "bg-green-100 text-green-800" :
                              stop.status === "Current" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {stop.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No active trip.</p>
          )}
        </div> */}

<div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Current Trips</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedTrips.map(trip => (
                  <tr key={trip.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.passengers}/{driverStats.totalCapacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.fare.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-gray-900">{trip.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Trips */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Scheduled Trips</h2>
          {scheduledTrips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduledTrips.map(trip => (
                    <tr key={trip.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.departureTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.route}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.bookings}/{driverStats.totalCapacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No scheduled trips.</p>
          )}
        </div>

        {/* Recent Completed Trips */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Completed Trips</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedTrips.map(trip => (
                  <tr key={trip.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.passengers}/{driverStats.totalCapacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {trip.fare.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-gray-900">{trip.rating}</span>
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

export default BusDriverDashboard;