import { IUserAccountInteractor } from "../../../application/interface/user/InteractorInterface";
import { Request,Response,NextFunction } from "express";
import userAccountInteractor from "../../../application/usecase/user/userAccountInteractor";
import userPaymentIntractor from "../../../application/usecase/user/userPaymentInteractor";



export class UserAccountController{
    private accountIntractor:IUserAccountInteractor
    private userPaymentInteractor

    constructor(accountIntractor:IUserAccountInteractor,userPaymentInteractor) {
        this.accountIntractor = accountIntractor
        this.userPaymentInteractor = userPaymentInteractor
    }


    onUserDetails=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {userId} = res.locals.accessTokenData
            const userProperties = req.query.userProperties as string[]
            const response =  await this.accountIntractor.getUserDetails(userId,userProperties)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    onUserDetailsUpdate=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const interactorData = {
                userId:res.locals.accessTokenData.userId,
                editData:req.body.editData
            }
            const response = await this.accountIntractor.updateUserDetails(interactorData)
            res.json(response).status(200)
        } catch (error) {
            
        }
    }

    onUserSubscriptionStatus=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {userId} = res.locals.accessTokenData
            const response = await this.accountIntractor.getUserSubscriptionStatus(userId)
            res.json(response).status(200)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    onUserSubscriptionAdd = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {userId} = res.locals.accessTokenData
            const response = await this.userPaymentInteractor.addUserSubscription(userId)
            res.json(response).status(200)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}


const userAccountController = new UserAccountController(userAccountInteractor,userPaymentIntractor)

export default userAccountController

