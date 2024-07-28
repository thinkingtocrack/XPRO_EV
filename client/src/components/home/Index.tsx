import { Map_page } from "../maps/MapPage";
import Footer from "../footer/Index"

const Index = () => {
  return (
    <>
    <div className="flex p-5 h-screen">
        <div className="flex-row-1 items-center">
            <h2 className="text-4xl">power stations for a green planet</h2>
            <h1 className="text-8xl">Next Generation . <br></br>Vehicle Charger .</h1>
            <h3 className="text-2xl">say hello to next gen electric vehicle charging stations</h3>
            <div className="flex items-center">
                <button className="rounded-3xl bg-blue-900 p-3 text-white font-bold">Browse Grid</button>
                <h2 className="text-2xl">📞+91 9539530392</h2>
            </div>
        </div>
        <div className="flex-1">
            <Map_page/>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default Index