import { UserSignupData } from "../../../application/interface/user/InteractorInterface"
import { IUserRepository, UserNameNotExist } from "../../../domain/repositories/user/userRepositoryInterface";
import UserOTPMOdel, { UserOTPModelType, UserOTPSchemaType } from "../../models/userOTP";
import { UserModelType, UserSchemaType } from "../../models/users";
import UserModel from "../../models/users";
import { UserNotExist } from "../../../application/usecase/errors/authErrors";
import VehicleModel, { VehicleModelType } from "../../models/vehicles";
import UserSubscriptionModel, { UserSubscriptionModelType, UserSubscriptionSchemaType } from "../../models/subscription";




export class UserRepository implements IUserRepository{
    private userModel:UserModelType
    private userOTPModel:UserOTPModelType
    private vehicleModel:VehicleModelType
    private userSubscriptionModel:UserSubscriptionModelType

    constructor(userModel:UserModelType,userOTPModel:UserOTPModelType,vehicleModel:VehicleModelType,userSubscriptionModel:UserSubscriptionModelType){
        this.userModel=userModel
        this.userOTPModel=userOTPModel
        this.vehicleModel=vehicleModel
        this.userSubscriptionModel=userSubscriptionModel
    }


    async getUserById(userId:string,properties:string):Promise<UserSchemaType>{
      try {
        const userDetails = await this.userModel.findById(userId).select(properties)
        if(!userDetails) throw new UserNotExist('user does not exist',['_id'])
        return userDetails
      } catch (error) {
        throw error
      }
    }

    async getUser(schema:object): Promise<UserSchemaType>{
        try {
            const user = await this.userModel.findOne(schema)
            if(!user){
              throw new UserNameNotExist('user does not exist')
            }else{
              return user
            }
        } catch (error) {
            throw error
        }
    }

