import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getExperienceById } from '../lib/storage';

function Experience() {

    const { experienceId } = useParams();
    const [experience, setExperience] = useState({});
    const [images, setImages] = useState([]);     

    useEffect(() => {

        getExperienceById(experienceId).then(data => {
            setExperience(data.details)
            setImages(data.images)
        })

    }, [])

    // useEffect(() => {
    //     if (!experience) return 
    //     const experienceOwner = experience.owner
    //     console.log(experienceOwner)
    // }, [experience])

    return (
        <div className='w-full h-full'>
            <div className="max-w-[1080px] h-full ml-auto mr-auto sm:px-2 sm:py-2 flex flex-col justify-between items-center">
                <Header/>
                <div className='w-full h-full flex flex-col justify-around'>
                    <h1 className='font-bold text-3xl py-14'>{experience?.title}</h1>
                    <div className='flex flex-wrap-reverse'>
                        <div className='grow'>
                            <h1 className='font-bold text-lg mb-5'>More on the subject 👇</h1>
                            <p className='mb-10'>{experience?.description}</p>
                            <div className='space-y-2 font-semibold'>
                                <p>Total price: {experience?.price}</p>
                                <p>This experience is in {experience?.location}</p>
                                <p>{experience?.minAge ? `The minimum age is ${experience.minAge}` : 'There is no age limit! Family approved 💖'}</p>
                                <p>{experience?.peopleLimit ? `The number of people allowed by your host is ${experience.peopleLimit}` : null}</p>
                            </div>
                        </div>
                        {/* TODO: implement owner profile */}
                        {/* <div className='grow w-full'>
                            <h1 className='font-bold text-2xl'>Meet the Host 🪅</h1>
                            <img className='w-100 h-100 bg-black' src=''/>
                        </div> */}
                    </div>
                </div>
                <Carousel label='Here, take a look! 😎' items={images?.map((url, i) => <Image url={url} key={i}/>)}/>
            </div>
            <Footer/>
        </div>
    );
}

export default Experience;


function Image({url}) {
    return(
        <div className='bg-gray-900 p-2 group w-fit h-fit'>
            <img src={url} className="w-fit h-[350px] md:h-[250px] object-contain group-hover:opacity-75"/>
        </div>
    )
}
