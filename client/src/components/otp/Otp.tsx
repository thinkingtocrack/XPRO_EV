import { useEffect, useRef, useState } from "react";
import { IForm } from "../signup/Signup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Otp = ({data}:{data:IForm}) => {
  const [otp,setOtp] = useState(new Array(4).fill(''))
  const navigate = useNavigate()
  const [disabledResend,setDisabledResend] = useState<boolean>(true)
  const [timerSecounds,setTimerSecounds] = useState<number>(0)
  const [timerMinutes,setTimerMinutes] = useState<number>(2)
  
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const [twoMinFromNow,setTwoMinFromNow] = useState(new Date(((new Date()).getTime()+1000*60*2)).getTime())

  useEffect(()=>{
    const timer = setInterval(()=>{
      const now = new Date().getTime()
      const distance = twoMinFromNow-now
      if(distance<0){
        clearInterval(timer)
        setDisabledResend(false)
      }else{
        const minutes = Math.floor((distance%(1000*60*60))/(1000*60))
        const secounds = Math.floor((distance% (1000*60))/1000)
        setTimerMinutes(minutes)
        setTimerSecounds(secounds)
      }
    },1000)

    return ()=>{
      clearInterval(timer)
    }
  },[twoMinFromNow])



  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])
  

  const handleChange = (index:number,e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value
    if(isNaN(Number(value))) return 
    const newOtp =[...otp]
    newOtp[index] = value.substring(value.length-1)
    setOtp(newOtp)
    if(index!=3){
      inputRefs.current[index+1]?.focus()
    }
  }

  const handleKeyDown = (index,e)=>{
    if(e.key==='Backspace'){
      e.preventDefault()
      const newOtp = [...otp]
      newOtp[index]=''
      setOtp(newOtp)
      inputRefs.current[index-1]?.focus()
    }
  }

  const handleVerification = async(e)=>{
    try {
      const otpData = otp.reduce((a,d)=>{
        return `${a}${d}`
      },'')
      const result = await axios.post('/api/auth/user/signup',{
      ...data,otp:otpData
      })
      toast.success('account created')
      setTimeout(() => {
        navigate('/home/login')
      }, 2000);
    } catch (error) {
      if(error.response.data.error==='otp_error'){
        toast.error(error.response.data.message)
      }else{
        toast.error('server error')
      }
    }
  }

  const handleResend = async()=>{
    try {
      const result = await axios.post('/api/auth/user/verification/sendotp',{
        email:data?.email,
        userName:data?.username
      })
      toast.success('otp has been resent')
      if(result.data.status){
        setTwoMinFromNow(new Date(((new Date()).getTime()+1000*60*2)).getTime())
      }
    } catch (error) {
      console.log(error)
      toast.error('error')
      if(error.response.data.name="User_Exists"){
        error.response.data.fields.forEach((a)=>{
          toast.error(`${a} exists`)
        })
      }
    }
  }

  return (
    <>
      <div className="relative  px-6 pt-10 pb-9  mx-auto w-full max-w-lg ">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-700">
              <p >We have sent a code to your email </p>
            </div>
          </div>

          <div>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {otp.map((value,index)=>{
                  
                  return (<div key={index} className="w-16 h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      value={value}
                      ref={(input)=>inputRefs.current[index]=input}
                      onChange={(e)=>handleChange(index,e)}
                      onClick={()=>handleClick(index)}
                      onKeyDown={(e)=>handleKeyDown(index,e)}
                    />
                  </div>
                  )
                  })}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                    onClick={handleVerification}
                     className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    {!disabledResend?<p>Didn't recieve code?</p>:null}
                    <button disabled={disabledResend}
                      className="flex flex-row items-center disabled:text-blue-300 text-blue-600"
                      onClick={handleResend}
                    >
                      Resend
                    </button>
                    {disabledResend?(
                      <div className="flex gap-2">
                        <div>
                          <span className="countdown font-mono text-2xl">
                            <span style={{"--value":timerMinutes}}></span>
                          </span>
                          min
                        </div>
                        <div>
                          <span className="countdown font-mono text-2xl">
                            <span style={{"--value":timerSecounds}}></span>
                          </span>
                          sec
                        </div>
                      </div>
                    ):null}
                    <span className="countdown font-mono text-6xl">

                    </span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Otp;
