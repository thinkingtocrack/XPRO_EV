import { timeStamp } from "console";
import mongoose from "mongoose";
import { string } from "zod";
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


export default mongoose.model('user',userSchema)