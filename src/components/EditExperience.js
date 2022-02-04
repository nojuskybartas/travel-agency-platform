import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import { Form, Formik } from 'formik';
import TextInput from '../components/form/TextInput';
import { DatePickerField } from '../components/form/DatePickerField';
import BoxSelect from '../components/form/BoxSelect';
import CountrySelect from '../components/form/CountrySelect';
import GooglePlacesInput from '../components/form/GooglePlacesInput';
import CurrencySelector from '../components/form/CurrencySelector';
import MotivationInput from '../components/form/MotivationInput';
import PictureUpload from '../components/form/PictureUpload';
import { auth, db, storage } from '../lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { getImagesFromStorageUrl, refreshUserData } from '../lib/storage';
import { doc, updateDoc } from 'firebase/firestore';
import ReactModal from 'react-modal';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { conversionRateAtom } from '../atoms/currencyAtom';
import YoutubeEmbed from './YoutubeEmbed';

function EditExperience({show, setShow, experience}) {

    const [userDetails, setUserDetails] = useRecoilState(userState)
    const currencyRates = useRecoilValue(conversionRateAtom)

    const handleLoginShow = () => {
        setShow(!show)
    }

    useEffect(() => {
        show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
        // return () => document.body.style.overflow = 'unset';
     }, [show]);

    return (
        <ReactModal
        isOpen={show}
        className='loginModal md:w-5/6 md:h-5/6 overflow-y-scroll scrollbar-hide'
        overlayClassName='loginModalOverlay'
        onRequestClose={handleLoginShow}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        >
        {/* <CheckCircleIcon className='absolute bottom-2 right-2 rounded-full w-12 h-12 '/> */}
        <Formik
            initialValues={{ 
                experienceTitle: experience.title,
                experienceDescription: experience.description,
                price: experience.price * currencyRates[userDetails?.financials ? userDetails.financials.currency : 'eur'],
                minAge: experience.minAge,
                locations: experience.locations,
                peopleLimit: experience.peopleLimit,
            }}
            

            onSubmit={(values, { setSubmitting }) => {

                console.log(values)

            //     if (userDetails.type !== 'regular') {
            //         updateDoc(doc(db, `users/${auth.currentUser.uid}/account/details`), {
            //             profession: values.profession,
            //             nationality: values.nationality,
            //             address: values.address,
            //             dateOfBirth: values.dateOfBirth,
            //             motivation: values.motivation,
            //             showAge: values.showAge
            //         })
            //     }

            //     updateDoc(doc(db, `users/${auth.currentUser.uid}/account/financials`), {
            //         currency: values.currency
            //     })

            //     // Image upload to firebase storage
            //     const metadata = {
            //         contentType: 'image/jpg'
            //     };

            //     if (values.picture) {
            //         const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile/profileImage.jpg`)
            //         uploadBytes(storageRef, values.picture, metadata).then((snapshot) => {
            //             getImagesFromStorageUrl(`users/${auth.currentUser.uid}/profile`).then(picture => {
            //                 updateDoc(doc(db, `users/${auth.currentUser.uid}/account/details`), {
            //                     picture: picture[0]
            //                 })                 
            //                 refreshUserData().then(data => {
            //                     setUserDetails(data)
            //                     handleLoginShow()
            //                 })        
                            
            //             })
            //         });
            //     } else {
            //         refreshUserData().then(data => {
            //             setUserDetails(data)
            //             handleLoginShow()
            //         })
            //     }
            }}
        >
        {({ values, isValid, isSubmitting, setValues, submitForm }) => (
        <Form className='w-full h-full p-2 relative'>
            <div className='w-full h-fit object-contain'> 

                <YoutubeEmbed embedId='dQw4w9WgXcQ'/>
                
                <div className='flex flex-col w-full md:w-1/2 h-full justify-center items-center'>
                    {/* {userDetails.type !== 'regular' && <>
                    <div className='flex w-full flex-wrap md:flex-nowrap space-y-6 sm:space-y-0 justify-around'>
                        <DatePickerField name='dateOfBirth'/>
                        <BoxSelect name='showAge' label='Show age'/>
                    </div>

                    <CountrySelect name='nationality'/>
                    <GooglePlacesInput name='address' label='Address'/>
                    <TextInput name='profession' placeholder='Profession'/></>}
                    <CurrencySelector name='currency'/> */}
                    {/* <MotivationInput name='motivation'/> */}
                </div>
                <div className='flex flex-col w-full md:w-1/2 h-full items-center justify-start'>
                    {/* <img src='' className='w-48 h-48'/> */}
                    {/* <PictureUpload name='picture' imageURL={userDetails.picture}/> */}
                    {/* <h1>Click to change photo</h1> */}
                </div>
                
                {/* <button className='absolute bg-gray-800 rounded-full text-white hover:bg-gray-700 hover:scale-110' type='submit'>Submit</button> */}

            </div>
            <div className='absolute hidden md:flex bottom-0 right-0 w-fit h-fit'>
                <XCircleIcon className='w-12 h-12 hover:scale-110' onClick={handleLoginShow}/>
                <CheckCircleIcon className='w-12 h-12 hover:scale-110' onClick={() => submitForm()}/>
            </div>

            <div className='w-full h-fit flex justify-between mt-7 md:hidden'>
                <button type='button' className='button bg-pink-700' onClick={handleLoginShow}>Cancel</button>
                <button type='submit' className='button bg-gray-900' onClick={() => submitForm()}>Submit</button>
            </div>
            {/* {isSubmitting && <SuccessModal successMessage='You have successfully signed up as a creator! We are super excited to see what you&#180;ll share with us' destination='/create'/>} */}

        </Form>)}
        
        </Formik>
        </ReactModal>
        );
    }

export default EditExperience;
