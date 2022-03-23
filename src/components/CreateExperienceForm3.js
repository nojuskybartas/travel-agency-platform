import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import Intro from './createExperienceForm/Intro';
import FormPage from './createExperienceForm/FormPage';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion"
import MainIdea from './createExperienceForm/MainIdea';
import useWindowDimensions from '../hooks/useWindowDimensions'
import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import useExperienceForm from '../hooks/useExperienceForm';


export default function CreateExperienceForm3() {

    const {currentPage, setCurrentPage, values, setValues, handleChange} = useExperienceForm()
    
    // const renderFormPage = useCallback(() => {
    //     switch(page) {
    //         case 0:
    //             return <Intro nextPage={nextPage}/>
    //         case 1:
    //             return <MainIdea values={values} setValues={setValues} handleChange={handleChange}/>
    //         case 2:
    //             return <p>Expectations</p>
    //     }
    // }, [page])

    return (
        <div className='w-full h-full overflow-hidden relative'>
            {currentPage != 0 && <Nav/>}
            <FormWrapper>
                <Page pageNumber={1} title='The basics first'>
                <FormControl>
                    <h2 id="experienceTypeRadioButtonLabel" className='text-xl'>Type</h2>
                    <RadioGroup
                        aria-labelledby="experienceTypeRadioButtonLabel"
                        name="type"
                        onChange={handleChange}
                        value={values.type}
                    >
                        <FormControlLabel value="guide" control={<Radio />} label="I will be the guide" />
                        <FormControlLabel value="noGuide" control={<Radio />} label="This experience doesn't require a guide" />
                    </RadioGroup>
                    <h2 id="experienceBasicInfoLabel" className='text-xl mt-10 mb-3'>Location and Language</h2>
                    <TextField 
                        variant="standard"
                        label='City / Country'
                        name='location'
                        value={values.location}
                        onChange={handleChange}
                    />
                    <TextField 
                        variant="standard"
                        label='Languages'
                        name='language'
                        value={values.language}
                        onChange={handleChange}
                    />
                    <h2 id="experienceCategoryInfoLabel" className='text-xl mt-10 mb-3'>Category</h2>
                    <Select
                        variant='standard'
                        labelId="experienceCategoryInfoLabel"
                        value={values.category}
                        onChange={handleChange}
                        name='category'
                        label="Category"
                        >
                        <MenuItem value=''>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value='wellness'>Wellness</MenuItem>
                        <MenuItem value='sports'>Sports</MenuItem>
                        <MenuItem value='exploratory'>Exploratory</MenuItem>
                        <MenuItem value='culture'>Culture</MenuItem>
                        <MenuItem value='history'>History</MenuItem>
                        <MenuItem value='wilderness'>Wilderness</MenuItem>
                    </Select>
                </FormControl>
                </Page>
                <Page pageNumber={2} title='Our expectations'>

                </Page>
                {/* <AnimatePresence>
                    {renderFormPage()}
                </AnimatePresence> */}
            </FormWrapper>
        </div>
    )
}

