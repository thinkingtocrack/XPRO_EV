import { Link} from "react-router-dom"
import { AxiosError, isAxiosError } from 'axios'
import toast from "react-hot-toast"
import { useDispatch, useSelector} from "react-redux"
import { loginStart,loginSucess,loginFailure } from "../../store/users/authSlice"
import { RootType } from "../../store/configurestore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userLoginSchema } from "../../utils/validation/user/userValidation"
import { axiosPrivate } from "../../utils/apis/axios/axiosInstance"


interface IFormInput {
  username:string,
  password:string,
  rememberme:boolean
}

const Index = () => {
  const dispatch=useDispatch()
  const {isLoading} = useSelector((store:RootType)=>store.user.auth)
  const {register,handleSubmit,formState:{errors}}=useForm<IFormInput>({resolver:zodResolver(userLoginSchema),mode:"onBlur"})

  const handleLogin=async(data:IFormInput)=>{
    try {
      dispatch(loginStart())
      const result = await axiosPrivate.post('api/auth/user/login',data)
      console.log(result.data)
      dispatch(loginSucess(result.data))
      toast.success('user logedin')
    } catch (error) {
      if(isAxiosError(error)){
        const axiosError  = error as AxiosError & {response?:{data?:{error:string,message:string}}}
        dispatch(loginFailure(axiosError.response?.data))
        toast.error(`${axiosError.response?.data?.message}`)
      }else{
        dispatch(loginFailure('server error'))
      }
    }
  }
  
  return (
    <>
    <div className='relative bg-slate-100 dark:bg-black w-full h-screen' >
        <div className="absolute left-20 top-32">
          <h1 className="text-black text-8xl mb-4">charge up .!</h1>
          <h2 className="text-black text-3xl italic border-2 inline-block p-1 border-black">Skip the QUEUE?</h2>
        </div>
        <div className="absolute right-[430px] top-9 rounded-full bg-gradient-to-t from-pink-600 to-violet-500 w-60 h-60"></div>
        <div className='h-auto absolute pt-14 pl-5 pr-5 pb-5 backdrop-blur-lg shadow rounded-2xl shadow-black w-96  top-10 right-28 flex flex-col gap-2'>
            <h1 className="text-black dark:text-white text-4xl font-medium">Login</h1>
            <p className="text-black dark:text-white mb-1">Glad you’re back.!</p>
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="flex flex-col gap-1">
                <div>
                  <input {...register('username',{required:true})} className={`${errors?.username?'input-error':""} input  input-bordered w-full`} placeholder="Username"  type="text" />
                  <p className={`${errors?.username?'visible':"invisible"} text-pink-600 text-sm`} >
                  {errors.username?errors.username.message:'invalid usrname'}
                  </p>
                </div>
                <div>
                  <input {...register('password',{required:true})} className={`${errors?.password?'input-error':""} input  input-bordered w-full`} placeholder="Password" type="password"/>
                  <p className={`${errors?.password?'visible':"invisible"} text-pink-600 text-sm`} >
                  {errors.password?.message?errors.password.message:'invalid password'}
                  </p>
                </div>
                <div className="flex gap-1">
                    <input className="checkbox" {...register('rememberme')}  id="rememberme" type="checkbox" />
                    <label className="text-black dark:text-white" htmlFor="rememberme">remember me</label>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="text-white w-full text-center bg-gradient-to-r from-green-300 via-green-500 to-green-300 rounded-lg h-10 ">{isLoading?<span className="loading loading-dots loading-lg"></span>:'Login'}</button>
                </div>
              </div>
            </form>
            <Link className="text-black dark:text-white text-center mt-2" to="/home/forgotpassword"> Forgot Password?</Link>
            <p className="text-black dark:text-white text-center">Don’t have an account ? <Link className="text-black dark:text-white underline" to="/home/signup">signup</Link></p>
        </div>
    </div>
    </>
  )
}

export default Index