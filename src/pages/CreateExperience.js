import React, { useEffect, useState, useRef } from 'react';
import CreateExperienceForm3 from '../components/CreateExperienceForm3';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import SignUpCreator from '../components/SignUpCreator';
import MainPageStructure from '../components/MainPageStructure';
import useUser from '../hooks/useUser';
import LoadingSpinner from '../components/LoadingSpinner';
import {AnimatePresence, AnimateSharedLayout, motion} from 'framer-motion'
import { Autocomplete, CircularProgress, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, Slider, TextField } from '@mui/material';
import GoogleMaps from '../components/muiFormComponents/PlacesAutocomplete';
import { Form, Formik, useFormikContext } from 'formik';
import languages from '../static/data/languages.json'
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { values } from 'lodash';
import ImageUploading from "react-images-uploading";
import axios from 'axios';
import { ref, uploadBytes } from 'firebase/storage';
import { getItemUrlFromStorage } from '../lib/storage';
import { convertCurrency } from '../lib/currency';
import { db, storage } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { useParams, useNavigate, generatePath, Navigate } from 'react-router-dom';

function CreateExperience() {

    const {loading, userData} = useUser()

    return (
        loading ?
        <LoadingSpinner/>
        :
        userData?.roles?.includes('creator') 
        ?
        <MainPageStructure name='createExperiencePage'>
            <FormikCreateExperienceFormWrapper>
            <div className='px-2 md:p-0 w-full h-full'>
                <h1 className='font-bold text-4xl py-5'>Lets build your experience!</h1>
                <h2 className='font-semibold text-lg text-gray-600 pb-3'>Click on any of the topics to get started</h2>
                <AnimatePresence>
                <CreateExperienceForm/>
                </AnimatePresence>
            </div>
            </FormikCreateExperienceFormWrapper>
        </MainPageStructure>
        :        
        <Navigate to='/creator/register'/>
    )
}

export default CreateExperience;


function FormikCreateExperienceFormWrapper({children, ...props}) {

    const { user } = useAuth()

    return <Formik
        initialValues={{
            title: '',
            type: '',
            location: '',
            language: [],
            category: '',
            description: '',
            overview: false,
            quality: false,
            safety: false,
            connection: false,
            duration: 0,
            ageGroups: [],
            extremeness: [1],
            fullDescription: {},
            images: [],
            locationImage: null,

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
                errors.mainIdea = 'You didnt tell us about your idea yet!';
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
                errors.expectations = 'Please accept the rules'
            }

            // Public Page

            if (!values.description) {
                errors.description = 'Required';
                errors.publicPage = 'You didnt finish the public page';
            }

            // Images

            if (!values.images || values.images.length === 0) {
                errors.images = 'Please upload at least one image';
            }

            // Details

            if (!values.duration || values.duration <= 0) {
                errors.duration = 'Invalid duration';
            }
            if (!values.extremeness || values.extremeness.length === 0) {
                errors.extremeness = 'Invalid rating';
            }
            if (errors.duration || errors.extremeness) {
                errors.details = 'We are missing some details'
            }

            // Full Travel plan

            if (errors.details || !values.fullDescription || Object.keys(values.fullDescription).length !== values.duration) {
                errors.travelPlan = 'The travel plan is incomplete! 🤔'
            }

            return {};
        }}

        onSubmit={(values) => {
            
            const metadata = {
                contentType: 'image/jpeg'
            };

            const experienceDocRef = doc(collection(db, `experiences`))
            

            const uploadImagesToStorage = async() => {

                const imageURLs = []
                await Promise.all(values.images.map(async(image, i) => {
                    const blob = await (await fetch(image.data_url)).blob(); 
                    const storageRef = ref(storage, `experiences/${experienceDocRef.id}/images/${i}.jpeg`)
                    await uploadBytes(storageRef, blob, metadata)
                    const imageUrl = await getItemUrlFromStorage(storageRef)
                    imageURLs.push(imageUrl)
                }))
                return imageURLs
                
            }

            const uploadExperience = async() => {
                
                const imageURLs = await uploadImagesToStorage()

                console.log(imageURLs)

                // TODO: PRICE!!!!

                // const currencyAdjustedPrice = await convertCurrency(values.price, userData.financials.currency.toLowerCase(), 'eur')
                await setDoc(experienceDocRef, {
                    owner: user.uid,
                    createdOn: new Date().valueOf(),
                    title: values.title,
                    description: values.description,
                    type: values.type,
                    location: values.location,
                    language: values.language,
                    category: values.category,
                    duration: values.duration,
                    ageGroups: values.ageGroups,
                    extremeness: values.extremeness,
                    fullDescription: values.fullDescription,
                    images: imageURLs,
                    rating: 0,
                    ratingCount: 0,
                    viewCount: 0,
                    // price: currencyAdjustedPrice,
                }) 
                await setDoc(doc(db, `users/${user.uid}/createdExperiences/${experienceDocRef.id}`), {
                    id: experienceDocRef.id,
                    // ref: doc(db, `experiences/${experienceDocRef.id}`)
                    ref: experienceDocRef,
                })

            }

            uploadExperience()
        }}        
    >
        {children}
    </Formik>
}

