import React from 'react';
import ReactModal from 'react-modal';
import { useEffect, useState } from 'react'
import logo from '../logo512.png'
import { ArrowLeftIcon, MailIcon, XIcon } from "@heroicons/react/outline"
import EmailLogin from './login/EmailLogin';
import FacebookLogin from './login/FacebookLogin';
import GoogleLogin from './login/GoogleLogin';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import EmailRegister from './login/EmailRegister';
import { auth } from '../lib/firebase';

function LoginModal({showLogin, setShowLogin, label, onExit}) {

    const [state, setState] = useState('loginMenu')
    const user = auth.currentUser


    const handleLoginShow = () => {
        setState('loginMenu')
        setShowLogin(!showLogin)
        if (onExit) onExit()
    }

    useEffect(() => {
        showLogin ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
        // return () => document.body.style.overflow = 'unset';
     }, [showLogin]);


  return (
    <ReactModal
    isOpen={showLogin}
    className='loginModal'
    overlayClassName='loginModalOverlay'
    onRequestClose={handleLoginShow}
    shouldCloseOnOverlayClick={false}
    shouldCloseOnEsc={true}
    ariaHideApp={false}
    >
        <div className='absolute top-5 right-5'>
            <XIcon className='w-4 h-4 cursor-pointer' onClick={handleLoginShow}/>
        </div>
        <div className='absolute top-5 left-5'>
            <ArrowLeftIcon className={`w-4 h-4 cursor-pointer ${state==='loginMenu' && 'hidden'}`} onClick={() => setState('loginMenu')}/>
        </div>
        <div className='w-full h-full flex flex-col justify-around'>

            <img className='w-32 h-fit object-fit' src={logo} alt='' onClick={handleLoginShow}/>
                
            <h1 className={`font-semibold text-2xl w-2/3`}>{state==='loginMenu' ? label : state != 'registerEmail' ? 'Welcome back.' : null}</h1>
            
            <div className={`flex flex-col space-y-5 ${state!='loginMenu' && 'hidden'}`}>
                <div className='loginButton opacity-70'>
                    <img src='https://static.tacdn.com/img2/google/G_color_40x40.png' className='w-6 h-6'/>
                    <button className='ml-[-5%] w-full'>Continue with Google</button>
                </div>
                <div className='loginButton opacity-70' > {/* onClick={() => setState('loginFacebook')} */}
                    <img src='https://static.tacdn.com/img2/facebook/icn-FB2.png' className='w-6 h-6'/>
                    <button className='ml-[-5%] w-full'>Continue with Facebook</button>
                </div>
                <div className='loginButton' onClick={() => setState('loginEmail')}>
                    <MailIcon className='w-6 h-6'/>
                    <button className='ml-[-5%] w-full'>Continue with Email</button>
                </div>
            </div>

            {state==='loginEmail' && <EmailLogin handleLoginShow={handleLoginShow} setParentState={setState}/>}
            {state==='registerEmail' && <EmailRegister handleLoginShow={handleLoginShow} />}
            {state==='loginFacebook' && <FacebookLogin/>}
            {state==='loginGoogle' && <GoogleLogin handleLoginShow={handleLoginShow}/>}

            <p className=' text-center text-xs'>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  "
            </p>
            
        </div>
        
    </ReactModal>
  )
}

export default LoginModal;
