import { Router } from "express";
import userAccountController from "../../controllers/user/accountController";


const userAccountRouter = Router();



userAccountRouter.get('/details',userAccountController.onUserDetails)
userAccountRouter.patch('/update',userAccountController.onUserDetailsUpdate)


//subscription
userAccountRouter.post('/subscription/add',userAccountController.onUserSubscriptionAdd)
userAccountRouter.get('/subscription/status',userAccountController.onUserSubscriptionStatus)
//



export default userAccountRouter