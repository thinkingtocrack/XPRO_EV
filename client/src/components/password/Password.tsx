import visible from '../../assets/images/password/visible.svg'
import visibleOff from '../../assets/images/password/visibleOff.svg'
import { useState } from "react";

const Password = ({password,setPassword}:{password:string,setPassword:React.Dispatch<React.SetStateAction<string>>}) => {
    const [isPasswordVisible,setIsPasswordVisible] = useState(false)
    return (
      <div className="w-full mt-4 relative" >
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type={isPasswordVisible?'text':"password"} placeholder="Password" className="input input-bordered w-full max-w-xs" />
          <img onClick={()=>setIsPasswordVisible((pre)=>pre?false:true)} className="absolute top-3 right-7 cursor-pointer" src={isPasswordVisible?visibleOff:visible} />
      </div>
    )
}


export default Password