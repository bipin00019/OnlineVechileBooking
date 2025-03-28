// import { BrowserRouter as Router } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes.jsx";
// import Navbar from "./Components/Navbar/Navbar";
// import { AuthProvider } from "./contexts/AuthContexts.jsx";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function App() {
//   return (
//     <>
//     <AuthProvider>
//      <Router>
//       <Navbar/>
//       <AppRoutes/>
//       </Router>
//       <ToastContainer position="bottom-right" autoClose={3000} />
//     </AuthProvider>
//     </>
//   )
// }

// export default App

import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./Components/Navbar/Navbar";
import { AuthProvider } from "./contexts/AuthContexts.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Router>
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
