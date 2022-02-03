import React, { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversionRateAtom } from '../atoms/currencyAtom';
import { userState } from '../atoms/userAtom';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ReviewSection from '../components/ReviewSection';
import { getFormatedPrice } from '../lib/currency';
import { getAgeInYears, getExperienceAge, timeSince } from '../lib/date';
import { auth } from '../lib/firebase';
import { countryArray, countryObject } from '../lib/nationalities';
import { getExperienceById, getExperienceOwner, getUserDetails, getUserFinancials, setExperienceViewed } from '../lib/storage';
import LoadingIndicator from '../components/LoadingIndicator'

function Experience() {

    const { experienceId } = useParams();
    const [experience, setExperience] = useState({});  
    const userData = useRecoilValue(userState)
    const currencyRates = useRecoilValue(conversionRateAtom)
    const [currency, setCurrency] = useState('eur')
    const [currencyAdjustedPrice, setCurrencyAdjustedPrice] = useState()

    useEffect(() => {
        setCurrencyAdjustedPrice(experience?.price * currencyRates[currency.toLowerCase()])

    }, [currency, currencyRates, experience])

    useEffect(() => {
        setCurrency(userData?.financials ? userData.financials.currency : 'eur')
    }, [userData]);

    useEffect(() => {

        trackPromise(
        getExperienceById(experienceId).then(exp => {
            if (!exp) {console.log('this experience does not exist'); setExperience(null); return;}
            getExperienceOwner(exp.owner).then(res => {
                exp.owner = res
                setExperience(exp)
            })
            setExperienceViewed(experienceId)
        }))
    }, [])

    useEffect(() => {
        // if (!experience) return 
        // const experienceOwner = experience.owner
        // console.log(experienceOwner)
        console.log(experience)
        
        // console.log()
    }, [experience])
    

    return (
        <div className='w-full h-full'>
            <div className="max-w-[1080px] h-full ml-auto mr-auto sm:px-2 sm:py-2 flex flex-col justify-between items-center">
                <Header/>
                {experience ? <>
                <LoadingIndicator/>
                <div className='w-full h-full flex flex-col justify-around'>
                    <h1 className='font-bold text-3xl py-14 break-words'>{experience?.title}</h1>
                    <div className='flex flex-wrap-reverse justify-between'>
                        <div className='w-full md:w-2/3'>
                            <h1 className='font-bold text-lg mb-5'>More on the subject 👇</h1>
                            <p className='break-words'>{experience?.description}</p>
                            <div className='space-y-2 font-semibold mt-16'>
                                <p>Total price: {getFormatedPrice(currencyAdjustedPrice, currency) || 'Free'}</p>
                                <p>This experience is in {experience?.locations}</p>
                                <p>{experience?.minAge ? `The minimum age is ${experience?.minAge}` : 'There is no age limit! Family approved 💖'}</p>
                                <p>{experience?.peopleLimit ? `The number of people allowed by your host is ${experience?.peopleLimit}` : null}</p>
                                <p>Posted {timeSince(experience?.createdOn)} ago</p>
                            </div>
                        </div>
                        {experience?.owner && <div className='grow h-fit space-y-2 mb-12 flex flex-col items-center md:items-end flip-card'>
                            <div className='flip-card-inner'>
                                <div className='flip-card-front flex flex-col justify-center items-center'>
                                    <h1 className='font-bold text-2xl'>Meet the Host 🪅</h1>
                                    <img className='w-48 h-48 object-cover bg-black rounded-2xl p-2' src={experience?.owner.picture}/>
                                    <div className='flex text-2xl'>
                                        <h1 className=''>{experience?.owner.name}</h1>
                                        <h1 className='font-semibold'>{experience?.owner.showAge && ', ' + getAgeInYears(experience?.owner.dateOfBirth)}</h1>
                                    </div>
                                    <h1>{experience?.owner.profession}</h1>
                                    <h1>{countryObject[experience?.owner.nationality]}</h1>
                                </div>
                                <div className='flip-card-back flex justify-center items-center'>
                                    <h1>{experience?.owner.motivation}</h1>
                                </div>
                            </div>
                            
                        </div>}
                    </div>
                </div>
                <Carousel label='Here, take a look! 😎' items={experience?.images?.map((url, i) => {
                    return <Image url={url} key={i}/>
                })}/>

                <ReviewSection experienceId={experienceId}/>
                
                </>
                :
                <div className='w-full h-[80vh] flex flex-col justify-center items-center'>
                    <h1>Uh oh! 😟</h1>
                    <h2>This experience doesn't exist</h2>
                </div>}

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
        <div className='bg-gray-900 p-2 group h-fit w-[350px] md:w-[450px]'>
            <img src={url} className={`w-full h-[350px] md:h-fit max-h-[350px] object-contain group-hover:opacity-75 `} onLoad={() => setLoaded(true)}/>
        </div>
    )
}
