import { Router } from "express";
import { userAuthController } from "../../../controllers/auth/userAuthController";
import userValidator from "../../../../infrastructure/middleware/validation/userValidation";

const router = Router()



router.post('/login',userValidator.loginValidator,userAuthController.onLogin)
router.post('/signup',userValidator.signupValidator,userAuthController.onSignup)

//verification
router.post('/verification/sendotp',userAuthController.onVerificationSendOtp)
//

//fotgotpassword
router.post('/forgotpassword',userAuthController.onForgotPassword)
router.patch('/forgotpassword/verify',userAuthController.onForgotPasswordVerify)
//

//JWT token
router.post('/token/accesstoken/reissue',userAuthController.onAccessTokenReissue)
//




export default router