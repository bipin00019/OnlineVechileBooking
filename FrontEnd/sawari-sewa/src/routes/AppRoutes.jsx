import React from "react";
import {Routes, Route} from 'react-router-dom'
import { PATHS } from "../constants/paths";
import Home from "../Components/Pages/Home";
import Login from "../Components/Auth/Login";
import DriverRegistration from "../Components/Pages/DriverRegistration";
import Register from "../Components/Pages/Register";
import VerifyEmail from "../Components/Pages/verifyEmail";
const AppRoutes = () => {
    return(
        <Routes>
            <Route path = {PATHS.HOME} element = {<Home/>}/>
            <Route path = {PATHS.LOGIN} element = {<Login/>}/>
            <Route path = {PATHS.DRIVERREGISTRATION} element = {<DriverRegistration/>}/>
            <Route path = {PATHS.REGISTER} element = {<Register/>} />
            <Route path = {PATHS.VERIFYEMAIL} element = {<VerifyEmail/>} />
        </Routes> 
    )
}

export default AppRoutes