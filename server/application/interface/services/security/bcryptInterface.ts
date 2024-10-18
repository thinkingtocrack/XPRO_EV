export interface IBcryptInteractor{
    checkPassword(checkPassword:string,userPassword:string):Promise<boolean>
    createPassword(password:string):Promise<string>
} 