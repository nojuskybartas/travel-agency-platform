import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../bounceAnimation.css'

function SignUpCreator() {

    const navigate = useNavigate()

    return (
        <section className="w-full h-full flex justify-center items-center">
            <div className="cd-intro-content bouncy space-y-4 p-3 md:p-0">
                <h1 className='font-bold text-4xl'>Experiences...</h1>
                <p className='font-semibold text-lg'>Do you think you have what it takes to create one?</p>
                <div className="flex justify-between">
                    <button className='cd-btn button bg-green-400 hover:bg-green-500 group' onClick={() => navigate('/creator/register')}>Get Started</button>
                    <button className="cd-btn button bg-gray-800 hover:bg-gray-900">Learn More</button>
                </div>
            </div>
        </section>
    )
}

export default SignUpCreator;
