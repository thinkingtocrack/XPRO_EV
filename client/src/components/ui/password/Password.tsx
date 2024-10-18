import visible from '../../../assets/images/password/visible.svg'
import visibleOff from '../../../assets/images/password/visibleOff.svg'
import { useState } from "react";

const Password = ({ password, setPassword }: { password: string, setPassword: any }) => {
    const [isPasswordVisible,setIsPasswordVisible] = useState(false)
    return (
      <div className="w-full relative" >
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type={isPasswordVisible?'text':"password"} placeholder="Password" className="input input-bordered w-full" />
          <img onClick={()=>setIsPasswordVisible((pre)=>pre?false:true)} className="absolute top-3 right-7 cursor-pointer" src={isPasswordVisible?visibleOff:visible} />
      </div>
    )
}


export default Password