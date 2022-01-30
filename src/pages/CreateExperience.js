import React, { useEffect } from 'react';
import CreateExperienceForm from '../components/CreateExperienceForm';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import SignUpCreator from '../components/SignUpCreator';

function CreateExperience() {

    const userData = useRecoilValue(userState)

    return (
        <div>
            <div className="max-w-[1080px] h-full ml-auto mr-auto space-y-6 sm:px-2 sm:py-2 flex flex-col justify-between items-center">
                <Header transparent/>
                <div className='w-full h-[80vh]'>
                    {userData?.type === 'regular' ? <SignUpCreator/> : <CreateExperienceForm/>}

                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default CreateExperience;
