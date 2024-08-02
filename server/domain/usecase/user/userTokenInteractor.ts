import { IUserTokenInteractor } from "../../entities/user/InteractorInterface";
import { ITokenInteractor } from "../../entities/utils/tokenInterface";
import { tokenInteractor } from "../utils/security/tokenInteractor";



export class UserTokenInteractor implements IUserTokenInteractor{

    private tokenInteractor:ITokenInteractor

    constructor(tokenInteractor:ITokenInteractor){
        this.tokenInteractor=tokenInteractor
    }

    generateUserToken(data: object): object {
        const accessToken=this.tokenInteractor.accessToken(data)
        const refreshToken = this.tokenInteractor.refreshToken(data)
        return {accessToken,refreshToken}
    }

    userTokenRefresh(header: string): object {
        return {}
    }

    getToken(data: string): string {
        return'hai'
    }
}


export const userTokenInteractor = new UserTokenInteractor(tokenInteractor)