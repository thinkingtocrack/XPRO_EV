import { IAdminCustomerInteractor } from '../../../application/interface/admin/adminInteractorInterface'
import { IAdminRepository } from "../../../domain/repositories/admin/adminRepositoryInterface"
import { IUserRepository } from '../../../domain/repositories/user/userRepositoryInterface'
import { UserSchemaType } from "../../../infrastructure/models/users";
import { adminRepository } from "../../../infrastructure/repositories/admin/adminRepository";
import { userRepository } from "../../../infrastructure/repositories/users/userRepository";





export class AdminCustomerInteractor implements IAdminCustomerInteractor{
    private userRepository:IUserRepository
    private adminRepository:IAdminRepository

    constructor(userRepository:IUserRepository,adminRepository:IAdminRepository){
        this.adminRepository=adminRepository
        this.userRepository=userRepository
    }

    async getCustomers(page:number): Promise<{users:UserSchemaType[] | null,count:number}> {
        try {
            const userData = await this.userRepository.getAllUsers(page)
            return userData
        } catch (error) {
            throw error
        }
    }

    async blockCustomer(id: string,block:boolean): Promise<boolean> {
        try {
            const status = await this.userRepository.blockUser(id,block)
            return status
        } catch (error) {
            throw error
        }
    }
}

export const adminCustomerInteractor =new AdminCustomerInteractor(userRepository,adminRepository)