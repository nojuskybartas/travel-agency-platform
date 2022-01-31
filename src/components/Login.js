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
import LoginModal from './LoginModal';


function Login() {

    const [state, setState] = useState('loginMenu')
    const [showLogin, setShowLogin] = useState(false)
    const user = auth.currentUser


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
        <div className='w-full h-10 hidden md:inline'>
            <div className='headerRight w-fit h-10 top-0 bg-black text-white hover:bg-gray-800 group relative'>
                <div className='font-bold ml-auto mr-auto' onClick={handleLoginShow}>{user ? `Hello, ${user.displayName || user.email}` : 'Sign In'}</div>
                {user && <Submenu/>}
                
                
            </div>
            
            <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} label='Sign in to unlock the best of Tripadvisor.'/>
        </div>
        
        
    )
}

function Submenu() {return (
    <ul className="absolute hidden group-hover:inline-block top-7 bg-gray-900 rounded-lg transition-all ease-in-out  h-fit w-5/6 p-2 z-[-1]">
      <Link to='/profile'>
        <li className="hover:bg-gray-600">
            <span>My Profile</span>
        </li>
      </Link>
      <li className="hover:bg-gray-600" onClick={() => signOut(auth)}>
        <span>Sign Out</span>
      </li>
      {/* <li className="hover:bg-gray-600">
        <span>Our Portfolio</span>
      </li> */}
    </ul>
  )

}

export default Login
