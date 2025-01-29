import React, { useState } from 'react';
import forgotbg from '../../Static/Image/forgotImage.jpg';
import { useNavigate } from 'react-router-dom';
import { sendVerificationCode, verifyCode } from '../../services/otpService';   
import { resetPassword } from '../../services/forgotPasswordServce';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async (e) => {
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
      console.log("API Response:", response); // Debugging line
  
      if (response) {
        console.log("Before update: isCodeSent =", isCodeSent);
        setIsCodeSent(true);
        console.log("After update: isCodeSent =", isCodeSent);
        console.log("isCodeSent set to:", true); // Debugging line
        setSuccess("Verification code sent successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
      setIsCodeSent(false);
    } finally {
      setLoading(false);
    }
  };
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyCode(formData.email, formData.verificationCode);  // FIXED: Removed duplicate email
      if (response) {
        setIsVerified(true);
        setSuccess("Email verified successfully");
      } else {
        setError("Invalid verification code");
      }
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

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword({
        email: formData.email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (result) {
        setSuccess("Password reset successfully");
        const redirectPath = "/login";  // FIXED: Corrected redirect path
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#17252A] h-screen flex items-center justify-center">
      <div className="bg-white text-black p-6 w-4/5 h-[80%] flex flex-col md:flex-row rounded-lg shadow-lg">
        {/* Left Section */}
        <div
          className="hidden md:flex flex-1 relative"
          style={{
            backgroundImage: `url(${forgotbg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px'
          }}
        ></div>

        {/* Right Section */}
        <div className="flex flex-col justify-center md:w-1/2 p-8 space-y-6">
          {/* Forgot Password Text */}
          <h1 className="text-4xl font-bold text-center text-indigo-600 tracking-wider uppercase">
            Forgot Password
          </h1>

          {!isVerified && (
            <form onSubmit={!isCodeSent ? handleSendOtp : handleVerifyOtp}>
              <label className="block text-lg font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                value={formData.email}
                onChange={handleChange}
                disabled={isCodeSent}
              />

              {isCodeSent && (
                <div className="mt-4">
                  <label className="block text-lg font-medium">Verification Code</label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                  />
                </div>
              )}

              {error && <p className="text-red-500 mt-4">{error}</p>}
              {success && <p className="text-green-500 mt-4">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white p-4 rounded-lg mt-4 hover:bg-blue-600 transition"
              >
                {loading ? "Processing..." 
                : (!isCodeSent 
                ? "Send Verification Code"
                 : "Verify Code")
                 }
              </button>
            </form>
          )}

          {isVerified && (
            <form onSubmit={handleSubmit}>
              <label className="block text-lg font-medium">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
              />

              <label className="block text-lg font-medium mt-4">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
              />

              {error && <p className="text-red-500 mt-4">{error}</p>}
              {success && <p className="text-green-500 mt-4">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white p-4 rounded-lg mt-4 hover:bg-green-600 transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-center">
            Already have an account?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate("/login")}>
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
