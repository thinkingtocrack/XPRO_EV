import SidebarVehicle from '../../../components/user/vehicle/SidebarVehicle'
import ChargingHistory from '../../../components/user/dashboard/ChargingHistory'
import ChargingHistory2 from '../../../components/user/dashboard/ChargingHistory2'

const Dashboard = () => {
  return (
    <div className='p-2 flex flex-col gap-3'>
        <div className='content-center w-full h-80 rounded-lg mt-5 bg-slate-50'>
            <SidebarVehicle/>
        </div>
        <div className='flex'>
          <ChargingHistory/>
          <ChargingHistory2/>
        </div>
    </div>
  )
}

export default Dashboard