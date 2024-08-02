import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import axios from 'axios'
import toast, { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { loginStart,loginSucess,loginFailure } from "../../store/users/authSlice"
import { RootType } from "../../store/configurestore"

const Index = () => {
  const {isAuth} = useSelector((store:RootType)=>store.user.auth)
  const navigate=useNavigate()
  const dispatch=useDispatch()
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
      const result=await axios.post('http://localhost:3000/auth/user/login',{
        username:username,
        password:password,
        rem:rem
      })
      if(result.data.isAuth){
        dispatch(loginSucess(result.data))
        toast.success('logged in')
        setTimeout(()=>{
          navigate('/')
        },1500)
      }else{
        dispatch(loginFailure(result.data))
        toast.error(result.data.error)
      }
    } catch (error) {
      dispatch(loginFailure(error))
      console.log(error)      
    }
  }

  const inputclassname="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-100 dark:focus:ring-neutral-600"

  return (
    isAuth?<Navigate to='/' />:
    <>
    <Toaster/>
    <div className='relative bg-black w-full h-screen'>
        <div className='h-auto absolute pt-14 pl-5 pr-5 pb-5 backdrop-blur-sm shadow rounded-2xl shadow-white min-w-96  top-10 right-28 flex flex-col gap-2'>
            <h1 className="text-white text-4xl font-medium">Login</h1>
            <p className="text-white mb-1">Glad you’re back.!</p>
            <div>
              <input className={inputclassname} placeholder="Username" value={username} type="text" key='1' onChange={(e)=>setUsername(e.target.value)} />
            </div>
            <div>
              <input className={inputclassname} placeholder="Password" type="password" value={password} key ='2' onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div>
                <input checked={rem} onChange={(e)=>setRem(e.target.checked)} id="rememberme" type="checkbox" />
                <label className="text-white" htmlFor="rememberme">remember me</label>
            </div>
            <div className="flex justify-center">
                <button onClick={loginForm} className="text-white w-full text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg h-10 ">Login</button>
            </div>
            <Link className="text-white text-center mt-2" to="/forgotpassword"> Forgot Password?</Link>
            <p className="text-white text-center">Don’t have an account ? <Link className="text-white underline" to="/signup">signup</Link></p>
        </div>
    </div>
    </>
  )
}

export default Index