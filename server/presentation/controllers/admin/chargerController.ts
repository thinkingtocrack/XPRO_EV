import { Response,Request,NextFunction } from "express";
import { IAdminStationInteractor } from "../../../application/interface/admin/adminInteractorInterface";
import { adminChargerInteractor } from "../../../application/usecase/admin/adminChargerInteractor";





export class AdminChargerController{
    private adminChargerInteractor:IAdminStationInteractor

    constructor(adminChargerInteractor:IAdminStationInteractor){
        this.adminChargerInteractor = adminChargerInteractor
    }

    getStations=async(req:Request,res:Response)=>{
        try {
            const page = Number(req.query.page ? req.query.page :1)
            const stationData = await this.adminChargerInteractor.getStationsPage(page)
            res.status(200).json({chargers:stationData.chargers,count:stationData.count})
        } catch (error) {
            console.log(error)
        }
    }

    addStations = async (req:Request,res:Response)=>{
        try {
            const data = req.body.data
            const {created} = await this.adminChargerInteractor.addStation(data)
            res.status(200).json({created:created})
        } catch (error) {
            console.log(error)
            res.status(400).json({created:false})
        }
    }

    deleteStations = async (req:Request,res:Response)=>{
        try {
            const id=req.body.id
            const {deleted} = await this.adminChargerInteractor.deleteStation(id)
            res.status(200).json({deleted:deleted})
        } catch (error) {
            console.log(error)
            res.status(400).json({deleted:false})
        }
    }

}

export const adminChargerController = new AdminChargerController(adminChargerInteractor)