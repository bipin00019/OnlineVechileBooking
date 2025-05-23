// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContexts';
// import LoginPhoto from '../../Static/Image/loginPhoto.jpeg';
// import { PATHS } from '../../constants/paths';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   const [touched, setTouched] = useState({
//     email: false,
//     password: false
//   });

//   const [errors, setErrors] = useState({
//     email: '',
//     password: '',
//     general: ''
//   });

//   const [loading, setLoading] = useState(false);

//   // Validate individual fields
//   const validateField = (name, value) => {
//     switch (name) {
//       case 'email':
//         if (!value) return 'Email is required';
//         if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
//         return '';
//       case 'password':
//         if (!value) return 'Password is required';
//         if (value.length < 6) return 'Password must be at least 6 characters';
//         return '';
//       default:
//         return '';
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     setErrors((prev) => ({
//       ...prev,
//       [name]: validateField(name, value),
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     const newValue = type === 'checkbox' ? checked : value;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));

//     // Only validate if the field has been touched
//     if (touched[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: validateField(name, newValue), // Keep the error until the field is corrected
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate all fields on submit
//     const newErrors = {
//       email: validateField('email', formData.email),
//       password: validateField('password', formData.password),
//       general: '',
//     };

//     setErrors(newErrors);
//     setTouched({ email: true, password: true });

//     // Check if there are any errors
//     if (Object.values(newErrors).some((error) => error)) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await login(formData);

//       if (result.success) {

//         //const roles = result.data.user.roles || []; //Added
//         // Redirect to the previous page or the homepage
//         const redirectPath = location.state?.from?.pathname || '/';
//         navigate(redirectPath, { replace: true });


//       } else {
//         // If login fails (invalid email/password), show general invalid credentials message
//         setErrors((prev) => ({ ...prev, general: 'Invalid credentials. Please check your email and password.' }));
//       }
//     } catch (err) {
//       // Catch any errors from the backend
//       if (err.response?.data?.message === 'Email not registered') {
//         setErrors((prev) => ({
//           ...prev,
//           general: 'Email is not registered. Please sign up first.',
//         }));
//       } else {
//         // For any other errors (like invalid password or email format)
//         setErrors((prev) => ({
//           ...prev,
//           general: 'Invalid credentials. Please check your email and password.',
//         }));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };


  
  
//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Section */}
//       <div className="bg-[#17252A] text-white w-full md:w-1/2 lg:w-[45%] xl:w-[40%] p-4 md:p-8 flex flex-col justify-center">
//         <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
//           <div className="text-6xl md:text-7xl lg:text-8xl">🚌</div>
//           <div className="text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Sewari Sewa</h1>
//             <div className="text-xl md:text-2xl mt-2">Trusted Ticketing Platform</div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto w-full">
//           {errors.general && (
//             <div className="p-3 bg-red-500 text-white rounded-lg text-center">
//               {errors.general}
//             </div>
//           )}

//           <div>
//             <label htmlFor="email" className="block text-lg font-medium mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               disabled={loading}
//               className={`w-full border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} 
//                 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
//                 disabled:opacity-50 text-black`}
//               placeholder="Enter your email"
//             />
//             {errors.email && touched.email && (
//               <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-lg font-medium mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               disabled={loading}
//               className={`w-full border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} 
//                 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
//                 disabled:opacity-50 text-black`}
//               placeholder="Enter your password"
//             />
//             {errors.password && touched.password && (
//               <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
//             )}
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="rememberMe"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleChange}
//               disabled={loading}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
//             />
//             <label htmlFor="rememberMe" className="ml-2 text-lg">
//               Remember me
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
//               text-white py-3 px-4 rounded-lg font-medium text-lg focus:outline-none focus:ring-2 
//               focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 transition duration-200`}
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Logging in...
//               </div>
//             ) : (
//               'Login'
//             )}
//           </button>

//           <div className="space-y-2 text-center">
//             <a 
//             onClick={() => navigate(PATHS.FORGOTPASSWORD)}
//             className="block text-blue-400 hover:text-blue-300 hover:underline">
//               Forgot Password?
//             </a>
//             <div>
//               Don't have an account?{' '}
//               <button
//                 type="button"
//                 onClick={() => navigate(PATHS.REGISTER)}
//                 className="text-blue-400 hover:text-blue-300 hover:underline"
//               >
//                 Register
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Right Section */}
//       <div
//         className="hidden md:flex flex-1 relative"
//         style={{
//           backgroundImage: `url(${LoginPhoto})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="absolute bottom-5 right-5 text-white text-right max-w-xl">
//           <h2 className="text-3xl md:text-4xl font-bold shadow-text">
//             Experience Travel Like Never Before
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContexts';
// import LoginPhoto from '../../Static/Image/loginPhoto.jpeg';
// import { PATHS } from '../../constants/paths';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   const [touched, setTouched] = useState({
//     email: false,
//     password: false
//   });

