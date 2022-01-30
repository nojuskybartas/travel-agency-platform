import { Field, useField } from 'formik';
import React from 'react';

const TextInput = ({placeholder, ...props}) => {

    const [field, meta, helpers] = useField(props)

    return (
        <div className='w-full h-10 mb-6 flex items-center border-b-2 border-solid bg-white border-gray-800'>
            <Field type='text' placeholder={placeholder} name={field.name} className='w-full h-full px-6 outline-none'/>
            <p className='text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
        </div>
    );
}

export default TextInput;
