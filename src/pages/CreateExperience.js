import React, { useEffect } from 'react';
import CreateExperienceForm from '../components/CreateExperienceForm';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../bounceAnimation.css'
import { useState } from 'react';
import CreateExperienceSuccess from '../components/CreateExperienceSuccess';

function CreateExperience() {

    const [state, setState] = useState('menu')
    const experienceId = new Date().valueOf() * Math.floor(Math.random() * 10000)

    return (
        <div>
            <div className="max-w-[1080px] h-full ml-auto mr-auto space-y-6 sm:px-2 sm:py-2 flex flex-col justify-between items-center">
                <Header transparent/>
                {state === 'menu' && 
                    <section className="w-full flex justify-center items-center h-[80vh]">
                        <div className="cd-intro-content bouncy space-y-4 p-3 md:p-0">
                            <h1 className='font-bold text-4xl'>Experiences...</h1>
                            <p className='font-semibold text-lg'>Do you think you have what it takes to create one?</p>
                            <div className="flex justify-between">
                                <a className="cd-btn bg-green-400 hover:bg-green-500 button" onClick={() => setState('creator')}>Get started</a>
                                <a className="cd-btn bg-gray-800 hover:bg-gray-900 button">Learn More</a>
                            </div>
                        </div>
                    </section>}
                {state != 'menu' && <div className='h-[80vh] w-full'>
                {state === 'creator' && 
                    <CreateExperienceForm experienceId={experienceId} setParentState={setState}/>}
                {state === 'submitted_success' && 
                    <CreateExperienceSuccess experienceId={experienceId} setParentState={setState}/>}
                </div>}
            </div>
            <Footer/>
        </div>
    )
}

export default CreateExperience;
