import { IBcryptInteractor } from "../../../entities/utils/bcryptInterface";
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


}

export const bcryptInteractor = new BcryptInteractor()