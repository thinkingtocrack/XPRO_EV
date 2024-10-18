import { useState} from "react"
import axios from 'axios'
import toast,{Toaster} from "react-hot-toast"
import { userSignupSchema } from "../../utils/validation/user/userValidation";
export type IForm={
  username:string,
  password:string,
  email:string,
  conformPassword:string,
  fullname:string
}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Otp from "../otp/Otp";

const Signup = () => {
  const [data,setData] = useState<IForm>()
  const {register,handleSubmit,formState:{errors}} = useForm<IForm>({resolver:zodResolver(userSignupSchema),mode:'onBlur'})
  const [otpForm,setOtpForm] = useState(false)
  
  
  const handleSignup = async(d:IForm)=>{
    try {
      const result = await axios.post('/api/auth/user/verification/sendotp',{
        email:d.email,
        userName:d.username
      })
      toast.success('verify the otp')
      if(result.data.status){
        setData(d)
        setOtpForm(true)
      }
    } catch (error) {
      console.log(error)
      if(error.response?.data?.name=="User_Exists"){
        error.response.data.fields.forEach((a)=>{
          toast.error(`${a} exists`)
        })
      }
    }
  }
  
  return (
    <>
    <div className='relative bg-slate-100 dark:bg-black w-full h-screen'>
        <div className="absolute left-20 top-32">
          <h1 className="text-black text-8xl mb-4">charge up .!</h1>
          <h2 className="text-black text-3xl italic border-2 inline-block p-1 border-black">Skip the QUEUE?</h2>
        </div>
        <div className="absolute right-[430px] top-9 rounded-full bg-gradient-to-t from-pink-600 to-violet-500 w-60 h-60"></div>
        <div className='pl-5 pr-5 pt-10 pb-6 h-auto absolute backdrop-blur-lg shadow rounded-2xl shadow-black dark:shadow-white min-w-96 w-auto  top-10 right-28 flex flex-col gap-2'>
            {otpForm?<Otp data={data} />:<>
            <div className="mb-1">
              <h1 className="text-black dark:text-white text-4xl font-medium mb-1">Signup</h1>
              <p className="text-black dark:text-white">Just some details to get you in.!</p>
            </div>
            <form onSubmit={handleSubmit(handleSignup)} >
              <div className="flex flex-col gap-2 w-96">
                <div className="flex flex-col">
                  <input {...register('username')} className="input input-bordered w-full" type="text" placeholder="Username"/>
                  <p className={`${errors?.username?'visible':"invisible"} text-pink-700 text-sm`} >
                  {errors.username && errors.username.message}
                  </p>
                </div>
                <div className="flex flex-col">
                  <input {...register('fullname')} className="input input-bordered w-full " type="text" placeholder="Fullname" />
                  <p className={`${errors?.fullname?'visible':"invisible"} text-pink-600 text-sm`} >
                  {errors.fullname && errors.fullname.message}
                  </p>
                </div>
                <div className="flex flex-col">
                  <input {...register('email')} className="input input-bordered w-full" type="email" placeholder="Email"  />
                  <p className={`${errors.email?'visible':"invisible"} text-pink-600 text-sm`} >
                  {errors.email && errors.email.message}
                  </p>
                </div>
                <div className="flex flex-col">
                  <input {...register('password')} className="input input-bordered w-full" type="password" placeholder="Password"  />
                  <p className={`${errors?.password?'visible':"invisible"} text-pink-600 text-sm`} >
                  {errors.password && errors.password.message}
                  </p>
                </div>
                <div className="flex flex-col">
                  <input {...register('conformPassword')} className="input input-bordered w-full" type="password" placeholder="Confirm Password"  />
                  <p className={`${errors?.conformPassword?'visible':"invisible"} text-pink-600 text-sm`} >
                  {errors.conformPassword && errors.conformPassword.message}
                  </p>
                </div>
                <div className="flex justify-center mt-2">
                    <button type="submit" className="text-white text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg h-10 w-full">SignUp</button>
                </div>
              </div>
            </form>
            </>
            }
        </div>
    </div>
    </>
  )
}

export default Signup