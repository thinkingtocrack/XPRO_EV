import { IStationsRepository } from "../../../domain/repositories/charger/stationsRepositoryInterface";
import { IPublicChargerInteractor } from "../../interface/public/publicInteractorInterface";
import { StationSchemaType } from "../../../infrastructure/models/chargingStation";
import { stationsRepository } from "../../../infrastructure/repositories/charger/stationsRepository";







export class PublicChargerInteractor implements IPublicChargerInteractor {
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

    async getStationsNearBy(location: { lat: number; lng: number; }): Promise<StationSchemaType[]> {
        try {
            const stations = await this.stationsRepository.getStationsNearBy(location)
            return stations
        } catch (error) {
            throw error
        }
    }

}


export const publicChargerInteractor =  new PublicChargerInteractor(stationsRepository)