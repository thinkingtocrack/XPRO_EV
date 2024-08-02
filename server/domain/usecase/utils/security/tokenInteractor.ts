import { error } from "console";
import { ITokenInteractor } from "../../../entities/utils/tokenInterface";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
const secret=process.env.JWT_SECRET as string
import { promisify } from "util";

export class TokenInteractor implements ITokenInteractor{
    private Jwt:typeof jwt
    
    constructor(){
        this.Jwt=jwt
    }

    accessToken(data: object): string {
        try {
            const accessToken=this.generateToken(data,'3m')
            return accessToken
        } catch (error) {
            throw error
        }
    }

    refreshToken(data: object): string {
        try {
            const refreshToken= this.generateToken(data,'30d')
            return refreshToken
        } catch (error) {
            throw error
        }
    }

    generateToken(data: object, expires: string): string {
        try {
            return this.Jwt.sign(data,secret,{
                expiresIn:expires
            })
        } catch (error) {
            throw error
        }
    }

    async verifyToken(token: string) {
        try {
            const verifyJwt = promisify(jwt.verify) as (token: string, secret: string) => Promise<JwtPayload>;
            const decoded = await verifyJwt(token,secret)
            return decoded
        } catch (error) {
            throw error
        }
    }

}


export const tokenInteractor = new TokenInteractor()