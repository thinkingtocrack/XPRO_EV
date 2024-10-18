import { adminRepository } from '../../../../infrastructure/repositories/admin/adminRepository'
import { IAdminAuthInteractor } from "../../../interface/admin/adminInteractorInterface"
import { IAdminRepository } from '../../../../domain/repositories/admin/adminRepositoryInterface'
import { IBcryptInteractor } from '../../../interface/services/security/bcryptInterface'
import { IUserTokenInteractor } from '../../../interface/services/security/usertokeninterface'
import { IsBlockedError,InvalidCredentialsError, TokenError } from "../../errors/authErrors"
import { bcryptInteractor } from "../../services/security/bcryptInteractor"
import { userTokenInteractor } from "../../services/security/userTokenInteractor"






export default class AdminAuthInteractor implements IAdminAuthInteractor{
    private adminTokenInteractor:IUserTokenInteractor
    private adminRepository:IAdminRepository
    private bcryptInteractor:IBcryptInteractor

    constructor(adminTokenInteractor:IUserTokenInteractor,adminRepository:IAdminRepository,bcryptInteractor:IBcryptInteractor){
        this.adminTokenInteractor=adminTokenInteractor
        this.adminRepository=adminRepository
        this.bcryptInteractor=bcryptInteractor
    }

    async authorizeUser(email: string, password: string): Promise<{ isAuth: boolean , accessToken:string,refreshToken:string , userData: object}> {
        try {
            const adminPassword = process.env.SUPER_ADMIN_PASSWORD as string
            const isValidPassword = await this.bcryptInteractor.checkPassword(password,adminPassword)
            if(email===process.env.SUPER_ADMIN_EMAIL && isValidPassword){
                const token = this.adminTokenInteractor.generateUserToken({email:email,role:'super_admin'})
                const userData = {
                    email:email,
                    fullName:'shane shaji',
                    role:'super_admin'
                }
                return {isAuth:true,...token,userData}
            }
            const user = await this.adminRepository.getUser({email:email})
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
            const token = this.adminTokenInteractor.generateUserToken({email:user.email,role:'admin'})
            const userData = {
                email:user.email,
                fullName:user.fullName,
                role:'admin'
            }
            return {isAuth:true,...token,userData}
        } catch (error) {
            throw error
        }
    }


    async reIssueAccessToken(refreshToken: string): Promise<string> {
        try {
            const decoded = await this.adminTokenInteractor.getDecodedToken(refreshToken,'refreshToken')
            if(decoded.isVerified && decoded?.decoded){
                const isBlocked = await this.adminRepository.isBlocked(decoded.decoded.email)
                if(isBlocked){
                    throw new IsBlockedError('user is blocked')
                }else{
                    const newAccessToken = this.adminTokenInteractor.generateAccessToken(decoded.decoded)
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

export const adminAuthInteractor = new AdminAuthInteractor(userTokenInteractor,adminRepository,bcryptInteractor)