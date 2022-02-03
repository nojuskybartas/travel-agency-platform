import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import ReactModal from 'react-modal';

// function CreateExperienceSuccess({experienceId, setParentState}) {

    
//     const navigate = useNavigate()

//     return (
//         <div className='w-full h-full flex flex-col items-center justify-center space-y-6'>
//             <h1 className='font-bold text-3xl p-2'>New Experience Created Successfully!</h1>
//             <p>Add drum rolls here</p>
//             <div className='w-3/4 h-fit flex justify-center space-x-5'>
//                 <button className='button bg-gray-800 hover:bg-gray-900 group' onClick={() => setParentState('creator')} onMouseEnter={() => setHoverOnMore(true)} onMouseLeave={() => setHoverOnMore(false)}>
//                     <div className='hidden lg:flex'>
//                         <p className='-translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all ease-in-out duration-600'>We know you want to</p>
//                         <p className='-translate-x-full group-hover:translate-x-[5%] group-hover:text-gray-400 transition-all ease-in-out duration-600'>{hoverOnMore ? 'add more': 'Add more?'}</p>
//                     </div>
//                     <p className='inline lg:hidden'>Add more?</p>
//                 </button>
//                 <button className='button bg-gray-600 hover:bg-gray-800' onClick={() => navigate(`/experience/${experienceId}`)}>View</button>
//             </div>
//         </div>
//     );
// }

// export default CreateExperienceSuccess;

function CreateExperienceSuccessModal({experienceId, values}) {

    console.log('render')

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(true)
    const [hoverOnMore, setHoverOnMore] = useState(false)

    useEffect(() => {
        showModal ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
     }, [showModal]);

     const handleShow = () => {
        setShowModal(!showModal)
        navigate('/profile')
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
        
        <div className='w-full h-full flex flex-col items-center justify-center space-y-6'>
            <h1 className='font-bold text-3xl p-2'>New Experience Created Successfully!</h1>
            <p className='italic'>Add drum rolls please</p>
            <div className='w-full h-fit flex justify-center space-x-2'>
                <button className='w-full h-full button bg-gray-800 hover:bg-gray-900 group' onClick={() => navigate('/create')} onMouseEnter={() => setHoverOnMore(true)} onMouseLeave={() => setHoverOnMore(false)}>
                    <div className='hidden lg:flex w-full'>
                        <p className='-translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-[5%] transition-all ease-in-out duration-600'>We know you want to</p>
                        <p className='-translate-x-full group-hover:translate-x-[15%] group-hover:text-gray-400 transition-all ease-in-out duration-600'>{hoverOnMore ? 'add more': 'Add more?'}</p>
                    </div>
                    <p className='inline lg:hidden'>Add more?</p>
                </button>
                <button className='button bg-gray-600 hover:bg-gray-800' onClick={() => navigate(`/experience/${experienceId}`)}>View</button>
            </div>
        </div>
        
            
        </ReactModal>
    );
}

export default CreateExperienceSuccessModal;