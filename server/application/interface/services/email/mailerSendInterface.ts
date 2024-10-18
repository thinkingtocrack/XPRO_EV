import { UserOTPSchemaType } from "../../../../infrastructure/models/userOTP";
import { UserSchemaType } from "../../../../infrastructure/models/users";




export interface IMailerSendInteractor{
    generateVerificationOtpEmail(otp:UserOTPSchemaType):Promise<boolean>
    generateForgotpasswordOtpEmail(otp:UserOTPSchemaType):Promise<boolean>
}