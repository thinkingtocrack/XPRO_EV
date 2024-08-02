import axios from "axios";
import { useState } from "react";
import toast,{Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {
  const [email,setEmail] = useState('')
  const navigate=useNavigate()
  const [password,setPassword]=useState('')
  const login = async()=>{
    if(password.length<5){
      toast('password is less than 5 charaters')
      return 
    }
    if(email.length<5){
      toast('email is less than 5 charaters')
      return 
    }
    const result = await axios.post('http://localhost:3000/auth/admin/login',{
      email,
      password
    })
    if(result.data.isAuth){
      navigate('/admin')
    }else{
      toast.error('invalid login')
    }
  }
    return (
      <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
        <Toaster/>
        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
          <div
            className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com//assets/components/form/userlogin/login_tailwindtap.jpg)`,
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <p className="text-xl text-gray-600 text-center">Welcome back!</p>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="email"
                required value={email} onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4 flex flex-col justify-between">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
              </div>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
              onClick={login} >
                Login
              </button>
            </div>
            <a
              href="#"
              className=" flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
            >
            </a>
          </div>
        </div>
      </div>
    );
  };
  export default AdminLogin;