import jwt from 'jsonwebtoken'


const secret=process.env.JWT_SECRET as string

export const generateToken=(userId:object,expires='30d')=>{
    const accessToken = jwt.sign({userId,refresh:false},secret,{
        expiresIn:`${1000*60*3}`
    })
    const refreshToken = jwt.sign({userId,refresh:true},secret,{
        expiresIn:expires
    })
    return {accessToken,refreshToken}
}


