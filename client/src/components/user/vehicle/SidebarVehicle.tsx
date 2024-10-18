import useAuthApi from '../../../utils/apis/axios/axiosInstance'
import { authorize, initSmartcar } from '../../../utils/smartCar/smartCar'
import { exchangeCode, getVehiclesApi } from '../../../utils/smartCar/api'
import { useCallback, useEffect, useState } from 'react'
import VehicleBox from './VehicleBox'

const SidebarVehicle = () => {
    const api = useAuthApi()
    const [vehicles,setVehicles] = useState([])

    const getVehicles=useCallback(async()=>{
        try {
            const result = await getVehiclesApi(api)
            if(result.data.status===true && result.data.vehicles?.length>0){
                setVehicles(result.data.vehicles)
            }
        } catch (error) {
            console.log(error)
        }
    },[api])

    useEffect(()=>{
        getVehicles()
    },[getVehicles])
    


    const onAuthorize=()=>{
        const onComplete = async(err,code:string,state)=>{
            if (err) {
                console.log(
                'An error occurred in the Connect flow, most likely because the user denied access'
                );
                return;
            }
            try {
                const result = await exchangeCode(api,code)
                console.log(result)
                await getVehicles()
            } catch (error) {
                console.log(error)
            }
        }
        const smartCar = initSmartcar(onComplete)
        authorize(smartCar)
    }
    return (
        <div className='p-3 mx-5 mt-10 bg-slate-100 rounded-lg'>
            <div className='flex justify-between'>
                <h1 className='text-xl'>my cars</h1>
                <button className='text-2xl' onClick={onAuthorize}>+</button>
            </div>
            <div className='flex mt-2 flex-col gap-3'>
                {
                    vehicles?.length>0?vehicles.map((vehicle,index)=>{
                        return <VehicleBox key={index} vehicle={vehicle}/>
                    }):null
                }
            </div>
        </div>
    )
}

export default SidebarVehicle