import {createBrowserRouter,createRoutesFromElements} from 'react-router-dom'
import AdminRoute from './admin/adminRoute.tsx'
import userRoute from './user/userRoute.tsx'


const router=createBrowserRouter(
    createRoutesFromElements(
      <>
        {userRoute}
        {AdminRoute}
      </>    
    )
)


export default router