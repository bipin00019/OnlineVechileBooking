import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import Navbar from "../Navbar/Navbar";
import { singleDriverApplication } from "../../services/DriverService";

const ReviewDriverApplication = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchSingleDriverApplication = async () => {
      try{
        const data = await singleDriverApplication(id);
        setApplication(data);
      } catch {
        setError("Failed to load driver application detals");
        console.log("Error while fetching driver application");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleDriverApplication();
  }, [id]);

  const handleImageError = (type) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const renderDocument = (path, type, title, description) => {
    if (imageLoadErrors[type] || !path) {
      return (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
          No Image Available
        </div>
      );
    }

    const cleanPath = path.replace(/^wwwroot[\\/]+/, "").replace(/\\/g, "/");
    const fullImageUrl = `${API_BASE_URL}/${cleanPath}`;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="relative group cursor-pointer" onClick={() => setSelectedImage(fullImageUrl)}>
          <img
            src={fullImageUrl}
            alt={title}
            className="w-full h-96 object-cover rounded shadow transition-transform duration-200 hover:scale-105"
            onError={() => handleImageError(type)}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="bg-black bg-opacity-75 text-white px-4 py-2 rounded">Click to enlarge</span>
          </div>
        </div>
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
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Driver Application Details</h1>
        
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Name:</span> {application.firstName} {application.lastName}</p>
              <p><span className="font-medium">Email:</span> {application.email}</p>
              <p><span className="font-medium">Phone:</span> {application.phoneNumber}</p>
              <p><span className="font-medium">License Number:</span> {application.licenseNumber}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Vehicle Type:</span> {application.vehicleType}</p>
              <p><span className="font-medium">Vehicle Number:</span> {application.vehicleNumber}</p>
              <p><span className="font-medium">Starting Point:</span> {application.startingPoint}</p>
              <p><span className="font-medium">Destination:</span> {application.destinationLocation}</p>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                application.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : application.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {application.status}
              </span>
            </p>
            <p><span className="font-medium">Created At:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
            {application.approvedAt && (
              <p><span className="font-medium">Approved At:</span> {new Date(application.approvedAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Documents</h2>
          
          {renderDocument(
            application.licensePhotoPath,
            "license",
            "Driver's License",
            "Official driving license issued by the government"
          )}
          
          {renderDocument(
            application.driverPhotoPath,
            "driver",
            "Driver Photo",
            "Recent photograph of the driver"
          )}
          
          {renderDocument(
            application.billbookPhotoPath,
            "billbook",
            "Vehicle Billbook",
            "Official vehicle registration document"
          )}
          
          {renderDocument(
            application.citizenshipFrontPath,
            "citizenshipFront",
            "Citizenship Card (Front)",
            "Front side of the citizenship identification card"
          )}
          
          {renderDocument(
            application.citizenshipBackPath,
            "citizenshipBack",
            "Citizenship Card (Back)",
            "Back side of the citizenship identification card"
          )}
          
          {renderDocument(
            application.selfieWithIDPath,
            "selfie",
            "Selfie with ID",
            "Self-portrait photograph with identification document"
          )}
          
          {renderDocument(
            application.vehiclePhotoPath,
            "vehicle",
            "Vehicle Photo",
            "Current photograph of the vehicle to be used"
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full max-h-screen">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDriverApplication;