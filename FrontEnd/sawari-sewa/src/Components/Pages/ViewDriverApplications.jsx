// import React, { useState, useEffect } from "react";
// import { allDriverApplications } from "../../services/DriverService";

// const ViewDriverApplications = () => {
//   const [driverApplications, setDriverApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   const pageSize = 10;
//   const baseUrl = "http://localhost:5000/"; // Update this if your API has a different base URL

//   useEffect(() => {
//     const fetchDriverApplications = async () => {
//       try {
//         const data = await allDriverApplications(currentPage, pageSize);
//         setDriverApplications(data.data); // Assuming the API returns `data`
//         setTotalPages(Math.ceil(data.totalCount / pageSize));
//       } catch (err) {
//         setError("Failed to load driver applications");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDriverApplications();
//   }, [currentPage]);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Driver Applications</h1>
//       {driverApplications.length === 0 ? (
//         <p>No driver applications found.</p>
//       ) : (
//         <table border="1">
//           <thead>
//             <tr>
//               <th>First Name</th>
//               <th>Last Name</th>
//               <th>License Number</th>
//               <th>Vehicle Type</th>
//               <th>Vehicle Number</th>
//               <th>Status</th>
//               <th>Created At</th>
//               <th>Approved At</th>
//               <th>Driver Photo</th>
//               <th>License Photo</th>
//               <th>Billbook Photo</th>
//               <th>Selfie with ID</th>
//               <th>Citizenship Card Front</th>
//               <th>Citizenship Card Back</th>
//             </tr>
//           </thead>
//           <tbody>
//             {driverApplications.map((application) => (
//               <tr key={application.id}>
//                 <td>{application.firstName}</td>
//                 <td>{application.lastName}</td>
//                 <td>{application.licenseNumber}</td>
//                 <td>{application.vehicleType}</td>
//                 <td>{application.vehicleNumber}</td>
//                 <td>{application.status}</td>
//                 <td>{new Date(application.createdAt).toLocaleDateString()}</td>
//                 <td>
//                   {application.approvedAt
//                     ? new Date(application.approvedAt).toLocaleDateString()
//                     : "Not Approved Yet"}
//                 </td>

//                 {/* Render images only if the path exists */}
//                 <td>
//                   {application.driverPhotoPath && (
//                     <img
//                       src={`${baseUrl}${application.driverPhotoPath}`}
//                       alt="Driver"
//                       className="w-12 h-12 object-cover"
//                       onError={(e) => (e.target.src = "default-driver-image.png")} // Use default image on error
//                     />
//                   )}
//                 </td>
//                 <td>
//                   {application.licensePhotoPath && (
//                     <img
//                       src={`${baseUrl}${application.licensePhotoPath}`}
//                       alt="License"
//                       className="w-12 h-12 object-cover"
//                       onError={(e) => (e.target.src = "default-license-image.png")} // Use default image on error
//                     />
//                   )}
//                 </td>
//                 <td>
//                   {application.billbookPhotoPath && (
//                     <img
//                       src={`${baseUrl}${application.billbookPhotoPath}`}
//                       alt="Billbook"
//                       className="w-12 h-12 object-cover"
//                       onError={(e) => (e.target.src = "default-billbook-image.png")} // Use default image on error
//                     />
//                   )}
//                 </td>
//                 <td>
//                   {application.selfieWithIDPath && (
//                     <img
//                       src={`${baseUrl}${application.selfieWithIDPath}`}
//                       alt="Selfie with ID"
//                       className="w-12 h-12 object-cover"
//                       onError={(e) => (e.target.src = "default-selfie-image.png")} // Use default image on error
//                     />
//                   )}
//                 </td>
//                 <td>
//                   {application.citizenshipFrontPath && (
//                     <img
//                       src={`${baseUrl}${application.citizenshipFrontPath}`}
//                       alt="Citizenship Card Front"
//                       className="w-12 h-12 object-cover"
//                       onError={(e) => (e.target.src = "default-citizenship-front.png")} // Use default image on error
//                     />
//                   )}
//                 </td>
//                 <td>
//                   {application.citizenshipBackPath && (
//                     <img
//                       src={`${baseUrl}${application.citizenshipBackPath}`}
//                       alt="Citizenship Card Back"
//                       className="w-12 h-12 object-cover"
//                       onError={(e) => (e.target.src = "default-citizenship-back.png")} // Use default image on error
//                     />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Pagination Controls */}
//       <div>
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           {" "}
//           Page {currentPage} of {totalPages}{" "}
//         </span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewDriverApplications;

import React, { useState, useEffect } from "react";
import { allDriverApplications } from "../../services/DriverService";
import { API_BASE_URL } from "../../config";

const ViewDriverApplications = () => {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Driver Applications</h1>
      {driverApplications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No driver applications found.</p>
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
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {application.firstName} {application.lastName}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {application.licenseNumber}
                  </td>
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
                    {renderImage(application.vehiclePhotoPath,"Vehicle",application.id,"vehicle")}
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
  );
};

export default ViewDriverApplications;
