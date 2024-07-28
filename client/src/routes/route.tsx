import {Route,createBrowserRouter,createRoutesFromElements} from 'react-router-dom'
import Home from '../pages/Home.tsx'
import Login from '../pages/Login.tsx'
import Signup from '../pages/Signup.tsx'
import HomeComponent from '../components/home/Index.tsx'


const router=createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/"  element={<Home  /> } >
          <Route index element={<HomeComponent/>} />
          <Route path="/login" element={<Login  />}/>
          <Route path="/signup" element={<Signup/>}/>
        </Route>
      </>    
    )
)


export default router