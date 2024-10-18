import axios, { AxiosError } from "axios"




export const getStationsPage=async(page:number):Promise<{sucess:boolean,data?:[],error?:AxiosError,count:number}>=>{
    try {
        const stations = await axios.get('/api/admin/charger/get-stations',{
            params:{page}
        })
        console.log(stations.data)
        return {sucess:true,data:stations.data.chargers,count:stations.data.count}
    } catch (error) {
        if(axios.isAxiosError(error)){
            return {sucess:false,error:error,count:0}
        }else{
            throw error
        }
    }
}