import { useNavigate } from "react-router-dom"

function ExperienceCard({id, image, price, description, rating, rating_count}) {

    const navigate = useNavigate()

    return (
        <div className="h-[550px] md:h-[450px] w-[350px] md:w-[250px] flex flex-col space-y-1 p-1 group cursor-pointer" onClick={() => navigate(`/experience/${id}`)}>
            <img src={image} className="w-full h-[350px] md:h-[250px] object-cover group-hover:opacity-75"/>
            <p className="font-semibold text-lg group-hover:underline">{description}</p>
            <div className='flex flex-row items-center'>
                {Array(rating).fill().map((_, i) => (<p key={i}>⭐</p>))}
                <p className="text-sm ml-2">{rating_count}</p>
            </div>
            <p className="font-semibold text-md">from ${price}</p>
        </div>
    )
}

export default ExperienceCard