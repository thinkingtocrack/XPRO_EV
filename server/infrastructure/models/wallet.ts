import mongoose,{Document,Model,InferSchemaType,Schema} from "mongoose";
import UserModel from "./users";




const walletScehma = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required:true,
        unique:true
    },
    history:[
        {
            type:{
                type:String,
                enum:['credit','debit'],
                required:true
            },
            for:{
                type:String,
                enum:['wallet','subscription','booking'],
            },
            amount:{
                type:Number,
                required:true
            }
        }
    ],
}, { timestamps: true })


walletScehma.pre('save',async function (next){
    try {
        if(this.isModified('history')){
            const userBalance = await UserModel.findById(this.userId).select('wallet')
            if(userBalance){
                if(this.history[this.history.length-1].type === 'debit') {
                    userBalance.wallet  -= this.history[this.history.length-1].amount
                }else if(this.history[this.history.length-1].type === 'credit') {
                    userBalance.wallet += this.history[this.history.length-1].amount
                }
                if(userBalance.wallet < 0){
                    next(new Error('Insufficient balance'))  
                } else{
                    await userBalance.save()
                }
            }
        }
        next()
    } catch (error) {
        throw error
    }
})


export type WalletSchemaType = InferSchemaType<typeof walletScehma>

export type WalletModelType = Model<WalletSchemaType & Document>

const WalletModel:WalletModelType = mongoose.model<WalletSchemaType & Document>('wallet',walletScehma)


export default WalletModel