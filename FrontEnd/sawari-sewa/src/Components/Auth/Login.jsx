import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import { useState } from 'react';
import LoginPhoto from '../../Static/Image/loginPhoto.jpeg';
import { PATHS } from '../../constants/paths';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="bg-[#17252A] text-white w-full md:w-[800px] p-8 flex flex-col justify-center">
        <div className="flex justify-center space-x-4">
          <div className="w-20 h-20 flex items-center justify-center mr-8">
            <span className="c text-9xl">🚌</span>
          </div>
          <div>
            <span className="text-6xl font-bold text-white">Sewari Sewa</span>
            <div className="text-2xl">Trusted Ticketing Platform</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-black"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="rememberMe" className="ml-2 text-lg">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-lg text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="mt-2 text-center text-lg">
          Don’t have an account?{' '}
          <a 
          className="text-blue-600 text-lg hover:underline cursor-pointer"
          onClick={() => navigate(PATHS.REGISTER)} 
          >
            Register
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex flex-1 items-center justify-center"
        style={{
          backgroundImage: `url(${LoginPhoto})`,
          backgroundSize: 'cover', // Ensures the image covers the entire container
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100vh', // Ensures the container covers full height of viewport
        }}
      >
        <div className="max-w-xl text-white text-center"
        style={{
          position: "absolute", // Make the text positionable
          bottom: "5%", // Move it 10% from the bottom of the container
          right: "5%", // Move it 10% from the right of the container
          textAlign: "right", // Optional: Align text to the right
        }}>
          <h1 className="text-4xl font-bold ">Experience Travel Like Never Before</h1>
          {/* <p className="text-xl opacity-90">
            Sign in to your account to access exclusive features, manage your bookings, and explore a world of seamless travel experiences.
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
