import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Field, Formik, useFormikContext } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
import GetPostalCode from '../GoogleApi/GetPostalCode';
import AutocompletePlaces from '../GoogleApi/AutocompletePlaces';
import { InputBase } from '@mui/material';
import { loadGoogleMapsScript } from '../../lib/google';


const AddressInput = () => {
    const [addresses, setAddresses] = useState([]);
    const { errors, values, setFieldValue } = useFormikContext()
    
    const handleChangeAddress = async (searchValue) => {
        if(!searchValue.target.value){
            return '';
        }
        const results = await AutocompletePlaces(searchValue.target.value);
        if (results) {
            setAddresses(results);
        }
    }

    const changeAddress = async (value, setFieldValue) => {
        let result = null;
        for(let x = 0; x < addresses.length; x++){
            if(value === addresses[x].description){
            result = await GetPostalCode(addresses[x].place_id);
            // Get Zip code
            }
        }
        if(!result){ 
            setFieldValue('address', '');
            setFieldValue('zipCode', '');
            setFieldValue('city', '');
            setFieldValue('stateOfAddress', '');
            return ; }
        setFieldValue('address', value);
        let postcode = null;
        for(let i = 0; i < result.address_components.length; i++){
            if(result.address_components[i].types[0] === 'postal_code'){
                postcode = result.address_components[i].long_name;
            }
        }
        setFieldValue('zipCode', postcode);
        // Get city
        let city = null;
        for(let i = 0; i < result.address_components.length; i++){
            if(result.address_components[i].types[0] === 'locality'){
                city = result.address_components[i].long_name;
            }
        }
        if(!city){
            for(let i = 0; i < result.address_components.length; i++){
            if(result.address_components[i].types[0] === 'administrative_area_level_2'){
                city = result.address_components[i].long_name;
            }
            }
        }
        setFieldValue('city', city);

        // Get State
        let state = null;
        for(let i = 0; i < result.address_components.length; i++){
            if(result.address_components[i].types[0] === 'administrative_area_level_1'){
            state = result.address_components[i].long_name;
            }
        }
        if(!state){
            for(let i = 0; i < result.address_components.length; i++){
            if(result.address_components[i].types[0] === 'administrative_area_level_2'){
                state = result.address_components[i].long_name;
            }
            }
        }
        setFieldValue('stateOfAddress', state);
    }

    //We can use this function to disable the browser auto complete from the fields because it looks really annoying
    useEffect(() => {
        loadGoogleMapsScript()
        window.document.querySelector('input[name="address"]').setAttribute('autocomplete', 'disable');
        window.document.querySelector('input[name="address"]').setAttribute('aria-autocomplete', 'off');
        window.document.querySelector('input[name="zipCode"]').setAttribute('autocomplete', 'disable');
        window.document.querySelector('input[name="zipCode"]').setAttribute('aria-autocomplete', 'off');
        window.document.querySelector('input[name="city"]').setAttribute('autocomplete', 'disable');
        window.document.querySelector('input[name="city"]').setAttribute('aria-autocomplete', 'off');
        window.document.querySelector('input[name="stateOfAddress"]').setAttribute('autocomplete', 'disable');
        window.document.querySelector('input[name="stateOfAddress"]').setAttribute('aria-autocomplete', 'off');
    }, []);

    return (
        <div className='w-full max-w-md h-fit flex flex-col space-y-2'>
            <div className='w-full h-fit'>
                <div className="w-full h-fit flex justify-between">
                    <p className="font-semibold">Address:</p>
                    <p className="text-xs italic text-red-500">{errors.address ? errors.address : null}</p>
                </div>
                <Autocomplete
                    options={addresses.map((option) => option.description)}
                    // closeIcon= { () => { return; } }
                    onInputChange={(event, value) => { changeAddress(value, setFieldValue); }}
                    autoComplete={false}
                    renderInput={(params) => (
                    <InputBase
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                        autoFocus
                        placeholder='Address'
                        className='rounded-lg w-full h-10 p-3 bg-white'
                        name="address" 
                        value={values.address} 
                        onChange={(value) => { handleChangeAddress(value); }}
                    />
                    //   <TextField {...params} label="Company Address" name="address" value={values.address} onChange={(value) => { handleChangeAddress(value); }} variant="outlined" />
                    )} 
                />
            </div>

            <div className='w-full h-fit'>
                <div className="w-full h-fit flex justify-between">
                    <p className="font-semibold">Zip Code:</p>
                    <p className="text-xs italic text-red-500">{errors.zipCode ? errors.zipCode : null}</p>
                </div>
                <Field className='rounded-lg w-full h-10 p-3' type='input' placeholder='Zip Code' name='zipCode'/>
            </div>

            <div className='w-full h-fit'>
                <div className="w-full h-fit flex justify-between">
                    <p className="font-semibold">City:</p>
                    <p className="text-xs italic text-red-500">{errors.city ? errors.city : null}</p>
                </div>
                <Field className='rounded-lg w-full h-10 p-3' type='input' placeholder='City' name='city'/>
            </div>

            <div className='w-full h-fit'>
                <div className="w-full h-fit flex justify-between">
                    <p className="font-semibold">State (Administrative Area):</p>
                    <p className="text-xs italic text-red-500">{errors.stateOfAddress ? errors.stateOfAddress : null}</p>
                </div>
                <Field className='rounded-lg w-full h-10 p-3' type='input' placeholder='State' name='stateOfAddress'/>
            </div>
        </div>
    );
};

export default AddressInput;