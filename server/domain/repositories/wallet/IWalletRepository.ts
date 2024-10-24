import { WalletSchemaType } from "../../../infrastructure/models/wallet"


export default interface IWalletRepository{
    getWalletAmount(userId:string): Promise<WalletSchemaType | null>
    updateWalletHistory(userId:string,historyDetails:{type:string,amount:number,for:string}): Promise<WalletSchemaType | null>
}