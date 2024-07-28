import Header from "../components/header/Index";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}


export default Home