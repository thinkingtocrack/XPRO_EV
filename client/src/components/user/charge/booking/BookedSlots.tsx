import useUserApi from '@/components/hooks/user/UserApiHook'
import { SelectedStationType } from '@/pages/user/booking/BookingPage'
import { AxiosInstance } from 'axios'
import React, { useEffect } from 'react'
import { Calendar,AlertCircle } from 'lucide-react'


const BookedSlots = ({selectedStation}:{selectedStation:SelectedStationType}) => {

  console.log(selectedStation)

  const getUserBookedSlots = async(api:AxiosInstance)=>{
    const result = await api.get('/api/user/booking/booked',{
      params:{
        chargerId:selectedStation?._id
      }
    })
    return result
  }

  const {loading,error,data:bookedSlotsResponse,refetch} = useUserApi(getUserBookedSlots)

  useEffect(()=>{
    refetch()
  },[selectedStation?._id])

  const bookedSlots = bookedSlotsResponse?.data?.bookings

  console.log(bookedSlots)


  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone:'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });





  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-green-600 text-white px-4 py-2 flex items-center">
        <Calendar className="mr-2" />
        <h2 className="text-xl font-semibold">Your Booked Slots</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {Array.isArray(bookedSlots)?
        bookedSlots.length===0?
        <div className="p-4 flex items-center justify-center text-gray-500">
          <AlertCircle className="mr-2" />
          <p>No bookings found. Book a slot to get started!</p>
        </div>
        :
        bookedSlots.map((slot) => (
          <li key={slot.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{slot?.createdAt?.split('T')[0]}</p>
                <p className="text-sm text-gray-500">{formatter.format(new Date(slot?.startTime))} - {formatter.format(new Date(slot?.endTime))}</p>
              </div>
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {selectedStation?.stationName}
              </span>
            </div>
          </li>
        )):null}
      </ul>
    </div>
  )
}

export default BookedSlots