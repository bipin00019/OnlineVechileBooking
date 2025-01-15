import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./Navbar/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
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
