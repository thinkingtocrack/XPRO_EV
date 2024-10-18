import { IAdminAuthInteractor } from '../../../application/interface/admin/adminInteractorInterface'
import { NextFunction, Request,response,Response } from "express";
import { IsBlockedError,InvalidCredentialsError } from '../../../application/usecase/errors/authErrors'
import { adminAuthInteractor } from "../../../application/usecase/auth/admin/adminAuthInteractor";
import {v2 as cloudinary} from 'cloudinary'



export class AdminAuthController {
    private adminAuthInteractor:IAdminAuthInteractor

    constructor(adminAuthInteractor:IAdminAuthInteractor){
        this.adminAuthInteractor=adminAuthInteractor
    }

    onLogin=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {email,password} = req.body
            const {accessToken,isAuth,refreshToken,userData} = await this.adminAuthInteractor.authorizeUser(email,password)
            res.cookie('adminRefreshToken',refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true,path:'/admin',})
            res.status(200).json({isAuth,accessToken,userData})
        } catch (error) {
            next(error)
        }
    }

    onAccessTokenReissue=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const refreshToken=req.cookies.adminRefreshToken
            const accessToken = await this.adminAuthInteractor.reIssueAccessToken(refreshToken)
            res.status(200).json({accessToken})
        } catch (error) {
            throw error
        }
    }

    onGetcloudinarySignature=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_SECRET,
                secure: true
            })
            const timestamp = Math.round((new Date).getTime()/1000);
            const signature = cloudinary.utils.api_sign_request({
                timestamp:timestamp,
                folder: 'stations_image',
                eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
            },process.env.CLOUDINARY_SECRET as string)
            res.json({timestamp,signature,cloudname: process.env.CLOUDINARY_CLOUD_NAME,apikey: process.env.CLOUDINARY_API_KEY})
        } catch (error) {
            
        }
    }
}

export const adminAuthController= new AdminAuthController(adminAuthInteractor)