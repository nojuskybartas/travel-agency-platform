import { useEffect, useState } from 'react'
import logo from '../tripadvisor_logo.svg'
import { ArrowLeftIcon, MailIcon, XIcon } from "@heroicons/react/outline"
import ReactModal from 'react-modal';
import EmailLogin from './login/EmailLogin';
import FacebookLogin from './login/FacebookLogin';
import GoogleLogin from './login/GoogleLogin';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Link, Navigate } from 'react-router-dom';


function Login() {

    const [state, setState] = useState('loginMenu')
    const [showLogin, setShowLogin] = useState(false)
    const user = useRecoilValue(userState)


    const handleLoginShow = () => {
        if(!user) {
            setState('loginMenu')
            setShowLogin(!showLogin)
        }
    }

    useEffect(() => {
        showLogin ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
        // return () => document.body.style.overflow = 'unset';
     }, [showLogin]);
    

    return (
        <div className='w-full h-10'>
            <div className='headerRight w-fit h-10 top-0 bg-black text-white hover:bg-gray-800 group relative'>
                <div className='font-bold ml-auto mr-auto' onClick={handleLoginShow}>{user ? `Hello, ${user.displayName || user.email}` : 'Sign In'}</div>
                {user && <Submenu/>}
                
                
            </div>
            
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
                        
                    <h1 className={`font-semibold text-2xl w-2/3`}>{state==='loginMenu' ? 'Sign in to unlock the best of Tripadvisor.' : 'Welcome back.'}</h1>
                    
                    <div className={`flex flex-col space-y-5 ${state!='loginMenu' && 'hidden'}`}>
                        <div className='loginButton' onClick={() => setState('loginGoogle')}>
                            <img src='https://static.tacdn.com/img2/google/G_color_40x40.png' className='w-6 h-6'/>
                            <button className='ml-[-5%] w-full'>Continue with Google</button>
                        </div>
                        <div className='loginButton' onClick={() => setState('loginFacebook')}>
                            <img src='https://static.tacdn.com/img2/facebook/icn-FB2.png' className='w-6 h-6'/>
                            <button className='ml-[-5%] w-full'>Continue with Facebook</button>
                        </div>
                        <div className='loginButton' onClick={() => setState('loginEmail')}>
                            <MailIcon className='w-6 h-6'/>
                            <button className='ml-[-5%] w-full'>Continue with Email</button>
                        </div>
                    </div>

                    {state==='loginEmail' && <EmailLogin handleLoginShow={handleLoginShow}/>}
                    {state==='loginFacebook' && <FacebookLogin/>}
                    {state==='loginGoogle' && <GoogleLogin handleLoginShow={handleLoginShow}/>}

                    <p className=' text-center text-xs'>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  "
                    </p>
                    
                </div>
                
            </ReactModal>
        </div>
        
        
    )
}

function Submenu() {return (
    <ul className="absolute hidden group-hover:inline-block top-7 bg-gray-900 rounded-lg transition-all ease-in-out  h-fit w-5/6 p-2 z-[-1]">
      <Link to='/profile'>
        <li className="hover:bg-gray-600">
            <a>My Profile</a>
        </li>
      </Link>
      <li className="hover:bg-gray-600" onClick={() => signOut(auth)}>
        <a>Sign Out</a>
      </li>
      {/* <li className="hover:bg-gray-600">
        <a>Our Portfolio</a>
      </li> */}
    </ul>
  )

}

export default Login
