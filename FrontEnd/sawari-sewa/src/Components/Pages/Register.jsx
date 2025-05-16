// import React, { useState } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import backgroundPhoto from "../../Static/Image/loginPhoto.jpeg"
// import { sendCodeForRegistration, verifyCode } from '../../services/otpService'
// import { useAuth } from '../../contexts/AuthContexts'
// import { PATHS } from '../../constants/paths'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     verificationCode: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isCodeSent, setIsCodeSent] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);

//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError("Please enter a valid email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await sendCodeForRegistration(formData.email);
//       if (response.success) {
//         setIsCodeSent(true);
//         setSuccess("Verification code sent successfully!");
//       } else {
//         throw new Error(response?.message || 'Email already registered');
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to send verification code';
//       setError(errorMessage);
//       setIsCodeSent(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await verifyCode(
//         formData.email,
//         formData.verificationCode
//       );

//       setIsVerified(true);
//       setSuccess("Email verified successfully");

//     } catch (err) {
//       setError(err.response?.data?.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const result = await register({
//         email: formData.email,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phoneNumber: formData.phoneNumber,
//         confirmPassword: formData.confirmPassword,
//       });

//       if (result.success) {
//         setSuccess("Registration successful!");
        
//         // Navigate to home page and reload after a short delay
//         const redirectPath = location.state?.from?.pathname || '/';
//         navigate(redirectPath, { replace: true });
        
//         // Add a small delay before reloading to ensure navigation completes
//         setTimeout(() => {
//           window.location.reload();
//         }, 100);
//       } else {
//         setError(result.message || "Registration failed.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to register. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='min-h-screen flex'>
//       <div className="bg-[#17252A] text-white w-full md:w-[800px] p-8 flex flex-col justify-center">
//         <h1 className="text-2xl mb-6">Sign Up</h1>

//         {!isVerified && (
//           <form onSubmit={!isCodeSent ? handleSendOTP : handleVerifyOTP}>
//             <div className="mb-4">
//               <label className="block mb-2">Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 text-white"
//                 required
//                 disabled={isCodeSent}
//               />
//             </div>

//             {isCodeSent && (
//               <div className="mb-4">
//                 <label className="block mb-2">Verification Code:</label>
//                 <input
//                   type="text"
//                   name="verificationCode"
//                   value={formData.verificationCode}
//                   onChange={handleChange}
//                   className="w-full p-2 rounded bg-gray-700 text-white"
//                   required
//                 />
//               </div>
//             )}

//             {error && <p className="text-red-500 mb-4">{error}</p>}
//             {success && <p className="text-green-500 mb-4">{success}</p>}

//             <button 
//               type="submit" 
//               disabled={loading}
//               className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//             >
//               {loading 
//                 ? "Processing..." 
//                 : (!isCodeSent 
//                     ? "Send Verification Code" 
//                     : "Verify Code")
//               }
//             </button>
//           </form>
//         )}

//         {isVerified && (
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block mb-2">First Name:</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 text-white"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2">Last Name:</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 text-white"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2">Phone Number:</label>
//               <input
//                 type="text"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 text-white"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2">Password:</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 text-white"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2">Confirm Password:</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 text-white"
//                 required
//               />
//             </div>

//             {error && <p className="text-red-500 mb-4">{error}</p>}
//             {success && <p className="text-green-500 mb-4">{success}</p>}

//             <button 
//               type="submit" 
//               disabled={loading}
//               className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//             >
//               {loading ? "Registering..." : "Register"}
//             </button>
//           </form>
//         )}

//         <div className="mt-4 text-center">
//           <p className="text-white">
//             Already have an account?{' '}
//             <span 
//               className="text-blue-500 hover:underline cursor-pointer"
//               onClick={() => navigate(PATHS.LOGIN)}
//             >
//               Login here
//             </span>
//           </p>
//         </div>
//       </div>

//       <div
//         className="hidden md:flex flex-1 items-center justify-center"
//         style={{
//           backgroundImage: `url(${backgroundPhoto})`,
//           backgroundSize: 'cover',
//           backgroundRepeat: 'no-repeat',
//           backgroundPosition: 'center',
//           height: '100vh',
//         }}
//       >
//         <div 
//           className="max-w-xl text-white text-center"
//           style={{
//             position: "absolute",
//             bottom: "5%",
//             right: "5%",
//             textAlign: "right",
//           }}
//         >
//           <h1 className="text-xl opacity-90">
//             Sign up to access exclusive features, manage your bookings, and explore a world of seamless travel experiences.
//           </h1>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

