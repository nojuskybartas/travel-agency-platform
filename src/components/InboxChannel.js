import { ChevronDoubleRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { getUserDetails } from '../lib/storage';
import LoadingIndicator from './LoadingIndicator';
import MainPageStructure from './MainPageStructure';
import { InView } from 'react-intersection-observer';
import useAuth from '../hooks/useAuth'

function InboxChannel({inboxId, onExit, selected}) {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)
    const {user} = useAuth()
    const [exiting, setExiting] = useState(false)
    const location = useLocation()

    useEffect(() => {
        console.log(selected)
        if (selected === false) setExiting(true)
    }, [selected])

    useEffect(() => {
        
        const unsubscribe = onSnapshot(query(collection(db, `messageChannels/${inboxId}/messages`), limit(15), orderBy('sentOn', 'desc')), (querySnapshot) => {
            trackPromise(
                getDoc(doc(db, `messageChannels/${inboxId}`)).then(res => {
                    // setUsers(res.data().users)
                    res.data().users.forEach(userId => {
                        if (auth.currentUser.uid !== userId) {
                            getUserDetails(userId).then(res => {
                                setUsers(res.data())
                            })
                        }
                        
                    })
                })
            )
            const fetchedMessages = []
            querySnapshot.forEach((doc) => {
                const msg = doc.data()
                msg.id = doc.id
                fetchedMessages.push(msg)
            });
            setMessages(fetchedMessages.reverse())
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        // console.log(messages)
      }, [messages])

    const handleInput = (e) => {
        setNewMessage(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (newMessage) {
            setDoc(doc(collection(db, `messageChannels/${inboxId}/messages`)), {
                text: newMessage,
                sentOn: new Date().valueOf(),
                author: auth.currentUser.uid
            })
            setNewMessage('')
        }
    }

    const handleMobileExit = () => {
        setExiting(true)
        setTimeout(() => {
            onExit()
        }, 200)
    }

    const isOnInboxView = () => {
        if (location === '/inbox') return true
        return false
    }

    return (
        // h-[calc(100vh-7rem)] overflow-y-scroll scrollbar-hide
        // <MainPageStructure hideFooter>
        //         <div className='fixed md:relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full h-screen md:h-full overflow-y-scroll scrollbar-hide flex flex-col justify-between bg-white'>
        <div className={`w-full h-screen md:h-full fixed md:relative flex flex-col justify-between bg-white slide-from-right-animation ${!isOnInboxView() && exiting && 'slide-to-right-animation'}`}>
            <div className='md:hidden sticky top-0 bottom-full w-full h-12 bg-white flex justify-between items-center px-2 py-1' onClick={handleMobileExit}>
                <ChevronLeftIcon className='w-6 h-6'/>
                <div className='flex-1 flex items-center justify-end space-x-2'> 
                    <div className='w-fit flex flex-col -space-y-1'>
                        <p>{users.name}</p>
                        <p className='text-right italic text-xs'>{users.type === 'creator' && 'Creator'}</p>
                    </div>
                    <img className='w-10 h-10 object-cover rounded-full' src={users.picture}/>
                </div>
            </div>
            <div className='w-full h-full px-3 py-2 space-y-2 flex flex-col overflow-y-scroll lg:scrollbar-hide'>
                <LoadingIndicator/>
                <div className='flex-1'/>
                {messages.map((message, i) => {
                    const isOwner = user.uid === message.author
                    return (
                        <InView threshold={0.3} key={i}>
                            {({ inView, ref, entry }) => {
                            if (!isOwner && inView && !message.seenOn) {
                                updateDoc(doc(db, `messageChannels/${inboxId}/messages/${message.id}`), {
                                    seenOn: new Date().valueOf()
                                })
                            }
                            const time = new Date(message.sentOn)
                            const timeString = time.getHours() + ':' + time.getMinutes()
                            return (
                            <div ref={ref} className={`w-full h-fit flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
                                <div className={`w-fit min-w-[10%] max-w-[80%] h-fit px-3 py-1 rounded-xl flex flex-col items-center ${isOwner ? 'bg-primary ' : 'bg-gray-400'}`}>
                                    <p className='break-all w-full h-full'>{message.text}</p>
                                    <p className={`text-[0.6rem] w-full ${isOwner ? 'text-right text-gray-700' : 'text-left text-gray-600'}`}>{timeString}</p>
                                </div>
                            </div>
                            )}}
                        </InView>
                        
                    )
                })}
                <div ref={messagesEndRef} className='bg-gray-700'/>
            </div>

            <div className='w-full h-12 sticky bottom-0'>
                <form className='w-full h-10 flex items-center space-x-2 transition-long p-2 fixed'>
                    <input placeholder='Type message' className='w-full h-9 p-3 outline outline-1 outline-gray-300 focus:outline-gray-500 rounded-3xl shadow-md transition-long' onChange={handleInput} value={newMessage}/>
                    <button type='submit' onClick={handleSubmit} className={`${newMessage ? 'w-11 ' : 'w-0 '} h-10 flex justify-center items-center bg-primary rounded-full shadow-md transition-all duration-200 ease-in-out`}><ChevronDoubleRightIcon className='w-5 h-5'/></button>
                </form>
            </div>

        </div>
        // </MainPageStructure>
    );
}

export default InboxChannel;