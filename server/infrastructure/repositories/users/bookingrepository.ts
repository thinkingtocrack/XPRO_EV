import mongoose from "mongoose";
import { IBookingRepository } from "../../../domain/repositories/booking/bookingRepositoryInterface";
import BookingModel, { BookingModelType, BookingSchemaType } from "../../models/booking";



class BookingRepository implements IBookingRepository{
    private bookingModel:BookingModelType

    constructor(bookingModel:BookingModelType){
        this.bookingModel = bookingModel
    }

    async conflectingBooking(chargerId:mongoose.Schema.Types.ObjectId,startTime: Date, endTime: Date): Promise<BookingSchemaType | null> {
        try {
            const bookings = await this.bookingModel.findOne({
                chargerId,
                $or:[
                    {startTime:{$lt:endTime},endTime:{$gt:startTime}},
                    {startTime:{$gte:startTime,$lt:endTime}},
                    {endTime:{$gt:startTime,$lte:endTime}},
                ]
            })
            return bookings
        } catch (error) {
            throw error
        }
    }

    async newBooking(data:{userId:mongoose.Schema.Types.ObjectId,chargerId:mongoose.Schema.Types.ObjectId,startTime:Date,endTime:Date}):Promise<BookingSchemaType>{
        try {
            const newBooking = await this.bookingModel.create(data)
            return newBooking
        } catch (error) {
            throw error
        }
    }

    async getBookings(chargerId:mongoose.Types.ObjectId,startTime:Date,endTime:Date):Promise<BookingSchemaType[]>{
        try {
            const bookings = await this.bookingModel.where('chargerId').equals(chargerId).where('startTime').gte(startTime.getTime()).where('endTime').lte(endTime.getTime())
            return bookings
        } catch (error) {
            throw error
        }
    }

    async userBookedSlots(userId: mongoose.Types.ObjectId, chargerId: mongoose.Types.ObjectId): Promise<BookingSchemaType[]> {
        try {
            const searchData ={
                userId,
                chargerId
            }
            const bookings = await this.bookingModel.find(searchData).select('startTime endTime createdAt')
            return bookings
        } catch (error) {
            throw error
        }
    }

}


const bookingRepository = new BookingRepository(BookingModel)

export default bookingRepository