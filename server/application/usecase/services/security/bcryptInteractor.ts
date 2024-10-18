import { IBcryptInteractor } from "../../../interface/services/security/bcryptInterface"
import bcrypt from "bcrypt";


export class BcryptInteractor implements IBcryptInteractor{

    private bcrypt:typeof bcrypt

    constructor(){
        this.bcrypt=bcrypt
    }

    async checkPassword(checkPassword: string, userPassword: string): Promise<boolean> {
        try {
            return await this.bcrypt.compare(checkPassword,userPassword)
        } catch (error) {
            throw error
        }
    }

    async createPassword(password:string):Promise<string>{
        try {
            const hash = await this.bcrypt.hashSync(password, 10);
            return hash
        } catch (error) {
            throw error
        }
    }

}

export const bcryptInteractor = new BcryptInteractor()