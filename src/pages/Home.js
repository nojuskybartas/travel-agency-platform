import { useState } from "react"
import { useEffect } from "react"
import Carousel from "../components/Carousel"
import ExperienceCard from "../components/ExperienceCard"
import Footer from "../components/Footer"
import Getaways from "../components/Getaways"
import Header from "../components/Header"
import SearchWBG from "../components/SearchWBG"
import { getExperienceById, getExperiences } from "../lib/storage"


function Home () {

    const [topExperiences, setTopExperiences] = useState([])

    const handleDragStart = (e) => e.preventDefault();

    useEffect(() => {

        setTopExperiences([])

        getExperiences().then(data => {
            data.forEach(({id}) => {
                getExperienceById(id).then(experience => {
                    setTopExperiences(experiences => [...experiences, {id:id, experience:experience}])
                })
            })
        })
        
    }, [])

    const items = topExperiences.map(item => {
        return <ExperienceCard id={item.id} image={item.experience.images[0]} price={item.experience.details.price} description={item.experience.details.title} rating={5} rating_count={315} onDragStart={handleDragStart} role="presentation"/>
    })

    return (
        <div>
            <div className="max-w-[1080px] h-full ml-auto mr-auto space-y-6 sm:px-2 sm:py-2">
                <Header/>
                <SearchWBG/>
                {/* <Experiences/> */}
                <div className='w-full h-fit'>
                    <Carousel label='Explore Latest Experiences' infinite items={items}/>
                </div>

                <Getaways/>
            </div>
            <Footer/>
        </div>
    )
}

export default Home