function CreateExperienceForm(props) {

    const { values, errors, validateForm, isValid, setFieldValue } = useFormikContext()

    useEffect(() => {
        validateForm()
    }, [])

    // useEffect(() => {
    //     console.log(values)
    //     console.log(errors)

    // }, [values])

    return (
        <Form id='create_experience_form' className='w-full h-full flex flex-wrap justify-between gap-y-5 pb-5' {...props}>
            <ExpandableCard pageId='expectations' title='Our Expectations' description='Couple simple rules we ask you to follow' renderExpanded={<ExpectationsPage/>} incomplete={errors.expectations}/>
            <ExpandableCard pageId='idea' title='Main Idea' description='Basic info' renderExpanded={<MainIdeaPage/>} disabled={errors.expectations} incomplete={errors.mainIdea}/>
            <ExpandableCard pageId='publicPage' title='Public page' description='This is what your experience will look like on the platform' renderExpanded={<PublicPage/>} disabled={errors.mainIdea || errors.expectations} incomplete={errors.publicPage}/>
            <ExpandableCard pageId='images' title='Images' renderExpanded={<ImageUpload/>} renderCollapsed={values.locationImage && <img className='w-full h-full absolute top-0 left-0 -z-10 object-cover brightness-50 opacity-50 contrast-50' src={values.locationImage[(Math.random() * Math.min([values.locationImage.length, 5])) | 0].urls.small}/>} disabled={errors.expectations || errors.mainIdea} incomplete={errors.images}/>
            <ExpandableCard pageId='details' title='Details' description='Find your audience' renderExpanded={<DetailsPage/>} disabled={errors.mainIdea || errors.expectations} incomplete={errors.details}/>
            <ExpandableCard pageId='travelPlan' title='The full travel plan' description='The complete, detailed travel plan' renderExpanded={<TravelPlanPage/>} disabled={errors.mainIdea || errors.expectations || errors.publicPage || errors.details} incomplete={errors.travelPlan}/>
            <SubmitButton/>
        </Form>
    )
}

function Title({text, ...props}) {
    return (
        <h2 {...props} className='font-semibold text-xl'>{text}</h2>
    )
}

function ConfirmButton({ name, label='I agree' }) {

    const { setFieldValue, values } = useFormikContext();

    const [clicked, setClicked] = useState(values[name])

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
    }, [clicked])

    return (
        <motion.button 
        animate={clicked ? 'agreed' : 'notAgreed'}
        variants={variants}
        className={`w-full max-w-md rounded-lg p-4 items-center flex justify-center`} onClick={(e) => {e.preventDefault(); setClicked(!clicked)}}>
            {clicked ? 'Agreed!' : label}
        </motion.button>
    )
}

