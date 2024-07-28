import userModel from "../../model/users"
import bcrypt from "bcrypt";
import { Request,Response } from "express";
import { generateToken } from "../../utils/token/generateToken";
import { getToken, verifyToken } from "../../middleware/auth/userAuthMiddleware";
import { TokenExpiredError,JsonWebTokenError } from "jsonwebtoken";

const loginAuth=async(req:Request,res:Response)=>{
    try {
        const user = await userModel.findOne({userName:req.body?.username})
        if(user){
            const check = await bcrypt.compare(req.body?.password,user?.password)
            if(check && !user.isBlocked){
                const token = req.body?.rem ?generateToken(user._id) :generateToken(user._id,'1d') 
                const userInfo={
                    name:user?.fullName,
                    userName:user?.userName,
                    email:user?.email
                }
                res.status(200).json({isAuth:true,token,userInfo})
            }else{
                res.status(200).json({isAuth:false,error:"invalid username or password"})
            }
        }else{
            res.json({isAuth:false,error:"invalid username or password"}).status(200)
        }    
    } catch (error) {
        res.status(500).json({isAuth:false,error})
    }
}

const signup=async(req:Request,res:Response)=>{
    try {
        const conditionEmail = await userModel.findOne({email:req.body.email}).select('email')
        const conditionUserName = await userModel.findOne({userName:req.body.username}).select('userName')
        req.body.password=await bcrypt.hash(req.body.password, 10)
        if(!conditionEmail && !conditionUserName ){
            const data ={
                userName:req.body.username,
                fullName:req.body.fullname,
                email:req.body.email,
                password:req.body.password
            }
            await userModel.create(data)
            res.status(201).json({userExist:false})
        }else{
            res.status(200).json({userExist:true})
        }    
    } catch (error) {
        res.status(500).json({error})
    }
}

const tokenRefresh = async(req:Request,res:Response)=>{
    try {
        const refreshToken= getToken(req,res)
        const decoded = refreshToken ? await verifyToken(refreshToken):null
        if(decoded && decoded.refresh && decoded.userId){
            const user= await userModel.findById(decoded.userId)
            if(!user?.isBlocked && user){
                const token = generateToken(user._id,`${decoded.exp}`)
                const userInfo={
                    name:user?.fullName,
                    userName:user?.userName,
                    email:user?.email
                }
                res.status(200).json({isAuth:true,token,userInfo})
            }else{
                res.status(200).json({isAuth:false,error:"userblocked"})
            }
        }
    } catch (error) {  
        if (error instanceof TokenExpiredError) {
            console.log('jwt expired',error)
            res.json({token:'expired token'}).status(200);
        } else if (error instanceof JsonWebTokenError) {
            console.log('JWT token is invalid:', error);
            return res.status(401).json({ token: 'invalid token' });
        } else {
            console.log('Unexpected error:', error);
            return res.sendStatus(500);
        }
    }
}

export default {loginAuth,signup,tokenRefresh}