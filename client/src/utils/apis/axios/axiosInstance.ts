import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootType } from '../../../store/configurestore';
const env = import.meta.env
import { logout, setAccessToken } from '../../../store/users/authSlice';

// Create an Axios instance
export const axiosWithCredentials = axios.create({
  baseURL: env.VITE_BASE_URL,
  withCredentials: true // Enable sending and receiving cookies
});

export const axiosPrivate = axios.create({
  baseURL: env.VITE_BASE_URL,
  withCredentials: true // Enable sending and receiving cookies
});

export const axiosInit=()=>{
  axios.defaults.baseURL = env.VITE_BASE_URL
  axios.defaults.timeout = 10000;
}


const useAuthApi = ()=>{
  const accessToken = useSelector((store:RootType)=>store.user.auth.accessToken)
  const dispatch = useDispatch()

  const api = useMemo(()=> axios.create({
    baseURL: env.VITE_BASE_URL,
    timeout:20000
  }),[])

  useEffect(()=>{
    const requestInterceptor = api.interceptors.request.use(
      (config)=>{
        if(accessToken){
          config.headers['authorization']= `Bearer ${accessToken}`;
        }
        return config
      },
      (error)=>{
        return Promise.reject(error)
      }
    )
    

    const responseInterceptor = api.interceptors.response.use(
      (response)=>{
        return response
      },

      async (error)=>{
        const originalRequest = error.config

        if(error?.response?.status===401 && !originalRequest?.sent){
          originalRequest.sent=true

          try {
            const response = await axiosPrivate.post('/api/auth/user/token/accesstoken/reissue',null)

            const {accessToken} = response.data
            dispatch(setAccessToken(accessToken))
            originalRequest.headers['authorization'] = `Bearer ${accessToken}`;

            return api(originalRequest)

          } catch (error) {
            dispatch(logout())
            console.error('Refresh token failed',error)
            return Promise.reject(error)
          }
          
        }
        return Promise.reject(error)
      }
    )

    return ()=>{
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  },[accessToken,dispatch,api])

  return api
}

export const useApi = ()=>{
  const accessToken = useSelector((store:RootType)=>store.user.auth.accessToken)
  const dispatch = useDispatch()

  const api = useMemo(()=> axios.create({
    baseURL: env.VITE_BASE_URL,
    timeout:20000
  }),[])

  useEffect(()=>{
    const requestInterceptor = api.interceptors.request.use(
      (config)=>{
        if(accessToken){
          config.headers['authorization']= `Bearer ${accessToken}`;
        }
        return config
      },
      (error)=>{
        return Promise.reject(error)
      }
    )
    

    const responseInterceptor = api.interceptors.response.use(
      (response)=>{
        return response
      },

      async (error)=>{
        const originalRequest = error.config

        if(error?.response?.status===401 && !originalRequest?.sent){
          originalRequest.sent=true

          try {
            const response = await axiosPrivate.post('/api/auth/user/token/accesstoken/reissue',null)

            const {accessToken} = response.data
            dispatch(setAccessToken(accessToken))
            originalRequest.headers['authorization'] = `Bearer ${accessToken}`;

            return api(originalRequest)

          } catch (error) {
            dispatch(logout())
            console.error('Refresh token failed',error)
            return Promise.reject(error)
          }
          
        }
        return Promise.reject(error)
      }
    )

    return ()=>{
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  },[accessToken,dispatch,api])

  return api
}


export default useAuthApi

