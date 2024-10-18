import { memo, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootType } from "../../../../store/configurestore"
import { Link } from "react-router-dom"
import useAuthApi from "../../../../utils/apis/axios/axiosInstance"


const ChargerInfo = memo(({selectedStation}) => {

  const [isCharging,setIsCharging] = useState(selectedStation?.chargers[0].chargingStatus==='charging')
  const api = useAuthApi()
  const location = useSelector((store:RootType)=>store.user.location)
  if(!selectedStation){
    return null
  }
  
  const onChargerStop = async()=>{
    try {
      const result = await api.post('/api/user/charger/charging/stop',{
        chargerId:selectedStation.chargers[0]._id
      })
      if(result.data.data.stoped){
        setIsCharging(false)
      }else{
        setIsCharging(true)
      }
    } catch (error) {
      console.log(error)
    }
  }



  const onChargerStart = async() =>{
    try {
      const result = await api.post('/api/user/charger/charging/start',{
        chargerId:selectedStation.chargers[0]._id
      })
      if(result.data.data.isCharging){
        setIsCharging(true)
      }else{
        setIsCharging(false)
      }
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
  return (  
    <div className="p-3 bg-white shadow-lg rounded-xl h-full flex flex-col gap-2">
        <div className="flex gap-2">
            <div>
              <img className="aspect-square w-32 rounded-lg" src={selectedStation.images[0]}/>
            </div>
            <div className="flex flex-col gap-2 justify-between py-2">
              <h1 className="text-2xl font-medium">{selectedStation.stationName}</h1>
              <div className="rounded-3xl border-2 px-2">
                <h1>{selectedStation.chargers.filter(a=>a.status==='online').length}/{selectedStation.chargers.length} plugs available</h1>
              </div> 
            </div>
        </div>
        <div>
          <div className="flex flex-col gap-1">
            {
              !isCharging?(
                <button onClick={onChargerStart} className="btn rounded-full btn-md bg-green-400 hover:bg-green-500">Charge</button>
              ):(
                <button onClick={onChargerStop} className="btn rounded-full btn-md bg-green-400 hover:bg-green-500">Stop</button>
              )
            }
            <Link to='/charge/slot-booking' className="btn rounded-full btn-md bg-slate-400">Slot Booking</Link>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold" >Station</h1>
            <button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${selectedStation.location.coordinates[1]},${selectedStation.location.coordinates[0]}`,'_blank')}>Get Directions</button>
          </div>
          <div className="flex gap-1 mt-1">
            <div className="bg-slate-200 w-full p-4 rounded-lg flex justify-between">
              <h1 className="basis-28 shrink-0">Plug Type:</h1>
              <div className="flex flex-wrap gap-1">
                {
                  [...new Set(selectedStation.chargers.map((a:{portType:string})=>`${a.portType}`))].map((type,index)=>{
                    return (
                      <p key={index} className="break-all">{type}</p>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-semibold" >Amenities</h1>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 rounded-lg bg-slate-200">free wifi</div>
            <div className="px-3 py-1 rounded-lg bg-slate-200">Bathroom</div>
            <div className="px-3 py-1 rounded-lg bg-slate-200">Food</div>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-semibold" >Images</h1>
          <div className="flex gap-2 overflow-y-hidden">
            {selectedStation.images.length>0 && selectedStation.images.map(image=>{
              return (
              <img className="aspect-square w-28 rounded-lg" src={image}/>
              )
            })}
          </div>
        </div>
    </div>
  )
})

export default ChargerInfo