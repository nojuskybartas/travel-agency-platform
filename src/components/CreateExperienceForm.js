import React, { useEffect } from 'react';
import { Formik, Form, validateYupSchema } from 'formik';
import ImageUpload from './form/ImageUpload';
import { useState } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { ref, uploadBytes, uploadString } from 'firebase/storage';
import TitleInput from './form/TitleInput';
import DescriptionInput from './form/DescriptionInput';
import DetailsInput from './form/DetailsInput';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import { doc, setDoc } from 'firebase/firestore';
import LoginModal from './LoginModal';
import { getCurrentUserData } from '../lib/user';
import ErrorModal from './ErrorModal';
import { getImagesFromStorageUrl, getUserDetails } from '../lib/storage';
import { useNavigate } from 'react-router-dom';
import { convertCurrency } from '../lib/currency';
import CreateExperienceSuccessModal from './CreateExperienceSuccessModal';

function CreateExperienceForm() {

    const [imagesInBytes, setImagesInBytes] = useState([])
    const [images, setImages] = useState([])
    const user = auth.currentUser
    const [state, setState] = useState(0)
    const [error, setError] = useState()
    const userData = useRecoilValue(userState)


    return (
        <div className='w-full h-full'>
            {/* {error && <ErrorModal errorMessage={error} destination='/'/>} */}
            <Formik
                initialValues={{ 
                    experienceId: new Date().valueOf() * Math.floor(Math.random() * 10000),
                    experienceTitle: '',
                    experienceDescription: '',
                    price: '',
                    minAge: '',
                    locations: [],
                    peopleLimit: '',
                }}
                validate={values => {
                    const errors = {};
                    if (!values.experienceTitle) {
                        errors.experienceTitle = 'Required';
                    } else if (values.experienceTitle?.length < 12) {
                        errors.experienceTitle = 'Please provide a more descriptive title'
                    }
                    if (!values.experienceDescription) {
                        errors.experienceDescription = 'Required';
                    }
                    if (!values.price) {
                        errors.price = 'Required';
                    }
                    if (values.locations.length < 1) {
                        errors.locations = 'Required';
                    }
                    if (images.length < 1) {
                        errors.images = 'Please upload at least 1 photo'
                    }
                    return errors;
                }}

                onSubmit={(values, { setSubmitting }) => {

                    // values.experienceId = new Date().valueOf() * Math.floor(Math.random() * 10000);

                    // Image upload to firebase storage
                    const metadata = {
                        contentType: 'image/jpg'
                      };
                    imagesInBytes.forEach((image, i) => {
                        const storageRef = ref(storage, `experiences/${values.experienceId}/images/${i}.jpg`)
                        uploadBytes(storageRef, image, metadata).then((snapshot) => {
                            getImagesFromStorageUrl(`experiences/${values.experienceId}/images`)
                            .then(imageURLs => {
                                convertCurrency(values.price, userData.financials.currency.toLowerCase(), 'eur')
                                .then((currencyAdjustedPrice) => {
                                    setDoc(doc(db, `experiences/${values.experienceId}`), {
                                        owner: doc(db, `users/${user.uid}`),
                                        createdOn: new Date().valueOf(),
                                        title: values.experienceTitle,
                                        description: values.experienceDescription,
                                        price: currencyAdjustedPrice,
                                        minAge: values.minAge,
                                        locations: values.locations,
                                        peopleLimit: values.peopleLimit,
                                        images: imageURLs,
                                        rating: 0,
                                        ratingCount: 0,
                                    })
                                })
                            })
                        });
                    });

                    setDoc(doc(db, `users/${user.uid}/created_experiences/${values.experienceId}`), {
                        ref: doc(db, `experiences/${values.experienceId}`)
                    })

                    // setTimeout(() => {

                    //     console.log('success')
                    //     // SUCCESS MODAL


                    //     // setParentState('submitted_success')
                    //     // alert(JSON.stringify(values, null, 2));
                    //     // setSubmitting(false);
                    // }, 1000);
                }}
            >
            {({ values, isValid, isSubmitting }) => (
            <div className='w-full h-full'>
            <Form className='flex flex-col items-center justify-center w-full h-full'>
                {<div className={`w-full h-full ${state != 0 && 'hidden'}`}><ImageUpload images={images} setImages={setImages} setImagesInBytes={setImagesInBytes} name='images'/></div>}
                {state === 1 && <TitleInput name='experienceTitle'/>}
                {state === 2 && <DescriptionInput name='experienceDescription'/>}
                {state === 3 && <DetailsInput/>}

                <div className='flex w-full h-16 items-center justify-center space-x-14 p-6 mb-14'>
                    <button className={`button bg-gray-800 hover:bg-gray-900 transition-all ease-in-out duration-500 
                                    ${state === 0 && 'opacity-0 cursor-default'}
                                    ${isValid && state===3 && !isSubmitting && 'w-1/4'} 
                                    ${isSubmitting && 'w-0 opacity-0'}`} 
                        onClick={(e) => {
                            if (state != 0 ) {
                                setState(state-1)
                            }; 
                            e.preventDefault()
                        }}>
                    Back
                    </button>
                    <button 
                        type={(state === 3 && isValid) ? 'submit' : 'button'} 
                        className={`button bg-gray-800 hover:bg-gray-900 transition-all ease-in-out duration-1000 
                                    ${isValid && state===3 && !isSubmitting && 'w-1/2'} 
                                    ${isSubmitting && 'w-full'}`} 
                        onClick={(e) => {
                            if (state != 3 ) {
                                setState(state+1); 
                                e.preventDefault()
                            }}}
                        >
                        {state === 3 ? isSubmitting ? 'Submitting...' : 'Submit!' : 'Next'}
                    </button>
                </div>
            </Form>
            {isValid && isSubmitting && <CreateExperienceSuccessModal experienceId={values.experienceId}/>}
            </div>
            )}
            {/* {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                />
                {errors.email && touched.email && errors.email}
                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                />
                {errors.password && touched.password && errors.password}
                <button type="submit" disabled={isSubmitting}>
                    Submit
                </button>
                </form>
            )} */}
            </Formik>
        </div>
    );
}

export default CreateExperienceForm;
