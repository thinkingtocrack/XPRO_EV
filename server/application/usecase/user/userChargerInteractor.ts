import { IStationsRepository } from "../../../domain/repositories/charger/stationsRepositoryInterface"
import { stationsRepository } from "../../../infrastructure/repositories/charger/stationsRepository"
import { IUserChargerInteractor } from "../../interface/user/InteractorInterface"
import { StationSchemaType } from "../../../infrastructure/models/chargingStation"
import mongoose from "mongoose"









export class UserChargerInteractor implements IUserChargerInteractor {
    private stationsRepository:IStationsRepository

    constructor(stationsRepository:IStationsRepository){
        this.stationsRepository=stationsRepository
    }


    async getStationsWithin(within: [number, number][]): Promise<StationSchemaType[]> {
        try {
            const stations = await this.stationsRepository.getStationsWithin(within)
            return stations
        } catch (error) {
            throw error
        }
    }
    
    async getStationsNearBy(location:{lat:number,lng:number}): Promise<StationSchemaType[]> {
        try {
            const stations = await this.stationsRepository.getStationsNearBy(location)
            return stations
        } catch (error) {
            throw error
        }
    }

    async createNewbooking(startTime: string, endTime: string,chargerId:string): Promise<boolean> {
        try {
            const bookingStatus = await this.stationsRepository.createBooking(startTime,endTime,chargerId)
            return bookingStatus.status
        } catch (error) {
            throw error
        }
    }


    async onChargerStart(userId: mongoose.Schema.Types.ObjectId, chargerId: string): Promise<{ status: boolean; message: string,data:{isCharging:boolean} }> {
        try {
            const chargerStatus = await this.stationsRepository.getChargerDetails(chargerId)
            if(chargerStatus){
                const startCharging = await this.stationsRepository.startCharger(userId,chargerId)
                if(startCharging) {
                    return {status:true,message:'charging started',data:{isCharging:true}}
                }else{
                    return {status:true,message:'charging failed',data:{isCharging:false}}
                }
            }else{
                return {status:true,message:'charger is not available',data:{isCharging:false}}
            }
        } catch (error) {
           throw error 
        }
    }

    async onChargerStop(userId: mongoose.Schema.Types.ObjectId, chargerId: string): Promise<{ status: boolean; message: string; data: { stoped: boolean } }> {
        try {
            const stopCharging = await this.stationsRepository.stopCharger(userId,chargerId)
            if(stopCharging?.chargingStatus==='notCharging'){
                return {
                    status:true,message:'cahrging stopped',data:{stoped:true}
                }
            }else{
                return {
                    status:true,message:'cahrging stopped',data:{stoped:false}
                }
            }
        } catch (error) {
            throw error
        }
    }

    async getChargerSession(userId){
        try {
            const sessions = await this.stationsRepository.getUserSessions(userId)
            return {data:sessions}
        } catch (error) {
            
        }
    }
}

export const userChargerInteractor =  new UserChargerInteractor(stationsRepository)