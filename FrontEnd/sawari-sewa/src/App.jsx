import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./Components/Navbar/Navbar";
import { AuthProvider } from "./contexts/AuthContexts.jsx";
function App() {
  return (
    <>
    <AuthProvider>
     <Router>
      
      <AppRoutes/>
      </Router>
    </AuthProvider>
    </>
  )
}

export default App
