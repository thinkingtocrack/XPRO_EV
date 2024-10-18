import { UserOTPModelType, UserOTPSchemaType } from "../../../../infrastructure/models/userOTP";
import { UserSchemaType } from "../../../../infrastructure/models/users";
import { IMailerSendInteractor } from "../../../interface/services/email/mailerSendInterface";
import  {MailerSend,Sender,Recipient,EmailParams}  from "mailersend";


export class MailerSendInteractor implements IMailerSendInteractor{
    private mailerSend:MailerSend

    constructor(apiKey:string){
        this.mailerSend = new MailerSend({
            apiKey:apiKey
        })
    }

    async generateVerificationOtpEmail(otp: UserOTPSchemaType): Promise<boolean> {
        try {
            const sentFrom = new Sender("MS_SOAQEO@trial-x2p0347j6034zdrn.mlsender.net", "MINNAL-OTPVERIFICATION")
            const recipients = [new Recipient(otp.email,'minnal client')]
            const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("OTP-Verification")
            .setHtml(`<strong>Your OTP for Verification is ${otp.otp} </strong>
                <br></br>
                <p>this is your verification otp,don't share with anyone</P>
                `)
            const sent=await this.mailerSend.email.send(emailParams);
            console.log(sent)
            if(sent){
                return true
              }else{
                return false
              }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async generateForgotpasswordOtpEmail(otp: UserOTPSchemaType): Promise<boolean> {
        try {
            const sentFrom = new Sender("MS_SOAQEO@trial-x2p0347j6034zdrn.mlsender.net", "MINNAL-FORGOTPASSWORD")
            const recipients = [new Recipient(otp.email,'minnal client')]
            const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("FORGOTPASSWORD-OTP")
            .setHtml(`<strong>Your OTP for Forgotpassword is ${otp.otp} </strong>
                <br></br>
                <p>this is your forgotpassword otp,don't share with anyone</P>
                `)
            const sent=await this.mailerSend.email.send(emailParams);
            if(sent){
                return true
              }else{
                return false
              }
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

const mailerSendInteractor = new MailerSendInteractor(process.env.MAILER_SEND as string)
export default mailerSendInteractor