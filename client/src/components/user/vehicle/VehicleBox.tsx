import { useEffect, useState } from "react"
import { getVehicleDetailsApi } from "../../../utils/smartCar/api"
import useAuthApi from "../../../utils/apis/axios/axiosInstance"
import tesla from '../../../assets/images/tesla/tesla.png'
import refreshImage from '../../../assets/images/refresh.png'


const VehicleBox = ({vehicle}) => {
    const [vehicleDetails,setVehicleDetails] = useState(null)
    const [loading,setLoading] = useState(false)
    const api = useAuthApi()
    
    const getVehicleDetails=async()=>{
        try {
            setLoading(true)
            const result = await getVehicleDetailsApi(api,vehicle._id,vehicle.vehicleIds[0])
            console.log(result.data.vehicle)
            setVehicleDetails(result.data.vehicle)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(()=>{
        getVehicleDetails()
        const interval = setInterval(async()=>{
            await getVehicleDetails()
        },1000*120)
        return ()=>{
            clearInterval(interval)
        }
    },[])

    if(loading && vehicleDetails===null){
        return(
            <div className="flex w-52 flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
                </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
            </div>
        )
    }

    return (
        <>
            {vehicleDetails?
            <div className="bg-slate-200 rounded-lg p-1 relative" >
                <div className="flex gap-2 justify-around">
                    {loading?<span className="absolute right-0 loading loading-spinner loading-sm"></span>:<button onClick={getVehicleDetails} className="absolute right-0"><img className="w-5" src={refreshImage} alt="refreshbutton" /></button>}
                    <img className="w-28" src={tesla} alt="tesla" />
                    <div>
                        <h1>{vehicleDetails.attributes.make}</h1>
                        <h1>{vehicleDetails.attributes.model}</h1>
                        <div className="w-24">
                            <p className={vehicleDetails.charge.isPluggedIn?'text-green-600 truncate':'text-red-600 truncate'}>{vehicleDetails.charge.state}</p>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="flex gap-1 justify-around">
                    <div>
                        <h1>Battery</h1>
                        <p className="text-green-600 font-medium">{vehicleDetails.battery.percentRemaining*100}%</p>
                    </div>
                    <div>
                        <h1>Range</h1>
                        <p className="font-medium">{vehicleDetails.battery.range} Km</p>
                    </div>
                    <div>
                    <button>...</button>
                    </div>
                </div>
            </div>
            :
            <h1 className="text-red-600">unable to get details</h1>
            }
        </>
)
}

export default VehicleBox