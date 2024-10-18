import { ITokenInteractor } from "../../../interface/services/security/tokenInterface"
import jwt, { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { promisify } from "util";

export class TokenInteractor implements ITokenInteractor{
    private Jwt:typeof jwt
    private accessTokenSecret : string
    private refreshTokenSecret : string
    private otpTokenSecret :string
    
    constructor(){
        this.Jwt=jwt
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
        this.otpTokenSecret = process.env.OTP_TOKEN_SECRET as string
    }


    otpToken(data: object, expires: string): string {
        try {
            const otpToken= this.generateToken(data,expires,this.otpTokenSecret)
            return otpToken
        } catch (error) {
            throw error
        }
    }
    
    accessToken(data: object,expires:string): string {
        try {
            const accessToken=this.generateToken(data,process.env.ACCESS_TOKEN_EXPIRE as string,this.accessTokenSecret)
            return accessToken
        } catch (error) {
            throw error
        }
    }

    refreshToken(data: object,expires:string): string {
        try {
            const refreshToken= this.generateToken(data,process.env.REFRESH_TOKEN_EXPIRE as string,this.refreshTokenSecret)
            return refreshToken
        } catch (error) {
            throw error
        }
    }

    generateToken(data: object, expires: string,secret:string): string {
        try {
            return this.Jwt.sign(data,secret,{
                expiresIn:expires
            })
        } catch (error) {
            throw error
        }
    }

    async verifyToken(token: string,secret:string):Promise<{decoded?:JwtPayload,isVerified:boolean}> {
        try {
            const verifyJwt = promisify(jwt.verify) as (token: string, secret: string) => Promise<JwtPayload>;
            const decoded = await verifyJwt(token,secret)
            return {decoded,isVerified:true}
        } catch (error) {
            if(error instanceof TokenExpiredError || error instanceof JsonWebTokenError || error instanceof NotBeforeError){
                return {isVerified:false}
            }else{
                throw error
            }
        }
    }

    async verifyAccessToken(token: string):Promise<{decoded?:JwtPayload,isVerified:boolean}> {
        try {
            return await this.verifyToken(token,this.accessTokenSecret)
        } catch (error) {
            throw error
        }
    }

    async verifyRefreshToken(token: string):Promise<{decoded?:JwtPayload,isVerified:boolean}> {
        try {
            return await this.verifyToken(token,this.refreshTokenSecret)
        } catch (error) {
            throw error
        }
    }

}


export const tokenInteractor = new TokenInteractor()