import React from "react";
import { Field, useField, useFormikContext } from "formik";

export const DatePickerField = ({ ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <div className="w-full max-w-md h-fit flex flex-col">
      <div className="w-full h-fit flex justify-between">
          <p className="font-semibold">Date of Birth:</p>
          <p className="text-xs italic text-red-500">{meta.error ? meta.error : null}</p>
      </div>
      <Field className='rounded-lg w-full h-10 p-2' type='date' name={field.name} />

    </div>
  );
};