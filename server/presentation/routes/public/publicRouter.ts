import { Router } from "express";
import publicChargerRouter from "./chargerRouter";

const publicRouter = Router()

publicRouter.use('/charger',publicChargerRouter)


export default publicRouter