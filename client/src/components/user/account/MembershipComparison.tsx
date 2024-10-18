import { useEffect,useRef,useState } from "react";
import useAuthApi from "../../../utils/apis/axios/axiosInstance";
import toast from "react-hot-toast";


const MembershipCard = ({ title, isSubscribed, features }) => (
  <div className={`w-72 p-4 rounded-lg ${isSubscribed ? 'bg-green-100' : 'bg-gray-100'}`}>
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title} {isSubscribed && <span className="bg-green-300 rounded-lg p-2">current</span>}</h2>
    </div>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-xl">
          {feature.available ? (
            "✅"
          ) : (
            "❌"
          )}
          <span>{feature.name}</span>
        </li>
      ))}
    </ul>
  </div>
);

const MembershipComparison = () => {

  const subscriptionModelRef = useRef<HTMLDialogElement>(null)
  const api = useAuthApi()
  const [isSubscribed, setIsSubscribed] = useState(false)

  const getSubscriptionStatus = async() => {
    try {
      const result = await api.get('/api/user/account/subscription/status')
      setIsSubscribed(result.data.data.isSubscribed)
    } catch (error) {
        console.log(error) 
    }
  }
  

  useEffect(()=>{
    getSubscriptionStatus()
  })



  const freeFeatures = [
    { name: 'Reliable Charge', available: true },
    { name: 'Discount Charging Rate ', available: false },
    { name: 'Access to Amenities', available: false },
    { name: 'Free Charging', available: false },
    {name:'Free Coupons',available:false}
  ];

  const subscribedFeatures = [
    { name: 'Reliable Charge', available: true },
    { name: 'Discount Charging Rate ', available: true },
    { name: 'Access to Amenities', available: true },
    { name: '1 Free Charge per Month', available: true },
    {name:'Free Coupons',available:true}
  ];

  const onSubscribe = async() => {
    try {
      const result = await api.post('/api/user/account/subscription/add')
      if(!result.data.data.isBalance) {
        toast.success('Insufficient Balance')
      }
      if(result.data.data.isSubscribed) {
        toast.success('Subscribed Successfully')
      }else{
        toast.error('Something went wrong. Please try again later.')
      }
    }catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-green-50 p-2 py-8 rounded">
      <div className="flex justify-center space-x-4 p-4 bg-gray-50">
        <MembershipCard title="Free Users" isSubscribed={!isSubscribed} features={freeFeatures} />
        <MembershipCard title="Subscribed Members" isSubscribed={isSubscribed} features={subscribedFeatures} />
      </div>
      {
        !isSubscribed?(
          <>
            <div className="flex justify-center">
              <button onClick={()=>subscriptionModelRef.current?.showModal()} className="btn w-20 bg-green-300 btn-square">subscribe</button>
            </div>
            <dialog ref={subscriptionModelRef} id="my_modal_5" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
                <h3 className="font-bold text-lg">⚡Subscription Gives you Freedom⚡</h3>
                <p className="py-4">Subscription Amount of Rs.100 will be withdrawn from your wallet</p>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn bg-red-400 hover:bg-red-500">Cancel</button>
                  </form>
                  <button onClick={onSubscribe} className="btn bg-green-400 hover:bg-green-500">Subscribe</button>
                </div>
              </div>
            </dialog>
          </>
        )
        :
        null
      }
    </div>
  );
};

export default MembershipComparison;