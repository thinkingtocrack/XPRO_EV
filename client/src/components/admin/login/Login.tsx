import logo from "../../../assets/images/logo.png";
import { useDispatch} from "react-redux";
import {
  loginStart,
  loginSucess,
  loginFailure,
} from "../../../store/admin/authSlice";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLoginSchema } from "../../../utils/validation/admin/adminValidation";
import { axiosPrivate } from "../../../utils/apis/axios/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";


interface IFormInput{
  email:string,
  password:string,
  rememberme:boolean
}


const Login = () => {
  const dispatch = useDispatch()
  const {register,handleSubmit,formState:{errors}} = useForm<IFormInput>({resolver:zodResolver(AdminLoginSchema),mode:'onBlur'})

  const handleLogin=async(data:IFormInput)=>{
    try {
      dispatch(loginStart())
      const result = await axiosPrivate.post('/api/auth/admin/login',data)
      dispatch(loginSucess(result.data))
    } catch (error) {
      console.log(error)
      if(axios.isAxiosError(error)){
        const errorMessage = error.response?.data?.message  || 'unexpected error'
        toast.error(errorMessage)
        dispatch(loginFailure(error))
      }else{
        dispatch(loginFailure(error))
      }
    }
  } 

  return (
    <>
      <div className="bg-[url('/images/background/adminLoginBG.png')] bg-cover h-screen flex justify-center items-center">
        <div className="w-full max-w-sm h-96 mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="px-6 py-4">
            <div className="flex justify-center mx-auto">
              <img className="w-auto h-7 sm:h-8" src={logo} alt="" />
            </div>

            <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
              Welcome Back
            </h3>

            <p className="mt-1 text-center text-gray-800 dark:text-gray-400">
              ADMIN
            </p>
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="w-full mt-4 mb-2">
                <input
                  {...register('email',{required:true})}
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                <p className={`${errors?.email?'visible':"invisible"} text-pink-600 text-sm`} >
                  invalid email
                </p>
              </div>
              
              <div className="w-full mt-4 mb-2">
                <input 
                {...register('password',{required:true})}
                type="password" 
                placeholder="password" 
                className="input input-bordered w-full " 
                />
                <p className={`${errors?.password?'visible':"invisible"} w-full text-pink-600 text-sm`} >
                  {errors.password?.message?errors.password.message:'invalid email'}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                >
                  Forget Password?
                </a>

                <button
                  type='submit'
                  className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
