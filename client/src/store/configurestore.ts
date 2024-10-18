import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/userReducer";
import adminReducer from './admin/adminReducer'
import { persistStore } from 'redux-persist'

const rootReducer = combineReducers({user:userReducer,admin:adminReducer})



const store= configureStore({
    reducer:rootReducer,
    middleware: (getDefaultMiddleware)=> getDefaultMiddleware({
        serializableCheck:false
    }),
})

export type RootType = ReturnType<typeof store.getState>

export default store

export const persistor = persistStore(store);