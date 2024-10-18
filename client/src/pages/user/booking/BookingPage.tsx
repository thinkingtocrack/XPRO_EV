import { useSelector } from "react-redux"
import MapPageWithState from "../../../components/maps/MapPageWithState"
import NearStations from "../../../components/user/charge/stations/NearStations"
import { useEffect, useState } from "react"
import { RootType } from "../../../store/configurestore"
import useAuthApi from "../../../utils/apis/axios/axiosInstance"
import BookingInfo from "../../../components/user/charge/booking/BookingInfo"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import BookedSlots from "@/components/user/charge/booking/BookedSlots"


export type SelectedStationType = null|{location:{coordinates:[number,number]},_id:string}

const BookingPage = () => {
  const api = useAuthApi()
  const location = useSelector((store:RootType)=>store.user.location)
  const [stations,setStations] =  useState<null | {location:{coordinates:[number,number]},_id:string}[]>(null)
  const [nearByStations,setNearByStations] = useState<null|{location:{coordinates:[number,number]},_id:string}[]>(null)
  const [selectedStation,setSelectedStation] = useState<SelectStationType>(null)
  useEffect(()=>{
    try {
        const getData=async()=>{
            const result = await api.get('/api/user/charger/nearby',{
                params:{location:JSON.stringify(location)}
              })
            console.log(result.data)
            setNearByStations(result.data.stations)
            setSelectedStation(result.data.stations[0])
        }
        getData()
    } catch (error) {
        console.log(error)
    }
},[api,location])
  return (
    <>
      <div className="w-full min-h-120 h-screen bg-green-50">
        <div className="flex h-full p-2 gap-2">
          <div className="flex flex-col shrink-0 gap-2 basis-8/12 w-8/12 h-full" >
            <MapPageWithState stations={stations} setStations={setStations}/>
            <NearStations setSelectedStation={setSelectedStation} nearByStations={nearByStations}/>
          </div>
          <div className="basis-4/12 min-h-full bg-slate-100 rounded-md p-2">
            <Tabs defaultValue="booking" className="">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="booking">slot booking</TabsTrigger>
                <TabsTrigger value="booked">booked slots</TabsTrigger>:
              </TabsList>
              <TabsContent value="booking">
                <BookingInfo selectedStation={selectedStation} />
              </TabsContent>
              <TabsContent value="booked">
                <BookedSlots selectedStation={selectedStation}/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookingPage