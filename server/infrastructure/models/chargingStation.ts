import {Document,Model,InferSchemaType,model,Schema} from "mongoose";


const stationSchema = new Schema({
    stationName:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    location:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        },
    },
    chargers:[{
        type:Schema.Types.ObjectId,
        ref:'charger'
    }],
    status:{
        type:String,
        enum:['availabe','not availabe','draft'],
        required:true
    },
    images:[
        {
            type:String,
        }
    ]

},{
    timestamps:true
})


stationSchema.index({location:'2dsphere'})






export type StationSchemaType = InferSchemaType<typeof stationSchema>;

export type StationModelType  =  Model<StationSchemaType & Document>;

const StationModel : StationModelType = model<StationSchemaType & Document>('chargingstation',stationSchema)


export default StationModel