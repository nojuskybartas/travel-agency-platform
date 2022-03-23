import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { createExperienceFormPageAtom, createExperienceFormValuesAtom } from '../atoms/createExperienceFormAtom';

export default function useExperienceForm() {
    const [currentPage, setCurrentPage] = useRecoilState(createExperienceFormPageAtom);
    const [values, setValues] = useRecoilState(createExperienceFormValuesAtom)

    const handleChange = (event) => {
        setValues(values => ({...values, [event.target.name]: event.target.value}))
    }  
    
    useEffect(() => {
        console.log(values)
    }, [values])
    useEffect(() => {
        console.log(currentPage)
    }, [currentPage])

    return {currentPage, setCurrentPage, values, setValues, handleChange};
}