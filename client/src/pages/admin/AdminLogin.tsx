import { useState } from 'react';
import logo from '../../assets/images/logo.png'
import Password from '../../components/password/Password';


const AdminLogin = () => {
  const [password,setPassword] = useState('')
  return (
    <>
      <div className="bg-[url('/images/background/adminLoginBG.png')] bg-cover h-screen flex justify-center items-center">
        <div className="w-full max-w-sm h-96 mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="px-6 py-4">
            <div className="flex justify-center mx-auto">
              <img
                className="w-auto h-7 sm:h-8"
                src={logo}
                alt=""
              />
            </div>

            <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
              Welcome Back
            </h3>

            <p className="mt-1 text-center text-gray-800 dark:text-gray-400">
              ADMIN
            </p>

            <form>
              <div className="w-full mt-4">
                <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs" />
              </div>

              <Password password={password} setPassword={setPassword} />

              <div className="flex items-center justify-between mt-4">
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                >
                  Forget Password?
                </a>

                <button className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
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

export default AdminLogin;
