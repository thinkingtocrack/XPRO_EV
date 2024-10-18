import { useState } from "react"
import { useNavigate} from "react-router-dom"
import axios from 'axios'
import toast, { Toaster } from "react-hot-toast"
import Password from "../ui/password/Password"
import { env } from "../../main"

const ForgotPassword = () => {
  const navigate=useNavigate()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [isOtpSend,setOtpSend]=useState(false)
  const [otp,setOtp]= useState('')

  const forgotPasswordAction = async()=>{
    try {
        const result = await axios.post('/api/auth/user/forgotpassword',{
            email
        })
        console.log(result)
        if(result.data.status){
            toast.success('otp sent')
            toast.success('please enter otp and new password')
            setOtpSend(true)
        }
    } catch (error) {
        toast.error('user not found')
    }
  }

  const changePasswordAction=async()=>{
    try {
        const result = await axios.patch('/api/auth/user/forgotpassword/verify',{
            email ,password,otp
        })
        console.log(result)
        if(result.data.isVerified){
            toast.success('password changed')
            setTimeout(()=>{
                navigate('/home/login')
            },2000)
        }else{
            toast.error('otp is wrong')
        }
    } catch (error) {
        toast.error('otp verifiaction failed')
        console.log(error)
    }
  }

  return (
    <>
    <div className='relative bg-slate-100 dark:bg-black w-full h-screen' >
        <div className="absolute left-20 top-32">
          <h1 className="text-black text-8xl mb-4">Be Alive !!</h1>
          <h2 className="text-black text-3xl italic border-2 inline-block p-1 border-black">Lets Revive you</h2>
        </div>
        <div className="absolute right-[430px] top-9 rounded-full bg-gradient-to-t from-pink-600 to-violet-500 w-60 h-60"></div>
        <div className='h-auto min-h-96 absolute pt-14 pl-5 pr-5 pb-5 backdrop-blur-lg shadow rounded-2xl shadow-black min-w-96  top-10 right-28 flex flex-col gap-2'>
            <h1 className="text-black dark:text-white text-4xl font-medium">Forgot Password ?</h1>
            <p className="text-black dark:text-white mb-1">Please enter you’re username</p>
            <div>
              <input className="input input-bordered w-full" placeholder="Email" value={email} type="text" key='1' onChange={(e)=>setEmail(e.target.value)} />
            </div>
            {isOtpSend?
            <>
                <div>
                <input className="input input-bordered w-full" placeholder="OTP" value={otp} type="text" key='1' onChange={(e)=>setOtp(e.target.value)} />
                </div>
                <Password password={password} setPassword={setPassword} />
            </>:<></>
            }
            <div className="flex justify-center">
                <button onClick={isOtpSend?changePasswordAction:forgotPasswordAction}  className="text-white w-full text-center bg-gradient-to-r from-green-300 via-green-500 to-green-300 rounded-lg h-10 ">{isOtpSend?'Reset Password':'Send OTP'}</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default ForgotPassword