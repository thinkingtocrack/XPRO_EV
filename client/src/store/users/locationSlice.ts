import { createSlice } from "@reduxjs/toolkit";

type locationType={
    lng:number,
    lat:number
}

const location:locationType= {
    lat:0,
    lng:0
}


const locationSlice=createSlice({
    name:"location",
    initialState:location,
    reducers:{
        setLocation:(state,action)=>{
            state.lat=action.payload.lat
            state.lng=action.payload.lng
        }
    }
})

export const {setLocation} = locationSlice.actions

export default locationSlice.reducer