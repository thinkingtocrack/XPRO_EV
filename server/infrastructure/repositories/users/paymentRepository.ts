import PaymentModel, { PaymentModelType } from "../../models/payment";




class PaymentRepository {
    private paymentModel: PaymentModelType

    constructor(paymentModel:PaymentModelType){
        this.paymentModel = paymentModel
    }

    async createPayment(userId: string,amount:number,status:string): Promise<WalletSchemaType> {
        try {
            const newPayment = await this.paymentModel.create({ userId,amount:Number(amount),status })
            return newPayment
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
    async updatePaymentId(_id:string,paymentId:string): Promise<WalletSchemaType | null>{
        try {
            const payment = await this.paymentModel.findByIdAndUpdate(_id, { paymentId }, { new: true })
        } catch (error) {
            throw error
        }
    }

    async updatePaymentStatus(paymentId: string,status:string): Promise<WalletSchemaType | null>{
        try {
            const payment = await this.paymentModel.findOneAndUpdate({paymentId}, { status }, { new: true })
            return payment
        } catch (error) {
            throw error
        }
    }
}


const paymentRepository = new PaymentRepository(PaymentModel)

export default paymentRepository