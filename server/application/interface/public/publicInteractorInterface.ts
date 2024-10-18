import { StationSchemaType } from "../../../infrastructure/models/chargingStation"




export interface IPublicChargerInteractor{
    getStationsWithin(within:[number,number][]):Promise<StationSchemaType[]>
    getStationsNearBy(location:{lat:number,lng:number}): Promise<StationSchemaType[]>
}