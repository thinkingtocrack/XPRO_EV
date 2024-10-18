import {Router} from 'express'
import { adminCustomerController } from '../../controllers/admin/customerController'

const router = Router()


router.get('/getusers',adminCustomerController.getCustomers)
router.patch('/blockuser',adminCustomerController.blockCustomer)


export default router