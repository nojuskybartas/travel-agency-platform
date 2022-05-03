import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import TextInput from '../components/form/TextInput';
import Header from '../components/Header';
import { DatePickerField } from '../components/form/DatePickerField';
import BoxSelect from '../components/form/BoxSelect';
import CountrySelect from '../components/form/CountrySelect';
import GooglePlacesInput from '../components/form/GooglePlacesInput';
import CurrencySelector from '../components/form/CurrencySelector';
import MotivationInput from '../components/form/MotivationInput';
import ProfilePictureUpload from '../components/form/ProfilePictureUpload';
import { auth, db, storage } from '../lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { getImagesFromStorageUrl, refreshUserData } from '../lib/storage';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import SuccessModal from '../components/SuccessModal';
import LoginModal from '../components/LoginModal';
import { Navigate, useNavigate } from 'react-router-dom';
import MainPageStructure from '../components/MainPageStructure';
import { useRecoilState } from 'recoil';
import { loginState } from '../atoms/navbarAtom';
import { TextInputField } from '../components/form/TextInputField';
import GoogleMaps from '../components/form/GooglePlacesInput';
import AddressAutofill from '../components/form/AddressAutofill';
import AddressInput from '../components/form/AddressInput';
import ImageUploadWithDropzone from '../components/form/ImageUploadWithDropzone';
import ProgressiveImage from 'react-progressive-image';
import {motion} from 'framer-motion'
import useWindowDimensions from '../hooks/useWindowDimensions';
import PhoneNumberInput from '../components/form/PhoneNumberInput';
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';
import LanguagesInput from '../components/form/LanguagesInput';
import LoadingSpinner from '../components/LoadingSpinner';
import useUser from '../hooks/useUser';
import axios from '../lib/axios';


