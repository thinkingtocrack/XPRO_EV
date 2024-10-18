import { IStationsRepository } from "../../../domain/repositories/charger/stationsRepositoryInterface";
import { IAdminStationInteractor } from "../../interface/admin/adminInteractorInterface";
import { StationSchemaType } from "../../../infrastructure/models/chargingStation";
import { stationsRepository} from "../../../infrastructure/repositories/charger/stationsRepository";







export class AdminChargerInteractor implements IAdminStationInteractor{
    private chargerRepository:IStationsRepository

    constructor(chargerRepository:IStationsRepository){
        this.chargerRepository=chargerRepository
    }

    async getStationsPage(page: number):Promise<{chargers:StationSchemaType[] | null,count:number}> {
        try {
            const stations = await this.chargerRepository.getStations(page)
            return stations
        } catch (error) {
            throw error
        }
    }

    async addStation(data: { stationName: string;status:string ; latitude: number; longitude: number; description:string; chargers: { basePrice:number,category:'string',discount:number,discountType:string,portType:string,power:number,status:string,tax:number,taxType:string }[]; }): Promise<{ created: boolean}> {
        try {
            const {created} = await this.chargerRepository.addStation(data)
            return {created:created}
        } catch (error) {
            throw error
        }
    }
    
    async deleteStation(id:string): Promise<{ deleted: boolean}> {
        try {
            const {deleted} = await this.chargerRepository.deleteStation(id)
            return {deleted}
        } catch (error) {
            throw error
        }
    }

}

export const adminChargerInteractor = new AdminChargerInteractor(stationsRepository)