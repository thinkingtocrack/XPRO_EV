import { Router } from "express";
import { userAuthController } from "../../../controllers/auth/userAuthController";
import userValidator from "../../../../middleware/validation/userValidation";

const router = Router()


router.post('/login',userValidator.loginValidator,userAuthController.onLogin)
router.post('/signup',userValidator.signupValidator,userAuthController.onSignup)

export default router