import { IUserAuthInteractor } from "../../../application/interface/user/InteractorInterface"
import { NextFunction, Request,Response } from "express";
import { userAuthInteractor } from "../../../application/usecase/auth/user/userAuthInteractor"




export class UserAuthController {
    private userAuthInteractor:IUserAuthInteractor

    constructor(userAuthInteractor:IUserAuthInteractor){
        this.userAuthInteractor=userAuthInteractor
    }

    onLogin=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {username,password,rememberme} = req.body
            const {isAuth,accessToken,refreshToken,userData} = await this.userAuthInteractor.authorizeUser(username,password)
            if(rememberme){
                res.cookie('refreshToken',refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true,path:'/api/auth/user'})
            }else{
                res.cookie('refreshToken',refreshToken,{httpOnly:true,path:'/api/auth/user'})
            }
            res.status(200).json({isAuth,userData,accessToken})
        } catch (error) {
            next(error)
        }
    }

    onSignup=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const userData = {
                userName:req.body.username,
                password:req.body.password,
                fullName:req.body.fullname,
                email:req.body.email,
                otp:req.body.otp
            }
            const data = await this.userAuthInteractor.userSignup(userData)
            console.log(data)
            if(!data.created){
                res.status(401).json({error:'otp_error',message:'incorrect otp or otp expired'})
            }else{
                res.status(200).json(data)
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    } 

    onVerificationSendOtp=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const email = req.body.email
            const userName = req.body.userName
            const {status} = await this.userAuthInteractor.verificationOtpHandler(email,userName)
            res.status(200).json({status})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    onForgotPassword = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const email = req.body.email
            const {status} = await this.userAuthInteractor.forgotPassword(email)
            res.status(200).json({status})
        } catch (error) {
            next(error)
        }
    }

    onForgotPasswordVerify = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const {email,password,otp} = req.body
            const isVerified = await this.userAuthInteractor.forgotPasswordVerify(email,password,otp)
            res.status(200).json({isVerified})
        } catch (error) {
            next(error)
        }
    }

    onAccessTokenReissue= async (req:Request,res:Response,next:NextFunction)=>{
        try {
            let refreshToken = req.cookies.refreshToken
            console.log(refreshToken)
            const accessToken = await this.userAuthInteractor.reIssueAccessToken(refreshToken)
            res.status(200).json({accessToken})
        } catch (error) {
            next(error)
        }
    }

}

export const userAuthController = new UserAuthController(userAuthInteractor)