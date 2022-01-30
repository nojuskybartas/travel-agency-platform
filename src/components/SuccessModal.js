import { XIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';

function SuccessModal({successMessage, destination}) {

    console.log('render')

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(true)

    useEffect(() => {
        showModal ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
     }, [showModal]);

     const handleShow = () => {
        setShowModal(!showModal)
        navigate(destination)
    }

    return (
        <ReactModal
        isOpen={showModal}
        className='loginModal'
        overlayClassName='loginModalOverlay'
        onRequestClose={handleShow}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        >

        <div className='absolute top-5 right-5'>
            <XIcon className='w-4 h-4 cursor-pointer' onClick={handleShow}/>
        </div>
        
        <div className='w-full h-full flex flex-col items-center justify-center text-center space-y-4'>
            <h1 className='font-bold text-lg'>⭐ Yippie! ⭐</h1>
            <p className='text-lg'>{successMessage}</p>
        </div>
        
            
        </ReactModal>
    );
}

export default SuccessModal;
