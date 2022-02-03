import { useState, useEffect } from 'react';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import { useField } from 'formik';
import { PhotoCameraBackOutlined } from '@mui/icons-material';

function PictureUpload(props) {

    const [field, meta, helpers] = useField(props)
    const [imageURL, setImageURL] = useState(props.imageURL)

    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => helpers.setValue(f.fileObject)))
            })
        })
    }

    useEffect(() => {
        if (field.value === null || field.value === '') return
      setImageURL(URL.createObjectURL(field.value))
    }, [field.value]);
    

    return (
        <div className='w-48 h-48 bg-gray-800 relative rounded-2xl overflow-hidden p-1 group hover:bg-gray-700'>
            {imageURL ? 
                <img src={imageURL} className='w-full h-full object-cover rounded-xl'/>
            :
                <div className='absolute top-1/2 left-0 flex flex-col items-center justify-center w-full text-white group-hover:scale-110'>
                    <PhotoCameraBackOutlined className='w-12 h-12'/>
                    <p>Upload Photo</p>
                    <p className='text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
                </div>
            }
            <label htmlFor='image-upload' className='w-full h-full top-0 left-0 absolute cursor-pointer'/>
            <input type="file" accept="image/*" onChange={e => {getFilesFromEvent(e)}} id='image-upload' className='hidden'/>
            
        </div>
    );
}

export default PictureUpload;
