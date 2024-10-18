import { IUserRepository } from "../../../domain/repositories/user/userRepositoryInterface";
import { IUserAccountInteractor } from "../../interface/user/InteractorInterface";
import { userRepository } from "../../../infrastructure/repositories/users/userRepository";
import { UserSchemaType } from "../../../infrastructure/models/users";




export class UserAccountIntractor implements IUserAccountInteractor{
    private userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.userRepository = userRepository
    }

    async getUserDetails(userId: string,userProperties:string[]): Promise<{data:UserSchemaType,status:boolean,message:string}> {
        try {
            const permittedUserProperties = ['wallet', 'userName' ,'email' ,'fullName','country','phoneNumber']
            const filteredUserProperties = userProperties.filter(property => permittedUserProperties.includes(property));
            const userDetails = await this.userRepository.getUserById(userId, filteredUserProperties.join(' '))
            return {
                status:true,
                data:userDetails,
                message:'User details fetched successfully'
            }
        } catch (error) {
            throw error
        }
    }

    async updateUserDetails(
        interactorData: { userId: string, editData: {fullName?:string,phoneNumber?:string,country?:string,countryCode?:'string'}}
    ): Promise<{data:UserSchemaType,status:boolean,message:string}>{
        try {
            const permitedUserEdit:string[] = ['fullName','phoneNumber','country','countryCode']
            const editData = Object.entries(interactorData.editData).reduce((acc,[key,value])=>{
                   if(permitedUserEdit.includes(key)){
                    acc[key] = value
                   }
                   return acc
            },{} as {firstName?:string,lastName?:string,phoneNumber?:string})
            const editedUserData = await this.userRepository.updateUserById(interactorData.userId,editData)
            return {data:editedUserData,status:true,message:'User details updated successfully'}
        } catch (error) {
            throw error
        }
    }

    async getUserSubscriptionStatus(userId: string): Promise<{ status: boolean; message: string; data: { isSubscribed: boolean; }; }> {
        try {
            const subscription = await this.userRepository.getSubscriptionStatus(userId)
            return {status:true,message:'Subscription status fetched successfully',data:{isSubscribed:subscription.subscriptionStatus}}
        } catch (error) {
            throw error
        }
    }
    
}

const userAccountInteractor = new UserAccountIntractor(userRepository)

export default userAccountInteractor