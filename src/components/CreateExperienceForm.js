import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import ImageUpload from './form/ImageUpload';
import { useState } from 'react/cjs/react.development';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, uploadString } from 'firebase/storage';

function CreateExperienceForm({setParentState}) {

    const [imagesInBytes, setImagesInBytes] = useState([])

    const [state, setState] = useState(0)

    useEffect(() => {
        console.log(imagesInBytes)
    }, [imagesInBytes])

    return (
        <div className='w-full h-full'>
            <Formik
                initialValues={{ 
                    experienceId: null,
                    image: imagesInBytes, 
                    title: '',
                    description: '',
                    price: 0,
                }}
                // validate={values => {
                //     const errors = {};
                //     if (!values.email) {
                //     errors.email = 'Required';
                //     } else if (
                //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                //     ) {
                //     errors.email = 'Invalid email address';
                //     }
                //     return errors;
                // }}
                onSubmit={(values, { setSubmitting }) => {

                    values.experienceId = new Date().valueOf();

                    const metadata = {
                        contentType: 'image/jpg'
                      };

                    // Image upload to firebase storage
                    imagesInBytes.forEach((image, i) => {
                        console.log('img>',image)
                        const storageRef = ref(storage, `experiences/${values.experienceId}/images/${i}.jpg`)
                        uploadBytes(storageRef, image, metadata).then((snapshot) => {
                            console.log('Uploaded a blob or file!');
                        });
                    });

                    console.log(imagesInBytes)
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                }}
            >
            {({ values }) => (
            <Form className='flex flex-col items-center justify-center w-full h-fit'>
                {state === 0 && <ImageUpload imagesInBytes={imagesInBytes} setImagesInBytes={setImagesInBytes}/>}

                <div className='flex w-full h-16 items-center justify-center space-x-14 p-6'>
                    <button className='button bg-gray-800 hover:bg-gray-900' onClick={(e) => {if(state===0) {setParentState('menu')} setState(state-1); e.preventDefault()}}>Back</button>
                    <button className='button bg-gray-800 hover:bg-gray-900' onClick={(e) => {setState(state+1); e.preventDefault()}}>Next</button>
                </div>
            </Form>
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
