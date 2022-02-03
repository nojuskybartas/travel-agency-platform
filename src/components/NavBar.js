import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { auth } from '../lib/firebase';
import LoginModal from './LoginModal';

function NavBar() {

    const [visible, setVisible] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const { height, width } = useWindowDimensions();
    const userDetails = useRecoilValue(userState)

    const navigate = useNavigate()

    useEffect(() => {
        visible ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
    }, [visible]);

    useEffect(() => {
        if (width >= 768) {
            setVisible(false)
        }

    }, [width]);
    

     const handleShow = () => {
        setVisible(!visible)
    }

    const redirect = location => {
        setVisible(false)
        navigate(location)
    }

    return (
        <div className='md:hidden w-1/4'>
            <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} label='Sign in to unlock the best of Tripadvisor.' />
            <MenuIcon className='w-7 h-7' onClick={handleShow}/>
            <nav className={`fixed bg-[#3b443eb7] backdrop-filter backdrop-blur-lg -top-2 -bottom-2 right-1/4 -left-2 z-10 ${visible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-out overflow-y-scroll`}>
                <ul className='relative w-full h-full flex flex-col text-white font-semibold text-xl space-y-[4vh] py-[10vh] px-10'>
                    <XIcon className='absolute w-6 h-6 right-5 top-5 cursor-pointer' onClick={handleShow}/>
                    {!auth.currentUser && <button className='button w-full bg-black' onClick={() => setShowLogin(true)}>Sign in</button>}
                    <li className='cursor-pointer custom-underline'>
                        Search all experiences
                    </li>
                    <li className='cursor-pointer custom-underline'>
                        Random experience
                    </li>
                    <li className='cursor-pointer custom-underline' onClick={() => redirect('/create')}>
                        Create an experience
                    </li>
                    <hr className='border-solid border-1 border-gray-900 w-full h-fit'/>
                    {auth.currentUser && <>
                    <li className='cursor-pointer custom-underline' onClick={() => redirect('/profile')}>
                        My Profile
                    </li>
                    {userDetails?.type !== 'regular' && <li className='cursor-pointer custom-underline' onClick={() => redirect('/profile')}>
                        My Experiences
                    </li>}
                    <hr className='border-solid border-1 border-gray-900 w-full h-fit'/>
                    <li className='cursor-pointer custom-underline' onClick={() => {signOut(auth); handleShow()}}>
                        Sign Out
                    </li>
                    </>}
                </ul>
            </nav>
        </div>
    );
}

export default NavBar;
