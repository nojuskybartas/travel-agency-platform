import React, { useEffect, useState } from 'react'
import useExperienceForm from '../../hooks/useExperienceForm'
import { motion } from 'framer-motion'
import useExperienceFormValues from '../../hooks/useExperienceFormValues'
import { Field, useFormikContext } from 'formik'

function ConfirmButton({ name }) {

    const [clicked, setClicked] = useState(false)

    const { errors, setFieldValue, values } = useFormikContext();
    const { currentPage, setCurrentPage, setNavbarAction } = useExperienceForm()

    const variants = {
        agreed: {
            backgroundColor: 'hsla(139, 25%, 45%, 1)',
            height: '2.5rem',
        },
        notAgreed: {
            backgroundColor: 'hsla(139, 8%, 45%, 1)',
            height: '3rem',
        }
    }

    useEffect(() => {

        setFieldValue(name, clicked)
        if (clicked === true) {
            setCurrentPage(page => page+1)
            // console.log(currentPage, errors.expectations)
            // if (currentPage === 5 && errors.expectations) return
            // if ([2,3,4,5].includes(currentPage)) {
            //     setNavbarAction(true)
            //     setCurrentPage(6)
            // } else {
            //     setCurrentPage(page => page+1)
            // }
        }
    }, [clicked])

    return (
        <motion.button 
        animate={clicked ? 'agreed' : 'notAgreed'}
        variants={variants}
        className={`w-full rounded-lg p-4 items-center flex justify-center`} onClick={(e) => {e.preventDefault(); setClicked(!clicked)}}>
            {clicked ? 'Agreed!' : 'I agree'}
        </motion.button>
    )
}

export default ConfirmButton