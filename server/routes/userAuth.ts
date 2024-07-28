import { Router } from "express";
const router=Router()
import userAuthController from '../controller/auth/userAuth'
import { signupValidator } from "../middleware/validation/userValidation";
import { isAuthenticated } from "../middleware/auth/userAuthMiddleware";
import { revokeUserId, unRevokeUserId } from "../model/reddis";
import userModel from '../model/users'
 

router.post('/login',userAuthController.loginAuth)
router.post('/signup',signupValidator,userAuthController.signup)


router.get('/check',isAuthenticated)

router.get('/blocked',async(req,res)=>{
    try {
        const user = await userModel.findById('66a4bd3ad1a0a0c900f5d574')
        if(user){
            user.isBlocked=true
            await user.save()
            await revokeUserId('66a4bd3ad1a0a0c900f5d574')
            res.send('shaneshaji blocked')
        }
    } catch (error) {
        
    }
})

router.get('/unblocked',async(req,res)=>{
    try {
        const user = await userModel.findById('66a4bd3ad1a0a0c900f5d574')
        user.isBlocked=false
        await user.save()
        await unRevokeUserId('66a4bd3ad1a0a0c900f5d574')
        res.send('shaneshaji blocked')
    } catch (error) {
        
    }
})

router.post('/user/refreshToken',userAuthController.tokenRefresh)

export default router