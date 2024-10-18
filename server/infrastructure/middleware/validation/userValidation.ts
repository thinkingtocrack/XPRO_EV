import { z } from "zod";
import { Request,Response,NextFunction } from "express";

const signupValidator = (req:Request,res:Response,next:NextFunction)=>{
    try {
        const User = z.object({
            username:z.string().min(5).max(14),
            password:z.string().min(7).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
                message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
            }),
            fullname:z.string().min(2).max(20),
            email:z.string().email(),
        })
        const parse = User.safeParse(req.body)
        if(parse.success){
            next()
        }else{
            res.status(400).json({validation:false,error:parse.error})
        }
    } catch (error) {
        res.status(500).json({validation:false})
    }
} 

const loginValidator = (req:Request,res:Response,next:NextFunction)=>{
    try {
        const User = z.object({
            username:z.string().min(5).max(14),
            password:z.string().min(7).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
                message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
            })
        })
        const parse = User.safeParse(req.body)
        if(parse.success){
            next()
        }else{
            res.status(400).json({validation:false,error:parse.error})
        }
    } catch (error) {
        res.status(500).json({validation:false})
    }
} 


export default {signupValidator,loginValidator}