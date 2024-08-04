import { useSelector } from 'react-redux'
import logo from '../../assets/images/logo.png'
import { NavLink ,Link} from 'react-router-dom'
import { RootType } from '../../store/configurestore'
import Dropdown from './loggedin/Dropdown'

const Header = () => {
  const {isAuth} = useSelector((store:RootType)=>store.user.auth)
  return (
    <header className='sticky top-0 z-10 backdrop-blur-xl'>
        <div className='flex items-center p-2'>
          <div className='flex-1'>
            <img src={logo}/>
          </div>
          <div className='flex-1'>
            <div className='flex gap-3'>
              <NavLink to="/home" className={({isActive})=>isActive?"text-black font-bold text-2xl":"text-gray-500 font-bold text-2xl"} >Homes</NavLink>
              <NavLink to="/Charge" className={({isActive})=>isActive?"text-black font-bold text-2xl":"text-gray-500 font-bold text-2xl"} >Charge</NavLink>
            </div>
          </div>
          <div className='flex'>
            {
              isAuth?
              <Dropdown />
              :
              <>
                <Link to="/home/login" className='btn bg-green-300 hover:bg-green-400 rounded-2xl'>Login</Link>
                <Link to="/home/signup" className='btn bg-green-300 hover:bg-green-400 rounded-2xl'>Signup</Link>
              </>
            }
          </div>
        </div>
        <hr></hr>
    </header>
  )
}

export default Header
