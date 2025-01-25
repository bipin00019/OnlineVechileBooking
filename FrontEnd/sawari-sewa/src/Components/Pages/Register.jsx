// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContexts';
// import { sendVerificationCode, verifyCode } from '../../services/otpService';
// const Register = () => {
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//         confirmPassword: "",
//         verificationCode:"",
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const { register } = useAuth();
//     const [isCodeSent, setIsCodeSent] = useState(false);
//     const [isVerified, setIsVerified] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         if (formData.password !== formData.confirmPassword) {
//             setError("Passwords do not match");
//             setLoading(false);
//             return;
//         }

//         try {
//             const result = await register({
//                 email: formData.email,
//                 password: formData.password,
//             });

//             if (result.success) {
//                 console.log("Registration successful vayo");
//                 setSuccess("Registration successful!");
//                 const redirectPath = location.state?.from?.pathname || '/';
//                 navigate(redirectPath, { replace: true });
//             } else {
//                 setError(result.message || "Registration failed.");
//                 console.error("Registration failed :", result);
//             }
//         } catch (err) {
//             console.error('Registration error:', err);
//             setError(err.response?.data?.message || 'Failed to register. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="register-container">
//             <h1>Register</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Email:</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Confirm Password:</label>
//                     <input
//                         type="password"
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 {error && <p className="error">{error}</p>}
//                 {success && <p className="success">{success}</p>}
//                 <button type="submit" disabled={loading}>
//                     {loading ? "Registering..." : "Register"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Register;

import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import backgroundPhoto from "../../Static/Image/loginPhoto.jpeg"
import { sendVerificationCode, verifyCode } from '../../services/otpService'
import { useAuth } from '../../contexts/AuthContexts'

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
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
      const response = await sendVerificationCode(formData.email);
      setIsCodeSent(true);
      setSuccess("Verification code sent to email")
      // if(response && response.success) {
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code catch');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    console.log("Verifying OTP");
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyCode(
        formData.email,
        formData.verificationCode
      );
      console.log("Response: ",response)
      
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
      });

      if (result.success) {
        setSuccess("Registration successful!");
        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath, { replace: true });
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
  )
}

export default Register