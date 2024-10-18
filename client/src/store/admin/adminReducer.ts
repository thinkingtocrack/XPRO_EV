import { combineReducers } from "@reduxjs/toolkit";
import adminAuthSlice from './authSlice'
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

export const persistConfig = {
    key: 'admin',
    storage,
    blacklist: [],
  };


const adminReducer = combineReducers({auth:adminAuthSlice})

const persistedAdminReducer = persistReducer(persistConfig, adminReducer);


export default persistedAdminReducer

