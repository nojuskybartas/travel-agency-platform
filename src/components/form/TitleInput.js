import React from 'react';
import { Field, useField } from "formik"

const TitleInput = ({ ...props }) => {

  const [field, meta, helpers] = useField(props)

  return (
    <div className='w-full h-full flex flex-col items-center'>
        <h1 className='p-10 font-bold text-3xl'>Step 2, name your experience 👇</h1>
        <div className='w-3/4 h-10 relative'>
          <Field type='text' maxLength={80} className='w-full h-full px-8 outline-none border-b-2 border-solid border-gray-800' name={field.name}/>
          <p className='absolute bottom-2 right-3'>{80 - field.value.length}</p>
        </div>
        <p className='mt-3 text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
        <p className='p-12'>Maybe an api here that displays an image related to what the user has typed in</p>
    </div>
  );
}

export default TitleInput;
