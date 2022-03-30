import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { createExperienceFormPageAtom, createExperienceFormValuesAtom, createExperienceFormNavbarAtom, createExperienceFormNavbarActionAtom } from '../atoms/createExperienceFormAtom';
import useExperienceFormValues from './useExperienceFormValues';

export default function useExperienceForm() {
    const [currentPage, setCurrentPage] = useRecoilState(createExperienceFormPageAtom);
    // const [values, setValues] = useRecoilState(createExperienceFormValuesAtom)
    const [navOpen, setNavOpen] = useRecoilState(createExperienceFormNavbarAtom)
    const [navbarAction, setNavbarAction] = useRecoilState(createExperienceFormNavbarActionAtom)
    // const { values } = useExperienceFormValues()
    // const handleChange = (event) => {
    //     setValues(values => ({...values, [event.target.name]: event.target.value}))
    // }  

    // const validateCityLanguage = () => {
    //     if (!values.location) return false
    //     if (values.type === 'guide' && !values.language) return false
    //     return true
    // }

    // const validateMainIdea = () => {
    //     if (values.type  && values.category && validateCityLanguage()) return true
    //     return false
    // }

    // const validateExpectations = () => {
    //     if (values.overview && values.quality && values.safety && values.connection) return true
    //     return false
    // }

    // const validate = {
    //     cityLanguage: validateCityLanguage(),
    //     mainIdea: validateMainIdea(),
    //     expectations: validateExpectations(),
    // }
    
    // useEffect(() => {
    //     console.log(values)
    // }, [values])
    // useEffect(() => {
    //     console.log(navbarAction)
    // }, [navbarAction])
    // useEffect(() => {
    //     console.log(currentPage)
    // }, [currentPage])

    return {currentPage, setCurrentPage, navOpen, setNavOpen, navbarAction, setNavbarAction};
}

