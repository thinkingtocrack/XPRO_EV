import { Schema,Types } from "mongoose";
import { IUserBookingInteractor } from "../../interface/user/InteractorInterface";
import moment from "moment-timezone"
import { IBookingRepository } from "../../../domain/repositories/booking/bookingRepositoryInterface";
import bookingRepository from "../../../infrastructure/repositories/users/bookingrepository";
import { BookingSchemaType } from "../../../infrastructure/models/booking";
import walletRepository from "../../../infrastructure/repositories/users/walletRepository";
import IWalletRepository from "../../../domain/repositories/wallet/IWalletRepository";






class UserBookingInteractor implements IUserBookingInteractor{
    bookingRepository:IBookingRepository
    walletRepository:IWalletRepository

    constructor(bookingRepository:IBookingRepository,walletRepository:IWalletRepository){
        this.bookingRepository = bookingRepository
        this.walletRepository = walletRepository
    }

    async scheduleChargerBooking({ userId, chargerId, startTime, endTime,date }: { userId: Schema.Types.ObjectId; chargerId: Schema.Types.ObjectId; startTime: string; endTime: string; date: string; }): Promise<{ status: boolean; message: string; data:{isBooked:boolean} }> {
        try {
            const utcStartTime = moment.tz(`${date} ${startTime}`,'Asia/Kolkata').utc().toDate()
            const utcEndTime = moment.tz(`${date} ${endTime}`,'Asia/Kolkata').utc().toDate()

            const conflictingBooking = await this.bookingRepository.conflectingBooking(chargerId,utcStartTime,utcEndTime)

            if(!conflictingBooking){
                const data ={
                    userId,
                    chargerId,
                    startTime:utcStartTime,
                    endTime:utcEndTime,
                    status:'confirmed'
                }
                const payment = await this.walletRepository.updateWalletHistory(userId,{type:'debit',amount:20,for:'booking'})
                const newBooking = await this.bookingRepository.newBooking(data)
                return {status:true,message:'booking sucessfull',data:{isBooked:true}}
            }else{
                return {status:true,message:'booking slot not availabe',data:{isBooked:false}}
            }
        } catch (error) {
            throw error
        }
    }

    async getAvaliableSlots({chargerId,date}:{chargerId:Types.ObjectId,date:string}):Promise<{status:boolean,message:string,data:{slots:any[]}}>{
        try {
            const startTime = moment.tz(date,'utc').startOf('day').toDate()
            const endTime = moment.tz(date,'utc').endOf('day').toDate()
            const bookings = await this.bookingRepository.getBookings(chargerId,startTime,endTime)
            const minStartTime = this.roundToNearestQuarter(date)
            console.log(minStartTime)
            const allSlots = this.generateTimeSlots(minStartTime, '18:00', 15, date, 'Asia/Kolkata')
            const availableSlots = allSlots.filter(slot=>{
                return !bookings.some(booking=>
                    (slot.startTimeUTC >= booking.startTime && slot.startTimeUTC < booking.endTime) ||
                    (slot.endTimeUTC > booking.startTime && slot.endTimeUTC <= booking.endTime)
                );
            });
            const localAvailableSlots = availableSlots.map(slot => ({
                startTime: moment(slot.startTimeUTC).tz('Asia/Kolkata').format('HH:mm'),
                endTime: moment(slot.endTimeUTC).tz('Asia/Kolkata').format('HH:mm')
              }));

            return {status:true,message:'available slots fetched sucussfully',data:{slots:localAvailableSlots}}
        } catch (error) {
            throw error
        }
    }

    async getUserBookedSlots({ userId, chargerId }: { userId: Types.ObjectId; chargerId: Types.ObjectId; }): Promise<{ status: boolean; message: string; data: { bookings: BookingSchemaType[]; }; }> {
        try {
            const bookings = await this.bookingRepository.userBookedSlots(userId,chargerId)
            return {status:true,message:'user booked slots fetched sucussfully',data:{bookings}}
        } catch (error) {
            throw error
        }
    }

    

    private roundToNearestQuarter(dateArg:string) {
        const currentTime = moment.tz(moment.tz.guess()); // Get current time in the local timezone
        const currentDate = moment.tz(moment.tz.guess()); // Get current time in the local timezone
 
      
        let passedDate;
        
        if (dateArg) {
          passedDate = moment.tz(dateArg, moment.tz.guess()).startOf('day');  // Get passed date (ignoring time)
        }
      
        // Case 1: If the passed date is greater than the current date, return 10:00
        if (dateArg && passedDate?.isAfter(currentDate)) {
          return '10:00';
        }
      
        // Proceed with time rounding logic if date is today or not passed
        const hour = currentTime.hour();
        const minute = currentTime.minute();
      
        // Case 2: If the time is lower than 10:00, round it up to 10:00
        if (hour < 10) {
          return '10:00';
        }
      
        // Case 3: Handle times between 10:00 and 17:59
        if (hour >= 10 && hour < 18) {
          const remainder = minute % 15;
          const roundedMinute = remainder <= 0 ? minute - remainder : minute + (15 - remainder);
      
          let roundedHour = hour;
          let finalMinutes = roundedMinute;
      
          // Handle case where rounding moves to the next hour
          if (roundedMinute === 60) {
            roundedHour++;
            finalMinutes = 0;
          }
      
          // Case 4: Special case: stop at 18:00
          if (roundedHour === 18) {
            return '18:00';
          }
      
          // Return the rounded time
          return `${roundedHour.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
        }
      
        // Case 5: If the time is 18:00 or later, return 18:00
        return '18:00';
      }
      



    private generateTimeSlots(start: string, end: string, interval: number, date: string, timeZone: string): { startTime: string; endTime: string; startTimeUTC: Date; endTimeUTC: Date; }[] {
        const slots = [];
        let currentTime = moment.tz(`${date} ${start}`, timeZone);
        const endTime = moment.tz(`${date} ${end}`, timeZone);
      
        while (currentTime.isBefore(endTime)) {
            const startTimeUTC = currentTime.utc().toDate();
          const startTimeLocal = currentTime.format('HH:mm');
          currentTime.add(interval, 'minutes');
          const endTimeUTC = currentTime.utc().toDate();
          const endTimeLocal = currentTime.format('HH:mm');
          
          slots.push({
            startTime: startTimeLocal,
            endTime: endTimeLocal,
            startTimeUTC,
            endTimeUTC
          });
        }
      
        return slots;
      }

    


}


const userBookingInteractor = new UserBookingInteractor(bookingRepository,walletRepository)


export default userBookingInteractor