import React from 'react'
import image from '../../Humaaans.png'
import {motion} from 'framer-motion'
import FormPage from './FormPage'

function Intro({nextPage}) {

  return (
    <FormPage>
      <div className='w-full h-full mb:p-10 flex flex-col justify-center space-y-10 items-center text-white'>
        <h1 className='text-3xl'>Share your experience with the world today.</h1>
        <img src={image} className='w-32 h-max'/>
        <motion.button onClick={nextPage} className='text-2xl border border-solid border-white rounded-3xl px-7 py-4'>I'm ready</motion.button>
     </div>
    </FormPage>
  )
}

export default Intro