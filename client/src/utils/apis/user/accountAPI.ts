import { AxiosInstance } from "axios";



export getUserDetails=async(api:AxiosInstance)=>{
    try {
        const result = await api.get('/api/user/ ')
    } catch (error) {
        
    }
}