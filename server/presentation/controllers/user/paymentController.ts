import userPaymentIntractor from "../../../application/usecase/user/userPaymentInteractor"
import { NextFunction,Request,Response } from "express"






export class UserPaymentController{
    private userPaymentIntractor

    constructor(userPaymentIntractor){
        this.userPaymentIntractor = userPaymentIntractor
    }

    onGetWallet=async(req: Request, res: Response,next:NextFunction) => {
        try {
            const userId = res.locals.accessTokenData.userId
            const response = await this.userPaymentIntractor.getWallet(userId)
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    onNewOrder=async(req: Request, res: Response,next:NextFunction) => {
        try {
            const { paymentMethod, amount} = req.body
            const userId = res.locals.accessTokenData.userId
            const response = await this.userPaymentIntractor.newOrder(userId, paymentMethod, amount)
            res.status(200).json(response)
        }catch(error){
            console.log(error)
            next(error)
        }
    }

    onOrderVerify=async(req: Request, res: Response,next:NextFunction) => {
        try {
            const { orderId, paymentId, signature ,receipt} = req.body
            const userId = res.locals.accessTokenData.userId
            const response = await this.userPaymentIntractor.verifyOrder(userId, orderId, paymentId, signature,receipt)
            res.status(200).json(response)
        }catch(error){
            console.log(error)
        }
    }


}

const userPaymentController = new UserPaymentController(userPaymentIntractor)
export default userPaymentController