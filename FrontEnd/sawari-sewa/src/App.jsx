import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./Components/Navbar/Navbar";
import { AuthProvider } from "./contexts/AuthContexts.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <AuthProvider>
     <Router>
      
      <AppRoutes/>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthProvider>
    </>
  )
}

export default App
