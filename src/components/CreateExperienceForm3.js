import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import Intro from './createExperienceForm/Intro';
import FormPage from './createExperienceForm/FormPage';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { AnimatePresence, motion, useMotionValue, useTransform, useAnimation, useViewportScroll } from "framer-motion"
import MainIdea from './createExperienceForm/MainIdea';
import useWindowDimensions from '../hooks/useWindowDimensions'
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import useExperienceForm from '../hooks/useExperienceForm';
import useExperienceFormValues from '../hooks/useExperienceFormValues';
import { useInView } from 'react-intersection-observer';
import ConfirmButton from './createExperienceForm/ConfirmButton';
import { Form, Formik, useFormikContext } from 'formik';
import languages from '../static/data/languages.json'
import GoogleMaps from './muiFormComponents/PlacesAutocomplete';
import ErrorFocus from './createExperienceForm/ErrorFocus.js'

export default function CreateExperienceForm3() {

    const { currentPage } = useExperienceForm()

    return (
        <div className='w-full h-full overflow-hidden relative'>
            <Formik
                initialValues={{
                    type: '',
                    location: '',
                    language: '',
                    category: '',
                    overview: false,
                    quality: false,
                    safety: false,
                    connection: false,
                    duration: 0,
                    ageGroups: [],

                }}
                validate={values => {
                    const errors = {};

                    // Main idea

                    if (!values.type) {
                        errors.type = 'Required';
                    }
                    if (!values.location) {
                        errors.location = 'Required';
                    }
                    if (!values.language) {
                        errors.language = 'Required';
                    }
                    if (!values.category) {
                        errors.category = 'Required';
                    }
                    if (!values.location || (values.type === 'guide' && !values.language)) {
                        errors.cityLanguage = 'Required';
                    }
                    if (errors.type || errors.category || errors.cityLanguage) {
                        errors.mainIdea = 'Required';
                    }

                    // Expectations

                    if (!values.overview) {
                        errors.overview = 'Please confirm';
                    }
                    if (!values.quality) {
                        errors.quality = 'Please confirm';
                    }
                    if (!values.safety) {
                        errors.safety = 'Please confirm';
                    }
                    if (!values.connection) {
                        errors.connection = 'Please confirm';
                    }
                    if (errors.overview || errors.quality || errors.safety || errors.connection) {
                        errors.expectations = 'Please confirm'
                    }

                    // Public Page

                    if (!values.description) {
                        errors.description = 'Required';
                    }

                    return errors;
                }}
            >
            <>
                {currentPage != 0 && <Nav/>}
                <FormItems/>
                <ErrorFocus/>
            </>
            </Formik>
        </div>
    )
}

function FormItems() {

    const { values, handleChange, errors, setFieldValue } = useFormikContext()

    return (
        <FormWrapper>
            <Page pageNumber={1} title='The basics first'>
                <Section title='Type'>
                    <RadioGroup
                        aria-labelledby="Type_section_label_id"
                        name="type"
                        onChange={handleChange}
                        value={values.type}
                    >
                        <FormControlLabel value="guide" control={<Radio />} label="I will be the guide" />
                        <FormControlLabel value="noGuide" control={<Radio />} label="This experience doesn't require a guide" />
                    </RadioGroup>
                </Section>
                
                <Section title='Location and Language'>

                    <GoogleMaps/>

                    <Autocomplete
                        multiple
                        disabled={values.type !== 'guide'}
                        options={languages}
                        onChange = {(event, value) => setFieldValue('language', value)}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                        <TextField 
                            {...params}
                            variant="standard"
                            disabled={values.type !== 'guide'}
                            label='Languages'
                            helperText='Languages that the explorers should know to participate in your guided activities'
                            name='language'
                            value={values.language}
                            onChange={handleChange}
                        />
                        )}
                    />
                   
                </Section>
                
                <Section title='Category'>
                    <Select
                        variant='standard'
                        labelId="Category_section_label_id"
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
                </Section>
            </Page>
            <Page pageNumber={2} title='Our expectations'>
                <Section title='Overview'>
                    <p>We expect you to upload only the experiences you have personally been on!</p>
                    <ConfirmButton name='overview'/>
                </Section>
            </Page>
            <Page pageNumber={3} title='Ensuring Quality'>
                <Section>
                    <p>Please don't rush this process and provide the future explorers with as much insightful information as possible. We are looking for high quality travel plans. We will of course help and guide you through the process! 😁</p>
                    <ConfirmButton name='quality'/>
                </Section>
            </Page>
            <Page pageNumber={4} title='Safety'>
                <Section>
                    <p>We care about our explorers well-being, and we want you to help us ensure a safe trip for every traveler.</p>
                    <p>We ask you to thoroughly indicate any activities that might be considered unsafe. P.S. Most of the time, this will not result in a disproval of your travel plan, but rather an indication of safety measures for the activity at question.</p>
                    <ConfirmButton name='safety'/>
                </Section>
            </Page>
            <Page pageNumber={5} title='Connection'>
                <Section>
                    <p>We're looking for warm and welcoming people who can help humans and animals connect more meaningfully.</p>
                    <p>If you're personally involved with our explorers, we expect you to be prepared, polite, and caring.</p>
                    <ConfirmButton name='connection'/>
                </Section>
            </Page>
            { !errors.expectations && <>
            
            <Page pageNumber={6} title='Lets set up your public page'>
                <p className='text-sm mb-10'>This is what your experience will look like on the platform</p>
                <Section title={`Describe what${values.type === 'guide' ? ' you and your guests' : ' the explorers'}  will do.`}>
                    <TextField
                        label="Description"
                        placeholder='Lets make this exciting'
                        multiline
                        rows={6}
                        variant="standard"
                        name='description'
                        value={values.description}
                        onChange={handleChange}
                    />
                </Section>
            </Page>
            <Page pageNumber={7} title='Details'>
                <Section title='How long is your trip?'>
                    <TextField
                        label="Duration (days)"
                        variant="standard"
                        name='duration'
                        type='number'
                        value={values.duration}
                        onChange={handleChange}
                    />
                </Section>
                <Section title='Is there a people limit?'>
                    <TextField
                        label="Max participants / group"
                        helperText='You can leave this empty if there is no limit'
                        variant="standard"
                        name='maxParticipants'
                        type='number'
                        value={values.maxParticipants}
                        onChange={handleChange}
                    />
                </Section>
                <Section title='Any age restrictions?'>
                    
                    <Autocomplete
                        multiple
                        options={[
                            {value: 'kids', label: 'Kids'},
                            {value: 'youngAdults', label: 'Young Adults'},
                            {value: 'adults', label: 'Adults'},
                            {value: 'grandparents', label: 'Grandparents'},
                        ]}
                        name='ageGroups'
                        id='ageGroups'
                        value={values.ageGroups}
                        onChange = {(event, value) => setFieldValue('ageGroups', value)}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Age groups"
                            helperText='Please select all age groups that apply'
                            variant="standard"
                        />
                        )}
                    />
                </Section>
            </Page>
            
            </>}
        </FormWrapper>
    )
}

function Page({children, pageNumber, title, ...props}) {
    
    const {currentPage, setCurrentPage, navbarAction, setNavbarAction} = useExperienceForm()    
    const ref = useRef(null)

    const scrollToRef = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth', alignToTop: true })
    }

    useEffect(() => {
        if (ref && ref.current && currentPage === pageNumber) {
            scrollToRef(ref)
        }
    }, [currentPage])

    const handleScrollEvents = () => {
        if (!navbarAction) {
            setCurrentPage(pageNumber)
        } else if (currentPage === pageNumber) {
            setNavbarAction(false)
        }
    }

    return (
        <motion.div
        {...props}
        ref={ref}
        className='w-full md:w-1/2 h-screen snap-start'>
            <motion.h1 
            onViewportEnter={handleScrollEvents} 
            className='text-3xl font-semibold max-w-md pt-5 pb-5'>{title}</motion.h1>
            {children}
        </motion.div>
    )
}

