import {Document,Model,InferSchemaType,model,Schema} from "mongoose";




const chargingSessionSchema = new Schema({
    startTime:{type:Date,required:true},
    endTime:{type:Date,required:true},
    energyConsumed:{type:Number,required:true},
    cost:{type:Number,required:true},
    userId:{
        type: Schema.Types.ObjectId,
        require: true,
        ref:'User'
    },
},{
    timestamps:true
})




export type ChargingSessionSchemaType = InferSchemaType<typeof chargingSessionSchema>;

export type ChargingSessionModelType  =  Model<ChargingSessionSchemaType & Document>;

const ChargingSessionModel : ChargingSessionModelType = model<ChargingSessionSchemaType & Document>('chargingSession',chargingSessionSchema)


export default ChargingSessionModel