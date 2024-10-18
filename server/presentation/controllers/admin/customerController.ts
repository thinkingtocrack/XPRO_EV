import { Response,Request } from "express"
import { IAdminCustomerInteractor } from '../../../application/interface/admin/adminInteractorInterface'
import { adminCustomerInteractor } from '../../../application/usecase/admin/adminCustomerInteractor'





export class AdminCustomerController{
    private adminCustomerInteractor:IAdminCustomerInteractor

    constructor(adminCustomerInteractor:IAdminCustomerInteractor){
        this.adminCustomerInteractor=adminCustomerInteractor
    }

    getCustomers=async(req:Request,res:Response)=>{
        try {
            const page = Number(req.query.page ? req.query.page :1)
            const userData = await this.adminCustomerInteractor.getCustomers(page)
            res.status(200).json({...userData})
        } catch (error) {
            console.log(error)
            res.status(500).json({error:"server error"})
        }
    }

    blockCustomer=async(req:Request,res:Response)=>{
        try {
            const userId = req.body.id
            const block = req.body.block
            const isBlocked = await this.adminCustomerInteractor.blockCustomer(userId,block)
            res.status(200).json(isBlocked)
        } catch (error) {
            res.status(200).json({error:'user not found'})
            console.log(error)
        }
    }

}

export const adminCustomerController= new AdminCustomerController(adminCustomerInteractor)
