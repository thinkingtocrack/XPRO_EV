import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState ,useEffect} from 'react';
import { useForm } from 'react-hook-form'
import { userAccountFormSchema } from '../../../utils/validation/user/userValidation';
import useAuthApi from '../../../utils/apis/axios/axiosInstance';

type AccountFromType = {
    phoneNumber:string,
    fullName:string,
    country:string,
    email:string,
    countryCode:string,
    image:FileList
}

const AccountProfilePage = () => {

  const api = useAuthApi()

  const [edit,setEdit] = useState(false)
  const [photo, setPhoto] = useState(null);

  const {register,handleSubmit,formState:{errors,isSubmitting,dirtyFields,isDirty},reset} = useForm<AccountFromType>({
        resolver:zodResolver(userAccountFormSchema),
    })

  const getUserDetails = useCallback(async()=>{
    try {
        const result = await api.get('/api/user/account/details',{
            params:{
                userProperties:['email','fullName','country','phoneNumber',]
            }
        })
        const userData = {
            fullName:result.data.data.fullName,
            country:result.data.data?.country,
            email:result.data.data.email,
            phoneNumber:result.data.data?.phoneNumber?.number,
            countryCode:result.data.data?.phoneNumber?.countryCode
        }
        reset(userData)
    } catch (error) {
        console.log(error)
    }
  },[api,reset])


  useEffect(()=>{
    getUserDetails()
  },[getUserDetails])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDiscardChanges = () => {
    setEdit(false)
    reset()
  }

  const onSubmit = async(data:AccountFromType) => {
    try {
        console.log(data)
        const allowedEditProperties = ['fullName','country','phoneNumber','countryCode']
        const changedEditProperties = allowedEditProperties.filter(key=>dirtyFields[key])
        const editData =  changedEditProperties.reduce((acc,key)=>{
            acc[key] = data[key]
            return acc
            },{})
        const result = await api.patch('/api/user/account/update',{
            editData: editData,
        })
        const newUserData = {
            fullName:result.data.data.fullName,
            country:result.data.data?.country,
            email:result.data.data.email,
            phoneNumber:result.data.data?.phoneNumber?.number,
            countryCode:result.data.data?.phoneNumber?.countryCode
        }
        reset(newUserData)
        setEdit(false)
    } catch (error) {
        console.log(error)        
    }
  }


  return (
    <div className='bg-green-100 p-2'>
        <div className="bg-slate-50 text-black rounded-lg p-4 shadow-lg" >
        <h1 className="text-2xl font-bold mb-4">Account Setting</h1>
        <div className="text-blue-400 mb-6">My Profile</div>

        <div className="mb-8">
            <div className='flex justify-between'>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Account Setting</h2>
                    <p className="text-gray-400 mb-4">Update Photo and personal detail here</p>
                </div>
                <div className="flex gap-3 items-center">
                    {   
                        edit ? 
                            <>
                                <button onClick={onDiscardChanges} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors">
                                Discard Changes
                                </button>
                                <button type='submit' disabled={!isDirty} form='account-edit-form' className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition-colors ">
                                Save
                                </button>
                            </>
                            :
                            <button onClick={()=>setEdit(true)} className="px-4 py-2 rounded bg-red-500 hover:bg-red-700 transition-colors">
                            Edit
                            </button>
                    }
                </div>
            </div>

            <div className="text-center mb-6">
            <p className="mb-2">Your Photo</p>
            <p className="text-sm text-gray-400 mb-4">This will be display on your profile</p>
            <div className="relative w-24 h-24 mx-auto mb-4">
                {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                )}
            </div>
            </div>

        </div>

        <div className="mb-8">
            <form id='account-edit-form' onSubmit={handleSubmit(onSubmit)}>
                <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center mb-8">
                <div className="text-gray-400 mb-2">Drag and drop here</div>
                <label className="cursor-pointer inline-block">
                    <span className="text-blue-400">Browse</span>
                    <input disabled={!edit || isSubmitting} type="file" {...register('image')} className="hidden" onChange={handlePhotoChange} accept="image/*" />
                </label>
                </div>
                <h3 className="text-lg font-semibold mb-4">General Information</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm mb-1">First Name</label>
                    <input disabled={!edit || isSubmitting} type="text" {...register('fullName',{required:true})} placeholder="First Name" className="w-full bg-white rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm mb-1">Country</label>
                    <input disabled={!edit || isSubmitting} type="text" {...register('country')} placeholder="Country" className="w-full bg-white rounded p-2" />
                </div>
                </div>
                <div className="mb-4">
                <label className="block text-sm mb-1">Email</label>
                <input disabled={true} type="email" {...register('email',{required:true})} placeholder="Email" className="w-full bg-white rounded p-2" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm mb-1">Country Code</label>
                    <div className="relative">
                    <select disabled={!edit || isSubmitting} {...register('countryCode')} className="w-full bg-white rounded p-2 appearance-none">
                        <option value='+01'>+01</option>
                        <option value='+02'>+02</option>
                        <option value='+91'>+91</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm mb-1">Phone Number</label>
                    <input disabled={!edit || isSubmitting} {...register('phoneNumber')} type="text" placeholder="Phone Number" className="w-full bg-white rounded p-2" />
                </div>
                </div>
            </form>
        </div>
        </div>
    </div>
  );
};

export default AccountProfilePage;