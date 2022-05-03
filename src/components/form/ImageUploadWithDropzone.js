import { XIcon } from '@heroicons/react/outline';
import { useFormikContext } from 'formik';
import React from 'react'
import ImageUploading from "react-images-uploading";

function ImageUploadWithDropzone() {

    const { values, setFieldValue } = useFormikContext()
    const onChange = (imageList, addUpdateIndex) => {
        setFieldValue('uploadedImages', imageList);
    };

    return (
        <ImageUploading
            multiple
            value={values.uploadedImages}
            onChange={onChange}
            maxNumber={20}
            dataURLKey="data_url"
            name='uploadedImages'
        >
            {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps
            }) => (
            <div className="w-full h-full flex flex-col">
                <button
                className={`w-full h-96 bg-gray-400 rounded-2xl border-2 border-green-900 ${isDragging ? 'bg-opacity-60 border-solid' : 'bg-opacity-30 border-dashed'}`}
                onClick={e => {e.preventDefault(); onImageUpload()}}
                {...dragProps}
                >
                    Click or Drop images here
                </button>
                
                <div className='w-full h-10 flex justify-end items-center'>
                    <button className='w-fit h-fit' onClick={(e) => {e.preventDefault(); onImageRemoveAll()}}>
                        Remove all images
                    </button>
                </div>

                <div className='w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4'>
                    {imageList.map((image, index) => (
                    <div key={index} className="w-44 h-full flex flex-col items-center space-y-2 relative group cursor-pointer">
                        <img className='w-full h-full object-contain md:group-hover:brightness-50 md:group-hover:opacity-70' src={image.data_url} alt={'user_uploaded_image_' + index} onClick={() => onImageUpdate(index)}/>
                        <XIcon className='w-5 h-fit bg-red-500 rounded-lg absolute top-0 right-1 hidden md:group-hover:inline' onClick={() => onImageRemove(index)}/>
                        <div className="w-full h-10 flex justify-center space-x-1 lg:hidden">
                            <button type='button' className='w-fit h-10 px-2 bg-gray-400 opacity-60 rounded-lg text-sm' onClick={() => onImageUpdate(index)}>Update</button>
                            <button type='button' className='w-fit h-10 px-2 bg-gray-400 opacity-60 rounded-lg text-sm' onClick={() => onImageRemove(index)}>Remove</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            )}
        </ImageUploading>
    )
}

export default ImageUploadWithDropzone