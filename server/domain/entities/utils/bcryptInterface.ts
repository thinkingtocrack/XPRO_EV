export interface IBcryptInteractor{
    checkPassword(checkPassword:string,userPassword:string):Promise<boolean>
} 