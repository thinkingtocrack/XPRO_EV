import mongoose, { Schema, Document,InferSchemaType, Model } from 'mongoose';

// Define the interface for the Booking document
interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    stationId: mongoose.Types.ObjectId;
    chargerId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: 'confirmed' | 'cancelled';
}

// Define the Booking schema
const BookingSchema: Schema<IBooking> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chargerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'charger',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
        validate:{
            validator:function (startDate){
                const now = new Date()
                return startDate>=now
            },
            message:'start date should be greater than current date'
        },
    
    },
    endTime: {
        type: Date,
        required: true,
        validate:{
            validator:function(endTime){
                const now = new Date()
                return endTime>=now
            },
            message:'end time should be greater than current date'
        }
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed',
    },
}, {
    timestamps: true,
});




export type BookingSchemaType = InferSchemaType<typeof BookingSchema>;

export type BookingModelType  =  Model<BookingSchemaType & Document>;

// Define the Booking model
const BookingModel: BookingModelType = mongoose.model<BookingSchemaType & Document>('Booking', BookingSchema);

export default BookingModel
