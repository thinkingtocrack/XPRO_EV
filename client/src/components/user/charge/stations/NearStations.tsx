import { memo} from "react"
import chargerIcon from "../../../../assets/images/map/chargerIcon.png"


const NearStations = memo(({nearByStations,setSelectedStation}) => {
  if(!nearByStations){
    return null
  }
  return (
    <div className='h-full bg-white basis-2/6 shadow-lg rounded-xl p-2'>
      <div className="h-full flex overflow-x-auto gap-2">
        {
          nearByStations.map((nearby,index)=>{
            return (
              <div key={index} onClick={()=>setSelectedStation(nearby)} className="bg-slate-100 w-56 h-full rounded-lg p-2 cursor-pointer">
                <div>
                  <img className="" src={chargerIcon}  />

                  <p>{(nearby.distance/1000).toFixed(1)} km</p>
                  <p>{nearby.stationName}</p>
                  <p className="text-slate-400" >type</p>
                  {
                  [...new Set(nearby.chargers.map((a:{portType:string})=>`${a.portType}`))].map((type,index)=>{
                    return (
                      <p key={index} className="break-all">{type}</p>
                    )
                  })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
})

export default NearStations