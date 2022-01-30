import { useState } from 'react';
import currencies from "../../lib/commonCurrency.json";
import { Field, useField } from "formik";

function CurrencySelector(props) {

    const [field, meta, helpers] = useField(props)

    const handleCurrency = (e) => {
        helpers.setValue(e.target.value)
    }

    // const onSelectedCurrency = currencyAbbrev => {
    //     console.log(`Selected ${currencyAbbrev}`)
    // }

    return (
        <div className='w-full h-fit'>
            {/* <SelectCurrency value={'USD'} onCurrencySelected={onSelectedCurrency} /> */}
            <div className="w-full h-fit flex justify-between">
                <p className='text-sm'>Currency:</p>
                <p className="text-xs italic text-red-500">{meta.error ? meta.error : null}</p>
            </div>
            <select onChange={handleCurrency} value={field.value || 'EUR'} className='w-full h-fit' name={field.name}>
              {Object.keys(currencies).map((cur, i) => (
                <option value={cur} key={i}>
                  {cur} - {currencies[cur].name}
                </option>
              ))}
            </select>
        </div>
    );
}

export default CurrencySelector;
