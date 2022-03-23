import React from 'react'
import {AnimatePresence, motion} from 'framer-motion'

function FormPage(props) {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div 
      key={props.title}
      className='w-full h-full p-4 md:px-0 md:py-8 text-form-formText' 
      initial={{ x: -100}}
      animate={{ x: 0 }}
      exit={{ x: -100 }}
      transition={{ duration: 0.5 }}
      >
        <h1 className='text-3xl font-semibold max-w-md mb-5'>{props.title}</h1>
        {props.children}
        <div className='h-10'/>
      </motion.div>
    </AnimatePresence>
  )
}

export default FormPage