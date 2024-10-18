import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import configRouter from "./config"




async function initServer(){
	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/xpro')
		const app = express()
		app.listen(process.env.port,()=>{
			console.log(`listening in port ${process.env.PORT}`)
		})
		app.use(configRouter)
	} catch (error) {
		console.log(error)
	}
}

initServer()



