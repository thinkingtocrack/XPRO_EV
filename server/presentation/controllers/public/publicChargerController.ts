import { NextFunction, Request, Response } from "express";
import { IPublicChargerInteractor } from "../../../application/interface/public/publicInteractorInterface";
import { publicChargerInteractor } from "../../../application/usecase/public/publicChargerInteractor";








export class PublicChargerController{
    private publicChargerInteractor:IPublicChargerInteractor

    constructor(publicChargerInteractor:IPublicChargerInteractor){
        this.publicChargerInteractor=publicChargerInteractor
    }

    getStations=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const within = JSON.parse(req.query.bounds as string)
            const stations = await this.publicChargerInteractor.getStationsWithin(within)
            res.json({stations:stations})
        } catch (error) {
            next(error)
        }
    }

    getNearByStations=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const location = JSON.parse(req.query.location as string)
            const stations = await this.publicChargerInteractor.getStationsNearBy(location)
            res.json({stations:stations})
        } catch (error) {
            next(error)
        }
    }  

}


export const publicChargerController = new PublicChargerController(publicChargerInteractor)