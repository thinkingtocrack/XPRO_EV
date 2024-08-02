import { IUserAuthInteractor } from "../../../domain/entities/user/InteractorInterface";
import { Request,Response } from "express";
import { userAuthInteractor, UserExistError } from "../../../domain/usecase/user/authInteractor";
import { IsBlockedError,InvalidCredentialsError } from "../../../domain/usecase/user/authInteractor";




export class UserAuthController {
    private userAuthInteractor:IUserAuthInteractor

    constructor(userAuthInteractor:IUserAuthInteractor){
        this.userAuthInteractor=userAuthInteractor
    }

    onLogin=async(req:Request,res:Response)=>{
        try {
            const {username,password} = req.body
            const data = await this.userAuthInteractor.authorizeUser(username,password)
            res.status(200).json(data)
        } catch (error) {
            if(error instanceof InvalidCredentialsError){
                res.status(401).json(error)
            }else if(error instanceof IsBlockedError){
                res.status(403).json(error)
            }else{
                console.log(error)
                res.status(500).json({message:'server error'})
            }
        }
    }

    onSignup=async(req:Request,res:Response)=>{
        try {
            const userData = {
                userName:req.body.username,
                password:req.body.password,
                fullName:req.body.fullname,
                email:req.body.email
            }
            const data = await this.userAuthInteractor.userSignup(userData)
            res.status(200).json(data)
        } catch (error) {
            if(error instanceof UserExistError){
                res.status(400).json({exists:true,fields:error.fields})
            }else{
                console.log(error)
                res.status(500).json('serverError')
            }
        }
    } 
}

export const userAuthController = new UserAuthController(userAuthInteractor)