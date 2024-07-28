import React from 'react'
import zeonLogo from '../../assets/images/zeonLogo.png'
import chargemodlogo from '../../assets/images/chargemodLogo.png'

const Index = () => {
  return (
    <footer className='bg-black p-5'>
        <div className='flex items-center flex-col gap-2'>
            <h1 className='text-white text-xl'>OUR PARTNERS</h1>
            <div className='flex gap-2'>
                <img src={zeonLogo} />
                <img src={chargemodlogo} />
            </div>
        </div>
    </footer>
  )
}

export default Index
