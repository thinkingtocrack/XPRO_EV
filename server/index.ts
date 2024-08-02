import express,{Express,Request,Response} from "express"
import "dotenv/config"
import cors from "cors"
import mongoose from "mongoose"
import { rateLimit } from 'express-rate-limit'
import routers from "./application/routes/routers"


const app = express()
app.use(cors())
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})
app.use(limiter)

mongoose.connect('mongodb://127.0.0.1:27017/xpro');


app.use(express.urlencoded({ extended: true ,limit:'10mb'}));
app.use(express.json({limit:'10mb'}))


app.use('/api/auth/user',routers.userAuthRouter)


app.listen(process.env.port,()=>{
    console.log(`listening in port ${process.env.PORT}`)
})