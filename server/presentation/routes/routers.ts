import userAuthRouter from './auth/user/userAuthRouter'
import adminAuthRouter from './auth/admin/adminAuthRouter'
import adminRouter from './admin/adminRouter'
import userRouter from './user/userRouter'
import { Router } from 'express'
import errorMiddleware from '../../infrastructure/middleware/error/errorMiddleware'
import publicRouter from './public/publicRouter'

const router=Router()


router.use('/api/public',publicRouter)
router.use('/api/auth/user',userAuthRouter)
router.use('/api/auth/admin',adminAuthRouter)
router.use('/api/admin',adminRouter)
router.use('/api/user',userRouter)
router.use(errorMiddleware)



export default router