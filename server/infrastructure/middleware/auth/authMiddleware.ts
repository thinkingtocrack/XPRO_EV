import { NextFunction, Request, Response } from "express";
import { IUserTokenInteractor } from "../../../application/interface/services/security/usertokeninterface";
import { IAdminRepository } from "../../../domain/repositories/admin/adminRepositoryInterface";
import { IUserRepository } from "../../../domain/repositories/user/userRepositoryInterface";
import { LogoutError } from "../../../application/usecase/errors/authErrors";
import { userRepository } from "../../repositories/users/userRepository";
import { adminRepository } from "../../repositories/admin/adminRepository";
import { userTokenInteractor } from "../../../application/usecase/services/security/userTokenInteractor";
import { IAuthMiddleware } from "../../../application/interface/services/middleware/authMiddleware";







class AuthMiddleware implements IAuthMiddleware{
    private userRepository:IUserRepository
    private adminRepository:IAdminRepository
    private userTokenInteractor:IUserTokenInteractor

    constructor(userRepository:IUserRepository,adminRepository:IAdminRepository,userTokenInteractor:IUserTokenInteractor){
        this.userRepository=userRepository
        this.adminRepository=adminRepository
        this.userTokenInteractor=userTokenInteractor
    }

    isAuthorizationHeaderSent=(req:Request,res:Response,next:NextFunction)=>{
        try {
            const accessTokenHeader = req.headers['authorization']
            if(typeof accessTokenHeader ==='string'){
                const [Bearer,accessToken] = accessTokenHeader.split(' ')
                if(Bearer==='Bearer' && accessToken!=='' && accessToken.length>20){
                    res.locals.accessToken=accessToken
                    next()
                }else{
                    throw new LogoutError()
                }
            }else{
                throw new LogoutError()
            }
        } catch (error) {
            console.log('auth header not sent')
            next(error)
        }
    }

    userAuthCheck=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const accessToken = res.locals.accessToken
            const {isVerified,decoded} = await this.userTokenInteractor.getDecodedToken(accessToken,'accessToken')
            if(isVerified && decoded){
                const isBlocked = await this.userRepository.isBlocked(decoded.userId)
                if(isBlocked){
                    throw new LogoutError()
                }else{
                    res.locals.accessTokenData= decoded
                    next()
                }           
            }else{
                throw new LogoutError()
            }
        } catch (error) {
            console.log('user auth check failed')
            next(error)
        }
    }

}

export const authMiddleware =  new AuthMiddleware(userRepository,adminRepository,userTokenInteractor)