//   const [errors, setErrors] = useState({
//     email: '',
//     password: '',
//     general: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorTimeout, setErrorTimeout] = useState(null);

//   // Load error from sessionStorage on component mount
//   useEffect(() => {
//     const savedError = sessionStorage.getItem('loginError');
//     if (savedError) {
//       setErrors(prev => ({ ...prev, general: savedError }));
      
//       // Clear the saved error from sessionStorage
//       sessionStorage.removeItem('loginError');
      
//       // Set a timer to clear the error message after 5 seconds
//       const timeout = setTimeout(() => {
//         setErrors(prev => ({ ...prev, general: '' }));
//       }, 5000);
      
//       setErrorTimeout(timeout);
//     }
    
//     return () => {
//       if (errorTimeout) clearTimeout(errorTimeout);
//     };
//   }, []);

//   // Validate individual fields
//   const validateField = (name, value) => {
//     switch (name) {
//       case 'email':
//         if (!value) return 'Email is required';
//         if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
//         return '';
//       case 'password':
//         if (!value) return 'Password is required';
//         if (value.length < 6) return 'Password must be at least 6 characters';
//         return '';
//       default:
//         return '';
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     setErrors((prev) => ({
//       ...prev,
//       [name]: validateField(name, value),
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     const newValue = type === 'checkbox' ? checked : value;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));

//     // Only validate if the field has been touched
//     if (touched[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: validateField(name, newValue), // Keep the error until the field is corrected
//       }));
//     }
//   };

//   const showError = (errorMessage) => {
//     // Save error to sessionStorage to persist through page reloads
//     sessionStorage.setItem('loginError', errorMessage);
    
//     // Set error in state
//     setErrors((prev) => ({ ...prev, general: errorMessage }));
    
//     // Clear any existing timeout
//     if (errorTimeout) clearTimeout(errorTimeout);
    
//     // Set a new timeout to clear the error after 5 seconds
//     const timeout = setTimeout(() => {
//       setErrors((prev) => ({ ...prev, general: '' }));
//       sessionStorage.removeItem('loginError');
//     }, 5000);
    
//     setErrorTimeout(timeout);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate all fields on submit
//     const newErrors = {
//       email: validateField('email', formData.email),
//       password: validateField('password', formData.password),
//       general: '',
//     };

//     setErrors(newErrors);
//     setTouched({ email: true, password: true });

//     // Check if there are any errors
//     if (Object.values(newErrors).some((error) => error && error !== 'general')) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await login(formData);

//       if (result.success) {
//         // Clear any existing error
//         sessionStorage.removeItem('loginError');
        
//         // Redirect to the previous page or the homepage
//         const redirectPath = location.state?.from?.pathname || '/';
//         navigate(redirectPath, { replace: true });
//       } else {
//         // If login fails (invalid email/password), show general invalid credentials message
//         showError('Invalid credentials. Please check your email and password.');
//       }
//     } catch (err) {
//       // Catch any errors from the backend
//       if (err.response?.data?.message === 'Email not registered') {
//         showError('Email is not registered. Please sign up first.');
//       } else {
//         // For any other errors (like invalid password or email format)
//         showError('Invalid credentials. Please check your email and password.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Function to dismiss error manually
//   const dismissError = () => {
//     setErrors(prev => ({ ...prev, general: '' }));
//     sessionStorage.removeItem('loginError');
//     if (errorTimeout) clearTimeout(errorTimeout);
//   };
  
//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Section */}
//       <div className="bg-[#17252A] text-white w-full md:w-1/2 lg:w-[45%] xl:w-[40%] p-4 md:p-8 flex flex-col justify-center">
//         <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
//           <div className="text-6xl md:text-7xl lg:text-8xl">🚌</div>
//           <div className="text-center md:text-left">
//             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Sewari Sewa</h1>

//             <div className="text-xl md:text-2xl mt-2">Trusted Ticketing Platform</div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto w-full">
//           {errors.general && (
//             <div className="p-3 bg-red-500 text-white rounded-lg text-center relative">
//               {errors.general}
//               <button 
//                 type="button" 
//                 onClick={dismissError}
//                 className="absolute top-1 right-2 text-white hover:text-gray-200"
//                 aria-label="Dismiss error"
//               >
//                 ✕
//               </button>
//             </div>
//           )}

//           <div>
//             <label htmlFor="email" className="block text-lg font-medium mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               disabled={loading}
//               className={`w-full border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} 
//                 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
//                 disabled:opacity-50 text-black`}
//               placeholder="Enter your email"
//             />
//             {errors.email && touched.email && (
//               <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-lg font-medium mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               disabled={loading}
//               className={`w-full border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} 
//                 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
//                 disabled:opacity-50 text-black`}
//               placeholder="Enter your password"
//             />
//             {errors.password && touched.password && (
//               <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
//             )}
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="rememberMe"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleChange}
//               disabled={loading}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
//             />
//             <label htmlFor="rememberMe" className="ml-2 text-lg">
//               Remember me
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
//               text-white py-3 px-4 rounded-lg font-medium text-lg focus:outline-none focus:ring-2 
//               focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 transition duration-200`}
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Logging in...
//               </div>
//             ) : (
//               'Login'
//             )}
//           </button>

