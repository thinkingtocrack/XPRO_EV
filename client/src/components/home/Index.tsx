import { useNavigate } from "react-router-dom";
import { Map_page } from "../maps/MapPage";

const Index = () => {
  const navigate = useNavigate()
  return (
    <>
    <div className="flex flex-col lg:flex-row px-10 py-5 h-screen gap-1 ">
        <div className="basis-3/5 flex flex-col items-start pt-20 gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-green-400 bg-300 animate-bg-animation py-2">
              <h2 className="text-5xl font-bold">power stations for a green planet</h2>
            </span>
            <h1 className="text-7xl bungee-spice-regular">Next Generation . <br></br>Vehicle Charger .</h1>
            <h3 className="text-2xl">say hello to next gen electric vehicle charging stations</h3>
            <div className="flex w-2/4 justify-between">
                <button onClick={()=>navigate('/home/grid')} className="rounded-3xl bg-blue-900 p-3 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-300 animate-bg-animation">Browse Grid</button>
                <h2 className="text-2xl">📞+91 9539530392</h2>
            </div>
        </div>
        <div className="basis-2/5 flex justify-center">
            <Map_page/>
        </div>
    </div>
    </>
  )
}

export default Index