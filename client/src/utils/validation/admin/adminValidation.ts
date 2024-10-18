import {z} from 'zod'

type data ={
    password:string,
    email:string,
}

export const loginValidator = (data:data)=>{
    const User = z.object({
        email:z.string().email(),
        password:z.string().min(7,{message:"password should contain at least 7 characters"}).max(20,{message:"password should contain at most 20 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
            message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
        }),
    })
    const parse = User.safeParse(data)
    return parse
} 


export const passwordValidation=(password:string)=>{
    const Password = z.string().min(7,{message:"password should contain at least 7 characters"}).max(20,{message:"password should contain at most 20 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
        message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    })
    return Password.safeParse(password)
}

export const emailValidation=(email:string)=>{
    const Email = z.string().email()
    return Email.safeParse(email)
}

export const AdminLoginSchema = z.object({
    email:z.string().email(),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,{
        message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    }).min(6,{message:'password must be 6 charactes in length'}),
})



export const adminAddChargerSchema=z.object({
    chargers:z.array(z.object({
        discountRate: z.number().min(0),
        discountType: z.enum(['percentage','amount']),
        basePrice: z.number().min(0),
        taxRate: z.number().min(0),
        portType: z.enum(['CCS','CCS2']),
        maxPower: z.number().min(1),
        category: z.enum(['fastcharging','slowcharging','superfastcharging']),
        status: z.enum(['online','offline','draft']),
        taxType:z.enum(['percentage','amount']),
    })),
    longitude:z.number().min(-180).max(180),
    latitude:z.number().min(-90).max(90),
    stationName:z.string().min(2),
  })
