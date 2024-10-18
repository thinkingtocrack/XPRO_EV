import { NavLink, Outlet} from "react-router-dom";
import Header from "../../components/admin/header/Header";



const MainLayout = () => {
  const highlight = 'text-white text-xl'
  return (
    <> 
      <div className="grid grid-cols-[250px_1fr] grid-rows-[auto_1fr] h-full">
          <div className="bg-blue-600 p-4 row-span-2 min-h-screen h-auto">
            <ul className="flex flex-col mt-32 gap-4">
              <li><NavLink className={({isActive})=>isActive?highlight:"text-xl text-slate-100"}  to="/admin/dashboard" > Dashboard </NavLink></li>
              <li><NavLink className={({isActive})=>isActive?highlight:"text-xl text-slate-100"}  to="/admin/customer" > Customer </NavLink></li>
              <li><NavLink className={({isActive})=>isActive?highlight:"text-xl text-slate-100"} to="/admin/charger" >Charger </NavLink></li>
            </ul>
          </div>
          <div>
              <Header/>
          </div>
          <div className="p-4">
              <Outlet/>
          </div>
      </div>
    </>
  )
}


export default MainLayout