import { useDispatch, useSelector } from "react-redux"
import { RootType } from "../../../store/configurestore"
import { logout } from "../../../store/users/authSlice"


const Dropdown = () => {
    const dispatch = useDispatch()
    const {userInfo} = useSelector((store:RootType)=>store.user.auth)
    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button " className="btn m-1 bg-green-300 hover:bg-green-400 rounded-3xl">{userInfo?userInfo.userName:'invalid'}</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li><button>Profile</button></li>
                <li><button onClick={()=>dispatch(logout())} >Logout</button></li>
            </ul>
        </div>
    )
}

export default Dropdown