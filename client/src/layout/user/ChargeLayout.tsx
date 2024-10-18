import Header from '../../components/header/Index'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/user/charge/SideBar'

const ChargeLayout = () => {
  return (
    <>
        <Header/>
        <div className='flex min-h-120 h-screen'>
            <SideBar/>
            <div className='grow'>
              <Outlet/>
            </div>
        </div>
    </>
  )
}

export default ChargeLayout