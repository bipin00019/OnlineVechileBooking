// import React, { useState, useEffect } from 'react';
// import { setFareAndSchedule, editFareAndSchedule } from '../../../services/DriverDashboardService';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const BikeRiderDashboardFeatures = () => {
//   // State for set fare form
//   const [fare, setFare] = useState('');
//   const [totalSeats, setTotalSeats] = useState('');
//   const [bookedSeats, setBookedSeats] = useState('');
//   const [departureDate, setDepartureDate] = useState('');
  
//   // State for edit fare form
//   const [editFare, setEditFare] = useState('');
//   const [editTotalSeats, setEditTotalSeats] = useState('');
//   const [editBookedSeats, setEditBookedSeats] = useState('');
//   const [editDepartureDate, setEditDepartureDate] = useState('');
//   const [editScheduleId, setEditScheduleId] = useState('');
  
//   // State to control whether the forms are open or not
//   const [isFareFormOpen, setIsFareFormOpen] = useState(false);
//   const [isEditFareFormOpen, setIsEditFareFormOpen] = useState(false);
  
//   // State for schedules list that can be edited
//   const [schedules, setSchedules] = useState([]);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);

//   // Function to fetch all schedules
//   const fetchSchedules = async () => {
//     try {
//       // This is a placeholder - you'll need to implement this API function
//       // in your DriverDashboardService
//       const response = await axios.get('https://localhost:7291/api/DriverDashboard/schedules');
//       setSchedules(response.data);
//     } catch (error) {
//       console.error("Error fetching schedules:", error);
//       toast.error("Failed to load schedules. Please try again.");
//     }
//   };

//   // Fetch schedules on component mount
//   useEffect(() => {
//     // Uncomment when API is ready
//     // fetchSchedules();
    
//     // Mock data for development
//     setSchedules([
//       { id: 1, fare: 3500, totalSeats: 2, bookedSeats: 1, departureDate: '2025-04-25T08:00:00' },
//       { id: 2, fare: 4000, totalSeats: 2, bookedSeats: 0, departureDate: '2025-04-26T09:30:00' },
//       { id: 3, fare: 3200, totalSeats: 2, bookedSeats: 2, departureDate: '2025-04-27T10:00:00' }
//     ]);
//   }, []);

//   // Populate edit form with selected schedule
//   const selectScheduleForEdit = (schedule) => {
//     setSelectedSchedule(schedule);
//     setEditFare(schedule.fare);
//     setEditTotalSeats(schedule.totalSeats);
//     setEditBookedSeats(schedule.bookedSeats);
//     setEditDepartureDate(schedule.departureDate.split('T')[0]); // Format date
//     setEditScheduleId(schedule.id);
//     setIsEditFareFormOpen(true);
//   };

//   // Handle set fare form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token"); // or use context/auth system
//     try {
//       const result = await setFareAndSchedule(fare, totalSeats, departureDate, token);
      
//       // Close form on successful submission
//       setIsFareFormOpen(false);
      
//       // Clear form fields after successful submission
//       setFare('');
//       setTotalSeats('');
//       setBookedSeats('');
//       setDepartureDate('');
      
//       // Refresh schedules list
//       fetchSchedules();
      
//       // Show success toast
//       toast.success("Fare and schedule successfully updated!", {
//         position: "top-right",
//         autoClose: 3000
//       });
//     } catch (err) {
//       toast.error("Failed to update fare and schedule. Please try again.", {
//         position: "top-right",
//         autoClose: 5000
//       });
//     }
//   };
  
  

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//       {/* Set Fare and Schedule Card */}
//       <div className="relative">
//         <div 
//           className={`bg-gradient-to-r ${isFareFormOpen ? 'from-white to-blue-500' : 'from-white to-blue-400'} 
//             p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
//             hover:shadow-lg hover:from-blue-400 hover:to-blue-500 hover:shadow-blue-200`}
//           onClick={() => {
//             setIsFareFormOpen(!isFareFormOpen);
//             setIsEditFareFormOpen(false); // Close edit form when opening set form
//           }}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <svg 
//                 className="h-6 w-6 mr-2 text-blue-800" 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="text-lg font-bold">Set Fare and Schedule</h3>
//             </div>
//             <svg 
//               className={`h-5 w-5 text-blue-800 transition-transform duration-300 ${isFareFormOpen ? 'transform rotate-180' : ''}`} 
//               fill="none" 
//               viewBox="0 0 24 24" 
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </div>
//         </div>
        
//         {isFareFormOpen && (
//           <div 
//             className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-200 transition-all duration-300 ease-in-out"
//             onClick={(e) => e.stopPropagation()} // Prevent the card from closing when clicking on the form
//           >
//             <div className="p-4">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block font-semibold text-gray-700">Fare (Rs)</label>
//                   <input
//                     type="number"
//                     value={fare}
//                     onChange={(e) => setFare(e.target.value)}
//                     className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-semibold text-gray-700">Total Seats</label>
//                   <input
//                     type="number"
//                     value={totalSeats}
//                     onChange={(e) => setTotalSeats(e.target.value)}
//                     className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-semibold text-gray-700">Booked Seats</label>
//                   <input
//                     type="number"
//                     value={bookedSeats}
//                     onChange={(e) => setBookedSeats(e.target.value)}
//                     className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-semibold text-gray-700">Departure Date</label>
//                   <input
//                     type="date"
//                     value={departureDate}
//                     onChange={(e) => setDepartureDate(e.target.value)}
//                     className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
//                     required
//                   />
//                 </div>
//                 <div className="flex items-center justify-between pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsFareFormOpen(false)}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center w-32 h-10"
//                   >
//                     <span>Submit</span>
//                     <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                     </svg>
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
      
      
      
