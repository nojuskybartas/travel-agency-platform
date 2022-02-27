import currencies from "../../lib/commonCurrency.json";
import { Box, FormControl, InputLabel, NativeSelect } from "@mui/material";
import { Field } from "formik";
import React from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions'

function CurrencySelect() {
    const {width, height} = useWindowDimensions()

    return (
        <Box minWidth={width < 768 ? '85vw' : ''}>
            <FormControl fullWidth >
            <InputLabel variant="standard" htmlFor="currency">
                Currency
            </InputLabel>
            <Field as={NativeSelect} name='currency' label='Currency' fullWidth>
            {Object.keys(currencies).map((cur, i) => (
                <option value={cur} key={i}>
                {cur} - {currencies[cur].name}
                </option>
            ))}
            </Field>
            </FormControl>
        </Box>
    )
}

export default CurrencySelect