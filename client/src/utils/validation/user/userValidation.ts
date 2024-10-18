import { z} from 'zod'

type data ={
    username:string,
    password:string,
    fullname:string,
    email:string,
    conformPassword:string
}

export const userSignupSchema = z.object({
        username:z.string().min(5,{message:"username should contain at least 5 characters"}).max(14,{message:"username should contain at most 14 characters"}),
        fullname:z.string().min(1,{message:"fullname should contain at least 1 characters"}).max(20,{message:"fullname should contain at most 20 characters"}),
        email:z.string().email(),
        password:z.string().min(7,{message:"password should contain at least 7 characters"}).max(20,{message:"password should contain at most 20 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
            message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
        }),
        conformPassword:z.string()
    }).refine(data=>data.password===data.conformPassword,{
        message:'conform-password and password should match',
        path:['conformPassword']
    }) 


export const userLoginSchema = z.object({
    username:z.string().min(5,{message:"username should contain at least 5 characters"}).max(14,{message:"username should contain at most 14 characters"}),
    password:z.string().min(7,{message:"password should contain at least 7 characters"}).max(20,{message:"password should contain at most 20 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
        message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    }),
    rememberme:z.boolean()
})

export const userAccountFormSchema = z.object({
    fullName:z.string().min(1,{message:'firstname should be at least 1 charactor'}).max(20,{message:'firstname should be at most 20 charactor'}),
    country:z.string().max(20,{message:'lastname should be at most 20 charactor'}),
    email:z.string().email(),
    phoneNumber:z.string().min(10,{message:'phoneNumber should be at least 10 charactor'}).max(10,{message:'phoneNumber should be at most 10 charactor'}),
    countryCode:z.string().min(3).max(3)
})