import React from "react";
import { Field, useField, useFormikContext } from "formik";

export const DatePickerField = ({ ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <div className="w-fit h-fit flex flex-col text-left">
      <div className="w-full h-fit flex justify-between">
          <p className="text-sm">Date of birth:</p>
          <p className="text-xs italic text-red-500">{meta.error ? meta.error : null}</p>
      </div>
      <Field
      type='date'
      name={field.name}
      />

    </div>
  );
};