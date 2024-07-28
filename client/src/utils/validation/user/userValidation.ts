import {z} from 'zod'

type data ={
    username:string,
    password:string,
    fullname:string,
    email:string,
    conformPassword:string
}

export const signupValidator = (data:data)=>{
    const User = z.object({
        username:z.string().min(5,{message:"username should contain at least 5 characters"}).max(14,{message:"username should contain at most 14 characters"}),
        fullname:z.string().min(1,{message:"fullname should contain at least 1 characters"}).max(20,{message:"fullname should contain at most 20 characters"}),
        email:z.string().email(),
        password:z.string().min(7,{message:"password should contain at least 7 characters"}).max(20,{message:"password should contain at most 20 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
            message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
        }),
        conformPassword:z.string().min(7,{message:"conform-password should contain at least 7 characters"}).max(20,{message:"conform-password should contain at most 20 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
            message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
        }),
    }).refine(data=>data.password===data.conformPassword,{
        message:'conform-password and password should match'
    }) 
    const parse = User.safeParse(data)
    return parse
} 