import { IUserRepository } from "../../../domain/repositories/user/userRepositoryInterface";
import smartcar from 'smartcar'
import { userRepository } from "../../../infrastructure/repositories/users/userRepository";
import { access } from "fs";


const client = new smartcar.AuthClient({
    clientId: process.env.SMARTCAR_CLIENT_ID,
    clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
    redirectUri: process.env.SMARTCAR_REDIRECT_URI,
    mode: 'simulated', // one of ['live', 'simulated']
  });






export class UserVehicleInteractor{
    private userRepository:IUserRepository
    private smartcar
    private client

    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository
        this.smartcar=smartcar
        this.client=client
    }


    async addVehicleAccessCode(code,userData){
        try {
            const accessCode = await this.client.exchangeCode(code)
            const {vehicles:vehicleIds} = await this.smartcar.getVehicles(accessCode.accessToken)
            await this.userRepository.addVehicle(accessCode,userData.userId,vehicleIds)
            return true
        } catch (error) {
            throw error
        }
    }

    async getVehiclesId(userId){
        try {
            const {vehicles} = await this.userRepository.getVehiclesId(userId)
            return {vehicles,message:'vehicles Ids sent',status:true}
        } catch (error) {
            throw error
        }
    }

    async refreshVehicleToken(vehicleId){
        try {
            const vehicleToken = await this.userRepository.getVehicleById(vehicleId)
            const newAccess = await this.client.exchangeRefreshToken(vehicleToken.refreshToken);
            await this.userRepository.updateVehicleById(vehicleId,newAccess)
        } catch (error) {
            throw error
        }
    }

    async getVehicle(_id,vehicleId){
        try {
            const vehicleDetails = await this.userRepository.getVehicleById(_id)
            const vehicle = await new this.smartcar.Vehicle(vehicleId, vehicleDetails.accessToken, { unitSystem:'metric'});
            const batchResponse = await vehicle.batch(['/battery','/','/charge'])
            return {status:true,message:'vehicles sent',vehicle:{battery:batchResponse.battery(),attributes:batchResponse.attributes(),charge:batchResponse.charge()}}
        } catch (error) {
            if(error.statusCode===401){
                try {
                    await this.refreshVehicleToken(_id)
                    return await this.getVehicle(_id,vehicleId)
                } catch (error) {
                    throw error
                }
            }else{
                throw error
            }
        }
    }
}

const userVehicleInteractor = new UserVehicleInteractor(userRepository)
export default userVehicleInteractor