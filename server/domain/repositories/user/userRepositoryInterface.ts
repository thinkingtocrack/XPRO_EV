import { UserSchemaType } from "../../../infrastructure/models/users"
import { UserSignupData } from '../../../application/interface/user/InteractorInterface'
import { UserOTPSchemaType } from "../../../infrastructure/models/userOTP"
import { UserSubscriptionSchemaType } from "../../../infrastructure/models/subscription"


export interface IUserRepository{
    getUserById(id:string,properties?:string):Promise<UserSchemaType>
    getUser(data:object):Promise<UserSchemaType | null>
    createUser(data:UserSignupData):Promise<UserSchemaType | undefined>
    checkUserExists(data:{email?:string,userName?:string}):Promise<{exists:boolean,fields?:string[]}>
    getAllUsers(page:number):Promise<{users:UserSchemaType[] | null,count:number}>
    blockUser(id:string,block:boolean):Promise<boolean>
    isBlocked(id:string):Promise<boolean>
    updateUserById(id:string,data:{fullName?:string,phoneNumber?:string,country?:string,countryCode?:'string'}):Promise<UserSchemaType>

    generateVerificationOtp(email:string):Promise<{created:boolean,otp?:UserOTPSchemaType}>
    generateForgotpasswordOtp(id:string):Promise<{created:boolean,otp?:UserOTPSchemaType,user?:UserSchemaType}>
    verifyOtp(otp:string,email:string,type:string):Promise<boolean>
    genereateOtp(email:string,type:string):Promise<UserOTPSchemaType>

    changePassword(email:string,password:string):Promise<boolean>

    getSubscriptionStatus(userId:string):Promise<{subscriptionStatus:boolean}>
    addUserSubscription(userId:string):Promise<UserSubscriptionSchemaType>
}

export class UserNameNotExist extends Error{
    constructor(message:string){
        super(message)
        this.name='user_not_exist'
    }
}