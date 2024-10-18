import { time } from "console";
import {Schema,Model,model,Document,InferSchemaType} from "mongoose";


const PaymentSchema = new Schema({
    paymentId:{
        type: String,
    },
    userId:{
        type: Schema.Types.ObjectId,
        require: true,
        ref:'User'
    },
    amount: {
        type: Number,
        required: true,
        min: 50
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
        required: true
    },
},{timestamps:true});


export type PaymentSchemaType = InferSchemaType<typeof PaymentSchema>
export type PaymentModelType = Model<PaymentSchemaType & Document>

const PaymentModel:Model<PaymentSchemaType & Document>  = model<PaymentSchemaType & Document>('Payment',PaymentSchema)

export default PaymentModel