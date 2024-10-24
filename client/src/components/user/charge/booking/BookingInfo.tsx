import  { useState, useEffect} from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import useUserApi from '@/components/hooks/user/UserApiHook';
import { AxiosInstance } from 'axios';
import toast from 'react-hot-toast';
import { SelectedStationType } from '@/pages/user/booking/BookingPage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const BookingInfo = ({selectedStation}:{selectedStation:SelectedStationType}) => {
  console.log(selectedStation)
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const formattedDate = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  const getAvailabeSlotsApi = async(api:AxiosInstance)=>{
    const result = await api.get('/api/user/booking/slots/avaliable',{
      params:{
        date:formattedDate,
        chargerId:selectedStation?._id
      }
    })
    return result
  }


  const {data,loading,refetch,error} = useUserApi(getAvailabeSlotsApi)

  if(error){
    toast.error(error)
  }

  const slotAvailabe = data?.data?.slots

  useEffect(()=>{
    refetch()
  },[date,selectedStation?._id])






  const createBookingApi = async(api:AxiosInstance) => {
    const result = await api.post('/api/user/booking/new', {
      date:formattedDate,
      startTime,
      endTime,
      chargerId:selectedStation?._id
    })
    return result
  };

  const {data:bookingData,loading:bookingLoading,error:bookingError,refetch:bookingRefetch} = useUserApi(createBookingApi)
  
  const handleBooking = async()=>{
    await bookingRefetch()
    console.log(bookingData)
    if(bookingError){
      toast.error(error)
    }else if(bookingData?.data?.isBooked){
      toast.success(bookingData?.message)
    }else{
      toast.error(bookingData?.message)
    }
    await refetch()
  }




  return (
    <div className="max-w-md mx-auto  p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Book a Slot</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date:</label>
        <div className='flex justify-center'>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => setDate(newDate || new Date())}
            disabled={(date) => date < (new Date().setHours(0, 0, 0, 0))}
            className="rounded-md border"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Start Time:</label>
        {
          loading?
          <Skeleton className="h-9 w-full border-solid border-2 border-slate-300" />
          :
          <Select  value={startTime} onValueChange={setStartTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {slotAvailabe?slotAvailabe.map((time,index) => (
                <SelectItem key={index} value={time.startTime}>
                  {time.startTime}
                </SelectItem>
              )):null}
            </SelectContent>
          </Select>
        }
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select End Time:</label>
        {loading?
          <Skeleton className="h-9 w-full border-solid border-2 border-slate-300" />
          :
          <Select value={endTime} onValueChange={setEndTime} disabled={!startTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {slotAvailabe?slotAvailabe.filter((time) => time.startTime === startTime).map((time,index) => (
                <SelectItem key={index} value={time.endTime}>
                  {time.endTime}
                </SelectItem>
              )):null}
            </SelectContent>
          </Select>
        }
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='w-full bg-gray-400' disabled={!date || !startTime || !endTime || bookingLoading} variant="outline">Book Slot</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Booking cannot be undone or cancelled.
              Also will take <p className='text-red-400 inline font-medium'>Rs.20</p> from your wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBooking}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};



export default BookingInfo