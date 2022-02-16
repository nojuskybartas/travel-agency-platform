function CityCard({city, country, image}) {

    return (
        <div className="h-[350px] md:h-[250px] w-[350px] md:w-[250px] relative p-1 group cursor-pointer">
            <img src={image} className="w-full h-full object-fit group-hover:opacity-90 brightness-75 rounded-lg"/>
            <h1 className="absolute bottom-0 left-0 p-5 w-3/5 font-bold text-3xl text-white">{city}, {country}</h1>
        </div>
    )
}

export default CityCard