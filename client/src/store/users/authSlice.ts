import { createSlice } from "@reduxjs/toolkit";

type UserInfo={
    name:string,
    userName:string,
    email:string
}

type InitialState={
    userInfo:null | UserInfo,
    isLoading:boolean,
    isAuth:boolean,
    error:null | object,
    accessToken:string | null
}

const initialState:InitialState = {
    userInfo:null,
    isLoading:false,
    isAuth:false,
    error:null,
    accessToken:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginStart:(state)=>{
            state.isLoading=true
            state.error=null
        },
        loginSucess:(state,action)=>{
            state.userInfo=action.payload.userData
            state.accessToken=action.payload.accessToken
            state.isLoading=false
            state.isAuth=true
        },
        loginFailure:(state,action)=>{
            state.userInfo=null
            state.isLoading=false
            state.error=action.payload.error
            state.isAuth=false
            state.accessToken=null
        },
        logout:(state)=>{
            state.isAuth=false
            state.accessToken=null
            state.userInfo=null
        },
        setAccessToken:(state,action)=>{
            state.accessToken=action.payload
        }
        
    }
})

export const {loginStart,loginFailure,loginSucess,logout,setAccessToken} = authSlice.actions

export default authSlice.reducer