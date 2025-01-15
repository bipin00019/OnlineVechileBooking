import React from "react";
import {Routes, Route} from 'react-router-dom';
import { PATHS } from "../constants/paths";
import Home from "../Pages/Home";
import Login from "../Auth/Login";



const AppRoutes = () => {
  return (
    <Routes>
        <Route path={PATHS.HOME} element = {<Home/>}/>
        <Route path={PATHS.LOGIN} element = {<Login/>}/>
    </Routes>
  )
}

export default AppRoutes
