// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { fetchAvailableVehicles, fetchBookedSeats } from "../../services/vehicleService";
// import { PATHS } from "../../constants/paths";
// import SeatSelection from "./SeatSelection";
// import BookingDetails from "./BookingDetails";

// const AvailableVehicle = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const params = new URLSearchParams(location.search);

//   const startingPoint = params.get("startingPoint");
//   const destination = params.get("destination");
//   const vehicleType = params.get("vehicleType");
//   const departureDate = params.get("departureDate");

//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTab, setSelectedTab] = useState("All");
//   const [departureFilters, setDepartureFilters] = useState([]);
//   const [vehicleTypeFilters, setVehicleTypeFilters] = useState([]);
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [totalFare, setTotalFare] = useState(0);
//   const [selectedBoardingPoint, setSelectedBoardingPoint] = useState("");
//   const [showLoginMessage, setShowLoginMessage] = useState(false);
//   const [bookedSeats, setBookedSeats] = useState([]);
//   const [vehicleAvailabilityId, setVehicleAvailabilityId] = useState(null);
  

//   useEffect(() => {
//     if (!startingPoint || !destination || !vehicleType || !departureDate) {
//       setError("Missing required parameters");
//       setLoading(false);
//       return;
//     }

//     const getAvailableVehicles = async () => {
//       try {
//         const response = await fetchAvailableVehicles(startingPoint, destination, vehicleType, departureDate);
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
//   }, [startingPoint, destination, vehicleType, departureDate]);

//   useEffect(() => {
//     // Calculate total fare based on selected seats and vehicle fare
//     if (selectedVehicleId !== null && selectedSeats.length > 0) {
//       const vehicle = vehicles.find((v, index) => v.id === selectedVehicleId || index === selectedVehicleId);
//       if (vehicle) {
//         setTotalFare(vehicle.fare * selectedSeats.length);
//       }
//     } else {
//       setTotalFare(0);
//     }
//   }, [selectedSeats, selectedVehicleId, vehicles]);

  

//   if (loading) return <p className="text-center text-xl">Loading available vehicles...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   const handleDepartureFilter = (filter) => {
//     setDepartureFilters((prev) =>
//       prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
//     );
//   };

//   const handleVehicleTypeFilter = (filter) => {
//     setVehicleTypeFilters((prev) =>
//       prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
//     );
//   };


// const handleViewSeats = async (vehicleId) => {
//   const isNewSelection = vehicleId !== selectedVehicleId;
//   setSelectedVehicleId(isNewSelection ? vehicleId : null);
  
//   console.log("Vehicle ID:", vehicleId);

//   if (isNewSelection) {
//       try {
//           const data = await fetchBookedSeats(vehicleId);
//           console.log("Booked seats data:", data);

//           // Ensure correct format
//           const seatsArray = Array.isArray(data) ? data : (data.bookedSeats || []);
//           setBookedSeats(seatsArray);
//       } catch (error) {
//           console.error("Failed to fetch booked seats:", error);
//           setBookedSeats([]);
//       }
//   } else {
//       setBookedSeats([]);
//   }

//   // Reset seat selection and fare
//   setSelectedSeats([]);
//   setTotalFare(0);
//   setShowLoginMessage(false);
// };

//   // Function to handle seat selection
//   const handleSeatSelection = (seatId) => {
//     setSelectedSeats((prevSeats) =>
//       prevSeats.includes(seatId)
//         ? prevSeats.filter((seat) => seat !== seatId)
//         : [...prevSeats, seatId]
//     );
//   };

//   const handleContinue = () => {
//     // Check if token exists in local storage
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       // Show login message if token doesn't exist
//       setShowLoginMessage(true);
//     } else {
//       // Get the selected vehicle details
//       const vehicle = vehicles.find((v, index) => v.id === selectedVehicleId || index === selectedVehicleId);
      
//       // Navigate to booking confirmation page with all necessary details
//       navigate(PATHS.BOOKINGCONFIRMATION, { 
//         state: { 
//           selectedSeats,
//           totalFare,
//           vehicleDetails: vehicle,
//           startingPoint,
//           destination
//         } 
//       });
//     }
//   };

//   const navigateToLogin = () => {
//     // Navigate to login page and store current page info for redirect back
//     navigate('/login', { 
//       state: { 
//         redirectTo: location.pathname + location.search,
//         selectedSeats,
//         selectedVehicleId
//       } 
//     });
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen font-sans">
      
