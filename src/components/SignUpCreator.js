import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms/userAtom';
import '../bounceAnimation.css'
import { auth } from '../lib/firebase';
import { refreshUserData } from '../lib/storage';
import LoginModal from './LoginModal';

function SignUpCreator() {

    const navigate = useNavigate()
    const [showLogin, setShowLogin] = useState(false)
    const [userData, setUserData] = useRecoilState(userState)

    useEffect(() => {
        refreshUserData().then(data => {
            setUserData(data)
        })
    }, [])

    const handleClick = () => {
        if (!auth.currentUser) {
            setShowLogin(true)
        } else {
            navigate('/creator/register')
        }
        
    }

    return (
        <section className="w-full h-full flex justify-center items-center">
        <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} label='Register an account first to become a creator'/>
            <div className="cd-intro-content bouncy space-y-4 p-3 md:p-0">
                <h1 className='font-bold text-4xl'>Experiences...</h1>
                <p className='font-semibold text-lg'>Do you think you have what it takes to create one?</p>
                <div className="flex justify-between">
                    <button className='cd-btn button bg-green-400 hover:bg-green-500 group' onClick={handleClick}>Get Started</button>
                    <button className="cd-btn button bg-gray-800 hover:bg-gray-900">Learn More</button>
                </div>
            </div>
        </section>
    )
}

export default SignUpCreator;
