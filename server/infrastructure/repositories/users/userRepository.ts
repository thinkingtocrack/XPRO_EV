import { arrayOutputType } from "zod";
import { UserSignupData } from "../../../domain/entities/user/InteractorInterface";
import { IUserRepository } from "../../../domain/entities/user/repositoryInterface";
import { UserModelType, UserSchemaType } from "../../models/users";
import UserModel from "../../models/users";



export class UserRepository implements IUserRepository{
    private userModel:UserModelType

    constructor(userModel:UserModelType){
        this.userModel=userModel
    }

    async getUser(schema:object): Promise<UserSchemaType | null>{
        try {
            const user = await this.userModel.findOne(schema)
            return user 
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

    async checkUserExists(data:{email:string,userName:string}):Promise<{exists:boolean,fields?:string[]}> {
        try {
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
      
    
}

export const userRepository = new UserRepository(UserModel)