import {useRef, useEffect, useState} from 'react';
import { MapControl, ControlPosition,useMapsLibrary } from "@vis.gl/react-google-maps";

const AutocompleteClassic = ({onPlaceSelect}) => {


  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <MapControl position={ControlPosition.TOP}>
      <div className="autocomplete-control">
        <div className="autocomplete-container">
          <input className='input input-bordered w-32 h-10 mt-2' ref={inputRef} />
        </div>
      </div>
    </MapControl>
  );
};

export default AutocompleteClassic;
