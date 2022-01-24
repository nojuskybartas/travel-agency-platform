import { Field, useField } from 'formik';
import React from 'react';

function RadioSelect({ label, ...props }) {

    const [field, meta, helpers] = useField(props)

    return (
        <div className='w-3/4 h-10 mb-6 flex items-center'>
            <p>{label}</p>
            <Field type='radio' name={field.name}/>
        </div>
    );
}

export default RadioSelect;
