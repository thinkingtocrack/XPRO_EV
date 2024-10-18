import { useCallback, useEffect, useState } from "react";
import useAuthApi from "../../../utils/apis/axios/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

type AccountDetailsType = {
  userName: string
  email: string
  fullName: string
  country:string
}

const AccountInfoCard = () => {

  const navigate = useNavigate()

  const api = useAuthApi()

  const [accountDetails,setAccountDetails] = useState<null | AccountDetailsType>(null)

  const getUserData =  useCallback(async () => {
    try {
      const result = await api.get('/api/user/account/details',{
        params:{
          userProperties:[ 'email' ,'fullName','wallet','country']
        }
      })
      setAccountDetails(result.data.data)
    }
    catch(error){
      console.error('Error fetching user data:', error)
    }
  },[api])

  useEffect(()=>{
    getUserData()
  },[getUserData])

  return (
    <div className="relative w-72 bg-white text-black rounded-lg shadow-2xl overflow-hidden border">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Account</h2>
          <Link to="profile" className="text-gray-400 hover:text-gray-600 transition-colors border p-2 rounded-2xl bg-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </Link>
        </div>
        
        <div className="space-y-3">
          <InfoItem label="Name" value={accountDetails?.fullName} />
          <InfoItem label="Email" value={accountDetails?.email?accountDetails.email:'Not Set'} />
          <InfoItem label="country" value={accountDetails?.country?accountDetails.country:'Not Set'} />
        </div>
        
        <button onClick={()=>navigate('profile')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md mt-4 transition-colors">
          More Info
        </button>
      </div>
      
      <div className="absolute top-14 right-4 w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
        <img src="/api/placeholder/40/40" alt="Avatar" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-zinc-500 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default AccountInfoCard;