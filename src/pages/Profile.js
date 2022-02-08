import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { userState } from "../atoms/userAtom"
import Carousel from "../components/Carousel"
import EditUser from "../components/EditUser"
import ExperienceCard from "../components/ExperienceCard"
import Footer from "../components/Footer"
import Header from "../components/Header"
import MainPageStructure from "../components/MainPageStructure"
import UserStatistics from "../components/UserStatistics"
import { auth } from "../lib/firebase"
import { getCurrentUserDetails, getCurrentUserFinancials, getExperienceById, getUserDetails, getUserExperiences, getUserFinancials } from "../lib/storage"
import upload_profile from '../upload_profile.svg'

function Profile() {

    const [topExperiences, setTopExperiences] = useState([])
    const [userDetails, setUserDetails] = useRecoilState(userState)
    const [editUser, setEditUser] = useState(false)
    const [items, setItems] = useState()
    // const [userFinancials, setUserFinancials] = useState({})

    const handleDragStart = (e) => e.preventDefault();  
    
    useEffect(() => {
        console.log('updated!')
    }, [userDetails])

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

        // getCurrentUserFinancials().then(res => {
        //     setUserFinancials(res.data())
        // })

        // getCurrentUserDetails().then(res => {
        //     setUserDetails(res.data())
        // })
        // getUserDetails(user.uid).then(data => {
        //     setUserDetails(data.data())
        // })

        // getUserFinancials(user.uid).then(data => {
        //     setUserFinancials(data.data())
        // })
        
    }, [userDetails])

    useEffect(() => {
        if (topExperiences.length === 0) return
        const items = topExperiences.map(item => {
            console.log(item)
            return <ExperienceCard id={item.id} image={item.experience.images[0]} price={item.experience.price} description={item.experience.title} rating={item.experience.rating} rating_count={item.experience.ratingCount} onDragStart={handleDragStart} role="presentation"/>
        });
        setItems(items)

    }, [topExperiences]);
    

    return (
        <MainPageStructure>
            <EditUser show={editUser} setShow={setEditUser}/>
            <div className="flex p-2">
                    <div className="flex flex-col flex-1 font-bold mb-20 space-y-2">
                        <h1 className="text-5xl tracking-wide"><span className="italic">Hello,</span> {userDetails?.name}</h1>
                        <h1 className="text-lg">{auth.currentUser.email}</h1>
                        <h1 className="text-sm">Currency: {userDetails?.financials?.currency}</h1>
                        {/* <h1>{'' + userDetails?.motivation}</h1> */}
                        <button onClick={() => setEditUser(true)} className="w-fit">Edit user</button>
                    </div>
                    <div className="w-48 h-48 bg-gray-800 p-2 rounded-2xl relative transition-long">
                        <img src={userDetails?.picture} className="w-full h-full object-cover rounded-xl"/>
                        <h1 className="text-lg text-center italic font-semibold mt-5 font-mono tracking-[0.2rem]">{userDetails?.type != 'regular' ? userDetails?.type : null}</h1>
                        {/* <img src={upload_profile} className="hidden absolute w-1/2 h-1/2 -translate-y-full group-hover:inline transition-long"/> */}
                        {/* <p className="opacity-0 group-hover:opacity-100 whitespace-nowrap w-full h-full transition-long">Upload photo</p> */}
                    </div>
                </div>
                {userDetails?.type === 'creator' && 
                <>
                    {/* <UserStatistics/> */}
                    <div className='w-full h-fit'>
                        <Carousel label={topExperiences.length >= 1 ? 'Your Latest Experiences' : 'You havent created any experiences yet... What are you waiting for?'} items={items}/>
                    </div>
                </>}
        </MainPageStructure>
    )
}

export default Profile