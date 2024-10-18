export class IsBlockedError extends Error{
    constructor(message: string) {
        super(message);
        this.name = "isBlockedError";
        }
}
export class InvalidCredentialsError extends Error{
    constructor(message: string) {
        super(message);
        this.name = "invalid_credentails";
        }
}

export class UserExistError extends Error{
    public fields:string[]
    constructor(message:string,fields:string[]){
        super(message)
        this.name = 'User_Exists'
        this.fields=fields
    }
}

export class UserNotExist extends Error{
    public fields:string[]
    constructor(message:string,fields:string[]){
        super(message)
        this.name = 'User_Not_Exist'
        this.fields=fields
    }
}

export class TokenError extends Error{
    constructor(message:string){
        super(message)
        this.name = 'TokenError'
    }
}

export class LogoutError extends Error{
    constructor(){
        super('logout user')
        this.name = 'userLogoutError'
    }
}


export class RevalidateAccessToken extends Error{
    constructor(){
        super('please revalidate accesstoken')
        this.name='revalidate_accessToken'
    }
}

export class DataValidationError extends Error{
    public fields:object
    constructor(fields:[string]) {
        super('Data Validation Error')
        this.fields = fields
        this.name = 'DataValidationError'
    }
}


export default {IsBlockedError,InvalidCredentialsError,UserExistError}