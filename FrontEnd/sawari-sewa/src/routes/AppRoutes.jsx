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
import AvailableVehcile from "../Components/Pages/AvailableVehcile";
import CreateVehicleSchedule from "../Components/VehiclePages/CreateVehicleSchedule";
import ViewVehicleSchedule from "../Components/VehiclePages/ViewVehicleSchedule";
import BookingConfirmation from "../Components/Pages/BookingConfirmation";
import AvailableVehicle from "../Components/AvailableVehicles/AvailableVehicle";
import VerifyPayment from "../Components/AvailableVehicles/VerifyPayment";
import VehicleReservation from "../Components/AvailableVehicles/VehicleReservation";
import VerifyReservationPayment from "../Components/AvailableVehicles/VerifyReservationPayment";
import AllReviews from "../Components/DriverDashboards/AllReviews";
import BookingHistory from "../Components/Pages/BookingHistory";
import MyBookings from "../Components/Pages/MyBookings";
import AllUsers from "../Components/Pages/AllUsers";
import DriverReviews from "../Components/Pages/DriverReviews";
import ManageRefundandCancellation from "../Components/DriverDashboards/ManageRefundandCancellaton";
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
            <Route path = {PATHS.AVAILABLEVEHICLE} element = {<AvailableVehicle/>} />
            <Route path = {PATHS.CREATEVEHICLESCHEDULE} element = {<CreateVehicleSchedule/>} />
            <Route path = {PATHS.VIEWVEHICLESCHEDULE} element = {<ViewVehicleSchedule/>} />
            <Route path = {PATHS.BOOKINGCONFIRMATION} element = {<BookingConfirmation/>} />
            <Route path = {PATHS.VERIFYPAYMENT} element = {<VerifyPayment/>} />
            <Route path = {PATHS.VEHICLERESERVATION} element = {<VehicleReservation/>} />
            <Route path = {PATHS.VERIFYRESERVATIONPAYMENT} element = {<VerifyReservationPayment/>} />
            <Route path = {PATHS.ALLREVIEWS} element = {<AllReviews/>} />
            <Route path = {PATHS.BOOKINGHISTORY} element = {<BookingHistory/>} />
            <Route path = {PATHS.MYBOOKINGS} element = {<MyBookings/>} />
            <Route path = {PATHS.ALLUSERS} element = {<AllUsers/>} />
            <Route path = {PATHS.DRIVERREVIEWS} element = {<DriverReviews/>} />
            <Route path = {PATHS.MANAGEREFUND} element = {<ManageRefundandCancellation/>} />
        </Routes> 
    )
}

export default AppRoutes