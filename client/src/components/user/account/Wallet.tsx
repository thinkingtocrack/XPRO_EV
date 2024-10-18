import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef ,useState} from 'react'
import { useForm} from 'react-hook-form'
import { z } from 'zod'
import useAuthApi from '../../../utils/apis/axios/axiosInstance'
import { env } from '../../../main'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const FormDataSchema = z.object({
  amount:z.number({message:'please enter a number'}).min(50,{message:"Amount must be greater than Rs.50"}).max(100000,{message:"Amount must be less than rs.100000"})
})

type FormData= z.infer<typeof FormDataSchema>

const Wallet = () => {

  const [wallet,setWallet] =  useState(0)
  const [walletLoadding,setWalletLoadding] = useState(true)


  const modal=useRef<HTMLDialogElement | null>(null)
  const api = useAuthApi()
  const {register,handleSubmit,formState:{errors}} = useForm<FormData>({
    resolver:zodResolver(FormDataSchema),
    mode:'onChange'
  })

  useEffect(()=>{
    console.log(window.Razorpay) // Log the value of window.Razorpay for debugging
    if(!window.Razorpay){
      const razorPayScript=document.createElement('script')
      razorPayScript.src="https://checkout.razorpay.com/v1/checkout.js"
      razorPayScript.id="razorpay-script"
      document.body.appendChild(razorPayScript)
    }
    return ()=>{
      if(window.Razorpay) {
        document.getElementById('razorpay-script')?.remove()
      }
    } 
  },[])

  const handlePaymentStart = async (data:
    {
      amount:number
      amount_due:number,
      currency:string,
      receipt:string,
      id:string,
    }) => { // Correct async function syntax
    const options = {
      key: env.VITE_RAZORPAY_KEY_ID, // Ensure env variable is correct
      amount: data.amount,
      currency: data.currency,
      name: env.VITE_COMPANY_NAME,
      description: "payment for wallet",
      order_id: data.id,
      handler: async (response:{
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string
      }) => {
        try {
          console.log(response)
          const res = await api.post('/api/user/wallet/verify', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          
          if (res.data.status) {
            await getWalletBalance()
            toast.success('Payment successful');
          } else {
            toast.error('Payment failed');
          }
        } catch (error) {
          toast.error('Payment failed');
          console.error(error); // Use console.error for error logging
        }
      },
    };
  
    // Check if Razorpay is available on the window object
    if (window.Razorpay) {
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      toast.error('Razorpay SDK is not loaded');
    }
  };
  


  const onOrderSubmit = async(data:FormData) => {
    try {
      const result = await api.post('api/user/wallet/order',{
        amount:data.amount
      })
      console.log(result)
      modal.current?.close()
      await handlePaymentStart(result.data.order)
    } catch (error) {
      console.log(error)
    }
  }

  const getWalletBalance = useCallback(async()=>{
      try {
        setWalletLoadding(true)
        const result = await api.get('api/user/wallet/balance')
        setWallet(result.data.balance)
        setWalletLoadding(false)
      } catch (error) {
        setWalletLoadding(false)
        console.log(error)
      }
  },[api]) 

  useEffect(()=>{
    getWalletBalance()
  },[getWalletBalance])

  return (
    <div className='flex  py-2 gap-2 items-end border-slate-200 border-2 rounded-xl w-72 justify-center'>
      <div>
        <p>Current Balance</p>
        <h2 className='text-3xl font-semibold'>Rs.{!walletLoadding?wallet:<span className="loading loading-dots loading-md"></span>}</h2>
      </div>
      <div>
        <button className="btn btn-full bg-green-400 hover:bg-green-500 rounded-2xl " onClick={()=>modal?.current && modal.current.showModal()}>Add More</button>
        <dialog ref={modal} id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Enter the amount to add to wallet</h3> 
            <div>
               <form onSubmit={handleSubmit((data)=>onOrderSubmit(data))} className='flex flex-col gap-2'>
                <input type="number" placeholder="Type here" className="input input-bordered input-sm w-full max-w-xs appearance-none"  {...register("amount",{valueAsNumber:true})} />
                {errors.amount && <p className='text-red-500'>{errors.amount.message}</p>}
                <div>
                  <button className={`btn btn-sm ${errors.amount?"bg-green-200":"bg-green-400 hover:bg-green-500"} px-6 rounded-2xl`} type='submit'>Add</button>
                </div>
               </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

export default Wallet