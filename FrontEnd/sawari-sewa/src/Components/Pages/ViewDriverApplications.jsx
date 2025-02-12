import React, { useState, useEffect } from "react";
import { allDriverApplications } from "../../services/DriverService";
import { API_BASE_URL } from "../../config";
import Navbar from "../Navbar/Navbar"; // Import Navbar component
import { PATHS } from "../../constants/paths";
import { Navigate, useNavigate } from "react-router-dom";

const ViewDriverApplications = () => {
  const navigate = useNavigate();
  const [driverApplications, setDriverApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const pageSize = 10;

  useEffect(() => {
    const fetchDriverApplications = async () => {
      try {
        const data = await allDriverApplications(currentPage, pageSize);
        console.log("Fetched data:", data); // Debug log
        setDriverApplications(data.data);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } catch (err) {
        setError("Failed to load driver applications");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverApplications();
  }, [currentPage]);

  const handleImageError = (id, type) => {
    console.log(`Image load error for ${id}-${type}`); // Debug log
    setImageLoadErrors((prev) => ({
      ...prev,
      [`${id}-${type}`]: true,
    }));
  };

  const renderImage = (path, alt, id, type) => {
    if (imageLoadErrors[`${id}-${type}`] || !path) {
      return (
        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded">
          No Image
        </div>
      );
    }

    // Ensure correct path handling
    const cleanPath = path.replace(/^wwwroot[\\/]+/, "").replace(/\\/g, "/");
    const fullImageUrl = `${API_BASE_URL}/${cleanPath}`;
    console.log("Image URL:", fullImageUrl); // Debug log

    return (
      <div className="relative group">
        <img
          src={fullImageUrl}
          alt={alt}
          className="w-12 h-12 object-cover rounded shadow group-hover:scale-150 transition-transform duration-200 cursor-pointer"
          onError={() => handleImageError(id, type)}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  
  

  

  return (
    <div>
      <Navbar /> {/* Include Navbar component */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Driver Applications</h1>
        {driverApplications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No driver applications found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b text-left">Name</th>
                  <th className="px-4 py-2 border-b text-left">License</th>
                  <th className="px-4 py-2 border-b text-left">Vehicle Details</th>
                  <th className="px-4 py-2 border-b text-left">Status</th>
                  <th className="px-4 py-2 border-b text-left">Documents</th>
                </tr>
              </thead>
              <tbody>
                {driverApplications.map((application) => (
                  <tr key={application.id} 
                  onClick={() => {
                    navigate(`/review-driver-application/${application.id}`);
                  }}
                  className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-2 border-b">
                      {application.firstName} {application.lastName}
                    </td>
                    <td className="px-4 py-2 border-b">{application.licenseNumber}</td>
                    <td className="px-4 py-2 border-b">
                      <div>
                        <div className="font-medium">{application.vehicleType}</div>
                        <div className="text-sm text-gray-600">{application.vehicleNumber}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          application.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : application.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b flex gap-2">
                      {renderImage(application.licensePhotoPath, "License", application.id, "license")}
                      {renderImage(application.driverPhotoPath, "Driver", application.id, "driver")}
                      {renderImage(application.billbookPhotoPath, "Billbook", application.id, "billbook")}
                      {renderImage(application.citizenshipFrontPath, "Citizenship Front", application.id, "citizenshipFront")}
                      {renderImage(application.citizenshipBackPath, "Citizenship Back", application.id, "citizenshipBack")}
                      {renderImage(application.selfieWithIDPath, "Selfie", application.id, "selfie")}
                      {renderImage(application.vehiclePhotoPath, "Vehicle", application.id, "vehicle")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDriverApplications;
