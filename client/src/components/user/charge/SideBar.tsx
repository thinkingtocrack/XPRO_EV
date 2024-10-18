import bell from '../../../assets/images/sidebar/bell.png'
import account from '../../../assets/images/sidebar/account.png'
import { NavLink } from 'react-router-dom'
import SidebarVehicle from '../vehicle/SidebarVehicle'


const SideBar = () => {
  const highlight="bg-slate-200 font-sans font-semibold rounded-lg p-2 text-lg text-green-600 flex gap-2"
  return (
    <div className="basis-80 shrink-0 pt-5 px-4 border-r-2">
      <ul>
        <NavLink to='/charge/stations'  className={({isActive})=>isActive?highlight:"p-2  text-lg flex gap-2"}><img src={bell}/>Stations</NavLink>
        <NavLink to='/charge/dashboard' className={({isActive})=>isActive?highlight:"p-2 text-lg flex gap-2"}><img src={account}/>Dashboard</NavLink>
        <NavLink to='/charge/slot-booking' className={({isActive})=>isActive?highlight:"p-2 text-lg flex gap-2"}><img src={account}/>Slot Booking</NavLink>
        <NavLink to='/charge/my-trip' className={({isActive})=>isActive?highlight:"p-2 text-lg flex gap-2"}><img src={account}/>My Trip</NavLink>
        <NavLink to='/charge/account' className={({isActive})=>isActive?highlight:"p-2 text-lg flex gap-2"}><img src={account}/>Account</NavLink>
      </ul>

      <SidebarVehicle/>
    </div>
  )
}
export default SideBar