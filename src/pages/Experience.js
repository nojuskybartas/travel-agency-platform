import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms/userAtom';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getFormatedPrice } from '../lib/currency';
import { auth } from '../lib/firebase';
import { getExperienceById, getExperienceOwner, getUserDetails, getUserFinancials, setExperienceViewed } from '../lib/storage';

function Experience() {

    const { experienceId } = useParams();
    const [experience, setExperience] = useState({});  
    const [price, setPrice] = useState();
    const [userData, setUserData] = useRecoilState(userState)

    useEffect(() => {

        getExperienceById(experienceId).then(data => {
            if (!data.details || !data.images) {console.log('this experience does not exist'); return;}
            const exp = data.details
            exp.images = data.images
            getExperienceOwner(exp.owner).then(res => {
                exp.owner = res
                setExperience(exp)
            })
            setExperienceViewed(experienceId)
            
        })        

    }, [])

    useEffect(() => {
        // if (!experience) return 
        // const experienceOwner = experience.owner
        // console.log(experienceOwner)
        // console.log(experience)
    }, [experience])

    useEffect(() => {
        getFormatedPrice(experience?.price, userData?.financials?.currency || 'EUR').then(res => {
            setPrice(res)
        })
    }, [userData, experience])

    

    return (
        <div className='w-full h-full'>
            <div className="max-w-[1080px] h-full ml-auto mr-auto sm:px-2 sm:py-2 flex flex-col justify-between items-center">
                <Header/>
                <div className='w-full h-full flex flex-col justify-around'>
                    <h1 className='font-bold text-3xl py-14'>{experience?.title}</h1>
                    <div className='flex flex-wrap-reverse justify-between'>
                        <div className='w-full md:w-2/3'>
                            <h1 className='font-bold text-lg mb-5'>More on the subject 👇</h1>
                            <p className=''>{experience?.description}</p>
                            <div className='space-y-2 font-semibold mt-16'>
                                <p>{price ? `Total price: ${price}` : 'Free'}</p>
                                <p>This experience is in {experience?.locations}</p>
                                <p>{experience?.minAge ? `The minimum age is ${experience.minAge}` : 'There is no age limit! Family approved 💖'}</p>
                                <p>{experience?.peopleLimit ? `The number of people allowed by your host is ${experience.peopleLimit}` : null}</p>
                            </div>
                        </div>
                        {experience.owner && <div className='grow space-y-2 mb-12 flex flex-col items-center md:items-end'>
                            <h1 className='font-bold text-2xl'>Meet the Host 🪅</h1>
                            <img className='w-40 h-40 bg-black rounded-2xl p-2' src={experience.owner.picture}/>
                            <h1 className='text-lg'>{experience.owner.name}</h1>
                        </div>}
                    </div>
                </div>
                <Carousel label='Here, take a look! 😎' items={experience?.images?.map((url, i) => {
                    return <Image url={url} key={i}/>
                })}/>
                {/* {experience?.images.forEach((url, i) => {
                    <Image url={url} key={i}/>
                })} */}
            </div>
            <Footer/>
        </div>
    );
}

export default Experience;


function Image({url}) {

    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
    }, [loaded])

    return(
        <div className='bg-gray-900 p-2 group w-fit h-fit'>
            <img src={url} className={`w-fit h-[350px] md:h-[250px] object-contain group-hover:opacity-75 `} onLoad={() => setLoaded(true)}/>
        </div>
    )
}
