import {Document,Model,InferSchemaType,model,Schema} from "mongoose";
import { string } from "zod";


const adminSchema = new Schema({
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
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    },
    role:{
        type:String,
        enum:['admin','super_admin','technician'],
        default:'admin'
    }
},{
    timestamps:true
})


export type AdminSchemaType = InferSchemaType<typeof adminSchema>;

export type AdminModelType  =  Model<AdminSchemaType & Document>;

const adminModel : AdminModelType = model<AdminSchemaType & Document>('Admin',adminSchema)


export default adminModel