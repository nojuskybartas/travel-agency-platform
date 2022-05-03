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
import CityCard from "../components/CityCard"
import MobileNav from "../components/MobileNav"
import MainPageStructure from "../components/MainPageStructure"
import RegionSelect from "../components/RegionSelect"


function Home () {

    const [topExperiences, setTopExperiences] = useState([])

    const handleDragStart = (e) => e.preventDefault();

    // console.log(topExperiences)

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

    const latestExperienceCards = topExperiences.map(item => {
        return <ExperienceCard key={item.id} id={item.id} image={item.experience.images[0]} price={item.experience.price} description={item.experience.title} rating={item.experience.rating} rating_count={item.experience.ratingCount} onDragStart={handleDragStart} role="presentation"/>
    })

    const countryCards = [
        <CityCard city='Paris' country='France' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c2/86/0e/caption.jpg?w=300&h=300&s=1' />,
        <CityCard city='Frankfurt' country='Germany' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f7/76/frankfurt.jpg?w=700&h=500&s=1' />,
        <CityCard city='Cologne' country='Germany' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f7/7e/cologne.jpg?w=300&h=300&s=1' />,
        <CityCard city='Dusseldorf' country='Germany' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f7/81/dusseldorf.jpg?w=300&h=300&s=1' />,
        <CityCard city='Antwerp' country='Belgium' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/54/6b/30/img-20170519-215608-largejpg.jpg?w=300&h=300&s=1' />,
    ];

    return (
        <MainPageStructure name='homePage'>
            {/* <div className="h-full overflow-y-scroll"> */}
                <SearchWBG/>
                <div className="w-full h-fit">
                    <RegionSelect/>
                </div>
                <div className='w-full h-fit test-outline'>
                    <Carousel label='Explore Latest Experiences' infinite items={latestExperienceCards}/>
                    <LoadingIndicator/>
                </div>
                <div className='w-full h-fit test-outline hidden'>
                    <Carousel label='Dream your next trip' infinite items={countryCards}/>
                    <LoadingIndicator/>
                </div>
            {/* </div> */}
        </MainPageStructure>
    )
}

export default Home