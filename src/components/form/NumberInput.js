import { Field, useField } from 'formik';
import React from 'react';

const NumberInput = ({placeholder, prefix, ...props}) => {

    const [field, meta, helpers] = useField(props)

    return (
        <div className='w-3/4 h-10 mb-6 flex items-center border-b-2 border-solid bg-white border-gray-800 relative'>
            <Field type='number' placeholder={placeholder} name={field.name} className='w-full h-full px-6 outline-none'/>
            <p className='text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
            <p className='absolute left-20'>{prefix}</p>
        </div>
    );
}

export default NumberInput;
