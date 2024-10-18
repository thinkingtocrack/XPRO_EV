import {Router} from 'express'
import { adminAuthController } from '../../../controllers/auth/adminAuthController'
import adminValidation from '../../../../infrastructure/middleware/validation/adminValidation'



const router = Router()

//login
router.post('/login',adminValidation.loginValidator,adminAuthController.onLogin)
//

//coudnaryToken
router.get('/cloudinary/getsignature',adminAuthController.onGetcloudinarySignature)
//


//jwt
router.post('/token/accesstoken/reissue')


export default router