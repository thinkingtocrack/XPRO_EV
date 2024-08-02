import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/images/_c2721e24-fbec-4690-889a-e2d4c1b9d573 1.png'
import { Link } from 'react-router-dom'
import { RootType } from '../../store/configurestore'
import { logout } from '../../store/users/authSlice'
import { useState } from 'react'

const Header = () => {
  const dispatch = useDispatch()
  const {isAuth,userInfo} = useSelector((store:RootType)=>store.user.auth)
  const [isVisible,setIsVisible]=useState(false)
  return (
    <header>
        <div className='flex items-center p-2'>
          <div className='flex-1'>
            <img src={logo}/>
          </div>
          <div className='flex-1'>
            <div className='flex gap-3'>
              <Link to="/" className='font-bold text-2xl' >Home</Link>
              <h2 className='font-bold text-2xl' >Charge</h2>
            </div>
          </div>
          <div className='flex-none w-24'>
            {
              isAuth?
              <>
                <div className='relative'>
                  <button onClick={()=>setIsVisible((pre)=>pre?false:true)} className='w-auto min-w-20 h-8 rounded-3xl bg-green-400 flex items-center justify-center'>{userInfo?.userName}</button>
                  {isVisible?
                    <div className='absolute top-9 right-1 bg-slate-600 rounded-md w-36 h-20 z-10 flex flex-col items-center p-2 border-white border-2 ring-1 ring-black'>
                      <button className='text-white' onClick={()=>{
                        (setIsVisible((pre)=>pre?false:true))
                        dispatch(logout())
                      }
                      }> logout</button>
                    </div>:
                    <></>
                  }
                </div>
              </>
              :
              <Link to="/login" className='w-20 h-8 rounded-3xl bg-green-400 flex items-center justify-center'>Login</Link>
            }
          </div>
        </div>
        <hr></hr>
    </header>
  )
}

export default Header
