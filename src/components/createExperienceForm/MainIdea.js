import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormPage from './FormPage'

function MainIdea({values, setValues, handleChange}) {

    
    return (
        <FormPage title='Lets get through the basics first'>
            <FormControl>
                <h2 id="experienceTypeRadioButtonLabel" className='text-xl'>Type</h2>
                <RadioGroup
                    aria-labelledby="experienceTypeRadioButtonLabel"
                    name="type"
                    onChange={handleChange}
                    value={values.type}
                >
                    <FormControlLabel value="guide" control={<Radio />} label="I will be the guide" />
                    <FormControlLabel value="noGuide" control={<Radio />} label="This experience doesn't require a guide" />
                </RadioGroup>
                <h2 id="experienceBasicInfoLabel" className='text-xl mt-10 mb-3'>Location and Language</h2>
                <TextField 
                    variant="standard"
                    label='City / Country'
                    name='location'
                    value={values.location}
                    onChange={handleChange}
                />
                <TextField 
                    variant="standard"
                    label='Languages'
                    name='language'
                    value={values.language}
                    onChange={handleChange}
                />
                <h2 id="experienceCategoryInfoLabel" className='text-xl mt-10 mb-3'>Category</h2>
                 <Select
                    labelId="experienceCategoryInfoLabel"
                    value={values.category}
                    onChange={handleChange}
                    name='category'
                    label="Category"
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value='wellness'>Wellness</MenuItem>
                    <MenuItem value='sports'>Sports</MenuItem>
                    <MenuItem value='exploratory'>Exploratory</MenuItem>
                    <MenuItem value='culture'>Culture</MenuItem>
                    <MenuItem value='history'>History</MenuItem>
                    <MenuItem value='wilderness'>Wilderness</MenuItem>
                </Select>
            </FormControl>
        </FormPage>
    )
}

export default MainIdea