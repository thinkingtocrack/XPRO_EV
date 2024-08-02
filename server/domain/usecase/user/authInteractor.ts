import { IUserAuthInteractor,IUserTokenInteractor } from "../../entities/user/InteractorInterface";
import { SignupBody } from "../../types/user/userTypes";
import { IUserRepository } from "../../entities/user/repositoryInterface";
import { IBcryptInteractor } from '../../entities/utils/bcryptInterface'
import { bcryptInteractor } from "../utils/security/bcryptInteractor";
import { userTokenInteractor } from "./userTokenInteractor";
import { userRepository, UserRepository } from "../../../infrastructure/repositories/users/userRepository";

export class IsBlockedError extends Error{
    constructor(message: string) {
        super(message);
        this.name = "isBlockedError";
        }
}
export class InvalidCredentialsError extends Error{
    constructor(message: string) {
        super(message);
        this.name = "invalid credentails";
        }
}

export class UserExistError extends Error{
    public fields:string[]
    constructor(message:string,fields:string[]){
        super(message)
        this.name = 'User data Exists'
        this.fields=fields
    }
}


export class UserAuthInteractor implements IUserAuthInteractor{
    private userTokenInteractor:IUserTokenInteractor
    private userRepository:IUserRepository
    private bcryptInteractor:IBcryptInteractor


    constructor(usertokenInteractor:IUserTokenInteractor,userRepository:IUserRepository,bcryptInteractor:IBcryptInteractor){
        this.userTokenInteractor=usertokenInteractor
        this.userRepository=userRepository
        this.bcryptInteractor=bcryptInteractor
    }

    async authorizeUser(username: string, password: string): Promise<{ isAuth: boolean , token: object , userData: object}> {
        try {
            const user = await this.userRepository.getUser({userName:username})
            if(!user){
                throw new InvalidCredentialsError('invalid credentials')
            }
            if(user.isBlocked){
                throw new IsBlockedError('user is blocked')
            }

            const checkPassword = await this.bcryptInteractor.checkPassword(password,user.password)
            if(!checkPassword){
                throw new InvalidCredentialsError('invalid credentials')
            }
            const token = this.userTokenInteractor.generateUserToken({username:user.userName})
            const userData = {
                userName:user.userName,
                email:user.email,
                fullName:user.fullName
            }
            return {isAuth:true,token,userData}
        } catch (error) {
            throw error
        }
    }

    async userSignup(userData: { email: string; userName: string; password: string; fullName: string; }): Promise<{ created: boolean; }> {
        try {
            const userExist = await this.userRepository.checkUserExists(userData)
            if(userExist.exists && userExist.fields){
                throw new UserExistError("user exists",userExist.fields)
            }
            const user = await this.userRepository.createUser(userData)
            return {created:true}
        } catch (error) {
            console.log(error)
            throw error
        }

    }


    tokenRefresh(header: string) {
        return this.userTokenInteractor.userTokenRefresh(header)
    }


}



export const userAuthInteractor = new UserAuthInteractor(userTokenInteractor,userRepository,bcryptInteractor)