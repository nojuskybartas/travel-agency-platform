import { ChevronRightIcon, CogIcon, FingerPrintIcon, IdentificationIcon, KeyIcon, MailIcon, PencilIcon, PresentationChartLineIcon, TicketIcon, UserCircleIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { userState } from "../atoms/userAtom"
import Carousel from "../components/Carousel"
import EditAccountDetailsModal2 from "../components/profile/EditAccountDetailsModal2"
import ExperienceCard from "../components/ExperienceCard"
import Footer from "../components/Footer"
import Header from "../components/Header"
import MainPageStructure from "../components/MainPageStructure"
import UserStatistics from "../components/UserStatistics"
import { useAuth } from "../hooks/useAuth"
import { auth } from "../lib/firebase"
import { getCurrentuserData, getCurrentUserFinancials, getExperienceById, getuserData, getUserExperiences, getUserFinancials, refreshUserData } from "../lib/storage"
import upload_profile from '../upload_profile.svg'
import { signOut } from "firebase/auth"
import useUser from "../hooks/useUser"
import ProgressiveImage from "react-progressive-image"
import {motion} from 'framer-motion'
import LoadingSpinner from "../components/LoadingSpinner"
import LoadingIndicator from "../components/LoadingIndicator"

function Profile() {

    // const {auth} = useAuth()
    const navigate = useNavigate()
    const [topExperiences, setTopExperiences] = useState([])
    const {userData, loading} = useUser()
    const [editAccountDetails, setEditAccountDetails] = useState(false)
    const [topExperienceCards, setTopExperienceCards] = useState([])
    // const [loading, setLoading] = useState(true)

    const handleDragStart = (e) => e.preventDefault();  
    
    // useEffect(() => {
    //     if (!userData || !auth.currentUser) return
    //     setLoading(false)
    // }, [userData, auth])

    useEffect(() => {

        setTopExperiences([])

        console.log(auth.currentUser)
        getUserExperiences(auth.currentUser.uid).then(data => {
            data.forEach(({id}) => {
                getExperienceById(id).then(experience => {
                    setTopExperiences(experiences => [...experiences, {id:id, experience:experience}])
                })
            })
        })
        
    }, [auth])

    useEffect(() => {
        if (topExperiences.length === 0) return
        const items = topExperiences.map(item => {
            console.log(item)
            return <ExperienceCard id={item.id} image={item.experience.images[0]} price={item.experience.price} description={item.experience.title} rating={item.experience.rating} rating_count={item.experience.ratingCount} onDragStart={handleDragStart} role="presentation"/>
        });
        setTopExperienceCards(items)

    }, [topExperiences]);
    

    return (
        <MainPageStructure name='profilePage'>
            <LoadingIndicator loading={loading}/>
            {/* <EditAccountDetailsModal2 show={editAccountDetails} setShow={setEditAccountDetails}/> */}
            <div className="flex p-6 test-outline ">
                <div className="flex flex-col flex-1 font-bold space-y-2 h-48 md:h-56 test-outline">
                    <h1 className="text-5xl tracking-wide"><span className="hidden sm:inline">Hello,</span> {userData?.name}</h1>
                    <h1 className="text-lg italic font-semibold mt-5 font-mono tracking-[0.1rem]">{userData?.roles?.includes('admin') ? 'Admin' : userData?.roles?.includes('creator') ? 'Creator' : userData?.roles?.includes('creator_pending') ? 'Creator application under review' : 'Explorer'}</h1>
                </div>
                <ProgressiveImage
                src={userData?.picture?.regular || userData?.picture}
                placeholder={userData?.picture?.small}>
                    {(src, loading) => (
                        <motion.img animate={loading ? {opacity: 1, filter: 'blur(3px)'} : {opacity: 1, filter: 'blur(0px)', }} src={src} className="w-32 h-32 md:w-48 md:h-48 object-cover bg-primary p-1 rounded-2xl transition-long" alt={userData?.name + ' profile picture'}/>
                    )}
                </ProgressiveImage>
            </div>

            <h1 className="font-bold text-2xl p-6">Account Details</h1>
            <ProfileItem title='Personal' icon={<CogIcon/>} onClick={() => setEditAccountDetails(true)}/>
            <ProfileItem title='Login' icon={<FingerPrintIcon/>} />

            {userData?.roles?.includes('admin') ? 
            <>
            <h1 className="font-bold text-2xl p-6">Admin Panel</h1>
            <ProfileItem title='Review creator applications' icon={<MailIcon/>} onClick={() => navigate('/admin')}/>
            </>
            :
            userData?.roles?.includes('creator') ?
            <>
            <h1 className="font-bold text-2xl p-6">Creator Panel</h1>
            <ProfileItem title='Create Experience' icon={<PencilIcon/>} onClick={() => navigate('/create')}/>
            </>
            :
            <>
            <h1 className="font-bold text-2xl p-6">Become a creator!</h1>
            <ProfileItem title={userData?.roles?.includes('creator_pending') ? 'Your application is being reviewed!' : 'Apply now'} icon={userData?.roles?.includes('creator_pending') ? <PresentationChartLineIcon/> : <IdentificationIcon/>} onClick={() => navigate('/creator/register')}/>
            </>
            }
            
            
            <h1 className="font-bold text-2xl p-6">Financials</h1>
            <ProfileItem title='Payments' icon={<TicketIcon/>} />


            <div className="w-full flex justify-center mt-20 lg:hidden">
                <button type="button" className="w-2/3 max-w-sm h-10 border-4 border-solid border-gray-700 rounded-2xl hover:bg-gray-300" onClick={() => signOut(auth)}>Log Out</button>
            </div>

            <div className="mb-10"/>
            
            
            {/* {userData?.type === 'creator' && 
            <>
                {topExperienceCards.length >= 1 &&
                <div className='w-full h-fit'>
                    <Carousel label={topExperienceCards.length >= 1 ? 'Your Latest Experiences' : 'You havent created any experiences yet... What are you waiting for?'} items={topExperienceCards}/>
                </div>}
            </>} */}
        </MainPageStructure>
    )
}

export default Profile

const ProfileItem = ({title, icon, onClick}) => {
    
    return (
        <div className="flex w-full h-14 p-6 items-center cursor-pointer outline-2 outline-gray-600 rounded-2xl hover:outline" onClick={() => {if (onClick) onClick()}}>
            <div className="w-6 h-6 mr-6">{icon}</div>
            <h2 className="flex-1 text-xl">{title}</h2>
            <ChevronRightIcon className="w-8 h-8"/>
        </div>
    )
}
