import { StationModelType,StationSchemaType } from "../../models/chargingStation";
import StationModel from '../../models/chargingStation'
import { IStationsRepository } from "../../../domain/repositories/charger/stationsRepositoryInterface";
import { ChargerModelType, ChargerSchemaType } from "../../models/charger";
import ChargerModel from "../../models/charger";
import mongoose, { Mongoose } from "mongoose";
import BookingModel, { BookingModelType, BookingSchemaType } from "../../models/booking";
import ChargingSessionModel, { ChargingSessionModelType } from "../../models/chargingSession";




export class StationsRepository implements IStationsRepository{
    private stationModel:StationModelType
    private chargerModel:ChargerModelType
    private bookingModel:BookingModelType
    private chargingSessionModel : ChargingSessionModelType

    constructor(stationModel:StationModelType,chargerModel:ChargerModelType,bookingModel:BookingModelType,chargingSessionModel:ChargingSessionModelType){
        this.stationModel=stationModel
        this.chargerModel=chargerModel
        this.bookingModel=bookingModel
        this.chargingSessionModel = chargingSessionModel
    }

    async getStations(page:number=0):Promise<{chargers:StationSchemaType[] | null,count:number}>{
        try {
            const chargers = this.stationModel.find().skip((page-1)*10).limit(10)
            const count = this.stationModel.countDocuments({})
            const data = await Promise.all([chargers,count])
            return {chargers:data[0],count:data[1]}
        } catch (error) {
            throw error
        }
    }

    async addStation(data: { images:string[],stationName: string; status:string;latitude: number; longitude: number; description:string; chargers: { basePrice:number,category:'string',discount:number,discountType:string,portType:string,power:number,status:string,tax:number,taxType:string }[]; }):Promise<{created:boolean,station:StationSchemaType}>{
        try {
            const stationDetails = {stationName:data.stationName,images:data.images,status:data.status,location:{type:'Point',coordinates:[data.longitude,data.latitude]}}
            const addedStation = await this.stationModel.create(stationDetails)
            if(data.chargers.length>0){
                const chargers = data.chargers.map((charger)=>{
                    return {
                        ...charger,
                        station:addedStation._id
                    }
                })
                const addedChargers = await this.chargerModel.insertMany(chargers) 
                const chargersId = addedChargers.map((charger)=>{
                    return charger._id
                })
                addedStation.chargers=chargersId
                await addedStation.save()
            }
            return {created:true,station:addedStation}
        } catch (error) {
            throw error
        }
    }

    async getStationsWithin(within: [number, number][]): Promise<StationSchemaType[]> {
        try {
            const stations = await this.stationModel.where('status').equals('availabe').where('location').within({ box: within }).populate('chargers').populate('chargers')
            return stations
        } catch (error) {
            throw error
        }
    }
    
    async getStationsNearBy(location:{lat:number,lng:number}): Promise<StationSchemaType[]> {
        try {
            const nearby = await this.stationModel.aggregate([
                {
                  $geoNear: {
                    near: {
                      type: "Point",
                      coordinates: [location.lng,location.lat]
                    },
                    distanceField: "distance",
                    spherical: true,
                  }
                },
                {
                  $sort: { distance: 1 } // Sort by distance in ascending order (least distance first)
                },
                {
                    $lookup: {
                      from: 'chargers', // The name of the collection to join
                      localField: 'chargers',
                      foreignField: '_id',
                      as: 'chargers'
                    }
                  },
              ]);
            return nearby
        } catch (error) {
            throw error
        }
    }

    async getChargersOnPolygon(polygon:any):Promise<StationSchemaType[]>{
        try {
            const newPolygon = polygon.coordinates.map((a)=>{
                return a.map(b=>b.reverse())
            })
            polygon.coordinates=newPolygon
            const chargers = await this.stationModel
                .where('status').equals('availabe')
                .where('location').within().geometry(polygon)
            return chargers
        } catch (error) {
            throw error
        }
    }

    async deleteStation(id:string):Promise<{deleted:boolean}>{
        try {
            const deletedStation = await this.stationModel.findByIdAndDelete(id)
            return {deleted:true}
        } catch (error) {
            throw error
        }
    }

    async createBooking(startTime: string, endTime: string, chargerId: string):Promise<{status:boolean,booking?:BookingSchemaType}> {
        try {
            const charger = await this.chargerModel.findById(chargerId)
            const checkBooking = await this.bookingModel.where('chargerId').equals(chargerId).where('startTime').gte((new Date(startTime)).getTime()).where('endTime').lte((new Date(endTime)).getTime())
            if(checkBooking.length===0 && charger){
                const booking = await this.bookingModel.create({
                    userId:'66d632a8af45270cf303f341',
                    stationId:charger.station,
                    chargerId:chargerId,
                    startTime,
                    endTime,
                    status:'confirmed'
                })
                return {status:true,booking}
            }else{
                return {status:false}
            }
        } catch (error) {
            throw error
        }
    }

    async getChargerDetails(chargerId:string):Promise<boolean>{
        try {
            const chargerStatus = await this.chargerModel.findById(chargerId).where('status').equals('online')
            if(chargerStatus?.chargingStatus==='notCharging' || chargerStatus){
                return true
            }else{
                return false
            }
        } catch (error) {
            throw error
        }
    }

    async startCharger(userId: mongoose.Schema.Types.ObjectId, chargerId: string): Promise<ChargerSchemaType | null> {
        try {
            const charger = await this.chargerModel.findByIdAndUpdate(chargerId,{
                chargingStatus:'charging',
                currentSession: { userId, startTime: new Date() }
            }).where('status').equals('online')
            return charger
        } catch (error) {
            throw error
        }
    }

    async stopCharger(userId: mongoose.Schema.Types.ObjectId, chargerId: string): Promise<ChargerSchemaType | null> {
        try {
            const charger = await this.chargerModel.findById(chargerId).where('status').equals('online')
            if (!charger || !charger.currentSession) {
                console.log('No active charging session found');
                return null;
            }
    
            const currentDate = new Date();
            const startTime = charger.currentSession.startTime;
            const durationHours = (currentDate.getTime() - startTime.getTime()) / 3600000; // Convert ms to hours
    
            const session = await this.chargingSessionModel.create({
                startTime: startTime,
                endTime: currentDate,
                energyConsumed: (charger.maxPower * durationHours)/1000,
                cost: (charger.basePrice * charger.maxPower * durationHours)/1000,
                userId: userId
            });
    
            charger.chargingStatus = 'notCharging';
            charger.currentSession = undefined;
            const updatedCharger = await charger.save();
    
            console.log(`Charging session stopped for charger ${chargerId}`);
            return updatedCharger;
        } catch (error) {
            console.error('Error stopping charger:', error);
            throw error; // Re-throw the error for proper error handling
        }
    }

    async getUserSessions(userId){
        try {
            const sessions = await this.chargingSessionModel.find({
                userId:userId
            })
            return sessions
        } catch (error) {
            
        }
    }


}

export const stationsRepository = new StationsRepository(StationModel,ChargerModel,BookingModel,ChargingSessionModel)