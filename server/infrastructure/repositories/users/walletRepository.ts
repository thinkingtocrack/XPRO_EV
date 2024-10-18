import { PaymentSchemaType } from "../../models/payment";
import { WalletModelType,WalletSchemaType } from "../../models/wallet";
import walletModel from "../../models/wallet";







export class WalletRepository{
    private walletModel:WalletModelType

    constructor(walletModel:WalletModelType) {
        this.walletModel = walletModel
    }

    async getWalletAmount(userId:string): Promise<WalletSchemaType | null> {
        try {
            const wallet = await this.walletModel.findOne({userId}).select('balance')
            return wallet
        } catch (error) {
            throw error
        }
    }

    async updateWalletHistory(userId:string,historyDetails:{type:string,amount:number,for:string}): Promise<WalletSchemaType | null>{
        try {
            const wallet = await this.walletModel.findOne({userId})
            if(wallet){
                wallet.history.push(historyDetails)
                await wallet.save()
            }else{
                const wallet = await this.walletModel.create({userId,historyDetails})
                return wallet
            }
            return wallet
        } catch (error) {
            throw error
        }
    }
}

const walletRepository = new WalletRepository(walletModel)

export default walletRepository