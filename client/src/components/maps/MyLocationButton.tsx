import { ControlPosition, MapControl } from '@vis.gl/react-google-maps'
import { memo } from 'react'

type MyLocationButtonProps={
    handleMyLocation():void
}

const MyLocationButton = memo(({handleMyLocation}:MyLocationButtonProps) => {
  return (
    <MapControl position={ControlPosition.RIGHT_BOTTOM}>
        <div className="bg-slate-300 p-1 mr-[10px] rounded-lg"><button onClick={handleMyLocation} className='text-2xl'>🟢</button></div>
    </MapControl>
  )
})

export default MyLocationButton