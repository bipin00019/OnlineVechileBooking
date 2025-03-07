// "use client"

// import { useState, useEffect } from "react"
// import { useSearchParams } from "react-router-dom"
// import { fetchAvailableVehicles } from "../../services/vehicleSerive"
// import { useLocation } from "react-router-dom"

// const AvailableVehicle = () => {

//   const location = useLocation();
//   const params = new URLSearchParams(location.search)

//   const startingPoint = params.get("startingPoint");
//   const destination = params.get("destination");
//   const vehicleType = params.get("vehicleType");

//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectedTab, setSelectedTab] = useState("All")
//   const [departureFilters, setDepartureFilters] = useState([])
//   const [busTypeFilters, setBusTypeFilters] = useState([])

//   useEffect(() => {
//     // Validate parameters before fetching
//     if (!startingPoint || !destination || !vehicleType) {
//       setError("Missing required parameters");
//       setLoading(false);
//       return;
//     }

//     const getAvailableVehicles = async () => {
//       try {
//         const response = await fetchAvailableVehicles(startingPoint, destination, vehicleType);
//         if (response.length === 0) {
//           setError("No vehicles available for this route.");
//         } else {
//           setVehicles(response);
//         }
//       } catch (err) {
//         setError(err.message || "An error occurred while fetching vehicles.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getAvailableVehicles();
//   }, [startingPoint, destination, vehicleType]);

//   if (loading) return <p>Loading available vehicles...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;

//   const handleDepartureFilter = (filter) => {
//     if (departureFilters.includes(filter)) {
//       setDepartureFilters(departureFilters.filter((item) => item !== filter))
//     } else {
//       setDepartureFilters([...departureFilters, filter])
//     }
//   }

//   const handleBusTypeFilter = (filter) => {
//     if (busTypeFilters.includes(filter)) {
//       setBusTypeFilters(busTypeFilters.filter((item) => item !== filter))
//     } else {
//       setBusTypeFilters([...busTypeFilters, filter])
//     }
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen font-sans">
//       {/* Header */}
//       <div className="bg-white p-4 shadow-sm">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-xl font-medium text-gray-700">{startingPoint} to {destination} Vehicle Tickets</h1>
//             </div>
//             <div className="flex items-center space-x-2 text-sm">
//               <a href="/" className="text-blue-500">
//                 Home
//               </a>
//               <span className="text-gray-400">&gt;</span>
//               <span className="text-gray-600">{startingPoint} to {destination}</span>
//             </div>
//           </div>
//         </div>
//       </div>
  
//       {/* Search Form */}
//       <div className="max-w-7xl mx-auto py-4 px-4">
//         <div className="flex flex-col md:flex-row gap-2">
//           <div className="relative flex-1">
//             <div className="border bg-white rounded flex items-center justify-between p-3">
//               <span className="text-gray-700">{startingPoint}</span>
//               <button className="text-gray-500">×</button>
//             </div>
//           </div>
  
//           <div className="flex items-center justify-center bg-gray-200 w-10 h-10 rounded">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-gray-500"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
//               />
//             </svg>
//           </div>
  
//           <div className="relative flex-1">
//             <div className="border bg-white rounded flex items-center justify-between p-3">
//               <span className="text-gray-700">{destination}</span>
//               <button className="text-gray-500">×</button>
//             </div>
//           </div>
  
//           <div className="relative flex-1">
//             <input
//               type="text"
//               className="w-full border rounded p-3"
//               placeholder="YYYY-MM-DD"
//               value="2081-11-22"
//               readOnly
//             />
//           </div>
  
//           <button className="bg-blue-600 text-white rounded px-6 py-3 font-medium">Search</button>
//         </div>
//       </div>
//       <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-4">
        
//       </div>
//       {/* Date Navigation */}
      
//         <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-4">
//           <button className="bg-blue-500 text-white rounded px-4 py-2 flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Previous
//           </button>
  
//           <div className="text-xl font-medium">2081-11-22</div>
  
//           <button className="bg-blue-500 text-white rounded px-4 py-2 flex items-center">
//             Next
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 ml-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
   
  
//       {/* Filters and Results */}
//       <div className="max-w-7xl mx-auto px-4">
//         <div className=" gap-6"> 
//           <div className="flex-1">
//             {/* Tabs */}
//             <div className="flex border-b overflow-x-auto">
//               <button
//                 key="All"
//                 className={`px-6 py-3 font-medium whitespace-nowrap ${selectedTab === "All" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
//                 onClick={() => setSelectedTab("All")}
//               >
//                 All
//               </button>
//             </div>
  
