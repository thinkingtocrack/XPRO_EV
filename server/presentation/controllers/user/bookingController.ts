import { NextFunction ,Request,Response} from "express";
import { IUserBookingInteractor } from "../../../application/interface/user/InteractorInterface";
import mongoose, { ObjectId } from "mongoose";
import userBookingInteractor from "../../../application/usecase/user/userBookingInteractor";




class UserBookingController {
    private userBookingInteractor:IUserBookingInteractor

    constructor(userBookingInteractor:IUserBookingInteractor){
        this.userBookingInteractor = userBookingInteractor
    }

    onCreateBooking=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            console.log(req.body)
            const data = {
                chargerId:req.body.chargerId,
                userId:res.locals.accessTokenData.userId,
                startTime:req.body.startTime,
                endTime:req.body.endTime,
                date:req.body.date
            }
            console.log(data)
            const response = await this.userBookingInteractor.scheduleChargerBooking(data)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    getAvaliableSlots=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const data = {
                chargerId:new mongoose.Types.ObjectId(req.query.chargerId as string),
                date:req.query.date as string
            }
            const response = await this.userBookingInteractor.getAvaliableSlots(data)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    getBookedSlots=async(req:Request,res:Response,next:NextFunction)=> {
        try {
            const data = {
                chargerId:new mongoose.Types.ObjectId(req.query.chargerId as string),
                userId:res.locals.accessTokenData.userId
            }
            const response = await this.userBookingInteractor.getUserBookedSlots(data)
            res.status(200).json(response)
        }catch (error) {
            console.log(error)
            next(error)
        }
    }
}


const userBookingController = new UserBookingController(userBookingInteractor)

export default userBookingController