import Header from "../components/header/Index";
import { Outlet} from "react-router-dom";



const MainLayout = () => {
  return (
    <>  
        <Header/>
        <Outlet/>
    </>
  )
}



export default MainLayout