import { JwtPayload } from "jsonwebtoken"



export interface IUserTokenInteractor{

    generateUserToken(data:object):{accessToken:string,refreshToken:string}
    generateAccessToken(data:object):string
    getDecodedToken(token:string,type:string):Promise<{isVerified:boolean,decoded?:JwtPayload}>
}