function RegisterCreator() {

    const [uploading, setUploading] = useState(false)
    const {isMobile} = useWindowDimensions()
    const {loading, userData} = useUser()
    const [travelImage, setTravelImage] = useState({
        urls: {
            small: 'https://images.unsplash.com/photo-1474755032398-4b0ed3b2ae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU1Nzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDk0Mjc5NjQ&ixlib=rb-1.2.1&q=80&w=400',
            regular: 'https://images.unsplash.com/photo-1474755032398-4b0ed3b2ae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU1Nzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDk0Mjc5NjQ&ixlib=rb-1.2.1&q=80&w=1080',
        },
        alt_description: 'woman holding persons hand walking on gray concrete steps'
    })

    const fetchRandomTravelImage = () => {
        const url = 'https://api.unsplash.com/photos/random?query=travel&client_id=' + process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
        axios.get(url).then(res => {
            console.log(res.data)
            setTravelImage(res.data)
        })
    }

    useEffect(() => {
        // fetchRandomTravelImage()
    }, [])
    
    return (
    loading ?
    <LoadingSpinner/>
    :
    userData.roles?.includes('creator')
    ?
    <Navigate to='/create'/>
    :
    <MainPageStructure name='registerCreatorPage' loading={uploading}>

        {userData.roles?.includes('creator_pending') && 
        <SuccessModal 
        title={<h2 className='pt-20 text-xl md:text-4xl font-semibold w-full text-center'>Hang tight!</h2>} 
        successMessage={
        <div className='text-lg space-y-2'>
            <h2>We've received your application, and are currently reviewing it</h2>
            <h2>You'll receive an email from us soon 😉</h2>
        </div>} 
        destination='/home'/>}

        <div className='text-center justify-center items-center flex flex-col w-full h-full'>
            <h1 className='text-2xl font-extrabold pt-5'>Become a creator 😍</h1>
            <h2 className='pb-5'>Submit your application to join our creator community</h2>
            <Formik
                initialValues={{ 
                        dateOfBirth: '',
                        phoneNumber: '',
                        nationality: '',
                        profession: '',
                        motivation: '',
                        picture: null,
                        address: '',
                        zipCode: '',
                        city: '',
                        stateOfAddress: '',
                    }}
                validate={values => {
                    const errors = {};

                    if (!values.picture) {
                        errors.picture = 'Required';
                    }

                    if (!values.dateOfBirth) {
                        errors.dateOfBirth = 'Required';
                    }
                    if (!values.nationality) {
                        errors.nationality = 'Required';
                    }
                    if (!values.profession) {
                        errors.profession = 'Required';
                    }

                    if (!values.phoneNumber) {
                        errors.phoneNumber = 'Required';
                    } else if (!isPossiblePhoneNumber(values.phoneNumber) || !isValidPhoneNumber(values.phoneNumber)) {
                        errors.phoneNumber = 'Invalid phone number'
                    }
                    if (!values.address) {
                        errors.address = 'Required';
                    }
                    if (!values.zipCode) {
                        errors.zipCode = 'Required';
                    }
                    if (!values.city) {
                        errors.city = 'Required';
                    }
                    if (!values.stateOfAddress) {
                        errors.stateOfAddress = 'Required';
                    }

                    if (!values.motivation) {
                        errors.motivation = 'Required';
                    }

                    return errors;
                }}

                onSubmit={(values, { setSubmitting, setStatus }) => {

                    setSubmitting(true)
                    setUploading(true)

                    const metadata = {
                        contentType: 'image/jpeg'
                    };
                    const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile/profileImage.jpeg`)

                    const uploadData = async() => {
                        await uploadBytes(storageRef, values.picture, metadata)
                        const pictureURL = await getImagesFromStorageUrl(`users/${auth.currentUser.uid}/profile`)
                        let pictureThumbs = []
                        while (true) {
                            pictureThumbs = await getImagesFromStorageUrl(`users/${auth.currentUser.uid}/profile/thumbs`)
                            if (pictureThumbs?.length === 3) break;
                        }
                        
                        await updateDoc(doc(db, `users/${auth.currentUser.uid}/accountDetails/private`), {
                            phoneNumber: values.phoneNumber,
                            address: {
                                address: values.address,
                                city: values.city,
                                zipCode: values.zipCode,
                                state: values.stateOfAddress
                            },
                        }).catch(err => {setUploading(false); setStatus('error')})

                        await updateDoc(doc(db, `users/${auth.currentUser.uid}/accountDetails/public`), {
                            picture: {
                                original: pictureURL[0],
                                small: pictureThumbs.find(url => url.includes('256x256')),
                                regular: pictureThumbs.find(url => url.includes('512x512')),
                                large: pictureThumbs.find(url => url.includes('1080x1080')),
                            },
                            profession: values.profession,
                            nationality: values.nationality,
                            dateOfBirth: values.dateOfBirth,
                            motivation: values.motivation,
                        }).catch(err => {setUploading(false); setStatus('error')})

                        const response = await axios({
                            method: 'post',
                            url: `/register/creator?uid=${auth.currentUser.uid}`
                        }).catch(err => {setUploading(false); setStatus('error')})

                        setUploading(false)
                        setStatus('success')
                    }

                    uploadData()
                }}
            >
            {({ values, errors, isValid, isSubmitting, setValues, setFieldValue, submitForm, touched, status }) => (
            <Form className='w-full h-full p-5 space-y-10'>

                <Section title='Here are a couple reasons why!' className='text-left space-y-2'>
                    <p>1. You get to meet new people from all over the world</p>
                    <p>2. You can generate a side-income</p>
                    <p>Convinced? Let's get started!</p>
                    <hr className='bg-primary w-full h-[2px]'/>
                </Section>
                
                <div className='w-full flex flex-wrap space-y-10 md:space-y-2 items-center md:justify-between'>
                    <Section title='First, upload a photo of yourself:' className='w-full md:w-fit space-y-4 flex flex-col items-center md:inline'>
                        <ProfilePictureUpload name='picture'/>
                    </Section>
                    <Section title='Some information about you:' className='w-full md:w-fit space-y-2 flex flex-col items-center md:inline'>
                        <DatePickerField name='dateOfBirth'/>
                        {/* <BoxSelect name='showAge' label='Show age'/> */}
                        <CountrySelect name='nationality'/>
                        <TextInputField name='profession' label='Profession'/>
                    </Section>
                </div>

                
                <div className='w-full flex flex-wrap space-y-10 md:space-y-0 items-center md:justify-between'>
                    <Section title='Contact information' className='w-full md:w-fit md:min-w-[448px] space-y-2 flex flex-col items-center md:inline'>
                        <PhoneNumberInput/>
                        <AddressInput/>
                    </Section>
                    <Section className='w-2/5 h-full'>
                    {!isMobile && travelImage &&
                        <ProgressiveImage
                        src={travelImage.urls.regular}
                        placeholder={travelImage.urls.small}>
                            {(src, loading) => (
                                <motion.img animate={loading ? {opacity: 0.3, filter: 'blur(4px)'} : {opacity: 0.9, filter: 'blur(0px)', }} src={src} className='w-full h-full object-fill rounded-2xl border-4 border-solid border-primary' alt={travelImage.alt_description}/>
                            )}
                        </ProgressiveImage>
                    }
                    </Section>
                </div>
                

                <Section title='Tell us a bit about why you would like to join our community. We will show this part to all our members, so make it interesting! :)'>
                    <MotivationInput name='motivation'/>
                </Section>
              
                <motion.button 
                whileHover={{opacity: 0.9, scale: 1.1}} 
                // animate={touched && isValid && !isSubmitting && {
                //     rotate: [0, 1, 2, 5, 8, 1, 0],
                // }}
                // transition={{
                //     duration: 1,
                //     ease: "linear",
                //     repeat: Infinity,
                //     repeatDelay: 1.5,
                //     // scale: {duration: 0.5, type: 'spring'}
                // }}
                disabled={isSubmitting}
                onClick={() => {submitForm(); console.log(errors)}} 
                className={`mt-10 w-1/3 h-10 ${isValid ? 'bg-primary' : 'bg-secondary'} rounded-3xl text-white`} 
                type='button'
                >
                    Submit
                </motion.button>

                {status === 'error' && <SuccessModal title={<h2 className='text-2xl h-full items-end'>Uh Oh!</h2>} successMessage={<h2 className='text-lg h-full items-end'>Something went wrong. Please try again</h2>}/>}
                
                {status === 'success' && <SuccessModal successMessage={<h2 className='text-lg h-full items-end'>You have successfully submitted your application to become a creator!<br/><br/> We will review it ASAP :) <br/><br/> Super excited to see what you&#180;ll share with us!</h2>} destination='/home'/>}
            
            </Form>)}
            </Formik>
        </div>
    </MainPageStructure>
  )
}

function Section({children, title, ...props}) {

    return (
        <div className='w-full h-fit flex flex-col items-center' {...props}>
            <h2 className='font-semibold text-lg text-left w-full h-fit pb-1'>{title}</h2>
            {children}
        </div>
    )
}

export default RegisterCreator;
