import { JwtPayload } from "jsonwebtoken"

export interface ITokenInteractor{
    generateToken(data:object,expires:string):string
    accessToken(data:object):string
    refreshToken(data:object):string
    verifyToken(token:string):any
}
