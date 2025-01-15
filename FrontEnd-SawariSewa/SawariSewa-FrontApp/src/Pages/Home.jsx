import React from 'react';

const Home = () => {
  const roleString = localStorage.getItem("user");
  const role = roleString ? JSON.parse(roleString) : null;
  const userRoles = role && role.roles ? role.roles : [];

  console.log("Role from localStorage:", role);
  console.log("User roles:", userRoles);

  // Prioritize SuperAdmin role if it exists
  const isSuperAdmin = userRoles.includes("SuperAdmin");
  const isOtherRole = userRoles.includes("OtherRole");

  return (
    <div>
      {isSuperAdmin ? (
        <h1>SuperAdmin Logged in</h1>
      ) : isOtherRole ? (
        <h1>Other Role Logged in</h1>
      ) : (
        <h1>Home Page</h1>
      )}
    </div>
  );
};

export default Home;
