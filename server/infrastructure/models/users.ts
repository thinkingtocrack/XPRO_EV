import mongoose,{Document,Model,InferSchemaType} from "mongoose";
const Schema=mongoose.Schema


const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    }
},{
    timestamps:true
})


export type UserSchemaType = InferSchemaType<typeof userSchema>;

export type UserModelType  =  Model<UserSchemaType & Document>;

const UserModel: Model<UserSchemaType & Document> = mongoose.model<UserSchemaType & Document>('User', userSchema);

export default UserModel