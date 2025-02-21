import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
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

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const [loading, setLoading] = useState(false);

  // Validate individual fields
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Only validate if the field has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue), // Keep the error until the field is corrected
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      general: '',
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {

        //const roles = result.data.user.roles || []; //Added
        // Redirect to the previous page or the homepage
        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath, { replace: true });


      } else {
        // If login fails (invalid email/password), show general invalid credentials message
        setErrors((prev) => ({ ...prev, general: 'Invalid credentials. Please check your email and password.' }));
      }
    } catch (err) {
      // Catch any errors from the backend
      if (err.response?.data?.message === 'Email not registered') {
        setErrors((prev) => ({
          ...prev,
          general: 'Email is not registered. Please sign up first.',
        }));
      } else {
        // For any other errors (like invalid password or email format)
        setErrors((prev) => ({
          ...prev,
          general: 'Invalid credentials. Please check your email and password.',
        }));
      }
    } finally {
      setLoading(false);
    }
  };


  
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="bg-[#17252A] text-white w-full md:w-1/2 lg:w-[45%] xl:w-[40%] p-4 md:p-8 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="text-6xl md:text-7xl lg:text-8xl">🚌</div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Sewari Sewa</h1>
            <div className="text-xl md:text-2xl mt-2">Trusted Ticketing Platform</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto w-full">
          {errors.general && (
            <div className="p-3 bg-red-500 text-white rounded-lg text-center">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} 
                rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                disabled:opacity-50 text-black`}
              placeholder="Enter your email"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} 
                rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                disabled:opacity-50 text-black`}
              placeholder="Enter your password"
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
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
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
              text-white py-3 px-4 rounded-lg font-medium text-lg focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 transition duration-200`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>

          <div className="space-y-2 text-center">
            <a 
            onClick={() => navigate(PATHS.FORGOTPASSWORD)}
            className="block text-blue-400 hover:text-blue-300 hover:underline">
              Forgot Password?
            </a>
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(PATHS.REGISTER)}
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex flex-1 relative"
        style={{
          backgroundImage: `url(${LoginPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute bottom-5 right-5 text-white text-right max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold shadow-text">
            Experience Travel Like Never Before
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Login;

 