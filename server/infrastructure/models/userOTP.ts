import mongoose,{Document,Model,InferSchemaType} from "mongoose";
const Schema=mongoose.Schema



const UserOTPSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    type:{
        type:String,
        enum:['verification','forgotpassword'],
        required:true,
    },
    otp:{
        type:String,
        required:true,
        minLength:[4],
        maxLength:[4]
    },
    createdAt:{
        type:Date,
        expires:'60m',
        default:Date.now
    }
})

export type UserOTPSchemaType = InferSchemaType<typeof UserOTPSchema> & { _id: mongoose.Types.ObjectId }

export type UserOTPModelType = Model<UserOTPSchemaType & Document>

const UserOTPMOdel:Model<UserOTPSchemaType & Document> = mongoose.model<UserOTPSchemaType & Document>('Userotp',UserOTPSchema)

export default UserOTPMOdel


