import { AdminSchemaType } from "../../../infrastructure/models/admin"


export interface IAdminRepository {
    getUser(data:object):Promise<AdminSchemaType | null>
    checkUserExists(data:{email:string}):Promise<{exists:boolean,fields?:string[]}>
    isBlocked(email:string):Promise<boolean>
}