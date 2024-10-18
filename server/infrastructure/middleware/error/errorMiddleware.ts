import { NextFunction,Request,Response } from "express";
import { DataValidationError, InvalidCredentialsError, IsBlockedError, LogoutError, UserExistError, UserNotExist } from "../../../application/usecase/errors/authErrors";
import { UserNameNotExist } from "../../../domain/repositories/user/userRepositoryInterface";



const errorMiddleware=(error:Error,req:Request,res:Response,next:NextFunction)=>{
    console.error(error)
    if(error instanceof InvalidCredentialsError){
        res.status(401).json({error:'invalid_credentials',message:'invalid username or password'})
    }else if(error instanceof IsBlockedError){
        res.status(403).json({error:'user_blocked',message:'user blocked'})
    }else if(error instanceof UserExistError){
        res.status(400).json({exists:true,fields:error.fields})
    }else if(error instanceof UserNotExist){
        res.status(409).json({error:error.name,message:"user does not exist"})
    }else if (error instanceof LogoutError){
        res.status(401).json({error:error.name,message:error.message})
    }else if (error instanceof DataValidationError){
        res.status(400).json({error:error.name,message:error.message,fields:error.fields})
    }
    
    
    else{
        res.status(500).json({error:'server_error',message:'server error'})
    }
}


export default errorMiddleware