function Section({children, title}) {

    return (
        <div className='w-full h-fit pb-7'>
            {title && <h2 id={`${title}_section_label_id`} className='font-semibold text-xl pb-2'>{title}</h2>}
            <FormControl className='w-full h-fit space-y-2'>
                {children}
            </FormControl>
        </div>
    )
}

function FormWrapper({children, ...props}) {
    const { values } = useFormikContext()
    useEffect(() => {
        console.log(values)
    }, [values])
    return (
        <Form className='h-screen w-full pl-4 pr-14 overflow-y-scroll scrollbar-hide snap-y' {...props}>
            {children}
        </Form>
    )
}

function Nav() {

    const { navOpen, setNavOpen } = useExperienceForm()

    const { width, isMobile } = useWindowDimensions()
    const navbarWidth = Math.floor(width*0.9)

    const x = useMotionValue(0)
    const background = useTransform(x, [0, navbarWidth], ["rgba(0, 0, 0, 0)", "rgba(29, 31, 29, 0.7)"] )
    const navItemColor = useTransform(x, [-100, 0, navbarWidth], ["rgba(222, 240, 223, 1)", "rgba(0, 0, 0, 1)", "rgba(222, 240, 223, 1)"] )
    const translateNavItems = useTransform(x, [-100, 0, navbarWidth], ["0%", "0%", "-12px"] )
    const animControls = useAnimation();

    const variants = {
        closed: {
            x: '90%',
        },
        open: {
            x: '0%'
        }
    }

    // Temporary: for now rendering a motion component for mobile devices and normal html for wider screens. Later must fix code duplication
    return ( isMobile ? 
        <motion.nav
        variants={variants}
        drag='x'
        style={{ x, background, touchAction: 'none' }}
        dragConstraints={navOpen ? { left: 0, right: 0} : { left: 10}}
        dragElastic={0.1}
        animate={animControls}
        onDragEnd={(event, info) => {
            if (navOpen) {
                if (info.point.x > 20) {
                    setNavOpen(false)
                    animControls.start('closed');
                }
            } else {
                if (info.point.x <= width-20) {
                    setNavOpen(true)
                    animControls.start('open');
                } else {
                    animControls.start('closed')
                }
            }
        }}
        className='w-full h-full absolute flex flex-col justify-center right-0 rounded-l-2xl backdrop-blur-md overflow-hidden z-[999]'
        >
            <div className='w-full h-screen overflow-y-scroll scrollbar-hide touch-none p-4'>
            <motion.h1 
            style={{ color: navItemColor }}
            className='font-semibold text-3xl pb-5 pt-5 w-2/3'
            >
                Let's get your experience published!
            </motion.h1>
            <motion.ul 
            style={{ color: navItemColor, x: translateNavItems }}
            className='w-full'
            >
                <NavItems/>
            </motion.ul>
            </div>
        </motion.nav>
        :
        <nav
            className='w-full max-w-md h-full absolute flex flex-col justify-center z-10 right-0 rounded-l-2xl md:rounded-2xl backdrop-blur-md bg-footer'
        >
            <div className='w-full h-screen overflow-y-scroll scrollbar-hide touch-none p-8'>
            <h1 
            className='font-semibold text-3xl pb-5 pt-5 w-2/3 text-form-navbarText'
            >
                Let's get your experience published!
            </h1>
            <ul 
            className='w-full text-form-navbarText'
            >
                <NavItems/>
            </ul>
            </div>
        </nav>
    )
}