//           <div className="space-y-2 text-center">
//             <a 
//             onClick={() => navigate(PATHS.FORGOTPASSWORD)}
//             className="block text-blue-400 hover:text-blue-300 hover:underline cursor-pointer">
//               Forgot Password?
//             </a>
//             <div>
//               Don't have an account?{' '}
//               <button
//                 type="button"
//                 onClick={() => navigate(PATHS.REGISTER)}
//                 className="text-blue-400 hover:text-blue-300 hover:underline"
//               >
//                 Register
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Right Section */}
//       <div
//         className="hidden md:flex flex-1 relative"
//         style={{
//           backgroundImage: `url(${LoginPhoto})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="absolute bottom-5 right-5 text-white text-right max-w-xl">
//           <h2 className="text-3xl md:text-4xl font-bold shadow-text">
//             Experience Travel Like Never Before
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import LoginPhoto from '../../Static/Image/loginPhoto.jpeg';
import { PATHS } from '../../constants/paths';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const submitAttempted = useRef(false);

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
  const [errorTimeout, setErrorTimeout] = useState(null);

  // Preserve form data in sessionStorage with a unique key
  const STORAGE_KEY = 'loginFormData';
  const ERROR_KEY = 'loginError';
  const ATTEMPT_KEY = 'loginAttempted';

  // Load preserved data on mount (handles page reloads)
  useEffect(() => {
    try {
      // Load preserved form data
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          email: parsedData.email || '',
          password: parsedData.password || '',
          rememberMe: parsedData.rememberMe || false
        }));
        
        // Mark fields as touched if they have values
        setTouched({
          email: !!parsedData.email,
          password: !!parsedData.password
        });
      }

      // Load preserved error
      const savedError = sessionStorage.getItem(ERROR_KEY);
      if (savedError) {
        setErrors(prev => ({ ...prev, general: savedError }));
        
        // Auto-clear error after 8 seconds
        const timeout = setTimeout(() => {
          setErrors(prev => ({ ...prev, general: '' }));
          sessionStorage.removeItem(ERROR_KEY);
        }, 8000);
        
        setErrorTimeout(timeout);
      }

      // Check if this was a failed login attempt
      const wasAttempted = sessionStorage.getItem(ATTEMPT_KEY);
      if (wasAttempted) {
        submitAttempted.current = true;
        sessionStorage.removeItem(ATTEMPT_KEY);
      }

    } catch (error) {
      console.error('Error loading preserved login data:', error);
    }

    return () => {
      if (errorTimeout) clearTimeout(errorTimeout);
    };
  }, []);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [formData]);

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

    // Clear general error when user starts typing
    if (errors.general && (name === 'email' || name === 'password')) {
      setErrors((prev) => ({ ...prev, general: '' }));
      sessionStorage.removeItem(ERROR_KEY);
      if (errorTimeout) {
        clearTimeout(errorTimeout);
        setErrorTimeout(null);
      }
    }

    // Validate field if it has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }
  };

  const showError = (errorMessage) => {
    try {
      // Save error to sessionStorage to persist through reloads
      sessionStorage.setItem(ERROR_KEY, errorMessage);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      
      // Clear any existing timeout
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
      
      // Set a new timeout to clear the error after 8 seconds
      const timeout = setTimeout(() => {
        setErrors((prev) => ({ ...prev, general: '' }));
        sessionStorage.removeItem(ERROR_KEY);
      }, 8000);
      
      setErrorTimeout(timeout);
    } catch (error) {
      console.error('Error saving error message:', error);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    }
  };

  const clearAllData = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(ERROR_KEY);
      sessionStorage.removeItem(ATTEMPT_KEY);
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark that a submit was attempted
    submitAttempted.current = true;
    
    try {
      sessionStorage.setItem(ATTEMPT_KEY, 'true');
    } catch (error) {
      console.error('Error saving attempt flag:', error);
    }

    // Validate all fields on submit
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      general: '',
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    // Check if there are any validation errors
    if (newErrors.email || newErrors.password) {
      try {
        sessionStorage.removeItem(ATTEMPT_KEY);
      } catch (error) {
        console.error('Error removing attempt flag:', error);
      }
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);

      if (result && result.success) {
        // Clear all stored data on successful login
        clearAllData();
        
        // Clear form state
        setFormData({
          email: '',
          password: '',
          rememberMe: false,
        });
        setTouched({ email: false, password: false });
        setErrors({ email: '', password: '', general: '' });
        
        // Navigate to destination
        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath, { replace: true });
      } else {
        // Login failed - show error but keep form data
        const errorMessage = result?.message || 'Login failed. Please check your email and password and try again.';
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      let errorMessage = 'Login failed due to an unexpected error. Please try again.';
      
      if (err?.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err?.response?.status === 404 || err?.response?.data?.message === 'Email not registered') {
        errorMessage = 'This email is not registered. Please check your email or sign up for a new account.';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Invalid email format. Please enter a valid email address.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = `Login failed: ${err.message}`;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      } else {
        errorMessage = 'Login failed due to a network error. Please check your connection and try again.';
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
      try {
        sessionStorage.removeItem(ATTEMPT_KEY);
      } catch (error) {
        console.error('Error removing attempt flag:', error);
      }
    }
  };
  
  // Function to dismiss error manually
  const dismissError = () => {
    setErrors(prev => ({ ...prev, general: '' }));
    sessionStorage.removeItem(ERROR_KEY);
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      setErrorTimeout(null);
    }
  };

  // Cleanup on unmount (only if login was successful)
  useEffect(() => {
    return () => {
      // Only clear data if there's no error and no loading state
      if (!errors.general && !loading && !submitAttempted.current) {
        clearAllData();
      }
    };
  }, []);

  // Prevent form reset on page unload if there was an error
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (errors.general || loading) {
        // Ensure data is saved before potential reload
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
          if (errors.general) {
            sessionStorage.setItem(ERROR_KEY, errors.general);
          }
        } catch (error) {
          console.error('Error saving data before unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, errors.general, loading]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="bg-[#17252A] text-white w-full md:w-1/2 lg:w-[45%] xl:w-[40%] p-4 md:p-8 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="text-6xl md:text-7xl lg:text-8xl">🚌</div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Sewari Sewa</h1>
            <div className="text-xl md:text-2xl mt-2">Trusted Ticketing Platform</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto w-full">
          {errors.general && (
            <div className="p-3 bg-red-500 text-white rounded-lg text-center relative animate-pulse">
              <span className="pr-6">{errors.general}</span>
              <button 
                type="button" 
                onClick={dismissError}
                className="absolute top-2 right-2 text-white hover:text-gray-200 text-lg font-bold leading-none"
                aria-label="Dismiss error"
              >
                ✕
              </button>
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
              className={`w-full border ${errors.email && touched.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} 
                rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                disabled:opacity-50 text-black transition-colors duration-200`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-red-400 text-sm flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.email}
              </p>
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
              className={`w-full border ${errors.password && touched.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} 
                rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                disabled:opacity-50 text-black transition-colors duration-200`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-red-400 text-sm flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.password}
              </p>
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
            disabled={loading || (errors.email && touched.email) || (errors.password && touched.password)}
            className={`w-full ${
              loading || (errors.email && touched.email) || (errors.password && touched.password)
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-3 px-4 rounded-lg font-medium text-lg focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-1 transition duration-200`}
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
              className="block text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-200">
              Forgot Password?
            </a>
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(PATHS.REGISTER)}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
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