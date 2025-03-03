import React from "react";
import {Routes, Route} from 'react-router-dom'
import { PATHS } from "../constants/paths";
import Home from "../Components/Pages/Home";
import Login from "../Components/Auth/Login";
import DriverRegistration from "../Components/Pages/DriverRegistration";
import Register from "../Components/Pages/Register";
import VerifyEmail from "../Components/Pages/verifyEmail";
import ForgotPassword from "../Components/Pages/ForgotPassword";
import ViewDriverApplications from "../Components/Pages/ViewDriverApplications";
import ReviewDriverApplication from "../Components/Pages/ReviewDriverApplication";
import DriverDashboard from "../Components/Pages/DriverDashboard";
import ApprovedDriversList from "../Components/Pages/ApprovedDriversList";
import ViewApprovedDriver from "../Components/Pages/ViewApprovedDriver";
const AppRoutes = () => {
    return(
        <Routes>
            <Route path = {PATHS.HOME} element = {<Home/>}/>
            <Route path = {PATHS.LOGIN} element = {<Login/>}/>
            <Route path = {PATHS.DRIVERREGISTRATION} element = {<DriverRegistration/>}/>
            <Route path = {PATHS.REGISTER} element = {<Register/>} />
            <Route path = {PATHS.VERIFYEMAIL} element = {<VerifyEmail/>} />
            <Route path = {PATHS.FORGOTPASSWORD} element = {<ForgotPassword/>} />
            <Route path = {PATHS.DRIVERAPPLICATIONS} element = {<ViewDriverApplications/>} />
            <Route path = {PATHS.REVIEWDRIVERAPPLICATION} element = {<ReviewDriverApplication/>} />
            <Route path = {PATHS.DRIVERDASHBOARD} element = {<DriverDashboard/>} />
            <Route path = {PATHS.APPROVEDDRIVERSLIST} element = {<ApprovedDriversList/>} />
            <Route path = {PATHS.VIEWAPPROVEDDRIVER} element = {<ViewApprovedDriver/>} />
        </Routes> 
    )
}

export default AppRoutes