function NavItems() {

    const {currentPage, setCurrentPage} = useExperienceForm()
    const { values, errors } = useFormikContext();

    return (
        <>
        <NavParent title='Main Idea' onClick={() => setCurrentPage(1)} selected={currentPage === 1} complete={!errors.mainIdea}>
            <NavChild title='Type' onClick={() => setCurrentPage(1)} complete={values.type}/>
            <NavChild title='City &#38; Language' onClick={() => setCurrentPage(1)} complete={!errors.cityLanguage}/>
            <NavChild title='Category' onClick={() => setCurrentPage(1)} complete={values.category}/>
        </NavParent>
        <NavParent title='Our Expectations' onClick={() => setCurrentPage(2)} selected={[2,3,4,5].includes(currentPage)} complete={!errors.expectations}>
            <NavChild title='Quality' onClick={() => setCurrentPage(3)} complete={values.quality}/>
            <NavChild title='Safety' onClick={() => setCurrentPage(4)} complete={values.safety}/>
            <NavChild title='Connection' onClick={() => setCurrentPage(5)} complete={values.connection}/>
        </NavParent>
        <NavParent title='Public Page' onClick={() => setCurrentPage(6)} selected={!errors.expectations && currentPage === 6} disabled={errors.expectations ? true : false}>
            <NavChild title='Description' onClick={() => setCurrentPage(6)} complete={values.description}/>
            <NavChild title='Requirements' onClick={() => setCurrentPage(6)} complete={values.requirements}/>
            <NavChild title='Title' onClick={() => setCurrentPage(6)} complete={values.title}/>
            <NavChild title='Photos' onClick={() => setCurrentPage(6)} complete={values.photos}/>
            <NavChild title='Activities' onClick={() => setCurrentPage(6)} complete={values.activities}/>
        </NavParent>
        <NavParent title='General settings' onClick={() => setCurrentPage(4)} selected={false}>
            <NavChild title='Group size' onClick={() => setCurrentPage(4)} complete={values.groupSize}/>
            <NavChild title='Availability' onClick={() => setCurrentPage(4)} complete={values.availability}/>
            <NavChild title='Pricing' onClick={() => setCurrentPage(4)} complete={values.pricing}/>
            <NavChild title='Cancellation' onClick={() => setCurrentPage(4)} complete={values.cancellation}/>
        </NavParent>
        </>
    )
}

function NavParent({title, onClick, complete, selected, disabled, ...props}) {

    const {setNavbarAction} = useExperienceForm()

    const containerVariants = {
        expanded: { 
            height: 'auto', 
            opacity: 1, 
            y: 0,
            transition: { 
                ease: 'easeOut',
                duration: 0.3
            }
        },
        collapsed: { 
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
        className={`w-full h-full border-2 border-solid ${disabled ? 'border-form-navbarBorderDisabled text-form-navbarBorderDisabled' : 'border-form-navbarBorder'} rounded-2xl mt-2 px-2`}
        whileTap={disabled ? {} : { scale: 0.95 }}
        // style={selected && {scale: 1.05}}
        >
            <a 
            onClick={disabled ? Function() : () => {setNavbarAction(true); onClick()}}
            className='w-full h-fit min-h-[3rem] cursor-pointer flex items-center justify-between'>
                {complete ? <CheckCircleIcon className='w-5 h-5 text-form-navbarBorderActive'/> : <ExclamationCircleIcon className='w-5 h-5 text-form-navbarBorder'/>}
                <h3 className=''>{title}</h3>  
            </a> 
            <motion.ul
            variants={containerVariants} 
            animate={selected ? "expanded" : "collapsed"}
            >
                {selected && props.children}
            </motion.ul>
            
        </motion.li>
    )
}

function NavChild({title, onClick, complete}) {

    const {setNavbarAction} = useExperienceForm()

    return (
        <li 
        className='w-full h-fit min-h-7 text-sm mb-2'>
            <a className='w-full h-fit flex items-center justify-between cursor-pointer' onClick={() => {setNavbarAction(true); onClick()}}>
                {complete ? <CheckCircleIcon className='w-5 h-5 text-form-navbarBorderActive'/> : <ExclamationCircleIcon className='w-5 h-5 text-form-navbarBorder'/>}
                <h4 className=''>{title}</h4>
            </a>
        </li>
    )
}