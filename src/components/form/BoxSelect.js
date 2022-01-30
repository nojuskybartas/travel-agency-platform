import { Field, useField } from 'formik';
import React from 'react';

function BoxSelect({label, ...props}) {

    const [field, meta, helpers] = useField(props)

  return (
      <div className='w-fit h-fit ml-auto'>
          <p className='whitespace-nowrap text-sm'>{label}</p>
          <Field type='checkbox' name={field.name}/>
      </div>
  );
}

export default BoxSelect;
