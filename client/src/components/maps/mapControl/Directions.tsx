import {useEffect, useState} from 'react';

import {
  useMapsLibrary,
  useMap,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import chargerIcon from '../../../assets/images/map/myLocation.png'
import destinationIcon from '../../../assets/images/map/pin.png'
import MarkerWithInfoWindow from './MarkerWithInfoWindow';


function Directions({destination,origin,waypoints,setRouteDirection}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map ,suppressMarkers:true}));
  }, [routesLibrary, map,destination?.formatted_address,origin?.formatted_address]);

  // Use directions service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    const waypointObject = waypoints[routeIndex].map((waypoint)=>{
      return {
        location:{lat:waypoint.location.coordinates[1],lng:waypoint.location.coordinates[0]},
        stopover:true
      }
    })

    directionsService
      .route({
        origin: origin?.formatted_address,
        destination: destination?.formatted_address,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        waypoints:waypointObject.reverse()
      })
      .then(async(response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });


    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer,destination?.formatted_address,origin?.formatted_address,routeIndex,waypoints]);


  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer,origin?.formatted_address,destination?.formatted_address]);

  useEffect(()=>{
    setRouteDirection(selected)
  },[selected,setRouteDirection])

  if (!leg) return null;

  return (
    <>
      <AdvancedMarker  position={{lat:origin.geometry.location.lat(),lng:origin.geometry.location.lng()}} >
        <img src={chargerIcon} width={32}  />
      </AdvancedMarker>
      <AdvancedMarker  position={{lat:destination.geometry.location.lat(),lng:destination.geometry.location.lng()}} >
        <img src={destinationIcon} width={32}  />
      </AdvancedMarker>
      {
        waypoints[routeIndex].map((waypoints)=>{
          return (
            <MarkerWithInfoWindow key={waypoints._id} stationDetails={waypoints} position={{lat:waypoints.location.coordinates[1],lng:waypoints.location.coordinates[0]}}/>
          )
        })
      }
      <div className="absolute w-[275px] bottom-0 left-0 p-5 pt-0 m-1 text-black bg-slate-50 rounded-xl shadow-inner">
        <h2>{selected.summary}</h2>
        <p>
          {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
        </p>
        <p>Distance: {leg.distance?.text}</p>
        <p>Duration: {leg.duration?.text}</p>

        <h2>Other Routes</h2>
        <ul>
          {routes.map((route, index) => (
            <li key={route.summary}>
              <button onClick={() => setRouteIndex(index)}>
                {route.summary}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>

  );
}


export default Directions