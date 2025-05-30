// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { API_BASE_URL } from "../../config";
// import Navbar from "../Navbar/Navbar";
// import { singleDriverApplication, approveDriverApplication, rejectDriverApplication} from "../../services/DriverService";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ReviewDriverApplication = () => {
//   const { id } = useParams();
//   const [application, setApplication] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageLoadErrors, setImageLoadErrors] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isApproving, setIsApproving] = useState(false);
//   const [ isRejecting, setIsRejecting] = useState(false);

//   useEffect(() => {
//     const fetchSingleDriverApplication = async () => {
//       try {
//         const data = await singleDriverApplication(id);
//         setApplication(data);
//       } catch {
//         setError("Failed to load driver application details");
//         console.log("Error while fetching driver application");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSingleDriverApplication();
//   }, [id]);

//   const handleApprove = async() => {
//     setIsApproving(true);
//     // try{
//     //   await approveDriverApplication(id);
//     //   setApplication((prev) => ({...prev, status: "Approved"}));
//     //   toast.success("Application approved successfully.");
//     // } catch (error) {
//     //   toast.error("Failed to approve the application");
//     // } finally {
//     //   setIsApproving(false);
//     // }
//     try {
//   await approveDriverApplication(id);
//   setApplication((prev) => ({ ...prev, status: "Approved" }));
//   toast.success("Application approved successfully.");
// } catch (errorMessage) {
//   toast.error(errorMessage); // This now shows the exact message from backend
// } finally {
//   setIsApproving(false);
// }


//   };

//   const handleReject = async() => {
//     setIsRejecting(true);
//     try {
//       await rejectDriverApplication(id);
//       setApplication((prev) => ({...prev, status: "Rejected"}));
//       toast.success("Application rejected successfully");
//     } catch (error) {
//       toast.error("Failed to reject the application");
//     } finally {
//       setIsRejecting(false);
//     }
//   };

//   const handleImageError = (type) => {
//     setImageLoadErrors((prev) => ({
//       ...prev,
//       [type]: true,
//     }));
//   };

//   const renderDocument = (path, type, title, description) => {
//     if (imageLoadErrors[type] || !path) {
//       return (
//         <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
//           No Image Available
//         </div>
//       );
//     }

//     const cleanPath = path.replace(/^wwwroot[\\/]+/, "").replace(/\\/g, "/");
//     const fullImageUrl = `${API_BASE_URL}/${cleanPath}`;

//     return (
//       <div className="bg-white p-4 rounded-lg shadow h-full">
//         <h3 className="text-lg font-semibold mb-2">{title}</h3>
//         <p className="text-gray-600 mb-3 text-sm">{description}</p>
//         <div className="relative group cursor-pointer h-64" onClick={() => setSelectedImage(fullImageUrl)}>
//           <img
//             src={fullImageUrl}
//             alt={title}
//             className="w-full h-full object-cover rounded shadow transition-transform duration-200 hover:scale-105"
//             onError={() => handleImageError(type)}
//           />
//           <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded"></div>
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//             <span className="bg-black bg-opacity-75 text-white px-4 py-2 rounded text-sm">Click to enlarge</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
      
//       <div className="p-6 max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Driver Application Details</h1>
        
//         {/* Personal Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
//             <div className="space-y-3">
//               <p><span className="font-medium">Name:</span> {application.firstName} {application.lastName}</p>
//               <p><span className="font-medium">Email:</span> {application.email}</p>
//               <p><span className="font-medium">Phone:</span> {application.phoneNumber}</p>
//               <p><span className="font-medium">License Number:</span> {application.licenseNumber}</p>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
//             <div className="space-y-3">
//               <p><span className="font-medium">Vehicle Type:</span> {application.vehicleType}</p>
//               <p><span className="font-medium">Vehicle Number:</span> {application.vehicleNumber}</p>
//               <p><span className="font-medium">Starting Location:</span> {application.startingPoint}</p>
//               <p><span className="font-medium">Destination:</span> {application.destinationLocation}</p>
//               <p><span className="font-medium">Departure Time:</span> {application.departureTime}</p>
//               <p><span className="font-medium">Pickup Point:</span> {application.pickupPoint}</p>
//               <p><span className="font-medium">Dropoff Point:</span> {application.dropOffPoint}</p>
//             </div>
//           </div>
//         </div>

//         {/* Status Section */}
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <h2 className="text-xl font-semibold mb-4">Application Status</h2>
//           <div className="space-y-3">
//             <p>
//               <span className="font-medium">Status:</span>
//               <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
//                 application.status === "Approved"
//                   ? "bg-green-100 text-green-800"
//                   : application.status === "Pending"
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-red-100 text-red-800"
//               }`}>
//                 {application.status}
//               </span>
//             </p>
//             <p><span className="font-medium">Created At:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
//             {application.approvedAt && (
//               <p><span className="font-medium">Approved At:</span> {new Date(application.approvedAt).toLocaleDateString()}</p>
//             )}
//           </div>

