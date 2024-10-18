import mongoose from "mongoose";
import { StationSchemaType } from "../../../infrastructure/models/chargingStation";
import { ChargerSchemaType } from "../../../infrastructure/models/charger";





export interface IStationsRepository{
    getStations(page:number):Promise<{chargers:StationSchemaType[] | null,count:number}>
    addStation(data: { stationName: string;status:string ;latitude: number; longitude: number; description:string; chargers: { basePrice:number,category:'string',discount:number,discountType:string,portType:string,power:number,status:string,tax:number,taxType:string }[]; }):Promise<{created:boolean,station:StationSchemaType}>
    getStationsWithin(within:[number,number][]):Promise<StationSchemaType[]>
    getStationsNearBy(location:{lat:number,lng:number}): Promise<StationSchemaType[]>
    deleteStation(id:string):Promise<{deleted:boolean}>
    getChargersOnPolygon(polygon:any):Promise<StationSchemaType[]>

    createBooking(startTime:string,endTime:string,chargerId:string):Promise<{status:boolean,booking?:BookingSchemaType}>

    getChargerDetails(chargerId:string):Promise<boolean>
    startCharger(userId:mongoose.Schema.Types.ObjectId,chargerId:string):Promise<ChargerSchemaType | null>
    stopCharger(userId: mongoose.Schema.Types.ObjectId, chargerId: string): Promise<ChargerSchemaType | null>
} 