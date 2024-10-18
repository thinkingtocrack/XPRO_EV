import { IUserTokenInteractor } from "../../../interface/services/security/usertokeninterface"
import { ITokenInteractor } from "../../../interface/services/security/tokenInterface"
import { tokenInteractor } from "./tokenInteractor";
import { IUserRepository } from "../../../../domain/repositories/user/userRepositoryInterface";
import { userRepository } from "../../../../infrastructure/repositories/users/userRepository";
import { IsBlockedError } from "../../errors/authErrors";
import { JwtPayload } from "jsonwebtoken";



export class UserTokenInteractor implements IUserTokenInteractor{

    private tokenInteractor:ITokenInteractor

    constructor(tokenInteractor:ITokenInteractor){
        this.tokenInteractor=tokenInteractor
    }

    generateUserToken(data: object): {accessToken:string,refreshToken:string} {
        try {
            const accessToken=this.tokenInteractor.accessToken(data,'5m')
            const refreshToken = this.tokenInteractor.refreshToken(data,'30d')
            return {accessToken,refreshToken}
        } catch (error) {
            throw error
        }
    }

    generateAccessToken(data:object):string{
        try {
            const accessToken=this.tokenInteractor.accessToken(data,'5m')
            return accessToken
        } catch (error) {
            throw error
        }
    }

    async getDecodedToken(token: string, type: string): Promise<{ isVerified: boolean; decoded?: JwtPayload; }> {
        try {
            if(type==='accessToken'){
                return await this.tokenInteractor.verifyAccessToken(token)
            }else if(type==='refreshToken'){
                return await this.tokenInteractor.verifyRefreshToken(token)
            }
            return {isVerified:false}
        } catch (error) {
            throw error
        }
    }
}


export const userTokenInteractor = new UserTokenInteractor(tokenInteractor)