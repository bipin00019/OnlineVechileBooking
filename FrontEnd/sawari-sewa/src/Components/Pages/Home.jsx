import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import HomeBody from './HomeBody';
import AdminsDashboard from './AdminsDashboard';
import DriverDashboard from './DriverDashboard';
import { RiPlaneFill } from 'react-icons/ri';
import HomeBody1 from './HomeBody1';

const Home = () => {
  const [userRoles, setUserRoles] = useState([]); // Assuming roles come from your user authentication system
  
    // Load user roles from localStorage when the component mounts
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

  return (
    <div>
           
      {isSuperAdmin ? (
        <AdminsDashboard />
      ) : isAdmin ? (
        <AdminsDashboard />
      ) : isDriver ? (
        <DriverDashboard />
      ) : (
        <>
          <HomeBody />
          <HomeBody1 />
        </>
      )}
    </div>
  );
};

export default Home;