    async getAllUsers(page:number): Promise<{users:UserSchemaType[] | null,count:number}>{
      try {
        const users = await this.userModel.find({}).limit(10).skip((page-1)*10).select('fullName email userName isBlocked')
        const count = await this.userModel.countDocuments({})
        return {users,count}
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    async createUser(data: UserSignupData): Promise<UserSchemaType | undefined> {
        try {
            const user = await this.userModel.create(data)
            return user
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async checkUserExists(data:{email?:string,userName?:string}):Promise<{exists:boolean,fields?:string[]}> {
        try {
          if(!data.email && !data.userName){
            return { exists: false };
          }
          const user = await this.userModel.findOne({
            $or: [
              { userName: data.userName },
              { email: data.email }
            ]
          });

          if (user) {
            if (user.userName === data.userName && user.email === data.email) {
              return { exists: true, fields: ['username', 'email'], };
            } else if (user.userName === data.userName) {
             return { exists: true, fields: ['username'],};
            } else {
              return { exists: true, fields: ['email'], };
            }
          }
          return { exists: false };
        } catch (err) {
          throw err;
        }
    }

    async blockUser(id:string,block:boolean):Promise<boolean>{
      try {
        const user = await this.userModel.findById(id)
        if(user){
          user.isBlocked=block
          const modifiedUser = await user.save()
          return block===modifiedUser.isBlocked?true:false
        }else{
          throw new Error('user not found')
        }
      } catch (error) {
        throw error
      }
    }

    async isBlocked(id:string):Promise<boolean>{
      try {
        const user = await this.userModel.findById(id)
        if(user){
          if(user.isBlocked){
            return true
          }else{
            return false
          }
        }else{
          throw new UserNotExist('user do not exist',['id'])
        }
      } catch (error) {
        throw error
      }
    }

    async updateUserById(
      id:string,data:{fullName?:string,phoneNumber?:string,country?:string,countryCode?:'string'}
    ):Promise<UserSchemaType>{
      try {
        const updateProperties={
          fullName:'fullName',
          phoneNumber:'phoneNumber.number',
          country:'country',
          countryCode:'phoneNumber.countryCode'
        }
        const updateDetails = Object.keys(data).reduce((acc,key)=>{
          if(data[key]){
            acc[updateProperties[key]]=data[key]
          }
          return acc
        },{})
        const updatedUser = await this.userModel.findByIdAndUpdate(id,updateDetails,{new:true}).select('-_id fullName email phoneNumber country countryCode')
        if(!updatedUser){
          throw new UserNotExist('user does not exist',['_id'])
        }
        return updatedUser
      } catch (error) {
        throw error
      }
    }

  

//OTP generation


   async generateForgotpasswordOtp(email: string): Promise<{created:boolean,otp?:UserOTPSchemaType,user?:UserSchemaType}> {
      try {
        const checkOtp = await this.userOTPModel.where('email').equals(email).where('type').equals('fotgotpassword').where('createdAt').gt(new Date(Date.now() - 5 * 60 * 1000)).sort({createdAt:-1})
        if(checkOtp.length>=1){
          if(checkOtp.length>3 || Date.now() - checkOtp[0].createdAt.getTime() < 120*1000){
            return {created:false}
          }
        }
        const generatedOTP = await this.genereateOtp(email,'forgotpassword')
        return {created:true,otp:generatedOTP}
      } catch (error) {
        throw error
      }
    }

    async generateVerificationOtp(email: string): Promise<{created:boolean,otp?:UserOTPSchemaType}> {
      try {
          const checkOtp = await this.userOTPModel.where('email').equals(email).where('type').equals('verification').where('createdAt').gt(new Date(Date.now() - 6 * 60 * 1000).getTime()).sort({createdAt:-1})
          if(checkOtp.length>=1){
            if(checkOtp.length>3 || Date.now() - checkOtp[0].createdAt.getTime() < 120*1000){
              return {created:false}
            }
          }
          const generatedOTP = await this.genereateOtp(email,'verification')
          return {created:true,otp:generatedOTP}
      } catch (error) {
        throw error
      }
    }


  async genereateOtp(email:string,type:string): Promise<UserOTPSchemaType > {
    try {
      const generatedOTP = `${Math.floor(Math.random()*9000 + 1000)}`
      const otpData={
        email:email,
        otp:generatedOTP,
        type:type
      }
      const OTP = await this.userOTPModel.create(otpData)
      return OTP
    } catch (error) {
      throw error
    }
  }

  async verifyOtp(otp: string, email: string,type:string): Promise<boolean> {
    try {
      const checkOtp = await this.userOTPModel.where('email').equals(email).where('type').equals(type).where('createdAt').gt(new Date(Date.now() - 5 * 60 * 1000)).where('otp').equals(otp)
      console.log(checkOtp)
      if(checkOtp.length===1){
        await this.userOTPModel.findByIdAndDelete(checkOtp[0]._id)
        return true
      }else{
        return false
      }
    } catch (error) {
      throw error
    }
  }

//*OTP generation

    async changePassword(email: string, password: string): Promise<boolean> {
      try {
        const user = await this.userModel.findOne({email:email})
        if(!user){
          return false
        }else{
          user.password=password
          user.save()
          return true
        }
      } catch (error) {
        throw error
      }
    }
    
    //Vehicle
    
    async addVehicle(accessCode,userId,vehicleIds){
      try {
        const data = {
          accessToken:accessCode.accessToken,
          refreshToken:accessCode.refreshToken,
          vehicleIds:vehicleIds
        }
        const vehicle = await this.vehicleModel.create(data)
        await this.userModel.findByIdAndUpdate(userId,{
          $addToSet:{vehicles:vehicle._id}
        })
      } catch (error) {
        throw error
      }
    }

    async getVehiclesId(userId){
      try {
        const vehicleDetails = await this.userModel.findById(userId).select('-_id vehicles').populate({path:'vehicles',select:'_id vehicleIds'})
        return vehicleDetails
      } catch (error) {
        throw error
      }
    }

    async getVehicleById(_id,vehicleId){
      try {
        const vehicle = await this.vehicleModel.findById(_id)
        return vehicle
      } catch (error) {
        
      }
    }

    async updateVehicleById(vehicleId,newAccess){
      try {
        const vehicle = await this.vehicleModel.findByIdAndUpdate(vehicleId,{
          accessToken:newAccess.accessToken,
          refreshToken:newAccess.refreshToken
        })
      } catch (error) {
       throw error 
      }
    }
    
    
    //

    //wallet
    async getWalletAmount(userId){
      try {
        const amount = await this.userModel.findById(userId).select('-_id wallet')
        return amount
      } catch (error) {
        
      }
    }
    //


    //subscription
    async getSubscriptionStatus(userId: string): Promise<{ subscriptionStatus: boolean; }> {
      try {
        const subscription = await this.userSubscriptionModel.findOne({ userId: userId })
        if (subscription) {
          if(subscription.expireDate > new Date()){
            return { subscriptionStatus: true }
          }else{
            return { subscriptionStatus: false}
          }
        }else{
          return { subscriptionStatus: false}
        }
      } catch (error) {
        throw error
      }
    }


    async addUserSubscription(userId:string):Promise<UserSubscriptionSchemaType>{
      try {
        const subscription = await this.userSubscriptionModel.create({userId:userId,expireDate:new Date(Date.now()+30*24*60*60*1000)})
        return subscription
      } catch (error) {
        throw error
      }
    }
    //


}


export const userRepository = new UserRepository(UserModel,UserOTPMOdel,VehicleModel,UserSubscriptionModel)