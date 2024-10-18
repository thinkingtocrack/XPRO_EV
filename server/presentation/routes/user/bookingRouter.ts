import { Router } from "express";
import userBookingController from "../../controllers/user/bookingController";


const bookingRouter = Router()


bookingRouter.get('/booked',userBookingController.getBookedSlots)
bookingRouter.post('/new',userBookingController.onCreateBooking)
bookingRouter.get('/slots/avaliable',userBookingController.getAvaliableSlots)


export default bookingRouter