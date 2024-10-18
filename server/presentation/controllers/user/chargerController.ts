import { IUserChargerInteractor } from "../../../application/interface/user/InteractorInterface"
import { userChargerInteractor } from "../../../application/usecase/user/userChargerInteractor"
import { NextFunction, Request,Response } from "express"
import userMapsInteractor from "../../../application/usecase/services/maps/userMapsInteractor"
import { IUserMapsInteractor } from "../../../application/interface/services/map/mapInterface"
import { DataValidationError } from "../../../application/usecase/errors/authErrors"





export class UserChargerController{
    private userChargerInteractor:IUserChargerInteractor
    private userMapsInteractor:IUserMapsInteractor

    constructor(userChargerInteractor:IUserChargerInteractor,userMapsInteractor:IUserMapsInteractor){
        this.userChargerInteractor=userChargerInteractor
        this.userMapsInteractor=userMapsInteractor
    }

    getStationsDetails=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const within = JSON.parse(req.query.bounds as string)
            const stations = await this.userChargerInteractor.getStationsWithin(within)
            res.json({stations:stations})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    
    getNearByStations=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const location = JSON.parse(req.query.location as string)
            const stations = await this.userChargerInteractor.getStationsNearBy(location)
            res.json({stations:stations})
        } catch (error) {
            next(error)
        }
    }            
    
    onNewBooking=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {startTime,endTime,chargerId} = req.body
            console.log(req.body)
            const status = await this.userChargerInteractor.createNewbooking(startTime,endTime,chargerId)
            res.status(200).json({created:status})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    getRouteChargers=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const origin = req.query.origin as string
            const destination = req.query.destination as string
            const response = await this.userMapsInteractor.getPathCoordinates(origin,destination)
            res.json(response).status(200)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    onChargerStart=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {userId} = res.locals.accessTokenData
            const {chargerId} = req.body
            const response = await this.userChargerInteractor.onChargerStart(userId,chargerId)
            res.json(response).status(200)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    onChargerstop=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {userId} = res.locals.accessTokenData
            const {chargerId} = req.body
            const response = await this.userChargerInteractor.onChargerStop(userId,chargerId)
            res.json(response).status(200)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    getUserSessions=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {userId} = res.locals.accessTokenData
            const response = await this.userChargerInteractor.getChargerSession(userId)
            res.json(response).status(200)
        } catch (error) {
            
        }
    }
}


export const userChargerController=new UserChargerController(userChargerInteractor,userMapsInteractor)