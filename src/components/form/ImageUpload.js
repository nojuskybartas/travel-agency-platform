import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import {useDropzone} from 'react-dropzone'
import { XIcon } from '@heroicons/react/outline';
import { useField } from 'formik';


const ImageUpload = ({ images, setImages, setImagesInBytes, ...props }) => {

    const [field, meta, helpers] = useField(props)    

    const fileParams = ({ meta }) => {
        return { url: 'https://httpbin.org/post' }
    }

    const onFileChange = (fileData, status) => { 
        if (status === 'done') {
            setImages(images => [...images, fileData])
        }
    }

    // const onSubmit = (files, allFiles) => {
    //     allFiles.forEach(f => f.remove())
    // }

    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject))
            })
        })
    }

    const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
        const textMsg = files.length > 0 ? 'Upload More' : 'Drag n drop these photies 😎'

        return (
            <div className='w-full h-full relative'>
                <label className="w-full h-full flex items-center justify-center overflow-hidden">
                    {textMsg}
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        accept={accept}
                        multiple
                        onChange={e => {
                            getFilesFromEvent(e).then(chosenFiles => {
                                onFiles(chosenFiles)
                                setImagesInBytes(chosenFiles)
                            })
                        }}
                    />
                </label>
                <p className='absolute bottom-3 w-fit left-1/2 -translate-x-1/2 mt-3 text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
            </div>
            
        )
    }

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <h1 className='p-10 font-bold text-3xl'>First step, upload a photo 👇</h1>
            <Dropzone
                // onSubmit={onSubmit}
                onChangeStatus={onFileChange}
                InputComponent={selectFileInput}
                getUploadParams={fileParams}
                getFilesFromEvent={getFilesFromEvent}
                accept="image/*,video/*"
                maxFiles={8}
                inputContent="Drop A File"
                styles={{
                    dropzone: { width: '90%', height: 400 },
                    dropzoneActive: { borderColor: 'green' },
                    submitButton: { display: 'none' }
                }}            
            />
        </div>
    );
}

export default ImageUpload;
