import { Client, LatLng, TravelMode, DirectionsResponseData } from "@googlemaps/google-maps-services-js"
import { IStationsRepository } from "../../../../domain/repositories/charger/stationsRepositoryInterface"
import {decode} from "@mapbox/polyline"
import {buffer,lineString}  from '@turf/turf'
import { stationsRepository } from "../../../../infrastructure/repositories/charger/stationsRepository"
import { IUserMapsInteractor } from "../../../interface/services/map/mapInterface"
import { StationSchemaType } from "../../../../infrastructure/models/chargingStation"




const client = new Client({})

class UserMapsInteractor implements IUserMapsInteractor{
    private client:Client
    private stationsRepository:IStationsRepository

    constructor(client:Client,stationsRepository:IStationsRepository){
        this.client = client
        this.stationsRepository = stationsRepository
    }

    getPathCoordinates=async(origin:string,destination:string):Promise<{data:{chargers:StationSchemaType[][]},status:boolean,message:string}>=> {
        try {
            const response = await this.client.directions({
                params:{
                    origin:origin,
                    destination:destination,
                    mode:TravelMode.driving,
                    key:process.env.GOOGLE_MAP_API as string,
                    alternatives:true
                }
            })
            const routesPolygon = response.data.routes.map((route)=>{
                return this.getPolygonFromPolyline(route.overview_polyline.points)
            })
            const nearbyChargersOnRouteArray = routesPolygon.map((route)=>{
                return this.stationsRepository.getChargersOnPolygon(route?.geometry)
            })
            const nearbyChargersOnRoutes = await Promise.all(nearbyChargersOnRouteArray)
            return {data:{chargers:nearbyChargersOnRoutes},status:true,message:'nearby stations sent'}
        } catch (error) {
            throw error
        }
    }

    private getPolygonFromPolyline = (polyline:string)=> {
        try {
            const coordinates = decode(polyline)
            const lineStringCoordinates = lineString(coordinates)
            const bufferedLineString = buffer(lineStringCoordinates,10, { units: 'kilometers' });
            return bufferedLineString
        } catch (error) {
            throw error
        }
    }

}

const userMapsInteractor = new UserMapsInteractor(client,stationsRepository)

export default userMapsInteractor