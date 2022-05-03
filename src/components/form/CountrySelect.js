import { useState } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { Field, useField } from "formik";

const CountrySelect = (props) => {
  const [field, meta, helpers] = useField(props)

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

  return (
    <div className="w-full max-w-md h-fit">
      <div className="w-full h-fit flex justify-between">
          <p className="font-semibold">Nationality:</p>
          <p className="text-xs italic text-red-500">{meta.error ? meta.error : null}</p>
      </div>
      <select
        name={field.name}
        className="w-full h-10 rounded-lg p-2"
        value={field.value || 'NL'}
        onChange={(e) => helpers.setValue(e.target.value)}
      >
        {!!countryArr?.length &&
          countryArr.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default CountrySelect