import { populate } from "dotenv";
import mongoose,{Document,Model,InferSchemaType} from "mongoose";
import { UserOTPSchemaType } from "./userOTP";
const Schema=mongoose.Schema


const vehicleSchema=new Schema({
    accessToken:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    },
    vehicleIds:[
        {type:String}
    ]
},{
    timestamps:true
})


export type VehicleSchemaType = InferSchemaType<typeof vehicleSchema> & { _id: mongoose.Types.ObjectId }

export type VehicleModelType  =  Model<VehicleSchemaType & Document>;

const VehicleModel: Model<VehicleSchemaType & Document> = mongoose.model<VehicleSchemaType & Document>('vehicle', vehicleSchema);

export default VehicleModel

