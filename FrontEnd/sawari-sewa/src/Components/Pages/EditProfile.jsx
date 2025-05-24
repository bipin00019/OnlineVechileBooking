// import React, { useState, useEffect } from 'react';
// import { fetchUserProfile } from '../../services/roleManagement';
// import { updateUserProfile as updateProfile } from '../../services/passengerService';

// const EditProfile = () => {
//   const [profile, setProfile] = useState({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     email: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Fetch user profile on component mount
//   useEffect(() => {
//     loadUserProfile();
//   }, []);

//   const loadUserProfile = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchUserProfile();
//       if (data && data.user) {
//         setProfile({
//           firstName: data.user.firstName || '',
//           lastName: data.user.lastName || '',
//           phoneNumber: data.user.phoneNumber || '',
//           email: data.user.email || ''
//         });
//       }
//     } catch (error) {
//       console.error('Error loading profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!profile.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     }
    
//     if (!profile.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     }
    
//     if (!profile.phoneNumber.trim()) {
//       newErrors.phoneNumber = 'Phone number is required';
//     } else if (!/^\d{10}$/.test(profile.phoneNumber.replace(/\D/g, ''))) {
//       newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setUpdating(true);
//       await updateProfile({
//         firstName: profile.firstName,
//         lastName: profile.lastName,
//         phoneNumber: profile.phoneNumber
//       });
      
//       // Optionally reload the profile to get updated data
//       // await loadUserProfile();
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <div className="px-6 py-4 bg-blue-600 text-white">
//             <h1 className="text-2xl font-bold">Edit Profile</h1>
//             <p className="text-blue-100 mt-1">Update your personal information</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* First Name */}
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 value={profile.firstName}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.firstName ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your first name"
//               />
//               {errors.firstName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
//               )}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={profile.lastName}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.lastName ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your last name"
//               />
//               {errors.lastName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
//               )}
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 value={profile.phoneNumber}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your phone number"
//               />
//               {errors.phoneNumber && (
//                 <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
//               )}
//             </div>

//             {/* Email (Read-only) */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={profile.email}
//                 readOnly
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
//                 placeholder="Email address"
//               />
//               <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={loadUserProfile}
//                 className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
//               >
//                 Reset
//               </button>
//               <button
//                 type="submit"
//                 disabled={updating}
//                 className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                   updating ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {updating ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Updating...
//                   </div>
//                 ) : (
//                   'Update Profile'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;

import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../services/roleManagement';
import { updateUserProfile as updateProfile } from '../../services/passengerService';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      if (data && data.user) {
        setProfile({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          phoneNumber: data.user.phoneNumber || '',
          email: data.user.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Handle different input types
    if (name === 'firstName' || name === 'lastName') {
      // Remove leading/trailing spaces and replace multiple spaces with single space
      processedValue = value.replace(/^\s+/, '').replace(/\s+/g, ' ');
    } else if (name === 'phoneNumber') {
      // Allow only digits, remove any non-digit characters
      processedValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    }
    
    setProfile(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // First name validation
    if (!profile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (profile.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s]+$/.test(profile.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters and spaces';
    } else if (profile.firstName !== profile.firstName.trim()) {
      newErrors.firstName = 'First name cannot start or end with spaces';
    }
    
    // Last name validation
    if (!profile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (profile.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s]+$/.test(profile.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters and spaces';
    } else if (profile.lastName !== profile.lastName.trim()) {
      newErrors.lastName = 'Last name cannot start or end with spaces';
    }
    
    // Phone number validation
    if (!profile.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profile.phoneNumber)) {
      if (profile.phoneNumber.length < 10) {
        newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
      } else if (profile.phoneNumber.length > 10) {
        newErrors.phoneNumber = 'Phone number cannot exceed 10 digits';
      } else {
        newErrors.phoneNumber = 'Phone number must contain only digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      await updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    loadUserProfile(); // Reset to original data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600 text-lg">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Display Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="flex items-center justify-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active Account
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">Full Name</span>
                  </div>
                  <p className="text-gray-800 font-semibold ml-8">{profile.firstName} {profile.lastName}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                  </div>
                  <p className="text-gray-800 font-semibold ml-8 break-all">{profile.email}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                  </div>
                  <p className="text-gray-800 font-semibold ml-8">{profile.phoneNumber || 'Not provided'}</p>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Edit Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {isEditing ? 'Edit Information' : 'Profile Information'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {isEditing ? 'Update your personal details below' : 'Your current profile information'}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 ${
                        errors.firstName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter your first name"
                      maxLength="50"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 ${
                        errors.lastName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter your last name"
                      maxLength="50"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 ${
                        errors.phoneNumber ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter 10-digit phone number"
                      maxLength="10"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      {profile.phoneNumber.length}/10 digits entered
                    </p>
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-gray-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 font-semibold transform hover:scale-105 ${
                        updating ? 'opacity-50 cursor-not-allowed transform-none' : ''
                      }`}
                    >
                      {updating ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Display Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-700 mb-2">FIRST NAME</h4>
                      <p className="text-xl font-bold text-gray-800">{profile.firstName}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-700 mb-2">LAST NAME</h4>
                      <p className="text-xl font-bold text-gray-800">{profile.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h4 className="text-sm font-semibold text-green-700 mb-2">PHONE NUMBER</h4>
                    <p className="text-xl font-bold text-gray-800">{profile.phoneNumber || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">EMAIL ADDRESS</h4>
                    <p className="text-xl font-bold text-gray-800 break-all">{profile.email}</p>
                    <div className="flex items-center mt-2 text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
