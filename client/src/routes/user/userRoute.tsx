import { Route,Navigate } from "react-router-dom"
import MainLayout from '../../layout/Main.tsx'
import HomePage from '../../pages/user/Home.tsx'
import LoginPage from '../../pages/user/Login.tsx'
import SignupPage from '../../pages/user/Signup.tsx'
import ForgotPasswordPage from '../../pages/user/ForgotPasswordPage.tsx'
import {LogoutProtectedRoute, ProtectedRoute} from "./RouteConfig.tsx"
import ChargeLayout from "../../layout/user/ChargeLayout.tsx"
import StationsPage from "../../pages/user/charge/StationsPage.tsx"
import BookingPage from "../../pages/user/booking/BookingPage.tsx"
import TripPage from "../../pages/user/charge/TripPage.tsx"
import Dashboard from "../../pages/user/charge/Dashboard.tsx"
import AccountPage from "../../pages/user/account/AccountPage.tsx"
import AccountProfilePage from "../../pages/user/account/AccountEditPage.tsx"

const userRoute = (
    <>
        <Route path="/"  element={<Navigate to='/home' />} />
        <Route path="/home" >
            <Route element={<MainLayout  />}>
                <Route index element={<HomePage/>} />
                <Route element={<LogoutProtectedRoute/>}>
                    <Route path="login" element={<LoginPage  />} />
                    <Route path="signup" element={<SignupPage/>}/>
                    <Route path="forgotpassword" element={<ForgotPasswordPage/>} />
                </Route>
            </Route>
        </Route>
        <Route path='/charge' element={<ProtectedRoute/>} >
            <Route element={<ChargeLayout/>}>
                <Route index element={<Navigate to='/charge/stations' />} />
                <Route path='/charge/stations' element={<StationsPage/>} />
                <Route path='/charge/dashboard' element={<Dashboard/>} />
                <Route path='/charge/slot-booking' element={<BookingPage/>} />
                <Route path='/charge/my-trip' element={<TripPage/>} />
                <Route path='/charge/account' >
                    <Route index element={<AccountPage/>} />
                    <Route path='profile' element={<AccountProfilePage/>} />
                </Route>
            </Route>
        </Route>
    </>
)

export default userRoute