import { UserNotExist } from "../../../application/usecase/errors/authErrors";
import { IAdminRepository } from "../../../domain/repositories/admin/adminRepositoryInterface"
import { AdminModelType, AdminSchemaType } from "../../models/admin";
import adminModel from "../../models/admin";



export class AdminRepository implements IAdminRepository{
    private adminModel:AdminModelType

    constructor(adminModel:AdminModelType){
        this.adminModel=adminModel
    }

    async getUser(schema:object): Promise<AdminSchemaType | null>{
        try {
            const user = await this.adminModel.findOne(schema)
            return user 
        } catch (error) {
            console.log(error)
            throw error
        }
    }


    async isBlocked(email:string):Promise<boolean>{
      try {
        const user = await this.adminModel.findOne({email:email})
        if(user){
          if(user.isBlocked){
            return false
          }else{
            return true
          }
        }else{
          throw new UserNotExist('user not exist',['id'])
        }
      } catch (error) {
        throw error
      }
    }


    async checkUserExists(data:{email:string}):Promise<{exists:boolean,fields?:string[]}> {
        try {
          const user = await this.adminModel.findOne({
            $or: [
              { email: data.email }
            ]
          });

          if (user) {
            if (user.email === data.email) {
              return { exists: true, fields: ['email'], };
            } else{
                return { exists: false };
            }
          }
          return { exists: false };
        } catch (err) {
          throw err;
        }
    }
      
    
}

export const adminRepository = new AdminRepository(adminModel)