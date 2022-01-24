import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { userState } from "../atoms/userAtom"
import Carousel from "../components/Carousel"
import ExperienceCard from "../components/ExperienceCard"
import Footer from "../components/Footer"
import Header from "../components/Header"
import UserStatistics from "../components/UserStatistics"
import { auth } from "../lib/firebase"
import { getExperienceById, getUserDetails, getUserExperiences, getUserFinancials } from "../lib/storage"
import upload_profile from '../upload_profile.svg'

function Profile() {

    const user = auth.currentUser
    const [topExperiences, setTopExperiences] = useState([])
    const [userDetails, setUserDetails] = useState({})
    const [userFinancials, setUserFinancials] = useState({})

    const handleDragStart = (e) => e.preventDefault();

    useEffect(() => {

        setTopExperiences([])

        getUserExperiences(user.uid).then(data => {
            data.forEach(({id}) => {
                getExperienceById(id).then(experience => {
                    setTopExperiences(experiences => [...experiences, {id:id, experience:experience}])
                })
            })
        })

        getUserDetails(user.uid).then(data => {
            setUserDetails(data.data())
        })

        getUserFinancials(user.uid).then(data => {
            setUserFinancials(data.data())
        })
        
    }, [user])

    const items = topExperiences.map(item => {
        return <ExperienceCard id={item.id} image={item.experience.images[0]} price={item.experience.details?.price} description={item.experience.details?.title} rating={5} rating_count={315} onDragStart={handleDragStart} role="presentation"/>
    })

    return (
        <div className="">
            <div className="max-w-[1080px] h-full ml-auto mr-auto space-y-6 sm:px-2 sm:py-2">
                <Header/>
                <div className="flex p-2">
                    <div className="flex flex-col flex-1 font-bold mb-20 space-y-2">
                        <h1 className="text-5xl">{user.displayName}</h1>
                        <h1 className="text-lg">{user.email}</h1>
                        <h1 className="italic">{userDetails.type != 'regular' ? userDetails.type : null}</h1>
                        <h1 className="text-sm">Currency: {userFinancials.currency}</h1>
                    </div>
                    <div className="w-32 h-32 bg-gray-800 p-2 rounded-2xl group relative transition-long">
                        <img src={userDetails.picture} className="w-full h-full rounded-xl group-hover:brightness-50 transition-long"/>
                        <img src={upload_profile} className="hidden absolute w-1/2 h-1/2 -translate-y-full group-hover:inline transition-long"/>
                        <p className="opacity-0 group-hover:opacity-100 whitespace-nowrap w-full h-full transition-long">Upload photo</p>
                    </div>
                </div>
                <UserStatistics/>
                <div className='w-full h-fit'>
                    <Carousel label={topExperiences.length > 1 ? 'Your Newest Experiences' : 'You havent created any experiences yet... What are you waiting for?'} items={items}/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Profile