import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from "@heroicons/react/outline"
import AliceCarousel from "react-alice-carousel"
import Carousel from "./Carousel";
import CityCard from "./CityCard"

const items = [
    <CityCard city='Paris' country='France' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c2/86/0e/caption.jpg?w=300&h=300&s=1' />,
    <CityCard city='Frankfurt' country='Germany' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f7/76/frankfurt.jpg?w=700&h=500&s=1' />,
    <CityCard city='Cologne' country='Germany' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f7/7e/cologne.jpg?w=300&h=300&s=1' />,
    <CityCard city='Dusseldorf' country='Germany' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f7/81/dusseldorf.jpg?w=300&h=300&s=1' />,
    <CityCard city='Antwerp' country='Belgium' image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/54/6b/30/img-20170519-215608-largejpg.jpg?w=300&h=300&s=1' />,

];

function Getaways() {

    return (
        <div className='w-full h-fit'>
            <Carousel label='Dream your next trip' infinite items={items}/>
        </div>
    )
}

export default Getaways