import { Router } from "express";
import userVehicleController from "../../controllers/user/vehicleController";




const VehicleRouter = Router()

VehicleRouter.get('/getvehicles',userVehicleController.onGetVehiclesId)
VehicleRouter.get('/getvehicle',userVehicleController.onGetVehicle)
VehicleRouter.post('/new',userVehicleController.onAddVehicles)



export default VehicleRouter