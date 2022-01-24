import { Field, useField } from 'formik';
import React from 'react';

const DescriptionInput = ({ ...props }) => {

    const [field, meta, helpers] = useField(props)

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <h1 className='p-10 font-bold text-3xl'>Step 3, describe your experience 👇</h1>
            <div className='w-3/4 h-3/4 max-h-64 relative'>
                <textarea maxLength={500} className="text-area" {...field} {...props} className='w-full h-full p-6 outline-none border-2 border-solid border-gray-800 resize-none'/>
                <p className='absolute bottom-2 left-5'>{500 - field.value.length}</p>    
            </div>
            <p className='mt-3 text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
        </div>
    );
}

export default DescriptionInput;