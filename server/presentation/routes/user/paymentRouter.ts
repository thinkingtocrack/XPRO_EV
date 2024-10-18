import { Router } from "express";
import userPaymentController from "../../controllers/user/paymentController";


const paymentRouter = Router()

paymentRouter.get('/balance',userPaymentController.onGetWallet)
paymentRouter.post('/order',userPaymentController.onNewOrder)
paymentRouter.post('/verify',userPaymentController.onOrderVerify)



export default paymentRouter