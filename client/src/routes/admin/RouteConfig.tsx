import { useSelector } from 'react-redux'
import { RootType } from '../../store/configurestore'
import { Navigate, Outlet } from 'react-router-dom'

export const AdminProtectedRoute = () => {
    const isAuth = useSelector((store:RootType)=>store.admin.auth.isAuth)
    if(isAuth){
        return(
            <Outlet/>
        )
    }else{
        return(
            <Navigate to="/admin/login"/>
        )
    }
}
