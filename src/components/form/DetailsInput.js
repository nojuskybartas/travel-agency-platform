import React from 'react';
import TextInput from './TextInput';

function DetailsInput() {


    return (
        <div className='w-full h-full flex flex-col items-center'>
            <h1 className='p-10 font-bold text-3xl'>Last one, just let us know a couple more details 🙏</h1>
            <TextInput name='location' placeholder='Location' />
            <TextInput name='peopleLimit' placeholder='People Limit' />
            <TextInput name='price' placeholder='Price' />
            <TextInput name='minAge' placeholder='Min-age 👀' />

            <p className='w-3/4 p-6'>Add price options (fixed / indicative), google location api, also maybe an option to say whether the start / end points are the same, or some sort of requirements</p>
        </div>
    );
}

export default DetailsInput;
