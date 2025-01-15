import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./Components/Navbar/Navbar";
function App() {
  return (
  <>
  <Router>
    <AppRoutes/>
  </Router>
  </>
  )
}

export default App
