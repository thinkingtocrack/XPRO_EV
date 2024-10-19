import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import configRouter from "./config"




async function initServer(){
	try {
		await mongoose.connect(`mongodb+srv://${process.env.MONGODBUSERNAME}:${process.env.MONGODBPASSWORD}@suggo-test.t4xhyqk.mongodb.net/`)
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



