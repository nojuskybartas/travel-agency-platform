import { FormControl, InputLabel, LinearProgress, MenuItem, NativeSelect, Select, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import currencies from "../../lib/commonCurrency.json";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import ProfilePictureUpload from "../form/ProfilePictureUpload";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import { PhotoCameraBackOutlined } from "@mui/icons-material";
import { auth, db, storage } from "../../lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { getImagesFromStorageUrl, refreshUserData } from "../../lib/storage";
import { doc, updateDoc } from "firebase/firestore";
import PlacesAutocomplete from "../muiFormComponents/PlacesAutocomplete";


function EditAccountDetailsModal2({show, setShow}) {

    const [userDetails, setUserDetails] = useRecoilState(userState)
    const {width, height} = useWindowDimensions()
    const [loading, setLoading] = useState({state: false, progress: 0})

    countries.registerLocale(enLocale);

    // Returns an object not a list
    const countryObj = countries.getNames("en", { select: "official" });

    const countryArr = Object.entries(countryObj).map(([value, label]) => {
        return {
        label: label,
        value: value
        };
    });

    const handleLoginShow = () => {
        setShow(!show)
    }

    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => setValues({
                    ...values,
                    image:f.fileObject
                })))
            })
        })
    }

    useEffect(() => {
        show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
        return () => document.body.style.overflow = 'unset';
    }, [show]);

    const [values, setValues] = useState({})

    useEffect(() => {
        setValues({
            fullName: userDetails?.name,
            nationality: userDetails?.nationality || '',
            currency: userDetails?.currency || 'EUR',
            image:'',
            imageURL: userDetails?.picture,
            profession: userDetails?.profession || '',
            address: userDetails?.address || '',
            motivation: userDetails?.motivation || '',

        })
    }, [userDetails, show])

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setValues({
            ...values,
            [name]:value
        })
    }

    useEffect(() => {
        console.log(values)
    }, [values])

    useEffect(() => {
        if (!values.image) return
        console.log(values.image)
        setValues({...values, imageURL:URL.createObjectURL(values.image)})
    }, [values.image]);

    const submit = (e) => {
        setLoading({...loading, state: true})
        e.preventDefault()
        if (!userDetails) return
        const dataToUpdate = {
            name: values.fullName,
            nationality: values.nationality
        }
        if (userDetails.type !== 'regular') {
            dataToUpdate.profession = values.profession
            dataToUpdate.address = values.address
            dataToUpdate.motivation = values.motivation
            // dataToUpdate.showAge = values.showAge
        }

        updateDoc(doc(db, `users/${auth.currentUser.uid}/account/details`), dataToUpdate)

        updateDoc(doc(db, `users/${auth.currentUser.uid}/account/financials`), {
            currency: values.currency
        })

        // Image upload to firebase storage
        const metadata = {
            contentType: 'image/jpg'
        };

        if (values.image) {
            const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile/profileImage.jpg`)
            const upload = uploadBytes(storageRef, values.image, metadata).then((snapshot) => {
                getImagesFromStorageUrl(`users/${auth.currentUser.uid}/profile`).then(picture => {
                    updateDoc(doc(db, `users/${auth.currentUser.uid}/account/details`), {
                        picture: picture[0]
                    })                 
                    refreshUserData().then(data => {
                        setUserDetails(data)
                        handleLoginShow()
                        setLoading({...loading, state: false})
                    })        
                    
                })
            });
            

        } else {
            refreshUserData().then(data => {
                setUserDetails(data)
                handleLoginShow()
                setLoading({...loading, state: false})
            })
        }
            
    }

    return (
        <ReactModal
        isOpen={show}
        className='loginModal md:w-5/6 md:h-1/2 max-w-3xl overflow-y-scroll scrollbar-hide z-20'
        overlayClassName='loginModalOverlay'
        onRequestClose={handleLoginShow}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        >
            <div className="w-full h-full flex flex-col justify-between">
            <form className="w-full h-fit flex flex-wrap-reverse">
                <div className="flex flex-col w-full md:w-1/2 h-fit md:h-full md:space-y-4 p-2">
                    <TextField 
                        variant="standard"
                        label='Full Name'
                        name='fullName'
                        value={values.fullName}
                        onChange={handleInputChange}
                    />

                    <FormControl minWidth={width < 768 ? '85vw' : ''} variant="standard">
                        <InputLabel id="nationalityLabel">Nationality</InputLabel>
                        <NativeSelect labelId='nationalityLabel' id='nationalitySelect' label='nationality' name='nationality' value={values.nationality} onChange={handleInputChange}>
                            <option value=""></option>
                            {!!countryArr?.length &&
                                countryArr.map(({ label, value }) => (
                                    <option key={value} value={value}>
                                    {label}
                                    </option>
                                    // <MenuItem value={value} key={value}>{label}</MenuItem>
                                ))}
                        </NativeSelect>
                    </FormControl>

                    
                    <FormControl minWidth={width < 768 ? '85vw' : ''} >
                        <InputLabel variant="standard" htmlFor="currency">
                            Currency
                        </InputLabel>
                        <NativeSelect variant="standard" name='currency' value={values.currency} onChange={handleInputChange}>
                        {Object.keys(currencies).map((cur, i) => (
                            <option value={cur} key={i}>
                            {cur} - {currencies[cur].name}
                            </option>
                        ))}
                        </NativeSelect>
                        
                    </FormControl>

                    {userDetails?.type === 'creator' && 
                    <>
                    <TextField 
                        variant="standard"
                        label='Profession'
                        name='profession'
                        value={values.profession}
                        onChange={handleInputChange}
                    />

                    {/* <PlacesAutocomplete setAddressValue={(value) => setValues({...values,address:value})} minWidth={width < 768 ? '85vw' : ''}/> */}
                    
                    <TextField
                        variant="standard"
                        id="outlined-multiline-flexible"
                        label={`Motivation (${500 - values.motivation?.length})`}
                        helperText='Tell us a bit more about why explorers would be interested in you / how you are unique'
                        name='motivation'
                        multiline
                        rows={8}
                        value={values.motivation}
                        onChange={handleInputChange}
                    />
                    </>}
                    
                </div>

                <div className='flex flex-col w-full md:w-1/2 h-fit items-center md:h-full md:items-end p-2'>
                    <div className='w-48 h-48 bg-gray-800 relative rounded-2xl overflow-hidden p-1 group hover:bg-gray-700'>
                        {values.imageURL ? 
                            <img src={values.imageURL} className='w-full h-full object-cover rounded-xl'/>
                        :
                            <div className='absolute top-1/2 left-0 flex flex-col items-center justify-center w-full text-white group-hover:scale-110'>
                                <PhotoCameraBackOutlined className='w-12 h-12'/>
                                <p>Upload Photo</p>
                            </div>
                        }
                        <label htmlFor='image-upload' className='w-full h-full top-0 left-0 absolute cursor-pointer'/>
                        <input type="file" accept="image/*" onChange={e => {getFilesFromEvent(e)}} id='image-upload' className='hidden'/>
                        
                    </div>
                    <h1>Click to change photo</h1>
                </div>

            </form>
            <div>
                {loading.state && <LinearProgress variant="indeterminate" />}
                <div className='w-full h-fit flex justify-between mt-7 pb-10'>
                    <button type='button' className='button bg-slate-400 outline-1 outline-gray-500 hover:outline' onClick={handleLoginShow}>Cancel</button>
                    <button type='submit' className='button bg-gray-700 outline-1 outline-gray-500 hover:outline' onClick={submit}>Submit</button>
                </div>
            </div>
            </div>
                        
        </ReactModal>
        );
    }

export default EditAccountDetailsModal2;