//           {/* Show buttons only if the status is Pending */}
//           {application.status === "Pending" && (
//           <div className="mt-4 flex gap-4">
//             <button
//             onClick={handleApprove}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               {isApproving? "Approving" : "Approve"}
//           </button>
//           <button
//           onClick={handleReject}
//           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             {isRejecting? "Rejecting":"Reject"}
//           </button>
//           </div>
//   )}
//         </div>

//         {/* Documents Section */}
//         <div>
//           <h2 className="text-2xl font-semibold mb-6">Documents</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {renderDocument(
//               application.licensePhotoPath,
//               "license",
//               "Driver's License",
//               "Official driving license issued by the government"
//             )}
            
//             {renderDocument(
//               application.driverPhotoPath,
//               "driver",
//               "Driver Photo",
//               "Recent photograph of the driver"
//             )}
            
//             {renderDocument(
//               application.billbookPhotoPath,
//               "billbook",
//               "Vehicle Billbook",
//               "Official vehicle registration document"
//             )}
            
//             {renderDocument(
//               application.citizenshipFrontPath,
//               "citizenshipFront",
//               "Citizenship Card (Front)",
//               "Front side of the citizenship identification card"
//             )}
            
//             {renderDocument(
//               application.citizenshipBackPath,
//               "citizenshipBack",
//               "Citizenship Card (Back)",
//               "Back side of the citizenship identification card"
//             )}
            
//             {renderDocument(
//               application.selfieWithIDPath,
//               "selfie",
//               "Selfie with ID",
//               "Self-portrait photograph with identification document"
//             )}
            
//             {renderDocument(
//               application.vehiclePhotoPath,
//               "vehicle",
//               "Vehicle Photo",
//               "Current photograph of the vehicle to be used"
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Image Modal */}
//       {selectedImage && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
//           onClick={() => setSelectedImage(null)}
//         >
//           <div className="relative w-full h-full flex items-center justify-center">
//             {/* Close button */}
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {/* Image container */}
//             <div 
//               className="max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={selectedImage}
//                 alt="Enlarged view"
//                 className="w-full h-full object-contain"
//                 style={{ maxHeight: '90vh' }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewDriverApplication;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import Navbar from "../Navbar/Navbar";
import { singleDriverApplication, approveDriverApplication, rejectDriverApplication} from "../../services/DriverService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewDriverApplication = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");

  useEffect(() => {
    const fetchSingleDriverApplication = async () => {
      try {
        const data = await singleDriverApplication(id);
        setApplication(data);
      } catch {
        setError("Failed to load driver application details");
        console.log("Error while fetching driver application");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleDriverApplication();
  }, [id]);

  const handleApprove = async() => {
    setIsApproving(true);
    try {
      await approveDriverApplication(id);
      setApplication((prev) => ({ ...prev, status: "Approved" }));
      toast.success("Application approved successfully.");
    } catch (errorMessage) {
      toast.error(errorMessage); // This now shows the exact message from backend
    } finally {
      setIsApproving(false);
    }
  };

  const handleOpenRejectModal = () => {
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectionMessage("");
  };

  const handleReject = async() => {
    if (!rejectionMessage.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    setIsRejecting(true);
    try {
      await rejectDriverApplication(id, rejectionMessage);
      setApplication((prev) => ({...prev, status: "Rejected"}));
      toast.success("Application rejected successfully");
      handleCloseRejectModal();
    } catch (errorMessage) {
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to reject the application");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleImageError = (type) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const renderDocument = (path, type, title, description) => {
    if (imageLoadErrors[type] || !path) {
      return (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
          No Image Available
        </div>
      );
    }

    const cleanPath = path.replace(/^wwwroot[\\/]+/, "").replace(/\\/g, "/");
    const fullImageUrl = `${API_BASE_URL}/${cleanPath}`;

    return (
      <div className="bg-white p-4 rounded-lg shadow h-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-3 text-sm">{description}</p>
        <div className="relative group cursor-pointer h-64" onClick={() => setSelectedImage(fullImageUrl)}>
          <img
            src={fullImageUrl}
            alt={title}
            className="w-full h-full object-cover rounded shadow transition-transform duration-200 hover:scale-105"
            onError={() => handleImageError(type)}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="bg-black bg-opacity-75 text-white px-4 py-2 rounded text-sm">Click to enlarge</span>
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
              <p><span className="font-medium">Starting Location:</span> {application.startingPoint}</p>
              <p><span className="font-medium">Destination:</span> {application.destinationLocation}</p>
              <p><span className="font-medium">Departure Time:</span> {application.departureTime}</p>
              <p><span className="font-medium">Pickup Point:</span> {application.pickupPoint}</p>
              <p><span className="font-medium">Dropoff Point:</span> {application.dropOffPoint}</p>
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

          {/* Show buttons only if the status is Pending */}
          {application.status === "Pending" && (
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {isApproving ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={handleOpenRejectModal}
              disabled={isRejecting}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </button>
          </div>
          )}
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image container */}
            <div 
              className="max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-full object-contain"
                style={{ maxHeight: '90vh' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseRejectModal}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Reject Driver Application</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection. This message will be sent to {application.firstName} {application.lastName}.</p>
            
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full border border-gray-300 rounded p-3 min-h-[120px] mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseRejectModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || !rejectionMessage.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {isRejecting ? "Rejecting..." : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDriverApplication;