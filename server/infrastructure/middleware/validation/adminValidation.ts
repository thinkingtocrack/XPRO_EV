import {z} from 'zod'
import { Request,Response,NextFunction } from 'express'




const loginValidator = (req:Request,res:Response,next:NextFunction)=>{
    try {
        const User = z.object({
            email:z.string().email(),
            password:z.string().min(7).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
                message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
            })
        })
        const parse = User.safeParse(req.body)
        if(parse.success){
            next()
        }else{
            res.status(400).json({error:'validation_error',message:"invalid email or password"})
        }
    } catch (error) {
        res.status(500).json({validation:false})
    }
} 


export default {loginValidator}