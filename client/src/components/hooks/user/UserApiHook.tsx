import useAuthApi from "@/utils/apis/axios/axiosInstance"
import { useCallback, useEffect, useState } from "react"



const useUserApi=(fetchFunction)=>{
    const [data,setData] = useState(null)
    const [loading,setLoading] = useState<boolean>(false)
    const [error,setError] = useState<string | null>(null)
    const api = useAuthApi()
    


    const fetchData = useCallback(async()=>{
        setLoading(true)
        setError(null)
        try {
            const result = await fetchFunction(api)
            console.log(result)
            setData(result.data)
        } catch (error) {
            console.log(error)
            setError("something went wrong");
        } finally{
            console.log('hia')
            setTimeout(()=>{
                setLoading(false)
            },500)
        }
    },[api,fetchFunction])
    

    return {data,loading,error,refetch:fetchData}
}


export default useUserApi