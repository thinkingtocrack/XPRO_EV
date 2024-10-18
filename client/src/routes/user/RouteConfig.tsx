import { useSelector} from "react-redux"
import { RootType} from "../../store/configurestore"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoute = () => {
    const isAuth = useSelector((store:RootType)=>store.user.auth.isAuth)
    if(isAuth){
        return <Outlet/>
    }else{
        return <Navigate to='/home' replace={true} />
    }

}

export const LogoutProtectedRoute = ()=> {
    const isAuth = useSelector((store:RootType)=>store.user.auth.isAuth)
    if(!isAuth){
        return <Outlet/>
    }else{
        return <Navigate to='/home'  />
    }
}