// import { useState } from "react"
import { 
  AdvancedMarker,
    APIProvider,
    Map,
    Pin,
    // AdvancedMarker,
    // Pin,
    // InfoWindow
 } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { darkModeStyles } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../store/users/locationSlice";
import { RootType } from "../../store/configurestore";
import { env } from "../../main";


export const Map_page = () => {
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

  return (
    <>
      <APIProvider apiKey={env.VITE_GOOGLE_MAP_API}>
          <div className="h-full">
              <Map mapId={"1212"} defaultZoom={9} defaultCenter={location.lat && location.lng?{lat:location.lat,lng:location.lng}:undefined} styles={darkModeStyles}>
              {location.lat && location.lng?
                <AdvancedMarker position={{lat:location.lat,lng:location.lng}} >
                  <Pin/>
                </AdvancedMarker>:
                <></>
              } 
              </Map>
          </div>
      </APIProvider>
    </>
  )
}
