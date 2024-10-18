import Razorpay from "razorpay"
import walletRepository from "../../../infrastructure/repositories/users/walletRepository"
import { createHmac } from "crypto"
import { userRepository } from "../../../infrastructure/repositories/users/userRepository"
import paymentRepository from "../../../infrastructure/repositories/users/paymentRepository"


export class UserPaymentIntractor{
    private razorpayInstance
    private walletRepositery
    private userRepository
    private paymentRepository

    constructor(walletRepository,userRepository,paymentRepository) {
        this.razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string,
        })
        this.walletRepositery = walletRepository
        this.userRepository = userRepository
        this.paymentRepository = paymentRepository
    }

    async getWallet(userId){
        try {
            const userWallet = await this.userRepository.getWalletAmount(userId)
            return {status:true,balance:userWallet.wallet}
        } catch (error) {
            throw error
        }
    }

    async newOrder(userId,paymentMethod,amount) {
        try {
            const newPayment = await this.paymentRepository.createPayment(userId,amount,'pending')
            const options = {
                amount: Number(Number(amount) * 100), // amount in the smallest currency unit
                currency: "INR",
                receipt: newPayment._id,
            }
            const order = await this.razorpayInstance.orders.create(options)
            await this.paymentRepository.updatePaymentId(newPayment._id,order.id)
            return {status:true,order,message:'order created successfully'}
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async verifyOrder(userId, orderId, paymentId, signature){
        try {
            const sign = orderId + "|" + paymentId;
            const expectedSign = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string).update(sign.toString()).digest("hex")
            const isAuthentic = expectedSign === signature as string
            if(isAuthentic===true){
                const payment = await this.paymentRepository.updatePaymentStatus(orderId,'success')
                if(payment){
                    const newWalletHistory = {
                        amount:payment.amount,
                        for:'wallet',
                        type:'credit'
                    }
                    const userWallet = await this.walletRepositery.updateWalletHistory(userId,newWalletHistory)
                    return {status:true,message:'payment validation successfull'}
                }else{
                    return {status:false,message:'payment validation failed'}
                }
            }else{
                   return {status:false,message:'payment failed'}
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async addUserSubscription(userId:string):Promise<{status:boolean,message:string,data:{issubscribed:boolean,isBalance:boolean}}>{
        try {
            const wallet = this.walletRepositery.updateWalletHistory(userId,{type:'debit',for:"subscription",amount:100})
            if(wallet){
                const subscription = await this.userRepository.addUserSubscription(userId)
                return {status:true,message:'subscription added successfully',data:{issubscribed:true,isBalance:true}}
            }else{
                return {status:true,message:'insufficient balance',data:{issubscribed:false,isBalance:false}}
            }
        } catch (error) {
            console.log(error)
            if(error instanceof Error && error.message==='insufficient balance'){
                return {status:true,message:'insufficient balance',data:{issubscribed:false,isBalance:false}}
            }else{
                throw error
            }
        }
    }

}

const userPaymentIntractor = new UserPaymentIntractor(walletRepository,userRepository,paymentRepository)

export default userPaymentIntractor