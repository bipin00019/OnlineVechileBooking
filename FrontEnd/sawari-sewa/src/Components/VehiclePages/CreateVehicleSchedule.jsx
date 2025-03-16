import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

const CreateVehicleSchedule = () => {
  const [formData, setFormData] = useState({
    driverId: '',
    totalSeats: 0,
    departureDate: '',
    fare: 0
  });
  
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [driverDetails, setDriverDetails] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 8,
    totalCount: 0
  });

  // Fetch approved drivers when component mounts
  useEffect(() => {
    loadApprovedDrivers();
  }, [pagination.page, pagination.pageSize]);

  // Fetch driver details when driverId changes
  useEffect(() => {
    if (formData.driverId) {
      loadDriverDetails(formData.driverId);
    } else {
      setDriverDetails(null);
    }
  }, [formData.driverId]);



  const loadApprovedDrivers = async () => {
    try {
      setLoading(true);
  
      // Fetch all approved drivers
      const driverResponse = await axios.get(
        `${API_URL}/Driver/all-approved-drivers?page=${pagination.page}&pageSize=${pagination.pageSize}`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Fetch all scheduled drivers
      const scheduleResponse = await axios.get(
        `${API_URL}/Vehicle/view-vehicle-schedules`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (driverResponse.data && driverResponse.data.data) {
        const scheduledDriverIds = new Set();
        if (Array.isArray(scheduleResponse.data)) {
          // Only map if the response is an array
          scheduleResponse.data.forEach(schedule => scheduledDriverIds.add(schedule.driverId));
        }
  
        // Filter out scheduled drivers
        const availableDrivers = driverResponse.data.data.filter(driver => !scheduledDriverIds.has(driver.id));
  
        setDrivers(availableDrivers);
        setPagination({
          ...pagination,
          totalCount: availableDrivers.length
        });
      }
  
      setError('');
    } catch (err) {
      setError('Failed to fetch approved drivers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  
  const loadDriverDetails = async (driverId) => {
    try {
      const response = await axios.get(`${API_URL}/Driver/single-approved-driver/${driverId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });
      setDriverDetails(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch driver details.');
      console.error(err);
    }
  };

  const createVehicleSchedule = async (scheduleData) => {
    try {
      const response = await axios.post(`${API_URL}/Vehicle/create-vehicle-schedule`, scheduleData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle schedule:", error.response ? error.response.data : error.message);
      throw new Error(error.response ? error.response.data : "Failed to create vehicle schedule");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'totalSeats' || name === 'fare' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.driverId || formData.totalSeats <= 0 || formData.fare <= 0 || !formData.departureDate) {
      setError('Please fill all required fields with valid values.');
      return;
    }

    try {
      setLoading(true);
      const response = await createVehicleSchedule(formData);
      
      setSuccess(response.message);
      // Reset form
      setFormData({
        driverId: '',
        totalSeats: 0,
        departureDate: '',
        fare: 0
      });
      setDriverDetails(null);
    } catch (err) {
      setError(err.message || 'Failed to create vehicle schedule.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  // Generate pagination buttons
  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`px-3 py-1 mx-1 rounded ${pagination.page === i ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Vehicle Schedule</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          <p>{success}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
  <label className="block text-gray-700 font-medium mb-2">Driver</label>
  {drivers.length === 0 ? (
    <p className="text-red-500 font-semibold">All approved drivers are scheduled.</p>
  ) : (
    <select
      name="driverId"
      value={formData.driverId}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select a driver</option>
      {drivers.map(driver => (
        <option key={driver.id} value={driver.id}>
          Driver Id: {driver.id} - {driver.firstName} {driver.lastName} - {driver.vehicleNumber}-{driver.vehicleType}
        </option>
      ))}
    </select>
  )}
</div>

          
          {driverDetails && (
            <div className="mb-6 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Driver & Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Driver:</span> {driverDetails.firstName} {driverDetails.lastName}</p>
                <p><span className="font-medium">Contact:</span> {driverDetails.phoneNumber}</p>
                <p><span className="font-medium">Vehicle Type:</span> {driverDetails.vehicleType}</p>
                <p><span className="font-medium">Vehicle Number:</span> {driverDetails.vehicleNumber}</p>
                <p><span className="font-medium">Starting Point:</span> {driverDetails.startingPoint}</p>
                <p><span className="font-medium">Destination:</span> {driverDetails.destinationLocation}</p>
                <p><span className="font-medium">Pickup Point:</span> {driverDetails.pickupPoint}</p>
                <p><span className="font-medium">Drop-off Point:</span> {driverDetails.dropOffPoint}</p>
                <p><span className="font-medium">Default Departure Time:</span> {driverDetails.departureTime}</p>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Departure Date</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Total Seats</label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Fare (₹)</label>
            <input
              type="number"
              name="fare"
              value={formData.fare}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              step="0.01"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition duration-300"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {paginationButtons}
          <button 
            onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
            disabled={pagination.page === totalPages}
            className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateVehicleSchedule;