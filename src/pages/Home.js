import { useState } from "react"
import { useEffect } from "react"
import Carousel from "../components/Carousel"
import ExperienceCard from "../components/ExperienceCard"
import Footer from "../components/Footer"
import Getaways from "../components/Getaways"
import Header from "../components/Header"
import SearchWBG from "../components/SearchWBG"
import { getExperienceById, getExperiences } from "../lib/storage"
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from "../components/LoadingIndicator"


function Home () {

    const [topExperiences, setTopExperiences] = useState([])

    const handleDragStart = (e) => e.preventDefault();

    console.log(topExperiences)

    useEffect(() => {

        setTopExperiences([])

        trackPromise(
        getExperiences().then(data => {
            data.forEach(({id}) => {
                getExperienceById(id).then(experience => {
                    setTopExperiences(experiences => [...experiences, {id:id, experience:experience}])
                })
            })
        }))
        
    }, [])

    const items = topExperiences.map(item => {
        return <ExperienceCard key={item.id} id={item.id} image={item.experience.images[0]} price={item.experience.price} description={item.experience.title} rating={item.experience.rating} rating_count={item.experience.ratingCount} onDragStart={handleDragStart} role="presentation"/>
    })

    return (
        <div>
            <div className="max-w-[1080px] h-full ml-auto mr-auto space-y-6 sm:px-2 sm:py-2">
                <Header/>
                <SearchWBG/>
                {/* <Experiences/> */}
                <div className='w-full h-fit'>
                    <Carousel label='Explore Latest Experiences' infinite items={items}/>
                    <LoadingIndicator/>
                </div>

                <Getaways/>
            </div>
            <Footer/>
        </div>
    )
}

export default Home