import React, { useState, useEffect } from 'react';
import { fetchViewVehicleSchedule } from '../../services/vehicleService';

const ViewVehicleSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8); // Fixed page size, or you can make it dynamic
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getSchedules = async () => {
      try {
        setLoading(true);
        const data = await fetchViewVehicleSchedule(pageNumber, pageSize);
        setSchedules(data.data); // data.data because the API returns structured data
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        setError("Failed to load vehicle schedules. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getSchedules();
  }, [pageNumber, pageSize]);

  // Format date in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Vehicle Schedule</h1>

      {loading && <p className="text-gray-600">Loading schedules...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && schedules.length === 0 && (
        <p className="text-gray-600">No vehicle schedules found.</p>
      )}

      {!loading && !error && schedules.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">S.N</th>
                <th className="py-2 px-4 border-b text-left">Vehicle Number</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Route</th>
                <th className="py-2 px-4 border-b text-left">Departure</th>
                <th className="py-2 px-4 border-b text-left">Available Seats</th>
                <th className="py-2 px-4 border-b text-left">Fare</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{(pageNumber - 1) * pageSize + index + 1}</td>
                  <td className="py-2 px-4 border-b">{schedule.vehicleNumber}</td>
                  <td className="py-2 px-4 border-b">{schedule.vehicleType}</td>
                  <td className="py-2 px-4 border-b">
                    {schedule.location} to {schedule.destination}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(schedule.departureDate)}, {schedule.departureTime}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {schedule.availableSeats}/{schedule.totalSeats}
                  </td>
                  <td className="py-2 px-4 border-b">Rs.{schedule.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Show pagination controls only if there are more than 8 rows */}
          {schedules.length > pageSize && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber === totalPages}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewVehicleSchedule;
