import {Document,Model,InferSchemaType,model,Schema} from "mongoose";




const chargerSchema = new Schema({
    portType:{
        type:String,
        enum:['type-1','type-2','GB/T',"CHAdeMO",'CCS1',"CCS2"],
        required:true
    },
    category:{
        type:String,
        enum:['fastcharging','slowcharging','superfastcharging'],
        required:true
    },
    maxPower:{
        type:Number,
        min:1
    },
    station:{
        type:Schema.Types.ObjectId,
        ref:'chargingstation'
    },
    status:{
        type:String,
        enum:['online','offline','draft'],
        required:true
    },
    basePrice:{
        type:Number,
        required:true,
    },
    discountType:{
        type:String,
        enum:['percentage','amount']
    },
    discountRate:{
        type:Number,
    },
    taxType:{
        type:String,
        enum:['percentage','amount']
    },
    taxRate:{
        type:Number,
    },
    chargingStatus:{
        type:String,
        enum:['charging','notCharging'],
        default:'notCharging',
        required:true
    },
    currentSession:{
            startTime:{type:Date},
            endTime:{type:Date},
            userId:{
                type: Schema.Types.ObjectId,
                ref:'User'
            },
    }
},{
    timestamps:true
})




export type ChargerSchemaType = InferSchemaType<typeof chargerSchema>;

export type ChargerModelType  =  Model<ChargerSchemaType & Document>;

const ChargerModel : ChargerModelType = model<ChargerSchemaType & Document>('charger',chargerSchema)


export default ChargerModel