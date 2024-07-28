import express,{Express,Request,Response} from "express"
import "dotenv/config"
import cors from "cors"
import mongoose from "mongoose"
import { rateLimit } from 'express-rate-limit'

import auth from './routes/userAuth'
import user from './routes/user'

const app = express()
app.use(cors())
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})
app.use(limiter)

mongoose.connect('mongodb://127.0.0.1:27017/xpro');


//reddis

import Redis from 'ioredis'
export const redis = new Redis(); // Default connection to localhost:6379
//

app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use('/auth/user',auth)
app.use('/user',user)

app.listen(process.env.port,()=>{
    console.log(`listening in port ${process.env.PORT}`)
})