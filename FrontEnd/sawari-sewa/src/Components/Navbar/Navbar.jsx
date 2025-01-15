import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Facebook, Instagram, Youtube, Mail, LogIn, UserPlus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className='w-full'>
      <div className="bg-[#17252A] text-white py-2">
        <div className='px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center'>
            <div className='flex items-center space-x-2'>
                <div className="w-20 h-20 flex items-center justify-center">
                    <span className="c text-6xl">🚌</span>
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
                <button onClick={() => navigate('/login')} className="flex items-center space-x-1 hover:text-blue-200">
                    <LogIn size={40} />
                    <span className="text-s">Log In</span>
                </button>
                <button onClick={() => navigate('/signup')} className="flex items-center space-x-1 hover:text-blue-200">
                    <UserPlus size={40} />
                    <span className="text-s">Sign Up</span>
                </button>
            </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;