//             {vehicles.length===0 ? (
//               <p>No vehicles available for this route.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {vehicles.map((vehicle) => (
//             <div key={vehicle.Id} className="bg-white p-4 rounded-lg shadow-lg">
//               {/* <img src={vehicle.VehiclePhotoPath || "/default-image.jpg"} alt="Vehicle" className="w-full h-40 object-cover rounded-md" /> */}
//               <h3 className="text-xl font-bold mt-2">{vehicle.vehicleType} - {vehicle.vehicleNumber}</h3>
//               <p className="text-gray-700">Driver: {vehicle.FirstName} {vehicle.lastName}</p>
//               <p className="text-gray-500">Contact: {vehicle.phoneNumber}</p>
//               <p className="text-gray-500">Fare: Rs. {vehicle.fareAmount || "Not specified"}</p>
//               <p className="text-gray-600">Departure: {vehicle.departureTime || "N/A"}</p>
//             </div>
//           ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
  
// }

// export default AvailableVehicle



import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchAvailableVehicles } from "../../services/vehicleSerive";

const AvailableVehicle = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const startingPoint = params.get("startingPoint");
  const destination = params.get("destination");
  const vehicleType = params.get("vehicleType");

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const [departureFilters, setDepartureFilters] = useState([]);
  const [busTypeFilters, setBusTypeFilters] = useState([]);

  useEffect(() => {
    if (!startingPoint || !destination || !vehicleType) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const getAvailableVehicles = async () => {
      try {
        const response = await fetchAvailableVehicles(startingPoint, destination, vehicleType);
        if (response.length === 0) {
          setError("No vehicles available for this route.");
        } else {
          setVehicles(response);
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching vehicles.");
      } finally {
        setLoading(false);
      }
    };

    getAvailableVehicles();
  }, [startingPoint, destination, vehicleType]);

  if (loading) return <p className="text-center text-xl">Loading available vehicles...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const handleDepartureFilter = (filter) => {
    setDepartureFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };

  const handleBusTypeFilter = (filter) => {
    setBusTypeFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-700">
              {startingPoint} to {destination} Vehicle Tickets
            </h1>
            <div className="text-sm text-gray-600">
              <a href="/" className="text-blue-500">
                Home
              </a>
              <span className="mx-2">&gt;</span>
              <span>{startingPoint} to {destination}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto py-4 px-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1">
            <div className="border bg-white rounded flex items-center justify-between p-4">
              <span className="text-gray-700">{startingPoint}</span>
              <button className="text-gray-500">×</button>
            </div>
          </div>

          <div className="flex items-center justify-center bg-gray-200 w-12 h-12 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>

          <div className="relative flex-1">
            <div className="border bg-white rounded flex items-center justify-between p-4">
              <span className="text-gray-700">{destination}</span>
              <button className="text-gray-500">×</button>
            </div>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              className="w-full border rounded p-3"
              placeholder="YYYY-MM-DD"
              value="2081-11-22"
              readOnly
            />
          </div>

          <button className="bg-blue-600 text-white rounded px-6 py-3 font-medium">Search</button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button className="bg-blue-500 text-white rounded px-4 py-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="text-xl font-medium">2081-11-22</div>

        <button className="bg-blue-500 text-white rounded px-4 py-2 flex items-center">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-4">
          <div className="flex border-b overflow-x-auto">
            <button
              key="All"
              className={`px-6 py-3 font-medium ${selectedTab === "All" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
              onClick={() => setSelectedTab("All")}
            >
              All
            </button>
          </div>

          {vehicles.length === 0 ? (
            <p className="text-center text-gray-500">No vehicles available for this route.</p>
          ) : (
            <div>
              {vehicles.map((vehicle, index) => (
                <div
                  key={vehicle.Id || index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full border"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    {vehicle.firstName} {vehicle.lastName}
                  </h3>

                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-xl font-bold text-gray-800">Departure Time</p>
                      <p className="text-xl font-bold text-gray-800">{vehicle.departureTime}</p>
                    </div>
                  </div>

                  <p className="text-gray-500 mt-2">Bike No. {vehicle.vehicleNumber}</p>

                  {/* Fare and Seats Available moved above the button */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">Rs.{vehicle.fareAmount}</p>
                      <p className="text-sm text-gray-600 mt-1">Seats Available</p>
                    </div>
                  </div>

                  {/* Book Seat Button */}
                  <div className="mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                      Book Seat
                    </button>
                  </div>

                  {/* Boarding & Dropping, Reviews */}
                  <div className="mt-4 border-t pt-2 text-gray-600 text-sm flex gap-4">
                    <p>Boarding & Dropping</p>
                    <p>Reviews</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableVehicle;
