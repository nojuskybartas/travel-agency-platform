import { Form, Formik } from 'formik';
import React from 'react';
import Footer from '../components/Footer';
import TextInput from '../components/form/TextInput';
import Header from '../components/Header';
import { DatePickerField } from '../components/form/DatePickerField';
import BoxSelect from '../components/form/BoxSelect';
import CountrySelect from '../components/form/CountrySelect';
import GooglePlacesInput from '../components/form/GooglePlacesInput';
import CurrencySelector from '../components/form/CurrencySelector';
import MotivationInput from '../components/form/MotivationInput';
import PictureUpload from '../components/form/PictureUpload';
import { auth, db, storage } from '../lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { getImagesFromStorageUrl } from '../lib/storage';
import { doc, updateDoc } from 'firebase/firestore';
import SuccessModal from '../components/SuccessModal';

function RegisterCreator() {
    
    return (

    <div>
    <div className="max-w-[1080px] h-full ml-auto mr-auto space-y-6 sm:px-2 sm:py-2">
        <Header/>
        <div className='text-center justify-center items-center flex flex-col w-full h-full'>
            <h1 className='text-2xl font-extrabold'>Become a creator 😍</h1>
            <h2 className=''>Submit your application to join our creator community</h2>
            <Formik
                initialValues={{ 
                        dateOfBirth: '',
                        showAge: true,
                        address: '',
                        nationality: '',
                        profession: '',
                        currency: '',
                        motivation: '',
                        picture: null,
                    }}
                validate={values => {
                    const errors = {};
                    if (!values.motivation) {
                        errors.motivation = 'Required';
                    }
                    if (!values.currency) {
                        errors.currency = 'Required';
                    }
                    if (!values.dateOfBirth) {
                        errors.dateOfBirth = 'Required';
                    }
                    if (!values.address) {
                        errors.address = 'Required';
                    }
                    if (!values.nationality) {
                        errors.nationality = 'Required';
                    }
                    if (!values.profession) {
                        errors.profession = 'Required';
                    }
                    if (!values.picture) {
                        errors.picture = 'Required';
                    }
                    return errors;
                }}

                onSubmit={(values, { setSubmitting }) => {

                    // Image upload to firebase storage
                    const metadata = {
                        contentType: 'image/jpg'
                    };
                    const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile/profileImage.jpg`)
                    uploadBytes(storageRef, values.picture, metadata).then((snapshot) => {
                        getImagesFromStorageUrl(`users/${auth.currentUser.uid}/profile`).then(picture => {
                            updateDoc(doc(db, `users/${auth.currentUser.uid}/account/details`), {
                                picture: picture[0],
                                type: 'creator',
                                profession: values.profession,
                                nationality: values.nationality,
                                address: values.address,
                                dateOfBirth: values.dateOfBirth,
                                motivation: values.motivation,
                                showAge: values.showAge
                            })
                            updateDoc(doc(db, `users/${auth.currentUser.uid}/account/financials`), {
                                currency: values.currency
                            })
                        })
                    });
                }}
            >
            {({ values, isValid, isSubmitting, setValues }) => (
            <Form className='flex flex-col w-1/2 h-full mt-10 space-y-10 justify-center items-center'>
                
                <PictureUpload name='picture'/>

                <div className='flex w-full flex-wrap md:flex-nowrap space-y-6 sm:space-y-0 justify-around'>
                    <DatePickerField name='dateOfBirth'/>
                    <BoxSelect name='showAge' label='Show age'/>
                </div>

                <CountrySelect name='nationality'/>
                <GooglePlacesInput name='address' label='Address'/>
                <TextInput name='profession' placeholder='Profession'/>
                <CurrencySelector name='currency'/>
                <MotivationInput name='motivation'/>

                <button className='mt-10 w-1/3 h-10 bg-gray-800 rounded-3xl text-white hover:bg-gray-700 hover:scale-110' type='submit'>Submit</button>
            
                {isSubmitting && <SuccessModal successMessage='You have successfully signed up as a creator! We are super excited to see what you&#180;ll share with us' destination='/'/>}
            
            </Form>)}
            </Formik>
        </div>
    </div>
    <Footer/>
</div>
  )
}

export default RegisterCreator;
