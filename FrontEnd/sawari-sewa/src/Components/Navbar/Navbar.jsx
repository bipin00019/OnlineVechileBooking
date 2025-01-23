import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Facebook, Instagram, Youtube, Mail, LogIn, UserPlus } from 'lucide-react';
import { FaWhatsapp, FaUserCircle } from 'react-icons/fa';
import { PATHS } from '../../constants/paths';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown menu
  const navbarRef = useRef(null); // Reference to the navbar area to detect outside click

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

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
    // localSrorage.removeItem('token');
    // localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.reload(); // Reload the app to reset state
    setDropdownVisible(false); // Hide dropdown after logout
    navigate(PATHS.HOME);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevent click from propagating to the document
    setDropdownVisible(!dropdownVisible);
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
                    <span className="text-s">{user.email}</span>
                  </div>
                  {dropdownVisible && (
                    <div
                      ref={dropdownRef} // Assign ref to dropdown menu
                      className="absolute right-0 mt-2 w-48 bg-black text-white shadow-lg rounded-none"
                    >
                      <button
                        onClick={() => navigate(PATHS.DRIVERREGISTRATION)}
                        className="block px-4 py-2 hover:bg-gray-800 w-full text-left"
                      >
                        Be a Driver
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 hover:bg-gray-800 w-full text-left"
                      >
                        Log Out
                      </button>
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
