import { useFormikContext } from 'formik'
import React from 'react'
import PhoneInput, { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'
import Input from 'react-phone-number-input/input'

function PhoneNumberInput() {

    const {values, errors, setFieldValue, setFieldError} = useFormikContext()

    const handleChange = (value) => {
        setFieldValue('phoneNumber', value)
    }

    return (
        <div className="w-full max-w-md h-fit flex flex-col">
            <div className="w-full h-fit flex justify-between">
                <p className="font-semibold">Phone Number:</p>
                <p className="text-xs italic text-red-500">{errors.phoneNumber}</p>
            </div>
            <Input
                placeholder="Phone number"
                value={values.phoneNumber}
                className='w-full h-10 rounded-lg p-3'
                onChange={handleChange}
            />
        </div>
    )
}

export default PhoneNumberInput