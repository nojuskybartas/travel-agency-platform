import { MinusIcon, PlusIcon } from '@heroicons/react/outline';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import GooglePlacesInput from './GooglePlacesInput';
import RadioSelect from './RadioSelect';
import TextInput from './TextInput';

function DetailsInput() {

    const { values, submitForm } = useFormikContext()
    const [locationCount, setLocationCount] = useState(0)

    return (
        <div className='w-full h-full flex flex-col items-center bg-white'>
            <h1 className='p-10 font-bold text-3xl'>Last one, just let us know a couple more details 🙏</h1>
            {/* <RadioSelect label='Single location' name='singleLocation'/> */}
            {/* {Array(values.locations.length+1).forEach(<div>
                <GooglePlacesInput name='locations'/>
            </div>)} */}
            <div className='flex w-3/4 h-10 mb-6 relative group'>
                <GooglePlacesInput name='locations'/>
                {values.locations.length > 0 && <div className='absolute bottom-0 right-1 -translate-y-1/2 transition-all ease-out duration-300 bg-gray-500 rounded-full bg-opacity-0 hover:bg-opacity-100' onClick={() => setLocationCount(locationCount + 1)}><PlusIcon className='w-5 h-5 group-hover:scale-105'/></div>}
            </div>

            
            {Array(locationCount).fill().map((_, i) => {
                return (
                    <div className='w-2/3 mb-5 relative' key={i}>
                        <GooglePlacesInput name='locations' label={`Location ${i+2}`}/>
                        <div className='absolute bottom-0 right-1 -translate-y-1/2 transition-all ease-out duration-300 bg-gray-500 rounded-full bg-opacity-0 hover:bg-opacity-100' onClick={() => setLocationCount(locationCount - 1)}>
                            <MinusIcon className='w-5 h-5 group-hover:scale-105'/>
                        </div>
                    </div>
                )
            })}
            
            
            {/* {Array((values.locations.length)+1).fill().map((_, i) => (<GooglePlacesInput key={i} name='locations'/>))} */}

            <TextInput name='peopleLimit' placeholder='People Limit' />
            <TextInput name='price' placeholder='Price' />
            <TextInput name='minAge' placeholder='Min-age 👀' />

            <p className='w-3/4 p-6'>Add price options (fixed / indicative), google location api, also maybe an option to say whether the start / end points are the same, or some sort of requirements</p>
        </div>
    );
}

export default DetailsInput;
