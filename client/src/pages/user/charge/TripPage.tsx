import React from 'react'
import MapWithDirections from '../../../components/maps/MapWithDirections'
import RoutesPlan from '../../../components/user/charge/trip/RoutesPlan'

const TripPage = () => {
  const [routeDirection, setRouteDirection] = React.useState(null)
  console.log(routeDirection)
  return (
    <div className='w-full h-full min-h-screen flex p-2 gap-2'>
        <div className='basis-120'>
            <MapWithDirections routeDirection={routeDirection} setRouteDirection={setRouteDirection} />
        </div>
        <div className=' grow'>
          {
            routeDirection?(
              <RoutesPlan routeDirection={routeDirection} />
            )
            :
            <div className='flex justify-center items-center h-full'>
              <h1>please select origin and destination</h1>
            </div>
          }
        </div>
    </div>
  )
}

export default TripPage