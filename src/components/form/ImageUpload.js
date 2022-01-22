import React, { useCallback } from 'react';
import { useState } from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import {useDropzone} from 'react-dropzone'
import { XIcon } from '@heroicons/react/outline';

// function ImageUpload({imagesInBytes, setImagesInBytes}) {


//     const [images, setImages] = useState([])

//     const onDrop = useCallback(acceptedFiles => {

//         acceptedFiles.forEach((file) => {        

//             const reader = new FileReader()
      
//             reader.onabort = () => console.log('file reading was aborted')
//             reader.onerror = () => console.log('file reading has failed')
//             reader.onload = (e) => {
//                 const binaryStr = reader.result
//                 setImagesInBytes(images => [...images, binaryStr])
//             }
//             reader.readAsArrayBuffer(file)
//         })

//         acceptedFiles.forEach((file) => {        

//             const reader = new FileReader()
      
//             reader.onabort = () => console.log('file reading was aborted')
//             reader.onerror = () => console.log('file reading has failed')
//             reader.onload = (e) => {
//                 const imgURL = e.target.result
//                 setImages(images => [...images, imgURL])
//             }
//             reader.readAsDataURL(file)
//         })


//     }, [])

//     const removeImage = ({id}) => {
//         // e.preventDefault()
//         images.filter((image,i) => i != id)
//     }
    
//     const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: 'image/*,video/*', maxFiles: 8})

//     return (
//         <div {...getRootProps()} className='w-full h-fit p-5 z-0'>
//             <input {...getInputProps()} />
//             <div className='w-full h-fit flex items-center justify-center bg-green-100 outline-dashed outline-1 outline-red-300 transition-all p-5 group overflow-x-scroll relative'>
            
//             {images.map((image, id) => {
//                 // console.log(image)
//                 return (
//                     <div className='relative flex z-10' onClick={removeImage(id)}>
//                         <XIcon className='absolute top-2 right-2 w-5 h-5'/>
//                         <img src={image} className='w-36 h-36 object-cover p-1 mb-10'/>
//                     </div>
//                 )
//             })}
//             {!images.length < 1 && <p className='absolute bottom-0 font-semibold text-lg'>{ isDragActive ? 'Drop the files here ... ' : 'Drag n drop some images / videos here, or click to select files'}</p>}
            
//             </div>
            
//         </div>
//     )

// }

function ImageUpload({setImagesInBytes}) {

    const fileParams = ({ meta }) => {
        return { url: 'https://httpbin.org/post' }
    }

    const onFileChange = ({ meta, file }, status) => { 
        // console.log(status, meta, file) 
    }

    const onSubmit = (files, allFiles) => {
        allFiles.forEach(f => f.remove())
    }

    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject))
            })
        })
    }

    const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
        const textMsg = files.length > 0 ? 'Upload Again' : 'Drag n drop these photies '

        return (
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
        )
    }

    return (
        <Dropzone
            onSubmit={onSubmit}
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
    );
}


// function ImageUpload({handleImage}) {

//     const hiddenFileInput = React.useRef(null);
//     const [uploadedFile, setUploadedFile] = useState(null)
  
//     const handleClick = event => {
//         event.preventDefault()
//         hiddenFileInput.current.click();
//     };

//     const handleChange = event => {
//         setUploadedFile(event.target.files[0]);
        
//         // handleImage(uploadedFile)
//     };

//     return (
//         <div>
//             <button onClick={handleClick} className='w-36 h-36 bg-gray-800 text-white rounded-3xl'>
//                 Upload Image
//             </button>
//             {uploadedFile && <img className='w-36 h-36' src={uploadedFile} />}
//             <input type="file"
//                 ref={hiddenFileInput}
//                 onChange={handleChange}
//                 className='hidden' 
//             /> 
//         </div>
//     );
// }

export default ImageUpload;
