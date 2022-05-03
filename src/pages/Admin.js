import { arrayRemove, arrayUnion, collection, deleteDoc, doc, FieldValue, getDocs, increment, limit, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import ProgressiveImage from 'react-progressive-image'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import MainPageStructure from '../components/MainPageStructure'
import useUser from '../hooks/useUser'
import { db } from '../lib/firebase'
import { getUserDetails } from '../lib/storage'
import { AnimateSharedLayout, motion } from 'framer-motion'
import { getAgeInYears } from '../lib/date'
import { countryObject } from '../lib/nationalities'
import { BadgeCheckIcon, BanIcon } from '@heroicons/react/outline'
import axios from 'axios'

function Admin() {

    const [stats, setStats] = useState({})

    useEffect(() => {
        const unsubscribe = onSnapshot(query(doc(db, 'admin/stats')), 
        (snapshot) => {
            setStats(snapshot.data())
        })

        return unsubscribe
    })


    return (
        <MainPageStructure hideFooter>
            <h1 className='text-3xl font-bold w-full text-center'>Admin Panel</h1>
            <PendingCreators numOfCreators={stats.pending_creators}/>
            <VerifiedCreators numOfCreators={stats.creators}/>
        </MainPageStructure>
    )
}

export default Admin

function Section({title, children}) {
    return (
        <div className='w-full min-h-[15rem] h-fit border-4 border-solid border-primary rounded-lg mt-10 p-2'>
            <h2 className='text-xl font-semibold py-4'>{title}</h2>
            {children}
        </div>
    )
}

function VerifiedCreators({numOfCreators}) {
    const [verifiedCreatorIDs, setVerifiedCreatorIDs] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, `users`), where('roles', 'array-contains', 'creator'), limit(20)), 
        (querySnapshot) => {
            const ids = [];
            querySnapshot.forEach((doc) => {
                const id = doc.id;
                ids.push(id);
            })
            setVerifiedCreatorIDs(ids)
        }, 
        (error) => {
            console.log(error)
        })

        return unsubscribe
    }, [])

    return (
        <Section title={`Verified Creators (${numOfCreators})`}>
            <div className='w-full h-full max-h-[500px] flex flex-wrap relative gap-4 overflow-y-scroll scrollbar-hide'>
                {verifiedCreatorIDs.length === 0 
                ?
                <p className='italic'>Nothing to display...</p>
                :
                verifiedCreatorIDs?.map(id => (
                    <VerifiedCreatorCard key={id} id={id}/>
                ))}
            </div>
        </Section>
    )
}

function VerifiedCreatorCard({id}) {
    
    const [creatorDetails, setCreatorDetails] = useState()

    useEffect(() => {
        getUserDetails(id)
        .then(data => setCreatorDetails(data))
    }, [])

    
    return creatorDetails ? (
        <motion.div 
        whileTap={{scale: 0.98}}
        className='w-fit h-fit bg-primary bg-opacity-30 rounded-xl flex flex-col items-center py-8 px-4'>
            <motion.img whileHover={{scale: 1.1}} initial={{y: '-50%'}} animate={{y: '0%'}} src={creatorDetails.picture?.small} className="w-32 h-32 object-cover bg-primary p-1 rounded-2xl transition-long" alt={creatorDetails.name + ' profile picture'}/>
            <motion.h2 className='font-bold text-lg pt-2'>{creatorDetails.name}</motion.h2>
        </motion.div>
    ) : null
}

function PendingCreators({numOfCreators}) {
    const [pendingCreatorIDs, setPendingCreatorIDs] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, `users`), where('roles', 'array-contains', 'creator_pending'), limit(20)), 
        (querySnapshot) => {
            const ids = [];
            querySnapshot.forEach((doc) => {
                const id = doc.id;
                ids.push(id);
            })
            setPendingCreatorIDs(ids)
        }, 
        (error) => {
            console.log(error)
        })

        return unsubscribe
    }, [])

    return (
        <Section title={`Review Pending Creator Applications (${numOfCreators})`}>
            <div className='w-full h-full flex relative gap-4 overflow-x-scroll scrollbar-hide'>
                {pendingCreatorIDs.length === 0 
                ?
                <p className='italic'>Nothing to display...</p>
                :
                pendingCreatorIDs?.map(id => (
                    <PendingCreatorCard key={id} id={id}/>
                ))}
            </div>
        </Section>
    )
}

