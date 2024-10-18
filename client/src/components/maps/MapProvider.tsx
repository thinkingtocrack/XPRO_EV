import { APIProvider } from "@vis.gl/react-google-maps"
import { env } from "../../main";
import React from "react";

interface MapProviderProps {
    children: React.ReactNode
}

const MapProvider:React.FC<MapProviderProps> = ({children}) => {
  return (
    <APIProvider apiKey={env.VITE_GOOGLE_MAP_API}>
        <div className="h-3/4 w-full rounded-2xl overflow-hidden">
            {children}
        </div>
    </APIProvider>
  )
}

export default MapProvider