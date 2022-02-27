import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../atoms/userAtom';
import { Field, Form, Formik } from 'formik';
import TextInput from '../form/TextInput';
import { DatePickerField } from '../form/DatePickerField';
import BoxSelect from '../form/BoxSelect';
import CountrySelect from '../form/CountrySelect';
import GooglePlacesInput from '../form/GooglePlacesInput';
import CurrencySelector from '../form/CurrencySelector';
import MotivationInput from '../form/MotivationInput';
import PictureUpload from '../form/PictureUpload';
import { auth, db, storage } from '../../lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { getImagesFromStorageUrl, refreshUserData } from '../../lib/storage';
import { doc, updateDoc } from 'firebase/firestore';
import ReactModal from 'react-modal';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { useAuth } from '../../hooks/useAuth';
import GoogleMaps from '../muiFormComponents/PlacesAutocomplete';
import { NativeSelect, TextField } from '@mui/material';
// import { FormikTextField } from 'formik-material-fields';
import NationalitySelect from '../muiFormComponents/NationalitySelect'
import CurrencySelect from '../muiFormComponents/CurrencySelect';


function EditAccountDetailsModal({show, setShow}) {

    // const { auth } = useAuth()
    const [userDetails, setUserDetails] = useRecoilState(userState)

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
        className='loginModal md:w-5/6 md:h-1/2 overflow-y-scroll scrollbar-hide z-20'
        overlayClassName='loginModalOverlay'
        onRequestClose={handleLoginShow}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        >
        {/* <CheckCircleIcon className='absolute bottom-2 right-2 rounded-full w-12 h-12 '/> */}
        <Formik
            initialValues={{ 
                    dateOfBirth: userDetails?.dateOfBirth,
                    showAge: userDetails?.showAge,
                    address: userDetails?.address,
                    nationality: userDetails?.nationality,
                    profession: userDetails?.profession,
                    currency: userDetails?.financials.currency,
                    motivation: userDetails?.motivation,
                    picture: null,
                    name: userDetails?.name,
                    email: auth.currentUser.email
            }}
            
            onSubmit={(values) => {
                console.log(values)
            }}

            // onSubmit={(values, { setSubmitting }) => {

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
            // }}
        >
        {({ values, isValid, isSubmitting, setValues, submitForm }) => (
        <Form className='w-full h-full p-2 relative'>
            <div className='w-full h-fit md:h-full flex flex-wrap-reverse justify-start'> 
                
                <div className='flex flex-col w-full md:w-1/2 h-full justify-center items-center text-left space-y-8 md:space-y-3'>
                    {/* {userDetails.type !== 'regular' && 
                    <>
                        <div className='flex w-full flex-wrap md:flex-nowrap space-y-6 sm:space-y-0 justify-around'>
                            <DatePickerField name='dateOfBirth'/>
                            <BoxSelect name='showAge' label='Show age'/>
                        </div>

                        <CountrySelect name='nationality'/>
                        <GooglePlacesInput name='address' label='Address'/>
                        <TextInput name='profession' placeholder='Profession'/>
                    </>} */}
                
                   
                    <Field as={TextField} name='name' label='Full name' variant='standard' fullWidth/>
                    <NationalitySelect value={userDetails?.nationality}/>
                    <CurrencySelect/>
                    


                    {/* <FormikTextField
                        name="username"
                        label="Username"
                        margin="normal"
                        fullWidth
                    /> */}
                    {/* <TextInput name='email' placeholder='Email'/> */}
                    {/* <MotivationInput name='motivation'/> */}
                </div>
                <div className='flex flex-col w-full md:w-1/2 h-full items-center justify-start md:items-end'>
                    {/* <img src='' className='w-48 h-48'/> */}
                    <PictureUpload name='picture' imageURL={userDetails.picture}/>
                    <h1>Click to change photo</h1>
                </div>
            </div>

            <div className='w-full h-fit flex justify-between mt-7 absolute bottom-1'>
                <button type='button' className='button bg-pink-700' onClick={handleLoginShow}>Cancel</button>
                <button type='submit' className='button bg-gray-900' onClick={() => submitForm()}>Submit</button>
            </div>
        </Form>)}
        
        </Formik>
        </ReactModal>
        );
    }

export default EditAccountDetailsModal;
