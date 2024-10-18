import { Router,urlencoded,json } from "express";
import cors from "cors"
import morgan from "morgan";
import { rateLimit  } from 'express-rate-limit'
import cookieParser from "cookie-parser"
import routers from "./presentation/routes/routers"
import session from 'express-session'

const configRouter = Router()

configRouter.use(cors({
	origin: process.env.CLIENT_BASE_URL,
	credentials: true
  }))
configRouter.use(morgan('tiny'))
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	limit: 100000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})
configRouter.use(limiter)


configRouter.use(cookieParser())
configRouter.use(urlencoded({ extended: true ,limit:'10mb'}));
configRouter.use(json({limit:'10mb'}))
configRouter.use(session({
	secret:'sdeefrefrfwefewdfwefe',
	resave:false,
	saveUninitialized: true,
	cookie:{
		httpOnly:true,
		path:'/api/auth/user'
	}
}))


configRouter.use(routers)


export default configRouter