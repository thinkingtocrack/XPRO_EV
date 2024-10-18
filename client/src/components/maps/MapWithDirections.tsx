import { 
      APIProvider,
      ControlPosition,
      Map,
      MapControl,
   } from "@vis.gl/react-google-maps";
import {  memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../store/users/locationSlice";
import { RootType } from "../../store/configurestore";
import { env } from "../../main";
import AutocompleteClassic from "./mapControl/AutocompleteClassic";
import Directions from "./mapControl/Directions";
import useAuthApi from "../../utils/apis/axios/axiosInstance";
  
  
  const MapWithDirections = memo(({routeDirection,setRouteDirection}) => {

    const api = useAuthApi()
    const [isLoading,setIsLoading] = useState(false)
    const [origin,setOrigin] =
    useState<google.maps.places.PlaceResult | null>(null);
    const [destination,setDestination] =
    useState<google.maps.places.PlaceResult | null>(null);
    const [waypoints,setWaypoints] = useState(null)

    const dispatch=useDispatch()
    const location=useSelector((store:RootType)=>store.user.location)
    useEffect(()=>{
      if(navigator.geolocation){
        const success=(pos:GeolocationPosition)=>{
          dispatch(setLocation({
            lat:pos.coords.latitude,
            lng:pos.coords.longitude,
          }))
        }
        const location=navigator.geolocation.watchPosition(success,(error)=>{
          if(error.code===error.PERMISSION_DENIED){
            fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data=>{
              dispatch(
              setLocation({
                lat:data.latitude,
                lng:data.longitude,
              }))
            })
          }
        })
        return ()=>{
          navigator.geolocation.clearWatch(location)
        }
      }  
    },[dispatch])



    const getWaypoints = useCallback(async(origin:google.maps.places.PlaceResult,destination:google.maps.places.PlaceResult)=>{
      try {
        setIsLoading(true)
        const result = await api.get('/api/user/charger/directions',{
          params:{
            origin:origin?.formatted_address,
            destination:destination?.formatted_address
          }
        })
        setIsLoading(false)
        setWaypoints(result.data.data.chargers)
      } catch (error) {
        console.log(error)
      }
    },[api])

    useEffect(()=>{
      if(!destination || !origin) return
      getWaypoints(origin,destination)

    },[destination,origin,getWaypoints])

    return (
      <>
        <APIProvider apiKey={env.VITE_GOOGLE_MAP_API}>
            <div className="h-3/4 w-full rounded-2xl overflow-hidden">
                <Map
                disableDefaultUI={true}
                defaultCenter={{lat: location.lat, lng: location.lng}}
                defaultZoom={9}
                gestureHandling={'greedy'}
                fullscreenControl={false}
                mapId={false?env.VITE_GOOGLE_MAP_ID:'49ae42fed52588c3'}>
                {
                  (waypoints && origin && destination) && <Directions setRouteDirection={setRouteDirection} destination={destination} origin={origin} waypoints={waypoints}/>
                }
                </Map>
                {
                  isLoading && <MapControl position={ControlPosition.RIGHT_TOP} ><span className=" top-2 loading loading-spinner loading-lg"></span></MapControl>
                }
                <AutocompleteClassic  onPlaceSelect={setOrigin} />
                <AutocompleteClassic onPlaceSelect={setDestination} />
            </div>
        </APIProvider>
      </>
    )
  })
  

  export default MapWithDirections