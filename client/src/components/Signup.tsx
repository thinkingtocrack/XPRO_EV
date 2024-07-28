import { useState } from "react"
import axios from 'axios'
import toast,{Toaster} from "react-hot-toast"
import { signupValidator } from "../utils/validation/user/userValidation";

const Signup = () => {
  const [form,setForm]=useState({username:"",password:"",email:"",conformPassword:"",fullname:""})

  const signupForm=async()=>{
    try {
      const validation = signupValidator(form)
      if(!validation.success){
        console.log(validation.error.issues)
        validation.error.issues.map((a)=>{
          toast.error(a.message)
        })
        return
      }
      const result=await axios.post('http://localhost:3000/auth/signup',form)
      if(result.data.userExist){
        toast.error('user exist')
      }else{
        toast.success('user created')
      }
    } catch (error) {
      toast.error('server error')
      console.log(error)      
    }
  }

  const inputclassname="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-100 dark:focus:ring-neutral-600"

  return (
    <>
    <Toaster/>
    <div className='relative bg-black w-full h-screen'>
        <div className='pl-5 pr-5 pt-14 h-auto absolute backdrop-blur-sm shadow rounded-2xl shadow-white min-w-96 w-auto  top-10 right-28 flex flex-col gap-2'>
            <div className="mb-2">
              <h1 className="text-white text-4xl font-medium mb-1">Signup</h1>
              <p className="text-white">Just some details to get you in.!</p>
            </div>
            <div className="flex flex-col">
              <input className={`${inputclassname}`} type="text" placeholder="Username" value={form.username} key='1' onChange={(e)=>setForm({...form,username:e.target.value})} />
            </div>
            <div className="flex flex-col">
              <input className={inputclassname} type="text" placeholder="Fullname" value={form.fullname} key='2' onChange={(e)=>setForm({...form,fullname:e.target.value})} />
            </div>
            <div className="flex flex-col">
              <input className={`${inputclassname}`} type="email" placeholder="Email" value={form.email} key='3' onChange={(e)=>setForm({...form,email:e.target.value})} />
            </div>
            <div className="flex flex-col">
              <input className={`${inputclassname}`} type="password" placeholder="Password" value={form.password} key='4' onChange={(e)=>setForm({...form,password:e.target.value})} />
            </div>
            <div className="flex flex-col">
              <input className={`${inputclassname}`} type="password" placeholder="Conform Password" value={form.conformPassword} key ='2' onChange={(e)=>setForm({...form,conformPassword:e.target.value})} />
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={signupForm} className="text-white text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg h-10 w-full">SignUp</button>
            </div>
            <br />
        </div>
    </div>
    </>
  )
}

export default Signup