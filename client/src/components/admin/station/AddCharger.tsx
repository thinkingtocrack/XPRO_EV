import { Link, redirect, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminAddChargerSchema} from '../../../utils/validation/admin/adminValidation';
import axios from 'axios';
import toast from 'react-hot-toast';

type IChargerForm = {
  stationName:string,
  description:string,
  image:FileList,
  chargers: {
    discountRate: number;
    discountType: string;
    basePrice: number;
    taxRate: number;
    portType: string;
    maxPower: number;
    category: string;
    status: string;
    taxType:string;
}[];
  images?:string[]
  latitude:number;
  longitude:number;
  status?:string;
};

const deafultValue ={
      discountRate: 0,
      discountType: '',
      basePrice: 10,
      taxRate: 0,
      portType: '',
      maxPower: 1,
      category: '',
      status: '',
      taxType:'',
    }


const AddCharger = () => {
  const navigate = useNavigate()
  const { getValues,register, handleSubmit, formState: { errors }, control } = useForm<IChargerForm>({
    defaultValues: {chargers:[deafultValue]},
    resolver:zodResolver(adminAddChargerSchema),
    mode:'onSubmit'
  });

  const [previewImage,setPreviewImage] = useState([])

  const { fields, append,remove } = useFieldArray({
    name: 'chargers',
    control
  });

  const [status,setStatus] = useState<string>('draft')

  const getImagesPreview = (file:Blob)=>{
    return new Promise((resolve,reject)=>{
      const reader = new FileReader()
      reader.onloadend=()=>{
        resolve(reader.result)
      }
      reader.readAsDataURL(file)
      reader.onerror=(error)=>{
        reject(error)
      }
    })
  }

  const onImagesChange=async ()=>{
    try {
      const images = Array.from(getValues('image'))
      const resolvedImages = await Promise.all(images.map((image)=>getImagesPreview(image)))
      setPreviewImage(resolvedImages)
    } catch (error) {
      console.log(error)
    }
  }
  
  const onImageUpload = async()=>{
    try {
        const signData = (await axios.get('/api/auth/admin/cloudinary/getsignature')).data
        const images = Array.from(getValues('image'))
        const imagesForUpload=images.map((image)=>{
          const formData = new FormData()
          formData.append('file',image)
          formData.append("api_key", signData.apikey);
          formData.append("timestamp", signData.timestamp);
          formData.append("signature", signData.signature);
          formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");
          formData.append("folder", "stations_image");
          return axios.post("https://api.cloudinary.com/v1_1/" + signData.cloudname + "/auto/upload",formData)
        })
        const uploadedImagesResponse = await Promise.all(imagesForUpload)
        const uploadedImages = uploadedImagesResponse.map((response)=>{
          if(response.status===200){
            return response.data
          }
        })
        return uploadedImages    
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async(data: IChargerForm) => {
    try {
        if(getValues('image').length>0){
          const uploadedImages = await onImageUpload()
          const uploadedImagesUrl = uploadedImages.map((image)=>{
            return image.secure_url
          })
          data.images=uploadedImagesUrl
        }
        data.status=status
        const result = await axios.post('/api/admin/charger/add-stations',{
            data
        })
        if(result.data?.created){
            setTimeout(()=>{
                toast.success('station added')
            },0)
            navigate('/admin/charger')
        }
    } catch (error) {
        console.log(error)
    }
  };

  const [removingIndex,setRemovingIndex] = useState<null | number>(null)
  const handleRemove = (index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      remove(index);
      setRemovingIndex(null);
    }, 1000); // Match this timeout with the CSS transition duration
  };


  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className="breadcrumbs text-sm">
          <ul>
            <li><Link to="/admin/charger">Chargers</Link></li>
            <li>Add Charger</li>
          </ul>
        </div>
        <div className='flex gap-2'>
          <button type='submit' form='stationForm' onClick={()=>setStatus('draft')} className='btn bg-red-300 hover:bg-red-400 '>Save as Draft</button>
          <button type='submit' form='stationForm' onClick={()=>setStatus('availabe')} className='btn bg-green-300 hover:bg-green-400'>Add Station</button>
        </div>
      </div>
      <div>
        <form id='stationForm' onSubmit={handleSubmit(onSubmit)} >
          <div>
            <div>
              <h1>General Information</h1>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Station Name</span>
                </div>
                <input type="text" {...register('stationName')} placeholder="Station Name" className="input input-bordered" />
                <p className={`my-1 ${errors?.stationName?'visible':"invisible"} text-orange-600 text-sm`} >
                  {errors?.stationName && errors?.stationName.message}
                </p>
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
                <textarea className="textarea textarea-bordered h-24" {...register('description')} placeholder="Description"></textarea>
              </label>
            </div>
            <div className='flex gap-2'>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">Latitude</span>
                        </div>
                        <input
                        type="number"
                        step=".00000001"
                        {...register(`latitude`,{valueAsNumber:true})}
                        className="input input-bordered"
                        />
                        <p className={`my-1 ${errors?.latitude?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.latitude && errors?.latitude.message}
                        </p>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">Longitude</span>
                        </div>
                        <input
                        type="number"
                        step=".00000001"
                        {...register(`longitude`,{valueAsNumber:true})}
                        className="input input-bordered"
                        />
                        <p className={`my-1 ${errors?.longitude?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.longitude && errors?.longitude.message}
                        </p>
                    </label>
                  </div>
            <div>
              <h1>Media</h1>
              <input accept='image/*' multiple type="file" {...register('image',{onChange:onImagesChange})} className="file-input w-full max-w-xs" />
              <div className='flex gap-1 flex-wrap'>
                {previewImage.map((Element)=>{
                  return (
                    <img className='w-96 rounded-lg' src={Element
                    } />
                  )
                })}
              </div>
            </div>
            <div className='flex justify-between items-center my-3'>
                <h1>Charger Details</h1>
                <button className='btn bg-blue-400' type="button" onClick={() => append(deafultValue)}>Add Charger</button>
            </div>
            <div className='px-32 bg-slate-100 py-10 rounded-xl'>
              {fields.map((field, index) => (
                <div key={field.id} className={`bg-white p-4 my-4 rounded-lg transition-opacity duration-1000 ${removingIndex===index?'opacity-0':'opacity-100'}`}>
                  <div className='flex justify-between'>
                    <h1 className='font-bold text-2xl'>charger {index+1}</h1>
                    <button type='button' className='btn bg-red-300' onClick={()=>handleRemove(index)} >❌</button>
                  </div>
                  <div className='flex gap-2'>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">Base Price</span>
                        </div>
                        <input
                        type="number"
                        {...register(`chargers.${index}.basePrice`,{valueAsNumber:true})}
                        className="input input-bordered"
                        />
                        <p className={`my-1 ${errors?.chargers?.[index]?.basePrice?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.basePrice && errors?.chargers?.[index]?.basePrice.message}
                        </p>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">power</span>
                        </div>
                        <input
                        type="number"
                        {...register(`chargers.${index}.maxPower`,{valueAsNumber:true})}
                        className="input input-bordered"
                        />
                        <p className={`my-1 ${errors?.chargers?.[index]?.maxPower?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.maxPower && errors?.chargers?.[index]?.maxPower.message}
                        </p>
                    </label>
                  </div>
                  <div className='flex gap-2'>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">discount type</span>
                        </div>
                        <select {...register(`chargers.${index}.discountType`)}  className="select select-bordered">
                            <option value='' disabled>Select discount Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="amount">Amount</option>
                        </select>
                        <p className={`my-1 ${errors?.chargers?.[index]?.discountType?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.discountType && errors?.chargers?.[index]?.discountType.message}
                        </p>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">discount</span>
                        </div>
                        <input
                        type="number"
                        {...register(`chargers.${index}.discountRate`,{valueAsNumber:true})}
                        className="input input-bordered"
                        />
                        <p className={`my-1 ${errors?.chargers?.[index]?.discountRate?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.discountRate && errors?.chargers?.[index]?.discountRate.message}
                        </p>
                    </label>
                  </div>
                  <div className='flex gap-2'>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">Tax Type</span>
                        </div>
                        <select {...register(`chargers.${index}.taxType`)} defaultValue='' className="select select-bordered">
                            <option value=''  disabled>Select Tax Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="amount">Amount</option>
                        </select>
                        <p className={`my-1 ${errors?.chargers?.[index]?.taxType?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.taxType && errors?.chargers?.[index]?.taxType.message}
                        </p>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">Tax</span>
                        </div>
                        <input
                        type="number"
                        {...register(`chargers.${index}.taxRate`,{valueAsNumber:true})}
                        className="input input-bordered"
                        />
                        <p className={`my-1 ${errors?.chargers?.[index]?.taxRate?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.taxRate && errors?.chargers?.[index]?.taxRate.message}
                        </p>
                    </label>
                  </div>
                  <div className='flex gap-2'>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">charger type</span>
                        </div>
                        <select {...register(`chargers.${index}.portType`)} defaultValue='' className="select select-bordered">
                            <option value=''  disabled>Select Port Type</option>
                            <option value="CCS">CCS</option>
                            <option value="CCS2">CCS2</option>
                        </select>
                        <p className={`my-1 ${errors?.chargers?.[index]?.portType?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.portType && errors?.chargers?.[index]?.portType.message}
                        </p>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">Category</span>
                        </div>
                        <select {...register(`chargers.${index}.category`)} defaultValue='' className="select select-bordered">
                            <option value=''  disabled>Select Category</option>
                            <option value="fastcharging">fast Charging</option>
                            <option value="slowcharging">slow Chargeing</option>
                            <option value="superfastcharging">super fats Charging</option>
                        </select>
                        <p className={`my-1 ${errors?.chargers?.[index]?.category?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.category && errors?.chargers?.[index]?.category.message}
                        </p>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                        <span className="label-text">status</span>
                        </div>
                        <select {...register(`chargers.${index}.status`)} defaultValue='' className="select select-bordered">
                            <option value=''  disabled>Select status</option>
                            <option value="online">Online</option>
                            <option value="offline">offline</option>
                            <option value="draft">draft</option>
                        </select>
                        <p className={`my-1 ${errors?.chargers?.[index]?.discountRate?'visible':"invisible"} text-orange-600 text-sm`} >
                            {errors?.chargers?.[index]?.status && errors?.chargers?.[index]?.status.message}
                        </p>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCharger;
