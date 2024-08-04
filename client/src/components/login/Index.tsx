import { useState } from "react"
import { Link} from "react-router-dom"
import axios from 'axios'
import toast, { Toaster } from "react-hot-toast"
import { useDispatch, useSelector} from "react-redux"
import { loginStart,loginSucess,loginFailure } from "../../store/users/authSlice"
import Password from "../password/Password"
import { RootType } from "../../store/configurestore"

const Index = () => {
  const dispatch=useDispatch()
  const {isLoading } = useSelector((store:RootType)=>store.user.auth)
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [rem,setRem]=useState(false)
  const validator=()=>{
    let ret=true
    if(username.length<5){
      toast.error('username is less than 5 charactors')
      ret=false
    }
    if(password.length<5){
      toast.error('password is less tha 5 charactors')
      ret =false
    }
    return ret
  }
  const loginForm=async()=>{
    dispatch(loginStart())
    if(!validator()){
      return
    }
    try {
      const result=await axios.post('http://localhost:3000/api/auth/user/login',{
        username:username,
        password:password,
        rem:rem
      })
      console.log(result)
      if(result.data.isAuth){
        dispatch(loginSucess(result.data))
      }else{
        dispatch(loginFailure(result.data))
        toast.error(result.data.error)
      }
    } catch (error) {
      dispatch(loginFailure(error))
      console.log(error)      
    }
  }


  return (
    <>
    <Toaster/>
    <div className='relative bg-white dark:bg-black w-full h-screen' >
        <div className="absolute left-20 top-32">
          <h1 className="text-black text-8xl mb-4">charge up .!</h1>
          <h2 className="text-black text-3xl italic border-2 inline-block p-1 border-black">Skip the QUEUE?</h2>
        </div>
        <div className="absolute right-[430px] top-9 rounded-full bg-gradient-to-t from-pink-600 to-violet-500 w-60 h-60"></div>
        <div className='h-auto absolute pt-14 pl-5 pr-5 pb-5 backdrop-blur-md shadow rounded-2xl shadow-black min-w-96  top-10 right-28 flex flex-col gap-2'>
            <h1 className="text-black dark:text-white text-4xl font-medium">Login</h1>
            <p className="text-black dark:text-white mb-1">Glad you’re back.!</p>
            <div>
              <input className="input input-bordered w-full max-w-xs" placeholder="Username" value={username} type="text" key='1' onChange={(e)=>setUsername(e.target.value)} />
            </div>
            <Password password={password} setPassword={setPassword} />
            <div className="flex gap-1">
                <input className="checkbox" checked={rem} onChange={(e)=>setRem(e.target.checked)} id="rememberme" type="checkbox" />
                <label className="text-black dark:text-white" htmlFor="rememberme">remember me</label>
            </div>
            <div className="flex justify-center">
                <button onClick={loginForm} className="text-white w-full text-center bg-gradient-to-r from-green-300 via-green-500 to-green-300 rounded-lg h-10 ">{isLoading?<span className="loading loading-dots loading-lg"></span>:'Login'}</button>
            </div>
            <Link className="text-black dark:text-white text-center mt-2" to="/forgotpassword"> Forgot Password?</Link>
            <p className="text-black dark:text-white text-center">Don’t have an account ? <Link className="text-black dark:text-white underline" to="/home/signup">signup</Link></p>
        </div>
    </div>
    </>
  )
}

export default Index