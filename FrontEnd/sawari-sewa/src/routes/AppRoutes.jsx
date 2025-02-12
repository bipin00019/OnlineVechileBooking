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
        </Routes> 
    )
}

export default AppRoutes