import { NextFunction,Response,Request } from "express";







export interface IAuthMiddleware{
    isAuthorizationHeaderSent(req:Request,res:Response,next:NextFunction):void
    userAuthCheck(req:Request,res:Response,next:NextFunction):Promise<void>
}