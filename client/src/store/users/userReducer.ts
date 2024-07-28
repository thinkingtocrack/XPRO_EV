import { combineReducers } from "@reduxjs/toolkit";
import locationSlice from './locationSlice' 
import authSlice from './authSlice'
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

export const persistConfig = {
    key: 'root',
    storage,
    blacklist: [],
  };

const userReducer = combineReducers({location:locationSlice,auth:authSlice})

const persistedUserReducer = persistReducer(persistConfig, userReducer);


export default persistedUserReducer