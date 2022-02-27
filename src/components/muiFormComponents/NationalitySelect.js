import { Box, FormControl, InputLabel, NativeSelect } from "@mui/material";
import { Field } from "formik";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

import React from 'react'
import useWindowDimensions from "../../hooks/useWindowDimensions";

function NationalitySelect(props) {
        // Have to register the languages you want to use
    countries.registerLocale(enLocale);

    // Returns an object not a list
    const countryObj = countries.getNames("en", { select: "official" });

    const countryArr = Object.entries(countryObj).map(([value, label]) => {
        return {
        label: label,
        value: value
        };
    });

    const {width, height} = useWindowDimensions()


    return (
        <Box minWidth={width < 768 ? '85vw' : ''}>
          <FormControl fullWidth >
            <InputLabel variant="standard" htmlFor="nationality">
              Nationality
            </InputLabel>
            <Field as={NativeSelect} name='nationality' label='Nationality' value={'Nationality'} fullWidth>
            {!!countryArr?.length &&
                countryArr.map(({ label, value }) => (
                    <option key={value} value={value}>
                    {label}
                    </option>
                ))}
            </Field>
          </FormControl>
        </Box>
    );
}

export default NationalitySelect
