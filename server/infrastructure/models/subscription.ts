import mongoose,{Model,Schema,model,Document,InferSchemaType } from "mongoose";


const SubscriptionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true,
    },
    expireDate: {
        type:Date,
        required:true
    },
},{timestamps:true})

export type UserSubscriptionSchemaType = InferSchemaType<typeof SubscriptionSchema> & { _id: mongoose.Types.ObjectId }

export type UserSubscriptionModelType = Model<UserSubscriptionSchemaType & Document>

const UserSubscriptionModel:Model<UserSubscriptionSchemaType & Document> = mongoose.model<UserSubscriptionSchemaType & Document>('subscription',SubscriptionSchema)

export default UserSubscriptionModel