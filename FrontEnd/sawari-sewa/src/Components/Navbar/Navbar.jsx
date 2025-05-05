import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Facebook, Instagram, Youtube, Mail, LogIn, UserPlus } from 'lucide-react';
import { FaWhatsapp, FaUserCircle } from 'react-icons/fa';
import { PATHS } from '../../constants/paths';
import { fetchUserProfile, switchRole } from '../../services/roleManagement'; 
import { checkDriverApplicationStatus } from '../../services/DriverService';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [isApprovedDriver, setIsApprovedDriver] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [pendingApplication, setPendingApplication] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown menu
  const navbarRef = useRef(null); // Reference to the navbar area to detect outside click

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token"); // Check if user is logged in
      if (!token) {
        setUser(null); // Ensure the user state is reset
        return;
      }
      try {
        const profile = await fetchUserProfile();
        //console.log("Fetched User Profile:", profile);
        setUser(profile.user);
        setUserRoles(profile.roles || []);
        //console.log("Current Roles: ",profile.roles);
        setIsApprovedDriver(profile.isApprovedDriver || false);

        // Store the current role state in localStorage
      //localStorage.setItem("userRole", JSON.stringify(profile.roles || []));

      const applicationStatus = await checkDriverApplicationStatus();
      setPendingApplication(applicationStatus);

      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    loadUserProfile();

    
    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    // Adding the event listener for clicks outside
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setUserRoles([]);
    setIsApprovedDriver(false);
    setDropdownVisible(false); // Hide dropdown after logout
    navigate(PATHS.HOME);
    window.location.reload(); // Force refresh
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevent click from propagating to the document
    setDropdownVisible(!dropdownVisible);
  };

  const isSuperAdmin = userRoles.includes("SuperAdmin");
  const isAdmin = userRoles.includes("Admin");
  const isDriver = userRoles.includes("Driver");
  const isPassenger = userRoles.includes("Passenger");
  

  const handleSwitchRole = async () => {
    if (!user) return;
  
    try {
      await switchRole(user.id); // Call the API to switch role
  
      // Refetch user profile to get updated roles
      const updatedProfile = await fetchUserProfile();
      //console.log("Updated User Profile:", updatedProfile);
  
      const updatedRoles = updatedProfile.roles || [];
      
      // Update the state
      setUserRoles(updatedRoles);
  
      // Store updated user data in localStorage (just like during login)
      const updatedUser = { ...user, roles: updatedRoles }; 
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      //console.log("Updated roles saved in localStorage:", updatedRoles);
  
      // Determine the new role and navigate accordingly
      if (updatedRoles.includes("Driver")) {
        //console.log("Navigating to DRIVER DASHBOARD...");
        navigate(PATHS.DRIVERDASHBOARD);
      } else {
        //console.log("Navigating to PASSENGER DASHBOARD...");
        navigate(PATHS.PASSENGERDASHBOARD);
      }
  
      // Force re-render to apply changes immediately
      window.location.reload(); 
  
    } catch (error) {
      console.error("Role switch failed:", error);
    }
  };
  
  
  
  return (
    <nav className='w-full' ref={navbarRef}>
      <div className="bg-[#17252A] text-white py-4">
        <div className='px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center'>
            <div className='flex items-center space-x-2'>
                <div className="w-20 h-20 flex items-center justify-center mr-8">
                    <span className="c text-8xl">🚌</span>
                </div>
                <div>
                  <span className="text-3xl font-bold text-white">Sewari Sewa</span>
                  <div className="text-s">Trusted Ticketing Platform</div>
                </div>
            </div>
            <div className="flex items-center space-x-5">
              <a href="https://www.facebook.com/profile.php?id=100008089039433" className="hover:text-blue-200">
                <Facebook size={40} />
              </a>
              <a href="https://www.instagram.com/bpintamang19/" className="hover:text-blue-200">
                <Instagram size={40} />
              </a>
              <a href="#" className="hover:text-blue-200">
                <Youtube size={40} />
              </a>
              <a href="#" className="hover:text-blue-200">
                <FaWhatsapp size={40} />
              </a>
            </div>
            <div className='hidden md:flex space-x-6'>
                <a href="tel:9862930264" className="flex items-center space-x-1 hover:text-blue-200">
                    <Phone size={40} />
                    <span className="text-s">9862930264</span>
                </a>
                <a href="mailto:info@sawarisewa.com" className="flex items-center space-x-1 hover:text-blue-200">
                    <Mail size={40} />
                    <span className="text-s">info@sawarisewa.com</span>
                </a>
            </div>
            <div className='flex items-center space-x-4'>
              {user ? (
                <div className="relative">
                  <div
                    className="flex items-center space-x-2 cursor-pointer hover:text-blue-200"
                    onClick={toggleDropdown} // Prevent outside click when opening dropdown
                  >
                    <FaUserCircle size={40} />
                    <span className="text-s">{user.email || "No email found"}</span>
                  </div>
                  {dropdownVisible && (
                    <div
                      ref={dropdownRef} // Assign ref to dropdown menu
                      className="absolute right-0 mt-2 w-48 bg-black text-white shadow-lg rounded-none"
                    >
                      {isSuperAdmin || isAdmin ? (
                        <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-800 w-full text-left">Log Out</button>
                      ) : isApprovedDriver ? (
                        <>
                          <button 
                          onClick={handleSwitchRole}
                          className="block px-4 py-2 hover:bg-gray-800 w-full text-left">
                            {isDriver ? "Passenger Mode" : "Driver Mode"}
                          </button>
                          <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-800 w-full text-left">Log Out</button>
                        </>
                      ) : (
                        <> 
                        {pendingApplication ? (
                          <p className="block px-4 py-2 text-red-500 w-full text-left">
                          You already have a pending application. Please wait for approval.
                        </p>
                        ) : (
                          
                          <button onClick={() => navigate(PATHS.DRIVERREGISTRATION)} className="block px-4 py-2 hover:bg-gray-800 w-full text-left">Be a Driver</button>
                        )}
                          <button 
                          onClick={() => navigate(PATHS.BOOKINGHISTORY)}
                          className="block px-4 py-2 hover:bg-gray-800 w-full text-left">
                          Booking History
                          </button>
                          <button 
                          onClick={() => navigate(PATHS.EDITPROFILE)}
                          className="block px-4 py-2 hover:bg-gray-800 w-full text-left">
                            Edit Profile
                          </button>
                          <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-800 w-full text-left">Log Out</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => navigate(PATHS.LOGIN)} className="flex items-center space-x-1 hover:text-blue-200">
                    <LogIn size={40} />
                    <span className="text-s">Log In</span>
                  </button>
                  <button onClick={() => navigate(PATHS.REGISTER)} className="flex items-center space-x-1 hover:text-blue-200">
                    <UserPlus size={40} />
                    <span className="text-s">Sign Up</span>
                  </button>
                </>
              )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

