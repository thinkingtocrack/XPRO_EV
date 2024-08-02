import { UserSchemaType } from "../../../infrastructure/models/users"
import { UserSignupData } from "./InteractorInterface"


export interface IUserRepository{
    getUser(data:object):Promise<UserSchemaType | null>
    createUser(data:UserSignupData):Promise<UserSchemaType | undefined>
    checkUserExists(data:{email:string,userName:string}):Promise<{exists:boolean,fields?:string[]}>
}