function MainIdeaPage() {

    const { values, handleChange, setFieldValue, errors } = useFormikContext()

    

    return (
        <FormControl className='w-full h-fit space-y-2'>

            <Title text='Type'/>
            <RadioGroup
                aria-labelledby="Type_section_label_id"
                name="type"
                onChange={handleChange}
                value={values.type}
            >
                <FormControlLabel value="guide" control={<Radio />} label="I will be the guide" className='w-fit'/>
                <FormControlLabel value="noGuide" control={<Radio />} label="This experience doesn't require a guide" className='w-fit'/>
            </RadioGroup>
            {errors.type && <p>{errors.type}</p>}

            <Title text='Location & Language'/>
            <GoogleMaps/>

            <Autocomplete
                multiple
                id='language'
                name='language'
                value={values.language}
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
                />
                )}
            />
            
            <Title text='Category'/>
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
        </FormControl>
    )
}

function ExpectationsPage() {
    return (
        <FormControl className='w-full h-fit space-y-2'>
            <Title text='Overview'/>
            <p>We expect you to upload only the experiences you have personally been on!</p>
            <ConfirmButton name='overview' label='I will'/>


            <Title text='Ensuring Quality'/>
            <p>Please don't rush this process and provide the future explorers with as much insightful information as possible. We are looking for high quality travel plans. We will of course help and guide you through the process! 😁</p>
            <ConfirmButton name='quality' label='I understand'/>


            <Title text='Safety'/>
            <p>We care about our explorers well-being, and we want you to help us ensure a safe trip for every traveler.</p>
            <p>We ask you to thoroughly indicate any activities that might be considered unsafe. P.S. Most of the time, this will not result in a disproval of your travel plan, but rather an indication of safety measures for the activity at question.</p>
            <ConfirmButton name='safety' label='I will be thorough'/>
        
            <Title text='Connection'/>
            <p>We're looking for warm and welcoming people who can help humans and animals connect more meaningfully.</p>
            <p>If you're personally involved with our explorers, we expect you to be prepared, polite, and caring.</p>
            <ConfirmButton name='connection'/>
        </FormControl>
    )
}

function DetailsPage() {

    const { values, handleChange, errors, setFieldValue } = useFormikContext()

    return (
        <FormControl className='w-full h-fit space-y-2'>

            <Title text='How long is your trip?'/>
                <TextField
                    label="Duration (days)"
                    variant="standard"
                    name='duration'
                    type='number'
                    value={values.duration}
                    onChange={handleChange}
                />

            <Title text='Is there a people limit?'/>
                <TextField
                    label="Max participants / group"
                    helperText='You can leave this empty if there is no limit'
                    variant="standard"
                    name='maxParticipants'
                    type='number'
                    value={values.maxParticipants}
                    onChange={handleChange}
                />

            <Title text='Any age restrictions?'/>
                <Autocomplete
                    multiple
                    options={[
                        {value: 'babies', label: 'Newborns and babies'},
                        {value: 'kids', label: 'Kids'},
                        {value: 'youngAdults', label: 'Young Adults'},
                        {value: 'adults', label: 'Adults'},
                        {value: 'grandparents', label: 'Grandparents'},
                    ]}
                    name='ageGroups'
                    id='ageGroups'
                    value={values.ageGroups}
                    onChange={ (_, value) => setFieldValue('ageGroups', value)}
                    getOptionLabel={(option) => option.label}
                    
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Age groups"
                        helperText='Please select all age groups that apply'
                        variant="standard"
                        error={errors.ageGroups}
                    />
                    )}  
                />

            <Title text='Give it a rating of extremeness'/>
            <Slider
                getAriaLabel={() => 'Extreme rating'}
                name='extremeness'
                value={values.extremeness}
                onChange={handleChange}
                valueLabelDisplay="auto"
                step={1}
                max={5}
                min={0}
            />

        </FormControl>
    )
}

