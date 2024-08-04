import { combineReducers } from "@reduxjs/toolkit";
import adminAuthSlice from './authSlice'


const userReducer = combineReducers({auth:adminAuthSlice})

