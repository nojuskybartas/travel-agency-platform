import { XIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';

function SuccessModal({title, successMessage, destination}) {

    console.log('render')

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(true)

    useEffect(() => {
        showModal ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
     }, [showModal]);

     const handleShow = () => {
        setShowModal(!showModal)
        if (destination) navigate(destination)
    }

    return (
        <ReactModal
        isOpen={showModal}
        className='loginModal w-[80vw] h-[80vh] md:w-1/2 md:min-h-[40vh] rounded-xl'
        overlayClassName='loginModalOverlay'
        onRequestClose={handleShow}
        onAfterClose={() => {document.body.style.overflow = 'unset'}}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        >

        <div className='absolute top-5 right-5'>
            <XIcon className='w-4 h-4 cursor-pointer' onClick={handleShow}/>
        </div>
        
        {title ? title : <h1 className='font-bold text-lg w-full text-center'>⭐ Yippie! ⭐</h1>}
        <div className='w-full h-full flex flex-col items-center justify-center text-center space-y-4'>
            {successMessage}
        </div>
        
            
        </ReactModal>
    );
}

export default SuccessModal;