function PublicPage() {

    const { values, handleChange } = useFormikContext()

    return (
        <FormControl className='w-full h-full space-y-6'>
            <Title text='Title'/>
            <TextField
                label="Title"
                variant="standard"
                name='title'
                value={values.title}
                onChange={handleChange}
            />
            

            <Title text={`Shortly describe what${values.type === 'guide' ? ' you and your guests' : ' the explorers'}  will do.`}/>
                <TextField
                    label="Description"
                    placeholder='Lets make this exciting'
                    helperText='We will ask you to describe the trip in more detail later on'
                    multiline
                    rows={6}
                    variant="standard"
                    name='description'
                    value={values.description}
                    onChange={handleChange}
                />
        </FormControl>
    )
}

function ImageUpload() {

    const { values, setFieldValue } = useFormikContext()
    // const [images, setImages] = React.useState([]);
    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setFieldValue('images', imageList);
    };

    return (
        <div className="">
        <ImageUploading
            multiple
            value={values.images}
            onChange={onChange}
            maxNumber={20}
            dataURLKey="data_url"
            name='images'
        >
            {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps
            }) => (
            <div className="w-full h-full flex flex-col">
                <button
                className={`w-full h-96 bg-gray-400 rounded-2xl border-2 border-green-900 ${isDragging ? 'bg-opacity-60 border-solid' : 'bg-opacity-30 border-dashed'}`}
                onClick={e => {e.preventDefault(); onImageUpload()}}
                {...dragProps}
                >
                    Click or Drop images here
                </button>
                
                <div className='w-full h-10 flex justify-end items-center'>
                    <button className='w-fit h-fit' onClick={(e) => {e.preventDefault(); onImageRemoveAll()}}>
                        Remove all images
                    </button>
                </div>

                <div className='w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4'>
                    {imageList.map((image, index) => (
                    <div key={index} className="w-44 h-full flex flex-col items-center space-y-2 relative group cursor-pointer">
                        <img className='w-full h-full object-contain md:group-hover:brightness-50 md:group-hover:opacity-70' src={image.data_url} alt={'user_uploaded_image_' + index} onClick={() => onImageUpdate(index)}/>
                        <XIcon className='w-5 h-fit bg-red-500 rounded-lg absolute top-0 right-1 hidden md:group-hover:inline' onClick={() => onImageRemove(index)}/>
                        <div className="w-full h-10 flex justify-center space-x-1 lg:hidden">
                            <button type='button' className='w-fit h-10 px-2 bg-gray-400 opacity-60 rounded-lg text-sm' onClick={() => onImageUpdate(index)}>Update</button>
                            <button type='button' className='w-fit h-10 px-2 bg-gray-400 opacity-60 rounded-lg text-sm' onClick={() => onImageRemove(index)}>Remove</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            )}
        </ImageUploading>
        </div>
    );
    
}

function TravelPlanPage() {

    const { values, handleChange, setFieldValue } = useFormikContext()

    const handleFullDescriptionChange = (e) => {
        setFieldValue('fullDescription', {...values.fullDescription, [e.target.name]: e.target.value} )
    }

    return (
        <FormControl className='w-full h-fit space-y-2'>
            <Title text={`Give a full description of the experience, day by day.`}/>
            <p>In case your experience involves one continuous activity (e.g. sailing through the atlantic ocean), you don't need to repeat yourself. Just fill in the days that <span className='italic'>stand out</span>.</p>
            {Array(values.duration).fill().map((i, day) => 
                <div key={day} className='w-full h-fit py-2'>
                <Title text={`Day ${day+1}`}/>
                <TextField
                    label={`Description of Day ${day+1}`}
                    placeholder='Lets make this informative & clear'
                    helperText='Talk about the activities, sights, meals, hospitalization.'
                    multiline
                    rows={6}
                    variant="standard"
                    name={`day_${day+1}`}
                    value={values.fullDescription[`day_${day+1}`]}
                    onChange={handleFullDescriptionChange}
                />
                </div>
            )}
                
        </FormControl>
    )
}

