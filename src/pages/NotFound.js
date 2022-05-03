import React, { useEffect } from 'react'
import MainPageStructure from '../components/MainPageStructure'
import image from '../static/images/404/24.png'

function NotFound() {


  return (
    <MainPageStructure>
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <img src={image} className='w-full md:w-[40%] h-fit pt-20'/>
            <h1 className='font-bold text-3xl'>Page not found</h1>
        </div>
    </MainPageStructure>
  )
}

export default NotFound