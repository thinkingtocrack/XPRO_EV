import {Route,createBrowserRouter,createRoutesFromElements} from 'react-router-dom'
import MainLayout from '../layout/Main.tsx'
import HomePage from '../pages/Home.tsx'
import LoginPage from '../pages/Login.tsx'
import SignupPage from '../pages/Signup.tsx'
import AdminLayout from '../layout/Admin.tsx'
import AdminLogin from '../pages/AdminLogin.tsx'


const router=createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/"  element={<MainLayout  /> } >
          <Route index element={<HomePage/>} />
          <Route path="login" element={<LoginPage  />} />
          <Route path="signup" element={<SignupPage/>}/>
        </Route>
        <Route path="/admin"  element={<AdminLayout  /> } >
            <Route index element={<h1>welcome admin</h1>} />
            <Route path="login" element={<AdminLogin/>} />
        </Route>
      </>    
    )
)


export default router