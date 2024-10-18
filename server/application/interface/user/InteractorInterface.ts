import { UserSchemaType } from "../../../infrastructure/models/users"
import { StationSchemaType } from "../../../infrastructure/models/chargingStation"
import mongoose from "mongoose"
import { BookingSchemaType } from "../../../infrastructure/models/booking"


export type AuthorizeUser={
    isAuth:boolean,
    accessToken:string,
    refreshToken:string,
    userData:object
}

export type UserSignupData = {
    email:string,
    userName:string,
    password:string,
    fullName:string,
    otp:string
}

export type CreateUser={
    created:boolean
}

export enum OtpType{
    
}

export interface IUserAuthInteractor{
    authorizeUser(username:string,password:string):Promise<AuthorizeUser>,
    userSignup(userData:UserSignupData):Promise<CreateUser>
    verificationOtpHandler(email:string,userName?:string):Promise<{status:boolean}>
    forgotPassword(email:string):Promise<{status:boolean}>
    forgotPasswordVerify(username:string,password:string,otp:string):Promise<boolean>
    reIssueAccessToken(refreshToken:string):Promise<string>
}

export interface IUserTokenInteractor{
    generateUserToken(data:object):{accessToken:string,refreshToken:string}
    userTokenRefresh(header:string):string
}

export interface IUserChargerInteractor{
    getStationsWithin(within:[number,number][]):Promise<StationSchemaType[]>
    getStationsNearBy(location:{lat:number,lng:number}): Promise<StationSchemaType[]>
    createNewbooking(startTime:string,endTime:string,chargerId:string):Promise<boolean>
    onChargerStart(userId:mongoose.Schema.Types.ObjectId,chargerId:string):Promise<{ status: boolean; message: string,data:{isCharging:boolean} }>
    onChargerStop(userId: mongoose.Schema.Types.ObjectId, chargerId: string): Promise<{ status: boolean; message: string,data:{stoped:boolean} }> 
}

export interface IUserAccountInteractor{
    getUserDetails(userId: string,userProperties:string[]): Promise<{data:UserSchemaType,status:boolean,message:string}>
    updateUserDetails(interactorData: { userId: string, editData: {fullName?:string,phoneNumber?:string,country?:string,countryCode?:'string'}}): Promise<{data:UserSchemaType,status:boolean,message:string}>

    getUserSubscriptionStatus(userId:string):Promise<{status:boolean,message:string,data:{isSubscribed:boolean}}>
}

export interface IUserPaymentInteractor{
    
}


export interface IUserBookingInteractor{
    scheduleChargerBooking(
        {userId,chargerId,startTime,endTime}:{userId:mongoose.Schema.Types.ObjectId,chargerId:mongoose.Schema.Types.ObjectId,startTime:string,endTime:string; date: string;})
        :Promise<{status:boolean,message:string}>
    
    getAvaliableSlots({chargerId,date}:{chargerId:mongoose.Types.ObjectId,date:string}):Promise<{status:boolean,message:string,data:{slots:any[]}}>

    getUserBookedSlots({userId,chargerId}:{userId:mongoose.Types.ObjectId,chargerId:mongoose.Types.ObjectId}):Promise<{status:boolean,message:string,data:{bookings:BookingSchemaType[]}}>
}

