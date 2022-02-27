import { ChevronRightIcon, CogIcon, FingerPrintIcon, TicketIcon, UserCircleIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
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
import { getCurrentUserDetails, getCurrentUserFinancials, getExperienceById, getUserDetails, getUserExperiences, getUserFinancials, refreshUserData } from "../lib/storage"
import upload_profile from '../upload_profile.svg'
import { signOut } from "firebase/auth"

function Profile() {

    // const {auth} = useAuth()
    const [topExperiences, setTopExperiences] = useState([])
    const [userDetails, setUserDetails] = useRecoilState(userState)
    const [editAccountDetails, setEditAccountDetails] = useState(false)
    const [topExperienceCards, setTopExperienceCards] = useState([])

    const handleDragStart = (e) => e.preventDefault();  
    
    // useEffect(() => {
    //     refreshUserData().then(data => {
    //         setUserDetails(data)
    //     })
    // }, [])

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
        
    }, [userDetails])

    useEffect(() => {
        if (topExperiences.length === 0) return
        const items = topExperiences.map(item => {
            console.log(item)
            return <ExperienceCard id={item.id} image={item.experience.images[0]} price={item.experience.price} description={item.experience.title} rating={item.experience.rating} rating_count={item.experience.ratingCount} onDragStart={handleDragStart} role="presentation"/>
        });
        setTopExperienceCards(items)

    }, [topExperiences]);
    

    return (
        <MainPageStructure>
            <EditAccountDetailsModal2 show={editAccountDetails} setShow={setEditAccountDetails}/>
            <div className="flex p-6 test-outline ">
                <div className="flex flex-col flex-1 font-bold space-y-2 h-48 md:h-56 test-outline">
                    <h1 className="text-5xl tracking-wide"><span className="italic hidden sm:inline">Hello,</span> {userDetails?.name}</h1>
                    <h1 className="text-lg italic font-semibold mt-5 font-mono tracking-[0.2rem]">{userDetails?.type != 'regular' ? userDetails?.type : 'explorer'}</h1>
                </div>
                <img src={userDetails?.picture} className="w-32 h-32 md:w-48 md:h-48 object-cover bg-gray-800 p-2 rounded-2xl transition-long"/>
            </div>

            <h1 className="font-bold text-2xl p-6">Account Details</h1>
            <ProfileItem title='Personal' icon={<CogIcon/>} onClick={() => setEditAccountDetails(true)}/>
            <ProfileItem title='Login' icon={<FingerPrintIcon/>} />

            <h1 className="font-bold text-2xl p-6">Financials</h1>
            <ProfileItem title='Payments' icon={<TicketIcon/>} />


            <div className="w-full flex justify-center mt-20 mb-10 rounded-2xl overflow-hidden">
                <button type="button" className="w-2/3 h-10 border-4 border-solid border-gray-700 rounded-2xl hover:bg-gray-300" onClick={() => signOut(auth)}>Log Out</button>
            </div>
            
            
            {/* {userDetails?.type === 'creator' && 
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
        <div className="flex w-full h-14 p-6 items-center cursor-pointer outline-2 outline-gray-600 hover:outline" onClick={() => {if (onClick) onClick()}}>
            <div className="w-6 h-6 mr-6">{icon}</div>
            <h2 className="flex-1 text-xl">{title}</h2>
            <ChevronRightIcon className="w-8 h-8"/>
        </div>
    )
}