function PendingCreatorCard({id}) {

    const [creatorDetails, setCreatorDetails] = useState()
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        getUserDetails(id)
        .then(data => setCreatorDetails(data))
    }, [])

    const verify = async() => {

        const userRef = doc(db, `users/${id}`)
        updateDoc(doc(db, 'admin/stats'), {
            creators: increment(1),
            pending_creators: increment(-1),
        })
        await updateDoc(userRef, {
            roles: arrayUnion('creator'),
        })
        await updateDoc(userRef, {
            roles: arrayRemove('creator_pending'),
        })
        

    }

    const deny = () => {
        
    }

    return creatorDetails ? (
        <AnimateSharedLayout type="crossfade">
        <motion.div 
        onClick={() => setExpanded(true)}
        layoutId='card'
        className='w-60 h-fit bg-primary bg-opacity-30 rounded-xl flex flex-col items-center py-8 px-4 cursor-pointer'
        >
            <ProgressiveImage
            src={creatorDetails.picture?.regular || creatorDetails.picture}
            placeholder={creatorDetails.picture?.small}>
                {(src, loading) => (
                    <motion.img layoutId='card-image' animate={loading ? {opacity: 1, filter: 'blur(3px)'} : {opacity: 1, filter: 'blur(0px)', }} src={src} className="w-32 h-32 md:w-48 md:h-48 object-cover bg-primary p-1 rounded-2xl transition-long" alt={creatorDetails.name + ' profile picture'}/>
                )}
            </ProgressiveImage>
            <motion.h2 layoutId='card-title-name' className='font-bold text-lg pt-2'>{creatorDetails.name}</motion.h2>
            <motion.h2 layoutId='card-title-age' className=''>{getAgeInYears(creatorDetails.dateOfBirth)} yo</motion.h2>
            <motion.h2 layoutId='card-title-profession' className='text-lg'>{creatorDetails.profession}</motion.h2>

        </motion.div>

        {expanded && 
        <motion.div
        layoutId='card'
        className='w-full min-h-full h-fit absolute bg-primary bg-opacity-70 backdrop-blur-md rounded-xl flex flex-col items-center py-8 px-4 z-10 cursor-pointer shadow-lg'
        onClick={() => setExpanded(false)}
        >
            <ProgressiveImage
            src={creatorDetails.picture?.regular || creatorDetails.picture}
            placeholder={creatorDetails.picture?.small}>
                {(src, loading) => (
                    <motion.img layoutId='card-image' animate={loading ? {opacity: 1, filter: 'blur(3px)'} : {opacity: 1, filter: 'blur(0px)', }} src={src} className="w-32 h-32 md:w-48 md:h-48 object-cover bg-primary p-1 rounded-2xl transition-long absolute right-4 top-4" alt={creatorDetails.name + ' profile picture'}/>
                )}
            </ProgressiveImage>
            <div className='w-full h-full'>
            <motion.h2 layoutId='card-title-name' className='font-bold text-lg pt-2'>{creatorDetails.name}</motion.h2>
            <motion.h2 layoutId='card-title-age' className='text-lg'>{getAgeInYears(creatorDetails.dateOfBirth)} years old</motion.h2>
            <motion.h2 layoutId='card-title-profession' className='text-lg'>{creatorDetails.profession}</motion.h2>
            <motion.h2 initial={{opacity: 0, y: '-20%'}} animate={{opacity: 1, y: '0%'}} className='text-lg'>From {countryObject[creatorDetails.nationality]}</motion.h2>
            <motion.h2 initial={{opacity: 0, y: '-20%'}} animate={{opacity: 1, y: '0%'}} className='font-semibold pt-2'>Motivation:</motion.h2>
            </div>
            <div className='w-full h-full'>
            <motion.p initial={{opacity: 0, y: '-20%'}} animate={{opacity: 1, y: '0%'}} className='w-2/3 h-full'>{creatorDetails.motivation}</motion.p>
            </div>
            <div className='absolute right-4 bottom-4 flex'>
                <BadgeCheckIcon onClick={verify} className='w-10 h-10 hover:text-green-700'/>
                <BanIcon onClick={deny} className='w-10 h-10 hover:text-red-700'/>
            </div>

        </motion.div>}
        </AnimateSharedLayout>
    ) : null
}