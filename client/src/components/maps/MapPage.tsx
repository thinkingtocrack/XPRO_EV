import { 
  AdvancedMarker,
    APIProvider,
    Map,
    MapCameraChangedEvent,
    MapCameraProps,
 } from "@vis.gl/react-google-maps";
import {  memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../store/users/locationSlice";
import { RootType } from "../../store/configurestore";
import { env } from "../../main";
import axios from "axios";
import MyLocationButton from "./MyLocationButton";
import myLocationImg from '../../assets/images/map/myLocation.png'
import chargerIcon from '../../assets/images/map/chargerIcon.png'
import MapProvider from "./MapProvider";


export const Map_page = memo(() => {
  const [stations,setStations] =  useState<null | [{location:{coordinates:[number,number]},_id:string}]>(null)
  const dispatch=useDispatch()
  const location=useSelector((store:RootType)=>store.user.location)
  const defaultCameraProps = {center:{lat:location.lat,lng:location.lng},zoom:7}
  const [cameraProps,setCameraProps]=useState<MapCameraProps>(defaultCameraProps)
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

  const mapCache = useRef(new globalThis.Map())

  const timer = useRef<undefined | number>(undefined)

  const getStationData = useCallback((data:MapCameraChangedEvent)=>{
      clearTimeout(timer.current)
      timer.current = setTimeout(async()=>{
        await getCoordinatesData(data)
      },400)
  },[])

  const getCoordinatesData = async (data:MapCameraChangedEvent)=>{
    try {
      const coordinates = data.detail.bounds
      const bounds = {bounds:JSON.stringify([[coordinates.west,coordinates.north],[coordinates.east,coordinates.south]])}
      if(mapCache.current.has(bounds.bounds)){
        setStations(mapCache.current.get(bounds.bounds))
        return
      }
      const result = await axios.get('/api/public/charger/within',{
        params:bounds
      })
      mapCache.current.set(bounds.bounds,result.data.station)
      setStations(result.data.stations)
      
    } catch (error) {
      console.log(error)
    }
  }


  const handleCameraChange = (e:MapCameraChangedEvent)=>{
    setCameraProps(e.detail)
  }

  const handleMyLocation = useCallback(()=>{
    setCameraProps({center:{lat:location.lat,lng:location.lng},zoom:19})
  },[location])

  return (
    <>
      <MapProvider>
        <Map restriction={{latLngBounds:{north:43.557112718774285,east:114.41786831229079,south:-10.106144163314845,west:49.309998626033675}}} zoomControl onBoundsChanged={getStationData} {...cameraProps} onCameraChanged={handleCameraChange} minZoom={2} mapId={false?env.VITE_GOOGLE_MAP_ID:'49ae42fed52588c3'}  reuseMaps={true}  disableDefaultUI>
        {location.lat && location.lng?
          <AdvancedMarker zIndex={1} position={{lat:location.lat,lng:location.lng}} >
            <img src={myLocationImg} width={32}  />
          </AdvancedMarker>
          :
          null
        }
        {stations?stations.map((station)=>{
          return (
            <AdvancedMarker key={station._id} position={{lat:station.location.coordinates[1],lng:station.location.coordinates[0]}} >
              <img src={chargerIcon} width={32}  />
            </AdvancedMarker>
            )
        }):null}
        <MyLocationButton handleMyLocation={handleMyLocation}/>
        </Map>
      </MapProvider>
    </>
  )
})
