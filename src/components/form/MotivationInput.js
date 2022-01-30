import { Field, useField } from 'formik';
import React from 'react';

const MotivationInput = ({ ...props }) => {

    const [field, meta, helpers] = useField(props)

    return (
        <div className='w-full h-[450px] flex flex-col items-center'>
            <h1 className='p-8 font-bold'>Why would you like to become a creator?</h1>
            <div className='w-full h-full relative'>
                <textarea maxLength={500} className="text-area" {...field} {...props} className='w-full h-full p-6 outline-none border-2 border-solid border-gray-800 resize-none'/>
                <p className='absolute bottom-0 left-5'>{500 - field.value.length}</p>    
            </div>
            <p className='mt-3 text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
        </div>
    );
}

export default MotivationInput;