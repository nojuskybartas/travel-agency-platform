import React, { useEffect } from 'react';
import CreateExperienceForm2 from '../components/CreateExperienceForm2';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import SignUpCreator from '../components/SignUpCreator';
import MainPageStructure from '../components/MainPageStructure';

function CreateExperience() {

    const userData = useRecoilValue(userState)

    return (
        <MainPageStructure>
            <div className='w-full h-full md:h-[80vh] md:mb-5'>
                {userData?.type !== 'creator' ? <SignUpCreator/> : <CreateExperienceForm2/>}
            </div>
        </MainPageStructure>
    )
}

export default CreateExperience;
