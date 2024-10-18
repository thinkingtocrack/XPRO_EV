import mongoose from "mongoose";
import { BookingSchemaType } from "../../../infrastructure/models/booking";



export interface IBookingRepository {
    conflectingBooking(chargerId:mongoose.Schema.Types.ObjectId,startTime:Date,endTime:Date):Promise<BookingSchemaType | null>;
    newBooking(data:{userId:mongoose.Schema.Types.ObjectId,chargerId:mongoose.Schema.Types.ObjectId,startTime:Date,endTime:Date}):Promise<BookingSchemaType>
    getBookings(chargerId:mongoose.Types.ObjectId,startTime:Date,endTime:Date):Promise<BookingSchemaType[]>
    userBookedSlots(userId:mongoose.Types.ObjectId,chargerId:mongoose.Types.ObjectId):Promise<BookingSchemaType[]>
}