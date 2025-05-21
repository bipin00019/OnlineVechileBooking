// import React, { useEffect, useState } from 'react';
// import { 
//   Users, 
//   Car, 
//   MapPin, 
//   CreditCard, 
//   AlertTriangle, 
//   Calendar,
//   DollarSign,
//   Dock,
//   PlusCircle,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { PATHS } from '../../constants/paths';
// import { totalApplicationCount, totalApprovedDriversCount } from '../../services/DriverService';
// import BookingsPerDayChart from './BookingsPerDayChart';
// import { fetchTotalSeatBookingCount } from '../../services/AdminDashboardService';

// const AdminDashboard = () => {
//   // Sample state data - In real app, this would come from your backend
//   const [stats] = useState({
//     activeBookings: 145,
//     totalVehicles: 89,
//     activeDrivers: 67,
//     totalRevenue: 158900
    
//   });

//   const [realtimeAlerts] = useState([
//     { id: 1, type: 'warning', message: 'Vehicle NH-1234 reporting GPS issues' },
//     { id: 2, type: 'info', message: 'New driver verification pending' },
//     { id: 3, type: 'success', message: 'Successful shared ride completed' }
//   ]);

//   const [vehicleTypes] = useState([
//     { type: 'Bus', available: 25, inUse: 15 },
//     { type: 'Jeep', available: 18, inUse: 12 },
//     { type: 'Van', available: 20, inUse: 8 },
//     { type: 'Bike', available: 30, inUse: 22 }
//   ]);

//   const navigate = useNavigate();

//   const [totalApplications, setTotalApplications] = useState(0);
//   const [totalApprovedDrivers, setTotalApprovedDrivers] = useState(0);
//   const [totalBookingCount, setTotalBookingCount] = useState(0);
//   //Fetch the total application
//   useEffect(() => {
//     const fetchTotalApplications = async () => {
//       try {
//         const total = await totalApplicationCount();
//         setTotalApplications(total);
//       } catch (error) {
//         console.error("Failed to fetch total applications count", error);
//       }
//     };
//     fetchTotalApplications();

//     const fetchTotalApprovedDriverCount = async () => {
//       try {
//         const total = await totalApprovedDriversCount();
//         setTotalApprovedDrivers(total);
//       } catch (error) {
//         console.log("Error fetching total approved drivers count ", error);
//       }
//     };
//     fetchTotalApprovedDriverCount();

//     fetchTotalBooking();
//   }, [])

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Sawari Sewa Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">Real-time vehicle booking management system</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div 
//             className="bg-white p-6 rounded-lg shadow cursor-pointer hover:text-blue-200 hover:bg-gray-100 transition-colors"
//             onClick={() => navigate(PATHS.DRIVERAPPLICATIONS)}
//           >
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-sm font-medium text-gray-600">Driver Applications</h3>
//               <Dock className="h-4 w-4 text-gray-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
//           </div>
//           <div 
//           className="bg-white p-6 rounded-lg shadow cursor-pointer hover:text-blue-200 hover:bg-gray-100 transition-colors"
//           onClick={() => navigate(PATHS.APPROVEDDRIVERSLIST)}
//           >
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-sm font-medium text-gray-600">Approved Drivers</h3>
//               <Users className="h-4 w-4 text-gray-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">{totalApprovedDrivers}</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-sm font-medium text-gray-600">Active Bookings</h3>
//               <Calendar className="h-4 w-4 text-gray-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">{totalBookingCount}</p>
//           </div>

          

          
//         </div>

//         {/* Main Content Grid */}
//         <BookingsPerDayChart/>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          


//           {/* Quick Actions */}
//           <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
//             <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
//               <button 
//               onClick={()=>navigate(PATHS.VIEWVEHICLESCHEDULE)}
//               className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
//               <Car className="h-6 w-6 text-green-600 mb-2" />
//                 <span className="text-sm font-medium">View Vehicle Schedule</span>
//               </button>
//               <button className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
//                 <Users className="h-6 w-6 text-blue-600 mb-2" />
//                 <span className="text-sm font-medium">Manage Users</span>
//               </button>
//               {/* <button className="p-4 bg-green-50 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition-colors">
//                 <Car className="h-6 w-6 text-green-600 mb-2" />
//                 <span className="text-sm font-medium">Add Vehicle</span>
//               </button> */}
              
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import {
  Users,
  Car,
  Calendar,
  Dock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/paths';
import { totalApplicationCount, totalApprovedDriversCount } from '../../services/DriverService';
import BookingsPerDayChart from './BookingsPerDayChart';
import { fetchTotalSeatBookingCount } from '../../services/AdminDashboardService';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [totalApplications, setTotalApplications] = useState(0);
  const [totalApprovedDrivers, setTotalApprovedDrivers] = useState(0);
  const [totalBookingCount, setTotalBookingCount] = useState(0);
  const [userRoles, setUserRoles] = useState([]);
  useEffect(() => {
      const roleString = localStorage.getItem('user');
      console.log("roleString: ",roleString);
      const role = roleString ? JSON.parse(roleString) : null;
      console.log("Role: ",role);
      const roles = role && role.roles ? role.roles : [];
      console.log("Roles: ",roles);
      setUserRoles(roles);
      //console.log('Current User Roles:', roles);
    }, []);
    const isSuperAdmin = userRoles.includes('SuperAdmin');
    const isAdmin = userRoles.includes('Admin');
    const isDriver = userRoles.includes('Driver');
  useEffect(() => {
    const fetchTotalApplications = async () => {
      try {
        const total = await totalApplicationCount();
        setTotalApplications(total);
      } catch (error) {
        console.error("Failed to fetch total applications count", error);
      }
    };

    const fetchTotalApprovedDriverCount = async () => {
      try {
        const total = await totalApprovedDriversCount();
        setTotalApprovedDrivers(total);
      } catch (error) {
        console.error("Error fetching total approved drivers count", error);
      }
    };

    const fetchTotalBooking = async () => {
      try {
        const totalBooking = await fetchTotalSeatBookingCount();
        setTotalBookingCount(totalBooking);
      } catch (error) {
        console.error("Error fetching the total booking count:", error);
      }
    };

    fetchTotalApplications();
    fetchTotalApprovedDriverCount();
    fetchTotalBooking();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sawari Sewa Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time vehicle booking management system</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:text-blue-200 hover:bg-gray-100 transition-colors"
            onClick={() => navigate(PATHS.DRIVERAPPLICATIONS)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Driver Applications</h3>
              <Dock className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:text-blue-200 hover:bg-gray-100 transition-colors"
            onClick={() => navigate(PATHS.APPROVEDDRIVERSLIST)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Approved Drivers</h3>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalApprovedDrivers}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalBookingCount}</p>
          </div>
        </div>

        {/* Charts */}
        <BookingsPerDayChart />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate(PATHS.VIEWVEHICLESCHEDULE)}
                className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <Car className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium">View Vehicle Schedule</span>
              </button>
              {isSuperAdmin && (
                <button 
              className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors"
              onClick={() => navigate(PATHS.ALLUSERS)}>
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
