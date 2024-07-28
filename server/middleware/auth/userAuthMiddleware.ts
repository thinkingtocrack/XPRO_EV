import jwt, { JwtPayload,TokenExpiredError,JsonWebTokenError } from 'jsonwebtoken'
import { Request,Response,NextFunction } from 'express'
import { checkBlockedUserId } from '../../model/reddis';
import { promisify } from 'util';

interface Decoded extends JwtPayload {
    userId: string;
    tokenId: string;
    refresh: boolean;
}


export const getToken=(req:Request,res:Response)=>{
    try {
        const authHeader = req.header('Authorization');
        if (authHeader===undefined) res.status(401).json({token:'not sent'});
        else{
            const token = authHeader.split(' ')[1]
            return token
        }
    } catch (error) {
        throw error
    }
}

const verifyJwt = promisify(jwt.verify) as (token: string, secret: string) => Promise<JwtPayload>;

export const verifyToken = async(token:string)=>{
    try {
        const decoded = await verifyJwt(token,process.env.JWT_SECRET as string) as Decoded
        return decoded
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw error;
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw error;
        } else {
            throw error;
        }
    }
}

export const isAuthenticated = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const accessToken = getToken(req,res)
        if (!accessToken) res.status(401).json({token:'not sent'});
        else{
            const decodedAccessToken=await verifyToken(accessToken)
            if(decodedAccessToken.refresh) res.status(401).json({token:'invalid token'});
            const check=await checkBlockedUserId(decodedAccessToken.userId)
            if(check){
                res.status(403).json({token:'user blocked'});
            } else{
                res.send('ahi')
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

