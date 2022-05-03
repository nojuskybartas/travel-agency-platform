import { Autocomplete, InputBase } from '@mui/material'
import { useFormikContext } from 'formik'
import React from 'react'
import languages from '../../static/data/languages.json'

function LanguagesInput() {

    const {values, errors, setFieldValue} = useFormikContext()
  return (
    <div className="w-full max-w-md h-fit flex flex-col">
        <div className="w-full h-fit flex justify-between">
            <p className="font-semibold">Languages:</p>
            <p className="text-xs italic text-red-500">{errors.languages}</p>
        </div>
        <Autocomplete
            multiple
            id='language'
            name='language'
            value={values.language}
            options={languages}
            onChange = {(event, value) => setFieldValue('language', value)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
            <InputBase
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                placeholder='Languages'
                className='rounded-lg w-full h-10 p-3 bg-white'
                name="languages" 
                value={values.languages} 
            />
            )}
        />
    </div>
  )
}

export default LanguagesInput