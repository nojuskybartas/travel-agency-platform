import React, { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversionRateAtom } from '../atoms/currencyAtom';
import { userState } from '../atoms/userAtom';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ReviewSection from '../components/ReviewSection';
import { getFormatedPrice } from '../lib/currency';
import { getAgeInYears, getExperienceAge, timeSince } from '../lib/date';
import { auth, db } from '../lib/firebase';
import { countryArray, countryObject } from '../lib/nationalities';
import { getExperienceById, getExperienceOwner, getUserDetails, getUserFinancials, setExperienceViewed } from '../lib/storage';
import LoadingIndicator from '../components/LoadingIndicator'
import EditExperience from '../components/EditExperience';
import MainPageStructure from '../components/MainPageStructure';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import { collection, doc, setDoc } from 'firebase/firestore';

function Experience() {

    const { experienceId } = useParams();
    const [experience, setExperience] = useState({});  
    const userData = useRecoilValue(userState)
    const currencyRates = useRecoilValue(conversionRateAtom)
    const [currency, setCurrency] = useState('eur')
    const [currencyAdjustedPrice, setCurrencyAdjustedPrice] = useState()
    const [userIsOwner, setUserIsOwner] = useState()
    const [showEditor, setShowEditor] = useState(false)
    const navigate = useNavigate()

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
            // if (auth.currentUser) {}
            setUserIsOwner(exp.owner.id === auth.currentUser?.uid ? true : false)
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
        // console.log(experience)
        
        // console.log()
    }, [experience])

    const channelExists = () => {
        console.log(userData)
        for (const channel of userData.messageChannels) {
            if (channel.user === experience.owner.id) {
                console.log('channel exists!'); 
                navigate(`/inbox/${channel.id}`); 
                return true
            }
        }
        console.log('no channel found')
        return false
    }

    const createConversation = () => {
        if (!auth.currentUser.uid || !experience.owner.id) return
        if (channelExists()) return

        const inbox = doc(collection(db, `messageChannels`))
        
        setDoc(inbox, {
            users: [auth.currentUser.uid, experience.owner.id]
        })
        setDoc(doc(db, `users/${auth.currentUser.uid}/messageChannels/${inbox.id}`), {
            id: inbox.id,
            user: experience.owner.id
        })
        setDoc(doc(db, `users/${experience.owner.id}/messageChannels/${inbox.id}`), {
            id: inbox.id,
            user: auth.currentUser.uid
        })
        navigate(`/inbox/${inbox.id}`)
    }
    

    return (
        <MainPageStructure>
            {experience ? <>
                <LoadingIndicator/>
                <EditExperience show={showEditor} setShow={setShowEditor} experience={experience}/>
                <div className='w-full h-full flex flex-col justify-around'>
                    <div className='w-full h-fit flex space-x-8 font-bold text-3xl py-14 items-center'>
                        <h1 className='break-words'>{experience?.title}</h1>
                        {userIsOwner && <h3 className='underline italic text-2xl hover:scale-110 cursor-pointer transition-all ease-out' onClick={() => setShowEditor(true)}>Edit</h3>}
                    </div>
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
                        {experience?.owner && 
                            <div className='flex flex-col grow h-fit items-center justify-center'>
                            <div className='h-fit min-h-[5rem] w-fit -translate-x-10'>
                                <h1 className='font-bold text-2xl'>Meet the Host 🪅</h1>
                                {!userIsOwner && <ChatAlt2Icon className='w-8 h-8 hover:scale-110' onClick={createConversation}/>}
                            </div>
                            
                            <div className='grow h-fit space-y-2 mb-12 flex flex-col items-center md:items-end flip-card'>
                                <div className='flip-card-inner h-fit'>
                                    <div className='flip-card-front flex flex-col justify-center items-center'>
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
                            
                            </div>
                        </div>}
                    </div>
                </div>
                <Carousel label='Here, take a look! 😎' items={experience?.images?.map((url, i) => {
                    return <Image url={url} key={i}/>
                }) || []}/>

                <ReviewSection experienceId={experienceId}/>
                
                </>
                :
                <div className='w-full h-[80vh] flex flex-col justify-center items-center'>
                    <h1>Uh oh! 😟</h1>
                    <h2>This experience doesn't exist</h2>
                </div>}
        </MainPageStructure>
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
