// // import React, { useState } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import { useAuth } from '../../contexts/AuthContexts';
// // import { sendVerificationCode, verifyCode } from '../../services/otpService';
// // const Register = () => {
// //     const [formData, setFormData] = useState({
// //         email: "",
// //         password: "",
// //         confirmPassword: "",
// //         verificationCode:"",
// //     });

// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState("");
// //     const [success, setSuccess] = useState("");
// //     const { register } = useAuth();
// //     const [isCodeSent, setIsCodeSent] = useState(false);
// //     const [isVerified, setIsVerified] = useState(false);
// //     const navigate = useNavigate();
// //     const location = useLocation();

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prev) => ({
// //             ...prev,
// //             [name]: value,
// //         }));
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setError("");
// //         setSuccess("");

// //         if (formData.password !== formData.confirmPassword) {
// //             setError("Passwords do not match");
// //             setLoading(false);
// //             return;
// //         }

// //         try {
// //             const result = await register({
// //                 email: formData.email,
// //                 password: formData.password,
// //             });

// //             if (result.success) {
// //                 console.log("Registration successful vayo");
// //                 setSuccess("Registration successful!");
// //                 const redirectPath = location.state?.from?.pathname || '/';
// //                 navigate(redirectPath, { replace: true });
// //             } else {
// //                 setError(result.message || "Registration failed.");
// //                 console.error("Registration failed :", result);
// //             }
// //         } catch (err) {
// //             console.error('Registration error:', err);
// //             setError(err.response?.data?.message || 'Failed to register. Please try again.');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <div className="register-container">
// //             <h1>Register</h1>
// //             <form onSubmit={handleSubmit}>
// //                 <div>
// //                     <label>Email:</label>
// //                     <input
// //                         type="email"
// //                         name="email"
// //                         value={formData.email}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>
// //                 <div>
// //                     <label>Password:</label>
// //                     <input
// //                         type="password"
// //                         name="password"
// //                         value={formData.password}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>
// //                 <div>
// //                     <label>Confirm Password:</label>
// //                     <input
// //                         type="password"
// //                         name="confirmPassword"
// //                         value={formData.confirmPassword}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>
// //                 {error && <p className="error">{error}</p>}
// //                 {success && <p className="success">{success}</p>}
// //                 <button type="submit" disabled={loading}>
// //                     {loading ? "Registering..." : "Register"}
// //                 </button>
// //             </form>
// //         </div>
// //     );
// // };

// // export default Register;

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
//     setLoading(true);  // Start loading (disables the button and shows "Processing...")
//     setError("");      // Reset error message
//     setSuccess("");    // Reset success message

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError("Please enter a valid email address");
//       setLoading(false);  // Stop loading if the email is invalid
//       return;
//     }

//     try {
//       const response = await sendCodeForRegistration(formData.email);
//       if (response.success) {
//         setIsCodeSent(true);  // OTP sent successfully, update state
//         setSuccess("Verification code sent successfully!");
//       } else {
//         throw new Error(response?.message || 'Email already registered');
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to send verification code';
//       setError(errorMessage);
//       setIsCodeSent(false);  // Reset the isCodeSent state in case of failure
//     } finally {
//       setLoading(false);  // Stop loading after the OTP request completes
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     console.log("Verifying OTP");
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await verifyCode(
//         formData.email,
//         formData.verificationCode
//       );
//       console.log("Response: ", response);

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

//       // Log user data just before calling register
//   //console.log("User Data Before Register:", formData);  // Logs the form data


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
//         const redirectPath = location.state?.from?.pathname || '/';
//         navigate(redirectPath, { replace: true });
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

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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

  return (
    <div className='min-h-screen flex'>
      <div className="bg-[#17252A] text-white w-full md:w-[800px] p-8 flex flex-col justify-center">
        <h1 className="text-2xl mb-6">Sign Up</h1>

        {!isVerified && (
          <form onSubmit={!isCodeSent ? handleSendOTP : handleVerifyOTP}>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
                disabled={isCodeSent}
              />
            </div>

            {isCodeSent && (
              <div className="mb-4">
                <label className="block mb-2">Verification Code:</label>
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {loading 
                ? "Processing..." 
                : (!isCodeSent 
                    ? "Send Verification Code" 
                    : "Verify Code")
              }
            </button>
          </form>
        )}

        {isVerified && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-white">
            Already have an account?{' '}
            <span 
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate(PATHS.LOGIN)}
            >
              Login here
            </span>
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex flex-1 items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundPhoto})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <div 
          className="max-w-xl text-white text-center"
          style={{
            position: "absolute",
            bottom: "5%",
            right: "5%",
            textAlign: "right",
          }}
        >
          <h1 className="text-xl opacity-90">
            Sign up to access exclusive features, manage your bookings, and explore a world of seamless travel experiences.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Register;