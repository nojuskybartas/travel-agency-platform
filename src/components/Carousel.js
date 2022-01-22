import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from '@heroicons/react/outline';
import 'react-alice-carousel/lib/alice-carousel.css';
import AliceCarousel from 'react-alice-carousel';

const responsive = {
    0: {
        items: 1,
    },
    512: {
        items: 2,
    },
    768: {
        items: 3,
    },
    1024: {
        items: 4
    }

  }

function Carousel({label, items}) {

    return (
        <div className='w-full h-fit'>
            <h1 className="font-bold text-2xl mt-10 mb-5">{label}</h1>
            <AliceCarousel 
                mouseTracking 
                infinite 
                autoWidth 
                disableDotsControls
                controlsStrategy="responsive" 
                responsive={responsive}  
                items={items} 
                renderPrevButton={() => {
                    return <ArrowCircleLeftIcon className='left-[-2vw] bg-white hover:bg-black hover:text-white rounded-full ml-3 w-12 h-12 absolute top-1/4'/>
                }}
                renderNextButton={() => {
                    return <ArrowCircleRightIcon className='right-[-2vw] bg-white hover:bg-black hover:text-white rounded-full mr-3 w-12 h-12 absolute top-1/4'/>
                }}
            />
        </div>
    )
}

export default Carousel