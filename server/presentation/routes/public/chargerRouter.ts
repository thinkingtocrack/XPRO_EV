import { Router } from "express";
import { publicChargerController } from "../../controllers/public/publicChargerController";

const publicChargerRouter = Router()

publicChargerRouter.get('/within',publicChargerController.getStations)
publicChargerRouter.get('/nearby',publicChargerController.getNearByStations)


export default publicChargerRouter