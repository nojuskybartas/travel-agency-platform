import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import southAmericaImg from '../static/images/regions/south america/ben-ostrower-HkrirTHELjE-unsplash.jpg'
import asiaImg from '../static/images/regions/asia/charles-postiaux-TnUG2pWraPE-unsplash.jpg'
import oceaniaImg from '../static/images/regions/oceania/ian-x_H-9suOpck-unsplash.jpg'
import europeImg from '../static/images/regions/europe/ernest-ojeh-nY-41_tBkb0-unsplash.jpg'
import { getImagesFromStorageUrl, getItemUrlFromStorage } from '../lib/storage'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '../lib/firebase'
import ProgressiveImage from 'react-progressive-image'

function RegionSelect() {

    // useEffect(() => {

    //     const url = getDownloadURL(ref(storage, 'images/regions/*'))
    // }, [])

    return (
        <div className='w-full h-full py-5'>
            <h1 className='font-bold text-2xl py-2'>Your journey starts here.<br/>Select a region</h1>
            <div className='w-full h-full grid grid-cols-2 md:grid-cols-3 gap-4 px-2 md:p-0'>
                <Region name='Africa' imgStorageName='africa'/>
                <Region name='North America & the Caribbean' imgStorageName='north_america'/>
                <Region name='Central & South America' imgStorageName='south_america'/>
                <Region name='Asia' imgStorageName='asia'/>
                <Region name='Oceania' imgStorageName='oceania'/>
                <Region name='Europe' imgStorageName='europe'/>

            </div>
        </div>
    )
}

export default RegionSelect

function Region({name, imgStorageName, link='#'}) {

    const [imageData, setImageData] = useState({ src: null, placeholder: null})

    useEffect(() => {

        const getImages = async() => {
            const placeholderImages = await getImagesFromStorageUrl('images/regions/' + imgStorageName + '/thumbnails512')
            const randomIndex = 0
            const placeholderImageUrl = placeholderImages[randomIndex]
            setImageData(imgData => ({ ...imgData, placeholder: placeholderImageUrl }))

            const images = await getImagesFromStorageUrl('/images/regions/' + imgStorageName)
            const imageUrl = images[randomIndex]
            setImageData(imgData => ({ ...imgData, src: imageUrl }))
        }

        getImages()

    }, [])

    return (
        <Link to={link}>
        <div className='w-full h-60 rounded-xl relative overflow-hidden hover:opacity-90 cursor-pointer darkenBottom'>
            <ProgressiveImage
                src={imageData.src}
                placeholder={imageData.placeholder}>
                {(src, loading) => (
                    <motion.img animate={loading ? {opacity: 0.3, filter: 'blur(4px)'} : {opacity: 1, filter: 'blur(0px)', }} src={src} className='w-full h-full object-cover' alt={name}/>
                )}
            </ProgressiveImage>
            {/* <img className='w-full h-full brightness-75 object-cover' src={img} alt={name}/> */}
            <h2 className='w-3/4 text-white font-semibold text-lg absolute bottom-4 left-4'>{name}</h2>
        </div>
        </Link>
    )
}