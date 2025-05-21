

// import React, { useState, useEffect } from 'react';
// import { fetchAllUsersWithRoles, changeUserRole } from '../../services/AdminDashboardService';

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState('');
//   const [uniqueRoles, setUniqueRoles] = useState([]);
//   const [popoverUserId, setPopoverUserId] = useState(null);
//   const [isChangingRole, setIsChangingRole] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         setLoading(true);
//         const userData = await fetchAllUsersWithRoles();
//         setUsers(userData);
        
//         // Extract unique roles for the filter dropdown
//         const roles = [...new Set(userData.map(user => user.role))];
//         setUniqueRoles(roles);
//       } catch (err) {
//         setError('Failed to load users. Please try again later.');
//         console.error('Error loading users:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUsers();
//   }, []);

//   // Clear success message after 3 seconds
//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   // Filter users based on search term and role filter
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = 
//       user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phoneNumber.includes(searchTerm);
    
//     const matchesRole = roleFilter === '' || user.role === roleFilter;
    
//     return matchesSearch && matchesRole;
//   });

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Handle role filter change
//   const handleRoleFilterChange = (e) => {
//     setRoleFilter(e.target.value);
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchTerm('');
//     setRoleFilter('');
//   };

//   // Handle role change button click
//   const handleRoleChangeClick = (userId) => {
//     setPopoverUserId(userId === popoverUserId ? null : userId);
//   };

//   // Close the popover
//   const closePopover = () => {
//     setPopoverUserId(null);
//   };

//   // Handle role change
//   const handleRoleChange = async (userId, newRole) => {
//     try {
//       setIsChangingRole(true);
//       await changeUserRole(userId, newRole);
      
//       // Update the users list with the new role
//       const updatedUsers = users.map(user => {
//         if (user.userId === userId) {
//           return { ...user, role: newRole };
//         }
//         return user;
//       });
      
//       setUsers(updatedUsers);
//       setPopoverUserId(null); // Close the popover
      
//       // Show success message
//       const user = users.find(u => u.userId === userId);
//       setSuccessMessage(`Role changed successfully! ${user?.firstName} ${user?.lastName} is now a ${newRole}`);
      
//     } catch (err) {
//       setError('Failed to change user role. Please try again.');
//       console.error('Error changing role:', err);
//     } finally {
//       setIsChangingRole(false);
//     }
//   };

//   // Get available roles for a user based on current role
//   const getAvailableRoles = (currentRole) => {
//     if (currentRole === 'Passenger') return ['Admin', 'Driver'];
//     if (currentRole === 'Driver') return ['Admin', 'Passenger'];
//     if (currentRole === 'Admin') return ['Passenger', 'Driver'];
//     return [];
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//       <strong className="font-bold">Error!</strong>
//       <span className="block sm:inline"> {error}</span>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">All Users</h1>
      
//       {/* Success Message */}
//       {successMessage && (
//         <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Success!</strong>
//           <span className="block sm:inline"> {successMessage}</span>
//           <button 
//             className="absolute top-0 bottom-0 right-0 px-4 py-3"
//             onClick={() => setSuccessMessage('')}
//           >
//             <span className="text-green-500 font-bold">&times;</span>
//           </button>
//         </div>
//       )}
      
//       {/* Filters */}
//       <div className="mb-6 flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <input
//             type="text"
//             placeholder="Search by name, email or phone..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
        
//         <div className="md:w-64">
//           <select
//             value={roleFilter}
//             onChange={handleRoleFilterChange}
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Roles</option>
//             {uniqueRoles.map(role => (
//               <option key={role} value={role}>{role}</option>
//             ))}
//           </select>
//         </div>
        
//         <button
//           onClick={resetFilters}
//           className="md:w-24 py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
//         >
//           Reset
//         </button>
//       </div>
      
//       {/* Stats */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-blue-50 border border-blue-200 rounded p-4">
//           <h3 className="text-sm text-blue-800 font-medium">Total Users</h3>
//           <p className="text-2xl font-bold text-blue-600">{users.length}</p>
//         </div>
//         {uniqueRoles.slice(0, 2).map(role => (
//           <div key={role} className="bg-green-50 border border-green-200 rounded p-4">
//             <h3 className="text-sm text-green-800 font-medium">{role}s</h3>
//             <p className="text-2xl font-bold text-green-600">
//               {users.filter(user => user.role === role).length}
//             </p>
//           </div>
//         ))}
//       </div>
      