// import React, { useState } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import backgroundPhoto from "../../Static/Image/loginPhoto.jpeg"
// import { sendCodeForRegistration, verifyCode } from '../../services/otpService'
// import { useAuth } from '../../contexts/AuthContexts'
// import { PATHS } from '../../constants/paths'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     verificationCode: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isCodeSent, setIsCodeSent] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [countdown, setCountdown] = useState(0);

//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const startResendCountdown = () => {
//     setResendDisabled(true);
//     setCountdown(30);
    
//     const timer = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setResendDisabled(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleSendOTP = async (e) => {
//     if (e) e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError("Please enter a valid email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await sendCodeForRegistration(formData.email);
//       if (response.success) {
//         setIsCodeSent(true);
//         setSuccess("Verification code sent successfully!");
//         startResendCountdown();
//       } else {
//         throw new Error(response?.message || 'Email already registered');
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to send verification code';
//       setError(errorMessage);
//       setIsCodeSent(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendCode = async (e) => {
//     e.preventDefault();
//     await handleSendOTP();
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await verifyCode(
//         formData.email,
//         formData.verificationCode
//       );

//       setIsVerified(true);
//       setSuccess("Email verified successfully");

//     } catch (err) {
//       setError(err.response?.data?.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const result = await register({
//         email: formData.email,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phoneNumber: formData.phoneNumber,
//         confirmPassword: formData.confirmPassword,
//       });

//       if (result.success) {
//         setSuccess("Registration successful!");
        
//         // Navigate to home page and reload after a short delay
//         const redirectPath = location.state?.from?.pathname || '/';
//         navigate(redirectPath, { replace: true });
        
//         // Add a small delay before reloading to ensure navigation completes
//         setTimeout(() => {
//           window.location.reload();
//         }, 100);
//       } else {
//         setError(result.message || "Registration failed.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to register. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetToEmailScreen = () => {
//     setIsCodeSent(false);
//     setFormData({
//       ...formData,
//       verificationCode: ""
//     });
//     setError("");
//     setSuccess("");
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
//       <div className="bg-[#17252A] w-full md:w-[800px] p-8 flex flex-col justify-center rounded-r-lg shadow-2xl relative overflow-hidden">
//         {/* Decorative elements */}
//         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-teal-400"></div>
//         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-70"></div>
        
//         <div className="relative z-10">
//           <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
//             Create Your Account
//           </h1>

//           {!isVerified && (
//             <div className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-gray-700">
//               <form onSubmit={!isCodeSent ? handleSendOTP : handleVerifyOTP}>
//                 <div className="mb-6">
//                   <label className="block mb-2 font-medium text-gray-300">Email:</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
//                     required
//                     disabled={isCodeSent}
//                     placeholder="Enter your email address"
//                   />
//                 </div>

//                 {isCodeSent && (
//                   <div className="mb-6 animate-fadeIn">
//                     <label className="block mb-2 font-medium text-gray-300">Verification Code:</label>
//                     <input
//                       type="text"
//                       name="verificationCode"
//                       value={formData.verificationCode}
//                       onChange={handleChange}
//                       className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
//                       required
//                       placeholder="Enter 6-digit code"
//                     />
//                   </div>
//                 )}

//                 {error && (
//                   <div className="mb-4 p-3 bg-red-500/20 border-l-4 border-red-500 rounded">
//                     <p className="text-red-300">{error}</p>
//                   </div>
//                 )}
                
//                 {success && (
//                   <div className="mb-4 p-3 bg-green-500/20 border-l-4 border-green-500 rounded">
//                     <p className="text-green-300">{success}</p>
//                   </div>
//                 )}

//                 <div className="flex flex-col gap-3">
//                   <button 
//                     type="submit" 
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 rounded-lg hover:from-blue-600 hover:to-teal-500 font-medium transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {loading 
//                       ? "Processing..." 
//                       : (!isCodeSent 
//                           ? "Send Verification Code" 
//                           : "Verify Code")
//                     }
//                   </button>
                  
//                   {isCodeSent && (
//                     <div className="flex justify-between items-center mt-2">
//                       <button 
//                         onClick={resetToEmailScreen}
//                         type="button"
//                         className="text-gray-400 hover:text-white transition-colors"
//                       >
//                         Change Email
//                       </button>
                      
//                       <button 
//                         onClick={handleResendCode}
//                         type="button"
//                         disabled={resendDisabled}
//                         className="text-blue-400 hover:text-blue-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
//                       >
//                         {resendDisabled 
//                           ? `Resend in ${countdown}s` 
//                           : "Resend Code"}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </form>
//             </div>
//           )}

//           {isVerified && (
//             <div className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-gray-700 animate-fadeIn">
//               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="mb-4">
//                   <label className="block mb-2 font-medium text-gray-300">First Name:</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
//                     required
//                     placeholder="Enter your first name"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block mb-2 font-medium text-gray-300">Last Name:</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
//                     required
//                     placeholder="Enter your last name"
//                   />
//                 </div>

//                 <div className="mb-4 md:col-span-2">
//                   <label className="block mb-2 font-medium text-gray-300">Phone Number:</label>
//                   <input
//                     type="text"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
//                     required
//                     placeholder="Enter your phone number"
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="block mb-2 font-medium text-gray-300">Password:</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
//                     required
//                     placeholder="Create a strong password"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block mb-2 font-medium text-gray-300">Confirm Password:</label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
//                     required
//                     placeholder="Confirm your password"
//                   />
//                 </div>

//                 {error && (
//                   <div className="mb-4 md:col-span-2 p-3 bg-red-500/20 border-l-4 border-red-500 rounded">
//                     <p className="text-red-300">{error}</p>
//                   </div>
//                 )}
                
//                 {success && (
//                   <div className="mb-4 md:col-span-2 p-3 bg-green-500/20 border-l-4 border-green-500 rounded">
//                     <p className="text-green-300">{success}</p>
//                   </div>
//                 )}

//                 <div className="md:col-span-2">
//                   <button 
//                     type="submit" 
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 rounded-lg hover:from-blue-600 hover:to-teal-500 font-medium transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {loading ? "Registering..." : "Complete Registration"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           <div className="mt-6 text-center">
//             <p className="text-gray-400">
//               Already have an account?{' '}
//               <span 
//                 className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-medium transition-colors"
//                 onClick={() => navigate(PATHS.LOGIN)}
//               >
//                 Login here
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

//       <div
//         className="hidden md:flex flex-1 items-center justify-center relative"
//         style={{
//           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${backgroundPhoto})`,
//           backgroundSize: 'cover',
//           backgroundRepeat: 'no-repeat',
//           backgroundPosition: 'center',
//           height: '100vh',
//         }}
//       >
//         <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
        
//         <div 
//           className="max-w-xl text-white p-8 rounded-lg relative z-10"
//           style={{
//             position: "absolute",
//             bottom: "10%",
//             right: "5%",
//             textAlign: "right",
//           }}
//         >
//           <div className="mb-4 w-16 h-1 bg-blue-400 ml-auto"></div>
//           <h1 className="text-3xl font-bold mb-4">Join Our Community</h1>
//           <p className="text-xl text-gray-200 opacity-90">
//             Sign up to access exclusive features, manage your bookings, and explore a world of seamless travel experiences.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import backgroundPhoto from "../../Static/Image/loginPhoto.jpeg"
import { sendCodeForRegistration, verifyCode } from '../../services/otpService'
import { useAuth } from '../../contexts/AuthContexts'
import { PATHS } from '../../constants/paths'

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    verificationCode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle validation for different fields
    if (name === 'firstName' || name === 'lastName') {
      // Remove leading spaces from name fields
      const trimmedValue = value.replace(/^\s+/, '');
      setFormData((prev) => ({
        ...prev,
        [name]: trimmedValue,
      }));
      
      // Show error if user tries to enter leading space
      if (value !== trimmedValue && value.startsWith(' ')) {
        setError("Don't add space before name");
        setTimeout(() => {
          if (error === "Don't add space before name") {
            setError("");
          }
        }, 3000);
      }
    } 
    // Phone number validation - only allow digits and max 10
    else if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      
      if (digitsOnly.length > 10) {
        setError("Phone number should be exactly 10 digits");
        setTimeout(() => {
          if (error === "Phone number should be exactly 10 digits") {
            setError("");
          }
        }, 3000);
      }
      
      // Only update with digits and limit to 10
      setFormData((prev) => ({
        ...prev,
        [name]: digitsOnly.substring(0, 10),
      }));
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(30);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await sendCodeForRegistration(formData.email);
      if (response.success) {
        setIsCodeSent(true);
        setSuccess("Verification code sent successfully!");
        startResendCountdown();
      } else {
        throw new Error(response?.message || 'Email already registered');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send verification code';
      setError(errorMessage);
      setIsCodeSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    await handleSendOTP();
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyCode(
        formData.email,
        formData.verificationCode
      );

      setIsVerified(true);
      setSuccess("Email verified successfully");

    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Check if password matches
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    // Validate phone number has exactly 10 digits
    if (formData.phoneNumber.length !== 10) {
      setError("Phone number should be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        setSuccess("Registration successful!");
        
        // Navigate to home page and reload after a short delay
        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath, { replace: true });
        
        // Add a small delay before reloading to ensure navigation completes
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError(result.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetToEmailScreen = () => {
    setIsCodeSent(false);
    setFormData({
      ...formData,
      verificationCode: ""
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-[#17252A] w-full md:w-[800px] p-8 flex flex-col justify-center rounded-r-lg shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-teal-400"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-70"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Create Your Account
          </h1>

          {!isVerified && (
            <div className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-gray-700">
              <form onSubmit={!isCodeSent ? handleSendOTP : handleVerifyOTP}>
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-gray-300">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
                    required
                    disabled={isCodeSent}
                    placeholder="Enter your email address"
                  />
                </div>

                {isCodeSent && (
                  <div className="mb-6 animate-fadeIn">
                    <label className="block mb-2 font-medium text-gray-300">Verification Code:</label>
                    <input
                      type="text"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
                      required
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border-l-4 border-red-500 rounded">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 bg-green-500/20 border-l-4 border-green-500 rounded">
                    <p className="text-green-300">{success}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 rounded-lg hover:from-blue-600 hover:to-teal-500 font-medium transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading 
                      ? "Processing..." 
                      : (!isCodeSent 
                          ? "Send Verification Code" 
                          : "Verify Code")
                    }
                  </button>
                  
                  {isCodeSent && (
                    <div className="flex justify-between items-center mt-2">
                      <button 
                        onClick={resetToEmailScreen}
                        type="button"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Change Email
                      </button>
                      
                      <button 
                        onClick={handleResendCode}
                        type="button"
                        disabled={resendDisabled}
                        className="text-blue-400 hover:text-blue-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        {resendDisabled 
                          ? `Resend in ${countdown}s` 
                          : "Resend Code"}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {isVerified && (
            <div className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-gray-700 animate-fadeIn">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-300">First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
                    required
                    placeholder="Enter your first name"
                  />
                  <small className="text-gray-400">No leading spaces allowed</small>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-300">Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
                    required
                    placeholder="Enter your last name"
                  />
                  <small className="text-gray-400">No leading spaces allowed</small>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block mb-2 font-medium text-gray-300">Phone Number:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
                    required
                    placeholder="Enter your phone number"
                    maxLength={10}
                  />
                  <small className="text-gray-400">Must be exactly 10 digits <span className="text-blue-400">{formData.phoneNumber.length}/10</span></small>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-300">Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
                    required
                    placeholder="Create a strong password"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-300">Confirm Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none"
                    required
                    placeholder="Confirm your password"
                  />
                </div>

                {error && (
                  <div className="mb-4 md:col-span-2 p-3 bg-red-500/20 border-l-4 border-red-500 rounded">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 md:col-span-2 p-3 bg-green-500/20 border-l-4 border-green-500 rounded">
                    <p className="text-green-300">{success}</p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 rounded-lg hover:from-blue-600 hover:to-teal-500 font-medium transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <span 
                className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-medium transition-colors"
                onClick={() => navigate(PATHS.LOGIN)}
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex flex-1 items-center justify-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${backgroundPhoto})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
        
        <div 
          className="max-w-xl text-white p-8 rounded-lg relative z-10"
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            textAlign: "right",
          }}
        >
          <div className="mb-4 w-16 h-1 bg-blue-400 ml-auto"></div>
          <h1 className="text-3xl font-bold mb-4">Join Our Community</h1>
          <p className="text-xl text-gray-200 opacity-90">
            Sign up to access exclusive features, manage your bookings, and explore a world of seamless travel experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;