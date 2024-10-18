import { JwtPayload } from "jsonwebtoken"

export interface ITokenInteractor{
    

    generateToken(data:object,expires:string,secret:string):string
    accessToken(data:object,expires:string):string
    refreshToken(data:object,expires:string):string
    otpToken(data:object,expires:string):string
    verifyToken(token:string,secret:string):Promise<{decoded?:JwtPayload,isVerified:boolean}>
    verifyAccessToken(token:string):Promise<{decoded?:JwtPayload,isVerified:boolean}>
    verifyRefreshToken(token:string):Promise<{decoded?:JwtPayload,isVerified:boolean}>
}
