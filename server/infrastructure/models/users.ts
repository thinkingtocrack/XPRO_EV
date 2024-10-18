import { populate } from "dotenv";
import mongoose,{Document,Model,InferSchemaType} from "mongoose";
import { UserOTPSchemaType } from "./userOTP";
const Schema=mongoose.Schema


const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
        minLength:[1,'few letters for fullname'],
        lowercase:true
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
        unique:true,
        lowercase:true,
        minLength:[5,'required min 5 letters']
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:true
    },
    vehicles:[
        {
            type:Schema.Types.ObjectId,
            ref:'vehicle'
        }
    ],
    otp:{
        forgotpassword:{
            type:Schema.Types.ObjectId,ref:'Userotp'
        }
    },
    wallet: {
        type: Number,
        default: 0,
        min:0
    },
    phoneNumber:{
        countryCode:{
            type:String,
        },
        number:  {
            type:String
        },
    },
    country:{
        type:String
    }
},{
    timestamps:true
})


export type UserSchemaType = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId }

export type UserModelType  =  Model<UserSchemaType & Document>;

const UserModel: Model<UserSchemaType & Document> = mongoose.model<UserSchemaType & Document>('User', userSchema);

export default UserModel

