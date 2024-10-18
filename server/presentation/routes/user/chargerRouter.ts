import {Router} from 'express'
import { userChargerController } from '../../controllers/user/chargerController'

const router= Router()


//directions
router.get('/directions',userChargerController.getRouteChargers)
//


//chargers
router.get('/within',userChargerController.getStationsDetails)
router.get('/nearby',userChargerController.getNearByStations)
//


//booking
router.post('/booking/new',userChargerController.onNewBooking)
//

//charging
router.post('/charging/start',userChargerController.onChargerStart)
router.post('/charging/stop',userChargerController.onChargerstop)
//

//sessions
router.get('/sessions',userChargerController.getUserSessions)
//




export default router