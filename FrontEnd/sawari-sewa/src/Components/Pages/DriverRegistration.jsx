import React, { useState } from 'react';
import { applyForDriver } from '../../services/DriverService';
import { useNavigate } from 'react-router-dom';

const DriverRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    LicenseNumber: '',
    VehicleNumber: '',
    VehicleType: '',
    StartingPoint: '',
    DestinationLocation: '',
    DepartureTime: '',
    DropOffPoint: '',
    PickupPoint: '',
  });

  const [files, setFiles] = useState({
    LicensePhoto: null,
    DriverPhoto: null,
    BillbookPhoto: null,
    CitizenshipFront: null,
    CitizenshipBack: null,
    SelfieWithID: null,
    VehiclePhoto: null,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files: [file] } = e.target;
    if (file) {
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setMessage(`File ${file.name} is not a valid image type. Please use JPG, JPEG or PNG`);
        return;
      }

      console.log(`File selected for ${name}:`, file.name);
      setFiles(prev => ({
        ...prev,
        [name]: file,
      }));
      setMessage(''); // Clear any error messages
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    setSuccess(false);

    // First, verify we have all required files
    const requiredFiles = ['LicensePhoto', 'DriverPhoto', 'BillbookPhoto', 'CitizenshipFront', 'CitizenshipBack', 'SelfieWithID', 'VehiclePhoto'];
    const missingFiles = requiredFiles.filter(fileKey => !files[fileKey]);
    
    if (missingFiles.length > 0) {
      setMessage(`Please upload all required files: ${missingFiles.join(', ')}`);
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    // Append form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) { // Only append if value is not empty
        formDataToSend.append(key, value);
        console.log(`Appending form field ${key}:`, value);
      }
    });

    // Append files to FormData with explicit file names
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file, file.name);
        console.log(`Appending file ${key}:`, file.name);
      }
    });

    try {
      const response = await applyForDriver(formDataToSend);
      setMessage(response.message || 'Registration successful!');
      setSuccess(true);
      console.log('Registration successful:', response);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.message || 'Driver registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Render file input field
  const renderFileInput = (name, label) => (
    <div className="mb-4 w-full">
      <label className="block text-lg font-medium mb-1 text-white">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="file"
        name={name}
        onChange={handleFileChange}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:ring-2 focus:ring-blue-500 text-white"
        accept="image/jpeg,image/png,image/jpg"
      />
      {files[name] && (
        <p className="mt-1 text-sm text-green-400">
          Selected: {files[name].name}
        </p>
      )}
    </div>
  );

  // Render text input field
  const renderTextInput = (name, label) => (
    <div className="mb-4 w-full">
      <label className="block text-lg font-medium mb-1 text-white">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:ring-2 focus:ring-blue-500 text-black"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="bg-[#17252A] text-white w-full md:w-1/3 p-8 flex flex-col justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl">🚗</div>
          <div className="text-center">
            <h1 className="text-4xl font-bold">Sewari Sewa</h1>
            <p className="text-xl">Trusted Ticketing Platform</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold">Join Our Driver Community</h2>
          <p className="text-lg mt-4 opacity-90">
            Register today to become a part of a trusted network of drivers and provide
            exceptional service to our customers.
          </p>
        </div>
      </div>
      <div className="flex-1 bg-[#17252A] p-4 md:p-8 bg-opacity-90">
        <div className="max-w-3xl mx-auto bg-[#00000099] rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">Driver Registration</h2>
          {message && (
            <div 
              className={`px-4 py-2 rounded-lg mb-4 ${
                success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
          {success ? (
            <div className="text-center">
              <p className="text-green-500 text-lg font-semibold mb-4">
                Registration Form Applied Successfully!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Go to Home Page
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderTextInput('LicenseNumber', 'License Number')}
              {renderTextInput('VehicleNumber', 'Vehicle Number')}
              {/* {renderTextInput('VehicleType', 'Vehicle Type')} */}
              <div className="mb-4 w-full">
                <label className="block text-lg font-medium mb-1 text-white">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="VehicleType"
                  value={formData.VehicleType}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="" disabled>Select a vehicle type</option>
                  <option value="Bus">Bus</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Van">Van</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>
              {renderTextInput('StartingPoint', 'Starting Location')}
              {renderTextInput('DestinationLocation', 'Destination Location')}
              {renderTextInput('DepartureTime', 'Departure Time')}
              {renderTextInput('PickupPoint', 'Pickup Point')}
              {renderTextInput('DropOffPoint', 'Drop Off Point')}
              {renderFileInput('LicensePhoto', 'License Photo')}
              {renderFileInput('DriverPhoto', 'Driver Photo')}
              {renderFileInput('BillbookPhoto', 'Vehicle Billbook Photo')}
              {renderFileInput('CitizenshipFront', 'Citizenship Front')}
              {renderFileInput('CitizenshipBack', 'Citizenship Back')}
              {renderFileInput('SelfieWithID', 'Selfie with ID')}
              {renderFileInput('VehiclePhoto', 'Vehicle Photo')}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register as Driver'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;