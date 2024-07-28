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
    token:string | null
}

const initialState:InitialState = {
    userInfo:null,
    isLoading:false,
    isAuth:false,
    error:null,
    token:null
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
            state.userInfo=action.payload.userInfo
            state.token=action.payload.token
            state.isLoading=false
            state.isAuth=true
        },
        loginFailure:(state,action)=>{
            state.userInfo=null
            state.isLoading=false
            state.error=action.payload.error
            state.isAuth=false
            state.token=null
        },
        logout:(state)=>{
            state.isAuth=false
            state.token=null
            state.userInfo=null
        }
        
    }
})

export const {loginStart,loginFailure,loginSucess,logout} = authSlice.actions

export default authSlice.reducer