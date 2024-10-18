import { AxiosInstance } from "axios"



export const exchangeCode=async(apiInstance:AxiosInstance,code:string)=>{
    const result = await apiInstance.post('/api/user/vehicle/new',{code})
    return result
}

export const getVehiclesApi=async(apiInstance:AxiosInstance)=>{
    const result = await apiInstance.get('/api/user/vehicle/getvehicles')
    return result
}

export const getVehicleDetailsApi=async(apiInstance:AxiosInstance,_id,vehicleId)=>{
    const result = await apiInstance.get('/api/user/vehicle/getVehicle',{
        params:{_id,vehicleId},
    })
    return result
}