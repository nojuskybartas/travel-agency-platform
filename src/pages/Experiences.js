import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import { getExperienceById, getExperiences, getExperiencesQuery } from '../lib/storage';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../components/LoadingIndicator';

function Experiences() {

    const [experiences, setExperiences] = useState([])
    const navigate = useNavigate()
    
    useEffect(() => {

        setExperiences([])

        trackPromise(
        getExperiences().then(data => {
            data.forEach(({id}) => {
                // console.log(e.id, '>', e.data())
                getExperienceById(id).then(experience => {
                    setExperiences(experiences => [...experiences, {id:id, experience:experience}])
                })
            })
        }))

    }, [])


  return (
      <div className='w-full h-full'>
          <div className='max-w-[1080px] h-full ml-auto mr-auto bottom-0 space-y-6 sm:px-2 sm:py-2'>
          <Header/>
          <LoadingIndicator/>
          <div className='w-full h-fit p-16 flex flex-wrap justify-center'>
            {experiences.map(item => (
                // <ExperienceCard description={experience.details.description} price={experience.details.price} image={experience.images[0]} rating_count={0} rating={0}/>
                <div className='flip-card w-[300px] md:w-[200px] h-[300px] md:h-[200px] cursor-pointer' key={item.id} onClick={() => navigate(`/experience/${item.id}`)}>
                    <div className='w-full h-full flip-card-inner'>
                        <div className='w-full h-full flip-card-front'>
                            <img src={item.experience.images[0]} className='w-full h-full object-cover p-1 rounded-lg shadow-md'/>
                        </div>
                        <div className='w-full h-full flip-card-back flex items-center justify-center'>
                            <h1 className='text-2xl text-green-200'>{item.experience.title}</h1>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
      
  );
}

export default Experiences;