function ExpandableCard({pageId, title, description, renderCollapsed, renderExpanded, disabled, incomplete}) {

    const { id } = useParams()
    const navigate = useNavigate()
    const openedTitleRef = useRef()

    useEffect(() => {
        if(id && id === pageId && openedTitleRef && openedTitleRef.current) {
            openedTitleRef.current.scrollIntoView({ behavior: 'smooth' })
        }

    }, [id])
    
    return (
    <AnimateSharedLayout type="crossfade">
        
        {id !== pageId &&<motion.div
            whileHover={!disabled && incomplete && {scale: 1.05}}
            onClick={() => {if(!disabled) navigate(generatePath('/create/:id', { id: pageId })) }}
            className={`w-full md:max-w-sm lg:max-w-md xl:max-w-lg h-fit min-h-[15rem] px-4 py-6 ${incomplete ? disabled ? 'bg-form-disabled' : 'bg-form-incomplete' : 'bg-form-complete'} glow rounded-2xl items-center cursor-pointer relative overflow-hidden`}
            layoutId="expandable-card"
            >
                <motion.h2 className='font-semibold text-xl' layoutId="expandable-card-title">{title}</motion.h2>
                <motion.h3 className='text-gray-800 text-sm' layoutId="expandable-card-description">{description}</motion.h3>
                <motion.div layoutId='expandable-card-body'>
                    {/* {error ? <CheckIcon className='w-6 h-6'/> : <CheckIcon className='w-6 h-6'/>} */}
                    {renderCollapsed}
                </motion.div>
        </motion.div>}

        {id && id === pageId &&
        <motion.div
        layout
        className={`w-full h-full absolute md:sticky md:rounded-xl left-0 top-0 md:top-16 p-4 z-10 glow ${incomplete ? disabled ? 'bg-form-disabled' : 'bg-form-incomplete' : 'bg-form-complete'}`}
        layoutId="expandable-card"
        >
            <div ref={openedTitleRef} className='absolute -top-full'></div>
            <motion.div layoutId='expandable-card-body' className='w-full h-full'>
                {/* {error ? <CheckIcon className='w-6 h-6'/> : <CheckIcon className='w-6 h-6'/>} */}
                <motion.h2 className='font-bold text-3xl h-fit max-w-[80%]' layoutId="expandable-card-title">{title}</motion.h2>
                <motion.h3 className='text-gray-800 text-xl h-fit mb-5 max-w-[80%]' layoutId="expandable-card-description">{description}</motion.h3>
                <XIcon className='w-12 h-12 absolute top-2 right-2 cursor-pointer z-20 glow' onClick={() => navigate('/create')}/>
                {renderExpanded}
            </motion.div>
        </motion.div>
        }

    </AnimateSharedLayout>)
}

function SubmitButton() {

    const {errors, isValid, submitForm} = useFormikContext()

    const defaultMessage = 'You are doing great!'
    const [message, setMessage] = useState(defaultMessage)
    const [progress, setProgress] = useState(0)

    const getErrors = () => {
        const totalIncompleteSections = [errors.expectations, errors.mainIdea, errors.publicPage, errors.images, errors.details, errors.travelPlan]
        const incompleteSections = totalIncompleteSections.filter(Boolean)
        setProgress(totalIncompleteSections.length-incompleteSections.length)
        setMessage(incompleteSections[0] || defaultMessage)
        setTimeout(() => {
            setMessage(defaultMessage)
        }, 10000)
    }

    return (
        <button type='submit' 
        onClick={e => { e.preventDefault(); getErrors(); if(isValid) {submitForm()}}} 
        className={`w-full max-w-sm h-16 md:h-28 ${isValid ? 'bg-form-submitButton' : 'bg-form-disabled'} rounded-2xl place-items-center glow relative cursor-pointer font-bold`}>
            {isValid ? 'Submit!' : message}
            {/* <div className='absolute right-4 top-2'>
                <CircularProgress variant="determinate" className='' value={progress/5*100}/>
                <p className=''>{progress + '/5'}</p>
            </div> */}
        </button>
    )
}