

// import { BrowserRouter as Router, useLocation } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes.jsx";
// import Navbar from "./Components/Navbar/Navbar";
// import { AuthProvider } from "./contexts/AuthContexts.jsx";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppWithNavbar />
//       </Router>
//       <ToastContainer position="bottom-right" autoClose={3000} />
//     </AuthProvider>
//   );
// }

// function AppWithNavbar() {
//   // Get the current path using useLocation
//   const location = useLocation();

//   // Check if the current path is not for login or register
//   const showNavbar = !['/login', '/register'].includes(location.pathname);
//   return (
//     <>
//       {showNavbar && <Navbar />}  {/* Conditionally render Navbar */}
//       <AppRoutes />
//     </>
//   );
// }

// export default App;



import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./Components/Navbar/Navbar";
import { AuthProvider } from "./contexts/AuthContexts.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingCleanup = () => {
  useEffect(() => {
    // Clean up any stale booking data on app load
    const pathname = window.location.pathname;
    
    // Only clean up if we're not on the verify-payment page
    if (!pathname.includes('/verify-payment')) {
      localStorage.removeItem("vehicleAvailabilityId");
      localStorage.removeItem("selectedSeats");
      
      // Keep processed payments in sessionStorage for the session duration
      // This prevents reprocessing even if the user goes back to the payment page
    }
  }, []);
  
  return null; // This component doesn't render anything
};
function App() {
  return (
    <AuthProvider>
      <Router>
      <BookingCleanup />
        <AppWithNavbar />
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthProvider>
  );
}

function AppWithNavbar() {
  // Get the current path using useLocation
  const location = useLocation();

  // Check if the current path is not for login or register
  const showNavbar = !['/login', '/register'].includes(location.pathname);
  return (
    <>
      {showNavbar && <Navbar />}  {/* Conditionally render Navbar */}
      <AppRoutes />
    </>
  );
}

export default App;
