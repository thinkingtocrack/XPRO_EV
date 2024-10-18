import { StationSchemaType } from "../../../infrastructure/models/chargingStation"
import { UserSchemaType } from "../../../infrastructure/models/users"

export type AuthorizeUser={
    isAuth:boolean,
    accessToken:string,
    userData:object,
    refreshToken:string
}









export interface IAdminAuthInteractor{
    authorizeUser(email:string,password:string):Promise<AuthorizeUser>
    reIssueAccessToken(refreshToken: string): Promise<string>
}


export interface IAdminCustomerInteractor{
    getCustomers(page:number):Promise<{users:UserSchemaType[] | null,count:number}>
    blockCustomer(id:string,block:boolean):Promise<boolean>
}


export interface IAdminStationInteractor{
    getStationsPage(page:number):Promise<{chargers:StationSchemaType[] | null,count:number}>
    addStation(data: { stationName: string;status:string; latitude: number; longitude: number; description:string; chargers: { basePrice:number,category:'string',discount:number,discountType:string,portType:string,power:number,status:string,tax:number,taxType:string }[]; }):Promise<{created:boolean}>
    deleteStation(id:string): Promise<{ deleted: boolean}>
}
