import { IUserAuthInteractor } from '../../../interface/user/InteractorInterface'
import {IUserTokenInteractor} from '../../../interface/services/security/usertokeninterface'
import { IUserRepository, UserNameNotExist } from '../../../../domain/repositories/user/userRepositoryInterface'
import { IBcryptInteractor } from '../../../interface/services/security/bcryptInterface'
import { bcryptInteractor } from "../../services/security/bcryptInteractor";
import { userTokenInteractor } from "../../services/security/userTokenInteractor";
import { userRepository } from "../../../../infrastructure/repositories/users/userRepository";
import { IsBlockedError,InvalidCredentialsError,UserExistError, UserNotExist, TokenError } from "../../errors/authErrors";
import { IMailerSendInteractor } from '../../../interface/services/email/mailerSendInterface';
import mailerSendInteractor from '../../services/email/mailerSendInteractor';
import UserConfig from '../../../../domain/entities/roles/userConfig';




export class UserAuthInteractor implements IUserAuthInteractor{
    private userTokenInteractor:IUserTokenInteractor
    private userRepository:IUserRepository
    private bcryptInteractor:IBcryptInteractor
    private mailerSendInteractor:IMailerSendInteractor


    constructor(usertokenInteractor:IUserTokenInteractor,userRepository:IUserRepository,bcryptInteractor:IBcryptInteractor,mailerSendInteractor:IMailerSendInteractor){
        this.userTokenInteractor=usertokenInteractor
        this.userRepository=userRepository
        this.bcryptInteractor=bcryptInteractor
        this.mailerSendInteractor=mailerSendInteractor
    }

    async authorizeUser(username: string, password: string): Promise<{ isAuth: boolean , accessToken: string,refreshToken:string , userData: object}> {
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
            const JWTData = UserConfig(user)
            const token = this.userTokenInteractor.generateUserToken(JWTData)
            const userData = {
                userName:user.userName,
                email:user.email,
                fullName:user.fullName
            }
            return {isAuth:true,...token,userData}
        } catch (error) {
            if(error instanceof UserNameNotExist){
                throw new InvalidCredentialsError('invalid_credentials')
            }else{
                throw error
            }
        }
    }

    async userSignup(userData: { email: string; userName: string; password: string; fullName: string; otp:string }): Promise<{ created: boolean; }> {
        try {
            const isVerified = await this.userRepository.verifyOtp(userData.otp,userData.email,'verification')
            if(!isVerified){
                console.log(isVerified)
                return {created:false}
            }
            userData.password= await this.bcryptInteractor.createPassword(userData.password)
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


    async verificationOtpHandler(email: string,userName?:string): Promise<{status:boolean}> {
        try {
            const exists = await this.userRepository.checkUserExists({email:email,userName:userName})
            if(exists.exists){
                if(exists.fields){
                    throw new UserExistError('user exists',exists.fields)
                }
                throw new UserExistError('user exists',[''])
            }
            const otpData = await this.userRepository.generateVerificationOtp(email)
            if(otpData.created && otpData.otp){
                const isEmailGenerated = await this.mailerSendInteractor.generateVerificationOtpEmail(otpData.otp)
                if(isEmailGenerated){
                    return {status:true}
                }else{
                    throw new Error('email not sent')
                }
            }else{
                throw new Error('otp not genereated')
            }
        } catch (error) {
            throw error
        }
    }


    async forgotPassword(email: string): Promise<{status:boolean}> {
        try {
            const exists = await this.userRepository.checkUserExists({email:email})
            if(!exists.exists && !exists.fields){
                throw new UserNotExist('email does not exist',['email'])
            }
            const otpData = await this.userRepository.generateForgotpasswordOtp(email)
            if(otpData.created && otpData.otp){
                const isEmailGenerated = await this.mailerSendInteractor.generateForgotpasswordOtpEmail(otpData.otp)
                if(isEmailGenerated){
                    return {status:true}
                }else{
                    throw new Error('email not sent')
                }
            }else{
                throw new Error('otp not genereated')
            }
        }  catch (error) {
            throw error   
            }
        } 

    async forgotPasswordVerify(email: string, password: string, otp: string): Promise<boolean> {
        try {
            const isVerified = await this.userRepository.verifyOtp(otp,email,'forgotpassword')
            if(!isVerified){
                return false
            }
            const newPassword=await this.bcryptInteractor.createPassword(password)
            const isPasswordChanged = await this.userRepository.changePassword(email,newPassword)
            return isPasswordChanged
        } catch (error) {
            throw error
        }
    }

    async reIssueAccessToken(refreshToken: string): Promise<string> {
        try {
            const decoded = await this.userTokenInteractor.getDecodedToken(refreshToken,'refreshToken')
            if(decoded.isVerified && decoded?.decoded){
                const isBlocked = await this.userRepository.isBlocked(decoded.decoded.userId)
                if(isBlocked){
                    throw new IsBlockedError('user is blocked')
                }else{
                    const newAccessToken = this.userTokenInteractor.generateAccessToken({userId:decoded.decoded.userId,role:'user'})
                    return newAccessToken
                }
            }else{
                throw new TokenError('invalid token or token expired')
            }
        } catch (error) {
            throw error
        }
    }

}



export const userAuthInteractor = new UserAuthInteractor(userTokenInteractor,userRepository,bcryptInteractor,mailerSendInteractor)