//       {/* Results count */}
//       <div className="mb-4 text-gray-600">
//         Showing {filteredUsers.length} of {users.length} users
//       </div>
      
//       {/* Users Table */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Phone
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user, index) => (
//                 <tr key={`${user.userId}-${index}`} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-gray-500">{user.email}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-gray-500">{user.phoneNumber}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                       ${user.role === 'Driver' ? 'bg-blue-100 text-blue-800' : 
//                       user.role === 'Passenger' ? 'bg-green-100 text-green-800' : 
//                       'bg-gray-100 text-gray-800'}`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap relative">
//                     <button
//                       onClick={() => handleRoleChangeClick(user.userId)}
//                       className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-xs font-medium transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
//                       disabled={isChangingRole}
//                     >
//                       Change Role
//                     </button>
                    
//                     {/* Enhanced Role change popover */}
//                     {popoverUserId === user.userId && (
//                       <div className="absolute z-10 mt-2 w-56 right-0 bg-white shadow-lg rounded-md border border-gray-200 animate-fadeIn">
//                         <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
//                           <div className="text-sm font-medium text-gray-700">
//                             Select new role:
//                           </div>
//                           <button 
//                             onClick={closePopover}
//                             className="text-gray-400 hover:text-gray-600 focus:outline-none"
//                           >
//                             &times;
//                           </button>
//                         </div>
//                         <div className="p-2">
//                           {getAvailableRoles(user.role).map(role => (
//                             <button
//                               key={role}
//                               onClick={() => handleRoleChange(user.userId, role)}
//                               className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded transition duration-150 ease-in-out"
//                               disabled={isChangingRole}
//                             >
//                               <span className={`w-3 h-3 rounded-full mr-2 ${
//                                 role === 'Driver' ? 'bg-blue-500' : 
//                                 role === 'Passenger' ? 'bg-green-500' : 
//                                 'bg-purple-500'
//                               }`}></span>
//                               {role}
//                               {isChangingRole && <span className="ml-2 animate-pulse">...</span>}
//                             </button>
//                           ))}
//                         </div>
//                         <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 rounded-b-md">
//                           Current role: {user.role}
//                         </div>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
//                   No users found matching your filters
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllUsers;

import React, { useState, useEffect } from 'react';
import { fetchAllUsersWithRoles, changeUserRole } from '../../services/AdminDashboardService';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [popoverUserId, setPopoverUserId] = useState(null);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [changingRoleInfo, setChangingRoleInfo] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const userData = await fetchAllUsersWithRoles();
        setUsers(userData);
        
        // Extract unique roles for the filter dropdown
        const roles = [...new Set(userData.map(user => user.role))];
        setUniqueRoles(roles);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm));
    
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
  };

  // Handle role change button click
  const handleRoleChangeClick = (userId) => {
    setPopoverUserId(userId === popoverUserId ? null : userId);
  };

  // Close the popover
  const closePopover = () => {
    setPopoverUserId(null);
  };

  // Get available roles for a user based on current role with specific rules:
  // - Passenger can be Driver or Admin
  // - Driver can be Admin or Passenger
  // - Admin can be Passenger but NOT Driver
  const getAvailableRoles = (currentRole) => {
    if (currentRole === 'Passenger') return ['Admin', 'Driver'];
    if (currentRole === 'Driver') return ['Admin', 'Passenger'];
    if (currentRole === 'Admin') return ['Passenger']; // Admin cannot be Driver
    return [];
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      setIsChangingRole(true);
      const user = users.find(u => u.userId === userId);
      
      // Set changing role info for visual feedback
      setChangingRoleInfo({
        userId,
        oldRole: user.role,
        newRole,
        name: `${user.firstName} ${user.lastName}`
      });
      
      await changeUserRole(userId, newRole);
      
      // Simulate a slight delay to show the transition animation
      setTimeout(() => {
        // Update the users list with the new role
        const updatedUsers = users.map(u => {
          if (u.userId === userId) {
            return { ...u, role: newRole };
          }
          return u;
        });
        
        setUsers(updatedUsers);
        setPopoverUserId(null); // Close the popover
        
        // Show success message
        setSuccessMessage(`Role changed successfully! ${user?.firstName} ${user?.lastName} is now a ${newRole}`);
        
        // Clear changing role info after completion
        setTimeout(() => {
          setChangingRoleInfo(null);
        }, 500);
      }, 800);
      
    } catch (err) {
      setError('Failed to change user role. Please try again.');
      console.error('Error changing role:', err);
      setChangingRoleInfo(null);
    } finally {
      setTimeout(() => {
        setIsChangingRole(false);
      }, 800);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}</span>
    </div>
  );

  // Helper function to get role badge styles
  const getRoleBadgeStyles = (role) => {
    switch(role) {
      case 'Driver':
        return 'bg-blue-100 text-blue-800';
      case 'Passenger':
        return 'bg-green-100 text-green-800';
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Users</h1>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {successMessage}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage('')}
          >
            <span className="text-green-500 font-bold">&times;</span>
          </button>
        </div>
      )}
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="md:w-64">
          <select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={resetFilters}
          className="md:w-24 py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
      
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="text-sm text-blue-800 font-medium">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>
        {uniqueRoles.map(role => (
          <div key={role} className={`${
            role === 'Driver' ? 'bg-blue-50 border-blue-200' :
            role === 'Passenger' ? 'bg-green-50 border-green-200' :
            'bg-purple-50 border-purple-200'
          } border rounded p-4`}>
            <h3 className={`text-sm font-medium ${
              role === 'Driver' ? 'text-blue-800' :
              role === 'Passenger' ? 'text-green-800' :
              'text-purple-800'
            }`}>{role}s</h3>
            <p className={`text-2xl font-bold ${
              role === 'Driver' ? 'text-blue-600' :
              role === 'Passenger' ? 'text-green-600' :
              'text-purple-600'
            }`}>
              {users.filter(user => user.role === role).length}
            </p>
          </div>
        ))}
      </div>
      
      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>
      
      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={`${user.userId}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {changingRoleInfo && changingRoleInfo.userId === user.userId ? (
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyles(changingRoleInfo.oldRole)} opacity-50 line-through`}>
                          {changingRoleInfo.oldRole}
                        </span>
                        <span className="mx-1 text-gray-500">&rarr;</span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyles(changingRoleInfo.newRole)} animate-pulse`}>
                          {changingRoleInfo.newRole}
                        </span>
                      </div>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyles(user.role)}`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <button
                      onClick={() => handleRoleChangeClick(user.userId)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-xs font-medium transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                      disabled={isChangingRole}
                    >
                      Change Role
                    </button>
                    
                    {/* Enhanced Role change popover */}
                    {popoverUserId === user.userId && (
                      <div className="absolute z-10 mt-2 w-56 right-0 bg-white shadow-lg rounded-md border border-gray-200 animate-fadeIn">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                          <div className="text-sm font-medium text-gray-700">
                            Select new role:
                          </div>
                          <button 
                            onClick={closePopover}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                        <div className="p-2">
                          {getAvailableRoles(user.role).map(role => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(user.userId, role)}
                              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded transition duration-150 ease-in-out"
                              disabled={isChangingRole}
                            >
                              <span className={`w-3 h-3 rounded-full mr-2 ${
                                role === 'Driver' ? 'bg-blue-500' : 
                                role === 'Passenger' ? 'bg-green-500' : 
                                'bg-purple-500'
                              }`}></span>
                              {role}
                              {isChangingRole && <span className="ml-2 animate-pulse">...</span>}
                            </button>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 rounded-b-md">
                          <div className="text-xs text-gray-500">
                            Current role: <span className="font-medium">{user.role}</span>
                          </div>
                          {user.role === 'Admin' && (
                            <div className="mt-1 text-xs text-amber-600">
                              Note: Admins cannot be assigned as Drivers
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;