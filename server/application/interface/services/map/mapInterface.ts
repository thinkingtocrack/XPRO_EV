import { ChargerSchemaType } from "../../../../infrastructure/models/charger";
import { StationSchemaType } from "../../../../infrastructure/models/chargingStation";
import { Client, LatLng,  DirectionsResponseData } from "@googlemaps/google-maps-services-js"




export interface IUserMapsInteractor{
    getPathCoordinates(origin:string,destination:string):Promise<{data:{chargers:StationSchemaType[][],},status:boolean,message:string}>
}