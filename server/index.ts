import express,{Express,Request,Response} from "express"
import "dotenv/config"

const app = express()

app.get('/',(req,res)=>{
    res.send('hai my name is shane hai')
})

app.listen(process.env.port,()=>{
    console.log(`listening in port ${process.env.PORT}`)
})