//     </div>
//   );
// };

// export default BikeRiderDashboardFeatures;

import React, { useState, useEffect } from 'react';
import { setFareAndSchedule, editFareAndSchedule } from '../../../services/DriverDashboardService';
import { toast } from 'react-toastify';
import axios from 'axios';

const BikeRiderDashboardFeatures = () => {
  // State for set fare form
  const [fare, setFare] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [bookedSeats, setBookedSeats] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  
  // State for edit fare form
  const [editFare, setEditFare] = useState('');
  const [editTotalSeats, setEditTotalSeats] = useState('');
  const [editBookedSeats, setEditBookedSeats] = useState('');
  const [editDepartureDate, setEditDepartureDate] = useState('');
  const [editScheduleId, setEditScheduleId] = useState('');
  
  // State to control whether the forms are open or not
  const [isFareFormOpen, setIsFareFormOpen] = useState(false);
  const [isEditFareFormOpen, setIsEditFareFormOpen] = useState(false);
  
  // State for schedules list that can be edited
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Function to fetch all schedules
  const fetchSchedules = async () => {
    try {
      // This is a placeholder - you'll need to implement this API function
      // in your DriverDashboardService
      const response = await axios.get('https://localhost:7291/api/DriverDashboard/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load schedules. Please try again.");
    }
  };

  // Fetch schedules on component mount
  useEffect(() => {
    // Uncomment when API is ready
    // fetchSchedules();
    
    // Mock data for development
    setSchedules([
      { id: 1, fare: 3500, totalSeats: 2, bookedSeats: 1, departureDate: '2025-04-25T08:00:00' },
      { id: 2, fare: 4000, totalSeats: 2, bookedSeats: 0, departureDate: '2025-04-26T09:30:00' },
      { id: 3, fare: 3200, totalSeats: 2, bookedSeats: 2, departureDate: '2025-04-27T10:00:00' }
    ]);
  }, []);

  // Populate edit form with selected schedule
  const selectScheduleForEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setEditFare(schedule.fare);
    setEditTotalSeats(schedule.totalSeats);
    setEditBookedSeats(schedule.bookedSeats);
    setEditDepartureDate(schedule.departureDate.split('T')[0]); // Format date
    setEditScheduleId(schedule.id);
    setIsEditFareFormOpen(true);
  };

  // Handle set fare form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // or use context/auth system
    try {
      const result = await setFareAndSchedule(fare, totalSeats, departureDate, token);
      
      // Close form on successful submission
      setIsFareFormOpen(false);
      
      // Clear form fields after successful submission
      setFare('');
      setTotalSeats('');
      setBookedSeats('');
      setDepartureDate('');
      
      // Show success toast
      toast.success("Fare and schedule successfully updated!", {
        position: "top-right",
        autoClose: 3000
      });
      
      // Reload the page after successful submission
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update fare and schedule. Please try again.", {
        position: "top-right",
        autoClose: 5000
      });
    }
  };
  
  // Function to handle canceling the fare form
  const handleCancelFareForm = () => {
    setIsFareFormOpen(false);
    // Reload the page when canceling
    window.location.reload();
  };
  
  // Function to handle canceling the edit form
  const handleCancelEditForm = () => {
    setIsEditFareFormOpen(false);
    // Reload the page when canceling
    window.location.reload();
  };
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Set Fare and Schedule Card */}
      <div className="relative">
        <div 
          className={`bg-gradient-to-r ${isFareFormOpen ? 'from-white to-blue-500' : 'from-white to-blue-400'} 
            p-4 rounded-lg shadow cursor-pointer transition-all duration-300 
            hover:shadow-lg hover:from-blue-400 hover:to-blue-500 hover:shadow-blue-200`}
          onClick={() => {
            setIsFareFormOpen(!isFareFormOpen);
            setIsEditFareFormOpen(false); // Close edit form when opening set form
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg 
                className="h-6 w-6 mr-2 text-blue-800" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold">Set Fare and Schedule</h3>
            </div>
            <svg 
              className={`h-5 w-5 text-blue-800 transition-transform duration-300 ${isFareFormOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isFareFormOpen && (
          <div 
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-200 transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent the card from closing when clicking on the form
          >
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700">Fare (Rs)</label>
                  <input
                    type="number"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Total Seats</label>
                  <input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Booked Seats</label>
                  <input
                    type="number"
                    value={bookedSeats}
                    onChange={(e) => setBookedSeats(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    required
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleCancelFareForm}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center w-32 h-10"
                  >
                    <span>Submit</span>
                    <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      
      
    </div>
  );
};

export default BikeRiderDashboardFeatures;