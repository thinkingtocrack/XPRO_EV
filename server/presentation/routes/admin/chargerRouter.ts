import { Router } from "express";
import { adminChargerController } from "../../controllers/admin/chargerController";

const router =Router()

router.get('/get-stations',adminChargerController.getStations)
router.post('/add-stations',adminChargerController.addStations)
router.delete('/delete-station',adminChargerController.deleteStations)

export default router