//       {/* Header */}
//       <div className="bg-white p-6 shadow-md">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-semibold text-gray-700">
//               {startingPoint} to {destination} Vehicle Tickets
//             </h1>
//             <div className="text-sm text-gray-600">
//               <a href="/" className="text-blue-500">
//                 Home
//               </a>
//               <span className="mx-2">&gt;</span>
//               <span>{startingPoint} to {destination}</span>
//             </div>
//           </div>
//         </div>
//       </div> 
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         {/* Results */}
//         <div>
//           {vehicles.filter(vehicle => {
//             const matchesDeparture = departureFilters.length > 0 ? departureFilters.includes(vehicle.departureTime) : true;
//             const matchesVehicleType = vehicleTypeFilters.length > 0 ? vehicleTypeFilters.includes(vehicle.type) : true;
//             return matchesDeparture && matchesVehicleType;
//           }).length === 0 ? (
//             <div className="bg-white p-8 rounded-lg shadow-md text-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p className="text-gray-500 text-xl mt-4">No vehicles available for this route.</p>
//               <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
//                 Try different dates
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {vehicles.filter(vehicle => {
//                 const matchesDeparture = departureFilters.length > 0 ? departureFilters.includes(vehicle.departureTime) : true;
//                 const matchesVehicleType = vehicleTypeFilters.length > 0 ? vehicleTypeFilters.includes(vehicle.type) : true;
//                 return matchesDeparture && matchesVehicleType;
//               }).map((vehicle, index) => (
//                 <div
//                   key={vehicle.id || index} 
//                   className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
//                 >
//                   {/* Vehicle header with type/class */}
//                   <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3 border-b border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center">
//                         <div className="bg-blue-600 text-white p-2 rounded-full mr-3">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                           </svg>
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-bold text-gray-900">
//                             {vehicle.vehicleType} 
//                           </h3>
//                           <div className="flex items-center">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                               <span className="text-sm text-gray-600">Vehicle No. {vehicle.vehicleNumber}</span>
//                             </div>
//                         </div>
//                       </div>
//                       <div className="hidden md:block">
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                           <svg className="mr-1 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
//                             <circle cx="4" cy="4" r="3" />
//                           </svg>
//                           Available 
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Main content */}
//                   <div className="p-6">
//                     <div className="flex flex-col md:flex-row justify-between">
//                       {/* Journey details */}
//                       <div className="flex flex-col space-y-4 justify-between w-full">
//                         <div className="flex items-center space-x-4">
//                           {/* Departure */}
//                           <div className="flex-1">
//                             <div className="text-gray-600">{vehicle.location}</div>
//                             <div className="text-sm text-gray-500">Starting Point</div>
//                             <div className="text-sm text-gray-500">Pick Up point: {vehicle.pickupPoint}</div>
//                           </div>

//                           {/* Journey visual */}
//                           <div className="flex-1 flex flex-col items-center">
//                             <div className="text-sm font-medium text-gray-500">
//                               Departure Time : {vehicle.departureTime}
//                             </div>
//                             <div className="w-full flex items-center">
//                               <div className="h-2 w-2 rounded-full bg-blue-600"></div>
//                               <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
//                               <div className="h-2 w-2 rounded-full bg-blue-600"></div>
//                             </div>
//                             <div className="text-sm font-medium text-gray-500">
//                               Departure Date : {new Date(vehicle.departureDate).toLocaleDateString()}
//                             </div>
//                           </div>

//                           {/* Arrival */}
//                           <div className="flex-1 text-right">
//                             <div className="text-gray-600">{vehicle.destination}</div>
//                             <div className="text-sm text-gray-500">Final Destination</div>
//                             <div className="text-sm text-gray-500">Drop Off point: {vehicle.dropOffPoint}</div>
//                           </div>
//                         </div>
//                         {/* Footer */}
//                         <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
//                           <div className="flex flex-wrap gap-4">
                            
//                             <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-sm">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                               </svg>
//                               Reviews
//                             </button>
//                             <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-sm">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                               Cancellation Policy
//                             </button>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Pricing and booking */}
//                       <div className="md:w-64 mt-4 md:mt-0 md:ml-6 md:border-l md:border-gray-200 md:pl-6 flex flex-col justify-between">
//                         <div>
//                           <div className="text-2xl font-bold text-gray-800">Rs.{vehicle.fare}</div>
//                           {vehicle.oldFare && vehicle.oldFare > vehicle.fare && (
//                             <div className="text-sm text-gray-500 line-through">Rs.{vehicle.oldFare}</div>
//                           )}
                          
//                           <div className="flex items-center mt-2">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
//                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                             </svg>
//                             <span className="text-sm text-gray-600 ml-1">
//                               {vehicle.rating || "4.5"} 
//                             </span>
//                           </div>
//                           <div className="mt-2 flex items-center text-sm font-medium text-green-600">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                             {vehicle.availableSeats} Seats Available 
//                           </div>
//                         </div>
                        
//                         <button 
//                           className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors font-medium"
//                           onClick={() => handleViewSeats(vehicle.id || index)}
//                         >
//                           {selectedVehicleId === (vehicle.id || index) ? "Hide Seats" : "View Seats"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Seat selection area - displays when View Seats is clicked */}
//                   {selectedVehicleId === (vehicle.id || index) && (
//                     <div className="border-t border-gray-200 bg-gray-50 p-6">
//                       <div className="flex flex-col md:flex-row md:space-x-6">
//                         {/* Seat map */}
//                         <div className="md:w-2/3">
//                           <SeatSelection 
//                             vehicleId={vehicle.id || index}
//                             bookedSeats={bookedSeats}
//                             selectedSeats={selectedSeats}
//                             onSeatSelect={handleSeatSelection}
//                             fare={vehicle.fare}
//                             vehicleType= {vehicleType}
//                             totalSeats={vehicle.totalSeats}
//                           />
//                         </div>
                        
//                         {/* Booking details */}
//                         <div className="md:w-1/3">
//                           <BookingDetails 
//                             selectedSeats={selectedSeats}
//                             vehicleAvailabilityId={vehicle.id }
//                             totalFare={totalFare}
//                             pickupPoint={vehicle.pickupPoint}
//                             fare={vehicle.fare}
//                             showLoginMessage={showLoginMessage}
//                             onContinue={handleContinue}
//                             onLogin={navigateToLogin}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvailableVehicle;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAvailableVehicles, fetchBookedSeats } from "../../services/vehicleService";
import { PATHS } from "../../constants/paths";
import SeatSelection from "./SeatSelection";
import BookingDetails from "./BookingDetails";

const AvailableVehicle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const startingPoint = params.get("startingPoint");
  const destination = params.get("destination");
  const vehicleType = params.get("vehicleType");
  const departureDate = params.get("departureDate");

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const [departureFilters, setDepartureFilters] = useState([]);
  const [vehicleTypeFilters, setVehicleTypeFilters] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalFare, setTotalFare] = useState(0);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState("");
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [vehicleAvailabilityId, setVehicleAvailabilityId] = useState(null);
  

  useEffect(() => {
    if (!startingPoint || !destination || !vehicleType || !departureDate) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const getAvailableVehicles = async () => {
      try {
        const response = await fetchAvailableVehicles(startingPoint, destination, vehicleType, departureDate);
        // Filter out vehicles with 0 available seats
        const availableVehicles = response.filter(vehicle => vehicle.availableSeats > 0);
        
        if (availableVehicles.length === 0) {
          setError("No vehicles available for this route.");
        } else {
          setVehicles(availableVehicles);
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching vehicles.");
      } finally {
        setLoading(false);
      }
    };

    getAvailableVehicles();
  }, [startingPoint, destination, vehicleType, departureDate]);

  useEffect(() => {
    // Calculate total fare based on selected seats and vehicle fare
    if (selectedVehicleId !== null && selectedSeats.length > 0) {
      const vehicle = vehicles.find((v, index) => v.id === selectedVehicleId || index === selectedVehicleId);
      if (vehicle) {
        setTotalFare(vehicle.fare * selectedSeats.length);
      }
    } else {
      setTotalFare(0);
    }
  }, [selectedSeats, selectedVehicleId, vehicles]);

  

  if (loading) return <p className="text-center text-xl">Loading available vehicles...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const handleDepartureFilter = (filter) => {
    setDepartureFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };

  const handleVehicleTypeFilter = (filter) => {
    setVehicleTypeFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };


const handleViewSeats = async (vehicleId) => {
  const isNewSelection = vehicleId !== selectedVehicleId;
  setSelectedVehicleId(isNewSelection ? vehicleId : null);
  
  console.log("Vehicle ID:", vehicleId);

  if (isNewSelection) {
      try {
          const data = await fetchBookedSeats(vehicleId);
          console.log("Booked seats data:", data);

          // Ensure correct format
          const seatsArray = Array.isArray(data) ? data : (data.bookedSeats || []);
          setBookedSeats(seatsArray);
      } catch (error) {
          console.error("Failed to fetch booked seats:", error);
          setBookedSeats([]);
      }
  } else {
      setBookedSeats([]);
  }

  // Reset seat selection and fare
  setSelectedSeats([]);
  setTotalFare(0);
  setShowLoginMessage(false);
};

  // Function to handle seat selection
  const handleSeatSelection = (seatId) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatId)
        ? prevSeats.filter((seat) => seat !== seatId)
        : [...prevSeats, seatId]
    );
  };

  const handleContinue = () => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Show login message if token doesn't exist
      setShowLoginMessage(true);
    } else {
      // Get the selected vehicle details
      const vehicle = vehicles.find((v, index) => v.id === selectedVehicleId || index === selectedVehicleId);
      
      // Navigate to booking confirmation page with all necessary details
      navigate(PATHS.BOOKINGCONFIRMATION, { 
        state: { 
          selectedSeats,
          totalFare,
          vehicleDetails: vehicle,
          startingPoint,
          destination
        } 
      });
    }
  };

  const navigateToLogin = () => {
    // Navigate to login page and store current page info for redirect back
    navigate('/login', { 
      state: { 
        redirectTo: location.pathname + location.search,
        selectedSeats,
        selectedVehicleId
      } 
    });
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
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Results */}
        <div>
          {vehicles.filter(vehicle => {
            const matchesDeparture = departureFilters.length > 0 ? departureFilters.includes(vehicle.departureTime) : true;
            const matchesVehicleType = vehicleTypeFilters.length > 0 ? vehicleTypeFilters.includes(vehicle.type) : true;
            // Only include vehicles with available seats greater than 0
            return matchesDeparture && matchesVehicleType;
          }).length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-xl mt-4">No vehicles available for this route.</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Try different dates
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.filter(vehicle => {
                const matchesDeparture = departureFilters.length > 0 ? departureFilters.includes(vehicle.departureTime) : true;
                const matchesVehicleType = vehicleTypeFilters.length > 0 ? vehicleTypeFilters.includes(vehicle.type) : true;
                // Only display vehicles with available seats greater than 0
                return matchesDeparture && matchesVehicleType;
              }).map((vehicle, index) => (
                <div
                  key={vehicle.id || index} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                >
                  {/* Vehicle header with type/class */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-600 text-white p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {vehicle.vehicleType} 
                          </h3>
                          <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-gray-600">Vehicle No. {vehicle.vehicleNumber}</span>
                            </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <svg className="mr-1 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Available 
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      {/* Journey details */}
                      <div className="flex flex-col space-y-4 justify-between w-full">
                        <div className="flex items-center space-x-4">
                          {/* Departure */}
                          <div className="flex-1">
                            <div className="text-gray-600">{vehicle.location}</div>
                            <div className="text-sm text-gray-500">Starting Point</div>
                            <div className="text-sm text-gray-500">Pick Up point: {vehicle.pickupPoint}</div>
                          </div>

                          {/* Journey visual */}
                          <div className="flex-1 flex flex-col items-center">
                            <div className="text-sm font-medium text-gray-500">
                              Departure Time : {vehicle.departureTime}
                            </div>
                            <div className="w-full flex items-center">
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                              <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                              Departure Date : {new Date(vehicle.departureDate).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Arrival */}
                          <div className="flex-1 text-right">
                            <div className="text-gray-600">{vehicle.destination}</div>
                            <div className="text-sm text-gray-500">Final Destination</div>
                            <div className="text-sm text-gray-500">Drop Off point: {vehicle.dropOffPoint}</div>
                          </div>
                        </div>
                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                          <div className="flex flex-wrap gap-4">
                            
                            <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              Reviews
                            </button>
                            <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Cancellation Policy
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pricing and booking */}
                      <div className="md:w-64 mt-4 md:mt-0 md:ml-6 md:border-l md:border-gray-200 md:pl-6 flex flex-col justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-800">Rs.{vehicle.fare}</div>
                          {vehicle.oldFare && vehicle.oldFare > vehicle.fare && (
                            <div className="text-sm text-gray-500 line-through">Rs.{vehicle.oldFare}</div>
                          )}
                          
                          <div className="flex items-center mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-gray-600 ml-1">
                              {vehicle.rating || "4.5"} 
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm font-medium text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {vehicle.availableSeats} Seats Available 
                          </div>
                        </div>
                        
                        <button 
                          className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors font-medium"
                          onClick={() => handleViewSeats(vehicle.id || index)}
                        >
                          {selectedVehicleId === (vehicle.id || index) ? "Hide Seats" : "View Seats"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Seat selection area - displays when View Seats is clicked */}
                  {selectedVehicleId === (vehicle.id || index) && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <div className="flex flex-col md:flex-row md:space-x-6">
                        {/* Seat map */}
                        <div className="md:w-2/3">
                          <SeatSelection 
                            vehicleId={vehicle.id || index}
                            bookedSeats={bookedSeats}
                            selectedSeats={selectedSeats}
                            onSeatSelect={handleSeatSelection}
                            fare={vehicle.fare}
                            vehicleType={vehicleType}
                            totalSeats={vehicle.totalSeats}
                          />
                        </div>
                        
                        {/* Booking details */}
                        <div className="md:w-1/3">
                          <BookingDetails 
                            selectedSeats={selectedSeats}
                            vehicleAvailabilityId={vehicle.id}
                            totalFare={totalFare}
                            pickupPoint={vehicle.pickupPoint}
                            fare={vehicle.fare}
                            showLoginMessage={showLoginMessage}
                            onContinue={handleContinue}
                            onLogin={navigateToLogin}
                          />
                        </div>
                      </div>
                    </div>
                  )}
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