import { UserSchemaType } from "../../../infrastructure/models/users";


export default function UserConfig(user:UserSchemaType){
    return {
        userId:user._id,
        role:'user',
    }
}