import { Router } from "express";

import chargerRouter from './chargerRouter'
import VehicleRouter from "./vechicleRouter";
import { authMiddleware } from "../../../infrastructure/middleware/auth/authMiddleware";
import paymentRouter from "./paymentRouter";
import userAccountRouter from "./accountRouter";
import bookingRouter from "./bookingRouter";



const router = Router()

router.use([authMiddleware.isAuthorizationHeaderSent,authMiddleware.userAuthCheck])

router.use('/booking',bookingRouter)
router.use('/charger',chargerRouter)
router.use('/account',userAccountRouter)
router.use('/vehicle',VehicleRouter)
router.use('/wallet',paymentRouter)


export default router

