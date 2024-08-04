import { createSlice } from "@reduxjs/toolkit";

export type UserInfo={
    userName:string,
    email:string,
    fullName:string
}

type InitialState={
    userInfo:null | UserInfo,
    isLoading:boolean,
    isAuth:boolean,
    error:null | object,
    token:string | null
}

const initialState:InitialState={
    userInfo:null,
    isLoading:false,
    isAuth:false,
    error:null,
    token:null
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
            state.userInfo=action.payload.userData
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


export const {loginStart,loginFailure,loginSucess,logout} = adminAuthSlice.actions

export default adminAuthSlice.reducer