function Page({children, pageNumber, title, ...props}) {

    const {currentPage, setCurrentPage} = useExperienceForm()    

    const scrollToPageControl = (ref) => {
        if (ref && ref.current &&  pageNumber === currentPage) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const myRef = useRef(null)
    
    useEffect(() => {
        if (currentPage === pageNumber) {
            console.log('scrolling to ', currentPage)
            scrollToRef(myRef)
        }
    }, [currentPage])

    const scrollToRef = (ref) => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // window.scrollTo(0, ref.current.offsetTop)   

    return (
        <motion.div
        {...props}
        ref={myRef}
        onViewportEnter={() => setCurrentPage(pageNumber)} 
        className='w-full h-screen snap-center'>
            <h1 className='text-3xl font-semibold max-w-md mb-5'>{title}</h1>
            {children}
        </motion.div>
    )
}

function FormWrapper({children, ...props}) {

    return (
        <form className='h-full w-full pl-4 pr-14 absolute overflow-y-scroll scrollbar-hide snap-y snap-mandatory' {...props}>
            {children}
        </form>
    )
}

function Nav() {

    const { width } = useWindowDimensions()
    const navbarWidth = Math.floor(width*0.88)

    const x = useMotionValue(0)
    const background = useTransform(x, [-100, 0, navbarWidth], ["rgba(29, 31, 29, 1)", "rgba(29, 31, 29, 0.95)", "rgba(0, 0, 0, 0)"] )
    const navItemColor = useTransform(x, [-100, 0, navbarWidth], ["rgba(222, 240, 223, 1)", "rgba(222, 240, 223, 1)", "rgba(0, 0, 0, 1)"] )
    const translateNavItems = useTransform(x, [-100, 0, navbarWidth], ["0%", "0%", "-150px"] )
    
    return (
        <motion.nav
        drag='x'
        style={{ x, background }}
        dragConstraints={{ left: 0, right: navbarWidth}}
        dragElastic={0.2}
        className='w-screen md:max-w-md h-full absolute -right-32 p-4 flex flex-col justify-center z-10 rounded-l-2xl backdrop-blur-md'
        >
            <div className='w-[calc(100%-8rem)]'>
            <motion.h1 className='text-form-navbarText font-semibold text-3xl mb-5'>Let's get your experience published!</motion.h1>
            <motion.ul 
                style={{ x: translateNavItems, color: navItemColor }}
            >
                <NavItems/>
            </motion.ul>
            </div>
        </motion.nav>
    )
}

function NavItems() {

    const {currentPage, setCurrentPage, values} = useExperienceForm()

    const validateCityLanguage = () => {
        if (!values.location) return false
        if (values.type === 'guide' && !values.language) return false
        return true
    }

    const validateMainIdea = () => {
        if (values.type  && values.category && validateCityLanguage()) return true
        return false
    }

    const validateExpectations = () => {
        if (values.expertise && values.ethics && values.safety && values.connection) return true
        return false
    }

    return (
        <>
        <NavParent title='Main Idea' onClick={() => setCurrentPage(1)} selected={currentPage === 1} complete={validateMainIdea()}>
            <NavChild title='Type' onClick={() => setCurrentPage(1)} complete={values.type}/>
            <NavChild title='City &#38; Language' onClick={() => setCurrentPage(1)} complete={validateCityLanguage()}/>
            <NavChild title='Category' onClick={() => setCurrentPage(1)} complete={values.category}/>
        </NavParent>
        <NavParent title='Our Expectations' onClick={() => setCurrentPage(2)} selected={currentPage === 2} complete={validateExpectations()}>
            <NavChild title='Expertise' onClick={() => setCurrentPage(2)} complete={values.expertise}/>
            <NavChild title='Ethics' onClick={() => setCurrentPage(2)} complete={values.ethics}/>
            <NavChild title='Safety' onClick={() => setCurrentPage(2)} complete={values.safety}/>
            <NavChild title='Connection' onClick={() => setCurrentPage(2)} complete={values.connection}/>
        </NavParent>
        <NavParent title='Public Page' onClick={() => setCurrentPage(3)} selected={currentPage === 3}>
            <NavChild title='Activities' onClick={() => setCurrentPage(3)} complete={values.activities}/>
            <NavChild title='Requirements' onClick={() => setCurrentPage(3)} complete={values.requirements}/>
            <NavChild title='Title' onClick={() => setCurrentPage(3)} complete={values.title}/>
            <NavChild title='Photos' onClick={() => setCurrentPage(3)} complete={values.photos}/>
        </NavParent>
        <NavParent title='General settings' onClick={() => setCurrentPage(4)} selected={currentPage === 4}>
            <NavChild title='Group size' onClick={() => setCurrentPage(4)} complete={values.groupSize}/>
            <NavChild title='Availability' onClick={() => setCurrentPage(4)} complete={values.availability}/>
            <NavChild title='Pricing' onClick={() => setCurrentPage(4)} complete={values.pricing}/>
            <NavChild title='Cancellation' onClick={() => setCurrentPage(4)} complete={values.cancellation}/>
        </NavParent>
        </>
    )
}

function NavParent({title, onClick, complete, selected, ...props}) {

    const variants = {
        open: { 
            height: 'auto', 
            opacity: 1, 
            y: 0,
            transition: { 
                ease: 'easeOut',
                duration: 0.3
            }
        },
        closed: { 
            height: '0%', 
            opacity: [0.2, 0], 
            y: -50,
            transition: { 
                ease: 'easeOut',
                duration: 0.3
            }
        },
        
    }

    return (
        <motion.li 
        className='w-full h-full border-2 border-solid border-form-navbarBorder rounded-2xl mt-2 px-2'
        whileTap={{ scale: 0.95 }}
        style={selected && {scale: 1.05}}
        >
            <a className='w-full h-fit min-h-[3rem] cursor-pointer flex items-center justify-between' onClick={onClick}>
                {complete ? <CheckCircleIcon className='w-5 h-5 text-form-navbarBorderActive'/> : <ExclamationCircleIcon className='w-5 h-5 text-form-navbarBorder'/>}
                <h3 className=''>{title}</h3>  
            </a> 
            <motion.ul
            variants={variants} 
            animate={selected ? "open" : "closed"}
            >
                {selected && props.children}
            </motion.ul>
            
        </motion.li>
    )
}

function NavChild({title, onClick, complete}) {

    return (
        <li className='w-full h-fit min-h-7 text-sm mb-2'>
            <a className='w-full h-fit flex items-center justify-between cursor-pointer' onClick={onClick}>
                {complete ? <CheckCircleIcon className='w-5 h-5 text-form-navbarBorderActive'/> : <ExclamationCircleIcon className='w-5 h-5 text-form-navbarBorder'/>}
                <h4 className=''>{title}</h4>
            </a>
        </li>
    )
}