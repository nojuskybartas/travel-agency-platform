import Carousel from './Carousel';
import ExperienceCard from './ExperienceCard';

const handleDragStart = (e) => e.preventDefault();

const items = [
    <ExperienceCard image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/80/93/65/caption.jpg?w=300&h=300&s=1' price={209} description='Moab Xtreme 3-Hour Experience' rating={5} rating_count={315} onDragStart={handleDragStart} role="presentation"/>,
    <ExperienceCard image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/d2/4c/ec/cappadocia-hot-air-balloon.jpg?w=300&h=-1&s=1' price={119} description='Capadocia Hot Air Balloon Flight' rating={5} rating_count={487} onDragStart={handleDragStart} role="presentation"/>,
    <ExperienceCard image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/99/c0/5d/surfer-factory.jpg?w=300&h=300&s=1' price={77} description='Surface Lessons with Professional Trainer' rating={4} rating_count={129} onDragStart={handleDragStart} role="presentation"/>,
    <ExperienceCard image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/48/b5/46/caption.jpg?w=300&h=300&s=1' price={199} description='Ocean Wild-life Encounter in Cape Town' rating={5} rating_count={223} onDragStart={handleDragStart} role="presentation"/>,
    <ExperienceCard image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/57/c2/7b/caption.jpg?w=300&h=300&s=1' price={117} description='Colloseum Underground and Ancient Rome Semi-Private Tour MAX 6 PEOPLE GUARANTEED' rating={5} rating_count={92} onDragStart={handleDragStart} role="presentation"/>,

    //   <Experience image={} price={} description={} rating={} rating_count={} onDragStart={handleDragStart} role="presentation" />,
];


function Experiences() {

    return (
        <div className='w-full h-fit'>
            <Carousel label='Explore Latest Experiences' items={items}/>
        </div>
    )
}

export default Experiences