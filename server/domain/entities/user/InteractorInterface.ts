

export type AuthorizeUser={
    isAuth:boolean,
    token:object,
    userData:object
}

export type UserSignupData = {
    email:string,
    userName:string,
    password:string,
    fullName:string
}

export type CreateUser={
    created:boolean
}

export interface IUserAuthInteractor{
    authorizeUser(username:string,password:string):Promise<AuthorizeUser>,
    userSignup(userData:UserSignupData):Promise<CreateUser>
    tokenRefresh(header:string):any
}

export interface IUserTokenInteractor{
    generateUserToken(data:object):object
    userTokenRefresh(header:string):object
    getToken(data:string):string
}


