import { createSlice } from "@reduxjs/toolkit";

export type UserInfo={
    userName:string,
    email:string,
    fullName:string
}

type InitialState={
    adminInfo:null | UserInfo,
    isLoading:boolean,
    isAuth:boolean,
    error:null | object,
    accessToken:string | null
}

const initialState:InitialState={
    adminInfo:null,
    isLoading:false,
    isAuth:false,
    error:null,
    accessToken:null
}

const adminAuthSlice = createSlice({
    name:'adminAuth',
    initialState,
    reducers:{
        loginStart:(state)=>{
            state.isLoading=true
            state.error=null
        },
        loginSucess:(state,action)=>{
            state.adminInfo=action.payload.userData
            state.accessToken=action.payload.accessToken
            state.isLoading=false
            state.isAuth=true
        },
        loginFailure:(state,action)=>{
            state.adminInfo=null
            state.isLoading=false
            state.error=action.payload.error
            state.isAuth=false
            state.accessToken=null
        },
        logout:(state)=>{
            state.isAuth=false
            state.accessToken=null
            state.adminInfo=null
        }
    }

})


export const {loginStart,loginFailure,loginSucess,logout} = adminAuthSlice.actions

export default adminAuthSlice.reducer