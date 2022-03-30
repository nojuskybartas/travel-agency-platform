import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { createExperienceFormValuesAtom } from '../atoms/createExperienceFormAtom';

export default function useExperienceFormValues() {
    const [values, setValues] = useRecoilState(createExperienceFormValuesAtom)

    const handleChange = (event) => {
        setValues(values => ({...values, [event.target.name]: event.target.value}))
    }  

    // useEffect(() => {
    //     console.log(values)
    // }, [values])

    return { values, setValues, handleChange };
}

