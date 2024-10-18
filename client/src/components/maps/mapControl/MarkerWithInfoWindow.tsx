import { useState,useCallback } from "react";
import { AdvancedMarker,InfoWindow,useAdvancedMarkerRef } from "@vis.gl/react-google-maps";


const MarkerWithInfoWindow = ({position,stationDetails}) => {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown(isShown => !isShown),
    []
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <img src={stationDetails.images[0]} alt="station" width="100" height="100" />
          <h2>Name:{stationDetails.stationName}</h2>
        </InfoWindow>
      )}
    </>
  );
};


export default MarkerWithInfoWindow