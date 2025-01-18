import React, { useState } from 'react';
import bg from '../../Static/Image/bg.jpeg';

const DriverRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    licenseNumber: '',
    licensePhoto: null,
    vehicleNumber: '',
    blueBookPhoto: null,
    driverSelfie: null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.licenseNumber ||
      !formData.licensePhoto ||
      !formData.vehicleNumber ||
      !formData.blueBookPhoto ||
      !formData.driverSelfie
    ) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      console.log('Form Submitted:', formData);
      alert('Driver registration successful!');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to register driver. Please try again.');
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
            <span className="text-9xl">🚗</span>
          </div>
          <div>
            <span className="text-6xl font-bold text-white">Sewari Sewa</span>
            <div className="text-2xl">Trusted Ticketing Platform</div>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-4xl font-bold">Join Our Driver Community</h1>
          <p className="text-lg opacity-90 mt-4">
            Register today to become a part of a trusted network of drivers and provide exceptional service to our customers.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-[#00000099] text-white w-full max-w-2xl p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Driver Registration</h2>
          {error && <div className="bg-red-100 px-4 py-2 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-lg font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-lg font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="licenseNumber" className="block text-lg font-medium mb-1">
                License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="licensePhoto" className="block text-lg font-medium mb-1">
                License Photo
              </label>
              <input
                type="file"
                id="licensePhoto"
                name="licensePhoto"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="vehicleNumber" className="block text-lg font-medium mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="blueBookPhoto" className="block text-lg font-medium mb-1">
                Bluebook Photo
              </label>
              <input
                type="file"
                id="blueBookPhoto"
                name="blueBookPhoto"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="driverSelfie" className="block text-lg font-medium mb-1">
                Driver Selfie
              </label>
              <input
                type="file"
                id="driverSelfie"
                name="driverSelfie"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {loading ? 'Registering...' : 'Register as Driver'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;
