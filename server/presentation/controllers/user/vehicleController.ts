import { NextFunction,Request,Response } from "express"
import userVehicleInteractor from "../../../application/usecase/user/userVehicleInteractor"





export class UserVechicleController {
    private userVehicleInteractor

    constructor(userVehicleInteractor){
        this.userVehicleInteractor=userVehicleInteractor
    }

    onGetVehiclesId=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            // const {userId} = req.query
            const {userId} = res.locals.accessTokenData
            const response = await this.userVehicleInteractor.getVehiclesId(userId)
            res.status(200).json(response)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    onGetVehicle=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {_id,vehicleId}=  req.query
            const response = await this.userVehicleInteractor.getVehicle(_id,vehicleId)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    onAddVehicles=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {code} =req.body
            const userData= res.locals.accessTokenData
            const response = await this.userVehicleInteractor.addVehicleAccessCode(code,userData)
            res.status(200).json({status:true,message:'valid code'})
        } catch (error) {
            console.log(error)
            if(error?.statusCode===400){
                res.status(200).json({status:false,message:'invalid code'})
            }else{
                next(error)
            }
        }
    }
}


const userVehicleController =  new UserVechicleController(userVehicleInteractor)
export default userVehicleController