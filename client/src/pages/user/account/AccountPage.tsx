import { createContext, useEffect } from "react"
import MembershipComparison from "../../../components/user/account/MembershipComparison"
import Wallet from "../../../components/user/account/Wallet"
import AccountInfoCard from "../../../components/user/account/AccountInfoCard"
export const accountContext = createContext()

const AccountPage = () => {


  return (
     <div className="p-2 pt-5 flex gap-20 justify-evenly">
        <div className="flex flex-col gap-5">
           <Wallet/>
           <AccountInfoCard/>
        </div>
        <div>
            <MembershipComparison/>
        </div>
     </div>
  )
}

export default AccountPage