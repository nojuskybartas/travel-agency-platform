import { Field, useField } from 'formik';
import React, { useState } from 'react';

const MotivationInput = ({ ...props }) => {

    const [field, meta, helpers] = useField(props)
    const [wordCount, setWordCount] = useState(0)

    const handleChange = (e) => {
        let words = e.target.value.split(' ').filter(Boolean)
        // const newWordCount = e.target.value.trim().split(' ').length
        if (words.length < 500) {
            helpers.setValue(e.target.value)
            setWordCount(words.length)
        } else {
            // const trim = e.target.value.split(' ').slice(0, 500).join(' ')
            // console.log(trim.trim().split(' ').length)
            helpers.setValue(words.slice(0, 500).join(' '))
            setWordCount(500)
        }
    }

    
    return (
        <div className='w-full h-full flex flex-col items-cente relative'>
            <textarea {...field} {...props} className='w-full min-h-[450px] h-fit p-6 outline-none rounded-lg' onChange={handleChange}/>
            <p className='absolute -bottom-3 left-2'>{500 - wordCount}</p>    
            {/* e.target.value.trim().split(' ').length */}
            <p className='mt-3 text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
        </div>
    );
}

export default MotivationInput;