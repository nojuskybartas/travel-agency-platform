import React, { useEffect, useState } from 'react';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import ExperienceCard from '../components/ExperienceCard';
import LoadingIndicator from '../components/LoadingIndicator';
import MainPageStructure from '../components/MainPageStructure';
import { getExperienceById, refreshUserData } from '../lib/storage';

function SavedExperiences() {
  const [userDetails, setUserDetails] = useRecoilState(userState)
  const navigate = useNavigate()
  const [userSavedExperiences, setUserSavedExperiences] = useState([])
  const { promiseInProgress } = usePromiseTracker();

  useEffect(() => {
    trackPromise(
      refreshUserData().then(res => {
        setUserDetails(res)
      })
    )
  }, [])

  useEffect(() => {
    setUserSavedExperiences([])
    userDetails?.savedExperiences?.map(experience => {
      getExperienceById(experience.id).then(res => {
        setUserSavedExperiences(exp => [...exp, {...res, id:experience.id}])
      })
    })
    
  }, [userDetails])

  return (
      <MainPageStructure name='savedExperiencesPage'>
        <div className='p-2 min-h-[60vh]'>
            <h1 className='font-bold text-2xl'>Saved Experiences</h1>
            <hr className='w-full h-1 bg-gray-900 mb-3'/>
            <LoadingIndicator/>
            <div className={`${promiseInProgress ? 'hidden' : 'w-full h-full'}`}>
              {userSavedExperiences.length > 0 ? 
                userSavedExperiences.map((experience, i) => {
                  return <ExperienceCard key={i} id={experience.id} image={experience.images[0]} price={experience.price} description={experience.title} rating={experience.rating} rating_count={experience.ratingCount}/>
                })
              :
                <div>
                    <p>You haven't saved any experiences yet!</p>
                    <a onClick={() => navigate('/experiences')} className='font-semibold underline'>Explore</a>
                </div>
              }
            </div>
        </div>          
      </MainPageStructure>
  );
}

export default SavedExperiences;
