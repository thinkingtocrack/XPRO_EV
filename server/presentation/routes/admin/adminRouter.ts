import {Router} from "express"
import customerRouter from './customerRouter'
import chargerRouter from './chargerRouter'



const router = Router()

router.use('/customer',customerRouter)
router.use('/charger',chargerRouter)


export default router

