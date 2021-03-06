import { CheckIcon, ChevronDoubleRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { getUserDetails } from '../lib/storage';
import LoadingIndicator from './LoadingIndicator';
import MainPageStructure from './MainPageStructure';
import { InView } from 'react-intersection-observer';
import useAuth from '../hooks/useAuth'
import { use100vh } from 'react-div-100vh';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { timeInHHMM } from '../lib/date';

function InboxChannel({inboxId, onExit, selected}) {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [exiting, setExiting] = useState(false)
    const location = useLocation()
    const [mobileKeyboardOpen, setMobileKeyboardOpen] = useState(false)
    const screenHeight = use100vh()
    const windowHeight = screenHeight ? screenHeight / 1 : '100%'
    const {width} = useWindowDimensions()
    const [error, setError] = useState(null)
    

    useEffect(() => {
        console.log(selected)
        if (selected === false) setExiting(true)
    }, [selected])

    
    useEffect(() => {
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
    }, [])    


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
        // style={ width < 768 ? { height: windowHeight } : { height: '100%'}}
        <div className={`w-full h-full absolute md:relative bg-background slide-from-right-animation overflow-hidden ${!isOnInboxView() && exiting && 'slide-to-right-animation'}`}>
            
            <ChatNavBar user={users} onClick={handleMobileExit} mobileKeyboardOpen={mobileKeyboardOpen} error={error}/>
            
            <LoadingIndicator/>

            <MessagesView inboxId={inboxId} users={users} mobileKeyboardOpen={mobileKeyboardOpen} error={error} setError={setError}/>
            
            <MessageInputField inboxId={inboxId} setMobileKeyboardOpen={setMobileKeyboardOpen} mobileKeyboardOpen={mobileKeyboardOpen} error={error}/>
            
        </div>
    );
}

function ChatNavBar({user, onClick, mobileKeyboardOpen, error}) {

    const chatNavBarRef = useRef()

    useEffect(() => {
        if (!chatNavBarRef.current) return
        if (mobileKeyboardOpen) {
            chatNavBarRef.current.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });
        } 
        // else {
        //     chatNavBarRef.current.removeEventListener('touchmove', (e) => {
        //         e.preventDefault();
        //     })
        // }
        
    }, [chatNavBarRef])

    return (
        <div className='md:hidden sticky top-0 w-full h-12 shadow-md flex justify-between items-center px-2 py-1' onClick={onClick}>
            <ChevronLeftIcon className='w-6 h-6'/>
            {error && <p>Back to Inbox</p>}
            <div className='flex-1 flex items-center justify-end space-x-2'> 
                <div className='w-fit flex flex-col -space-y-1'>
                    <p>{user?.name}</p>
                    <p className='text-right italic text-xs'>{user?.type === 'creator' && 'Creator'}</p>
                </div>
                <img className='w-10 h-10 object-cover rounded-full' src={user?.picture}/>
                
            </div>
        </div>
    )
}

function MessagesView({inboxId, users, mobileKeyboardOpen, error, setError}) {

    const [messages, setMessages] = useState([]);
    const [lastKey, setLastKey] = useState(null)
    const messagesEndRef = useRef(null)
    const {user} = useAuth()
    const [fetching, setFetching] = useState(false)
    const [initialFetchDone, setInitialFetchDone] = useState(false)
    
    
    const messageListContainerRef = useRef()

    const getNextMessages = (lastMessage) => {
        console.log(lastMessage)
        if (messages.length > 20) return
        setFetching(true)
        const queryRef = query(collection(db, `messageChannels/${inboxId}/messages`), limit(20), orderBy('sentOn', 'desc'), startAfter(lastMessage.sentOn))
        getDocs(queryRef)
        .then(documentSnapshot => {
            const fetchedMessages = []
            documentSnapshot.forEach((doc) => {
                const msg = doc.data()
                msg.id = doc.id
                fetchedMessages.push(msg)
            });
            const newMessages = fetchedMessages.reverse()
            console.log(newMessages)
            setMessages(prevMessages => [...newMessages, ...prevMessages])
            setFetching(false)
            if (!initialFetchDone) {
                setInitialFetchDone(true)
            }
        })
        .catch(e => console.log(e))
    }

    useEffect(() => {

        // getNextMessages({sentOn: 1645920574606})
        
        const unsubscribe = onSnapshot(query(collection(db, `messageChannels/${inboxId}/messages`), orderBy('sentOn', 'desc')), 
        (querySnapshot) => {
            const fetchedMessages = []
            querySnapshot.forEach((doc) => {
                const msg = doc.data()
                msg.id = doc.id
                fetchedMessages.push(msg)
            });
            setMessages(fetchedMessages.reverse())
            // setMessages(prevMessages => ([...prevMessages, ...fetchedMessages.reverse()]))
            // messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
        }, 
        (error) => {
            setError(error)
        })

        // getNextMessages({sentOn: new Date().valueOf()})


        return unsubscribe
    }, [])

    useEffect(() => {
        if (!messageListContainerRef) return
        messageListContainerRef.current.addEventListener('touchmove', (e) => {
            if (!e.currentTarget) {
                return;
            }
            if (e.currentTarget.scrollTop === 0) {
                e.currentTarget.scrollTop = 1;
            } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop +
                                                        e.currentTarget.offsetHeight) {
                e.currentTarget.scrollTop -= 1;
            }
            });

    }, [mobileKeyboardOpen])

    useEffect(() => {
        // console.log(messages)
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }, [messages])
    

    return (
        <div ref={messageListContainerRef} className='w-full h-[calc(100%-6rem)] md:h-[calc(100%-3rem)] overflow-y-scroll space-y-2 flex flex-col'>

            <div className='flex-1'/>

            {/* <InView>
                {({ inView, ref, entry }) => {
                    
                    if (inView && messages.length > 0 && !fetching) {         
                        const lastMessage = messages[0]
                        if (lastMessage?.sentOn) {
                            getNextMessages(lastMessage)
                            console.log('last message:', lastMessage)
                        }
                    }
                    return (
                        <div ref={ref}></div>
                    )
                }}
            </InView> */}

            {messages.length === 0 && !error &&
            <NewChatDisplay message={'Start a chat with ' + users.name}/>}

            {error &&
            <NewChatDisplay message='There has been an error'/>}

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
                        
                        const timeString = timeInHHMM(message.sentOn)
                        return (
                            <div ref={ref} className={`w-full px-3 h-fit flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
                                <div className={`w-fit min-w-[10%] max-w-[80%] h-fit px-3 py-1 rounded-xl flex flex-col items-center ${isOwner ? 'bg-primary ' : 'bg-gray-400'}`}>
                                    <p className='break-all w-full h-full'>{message.text}</p>
                                    <div className='w-full flex space-x-1'>
                                        <p className={`text-[0.6rem] w-full ${isOwner ? 'text-right text-gray-700' : 'text-left text-gray-600'}`}>{timeString}</p>
                                        {isOwner && <span className={`w-fit flex -space-x-2 ${message.seenOn ? 'text-blue-500' : 'text-gray-600'}`}><CheckIcon className='w-3 h-3'/><CheckIcon className='w-3 h-3'/></span>}
                                    </div>
                                </div>
                            </div>
                        )}}
                    </InView>
                )
            })}
            <div ref={messagesEndRef}/>
        </div>
    )

}

function MessageInputField({inboxId, mobileKeyboardOpen, setMobileKeyboardOpen, error}) {

    const [newMessage, setNewMessage] = useState('')
    const inputContainerRef = useRef()

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

    const handleOnFocus = () => {
        setMobileKeyboardOpen(true)
    }

    const handleOnBlur = () => {
        setMobileKeyboardOpen(false)
    }

    useEffect(() => {
        if (!inputContainerRef.current) return
        if (mobileKeyboardOpen) {
            inputContainerRef.current.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });
        } else {
            inputContainerRef.current.removeEventListener('touchmove', (e) => {
                e.preventDefault();
            })
        }
        
    }, [mobileKeyboardOpen])

    return !error && (
        <div className='sticky bottom-0 w-full h-12 py-2 md:rounded-2xl' ref={inputContainerRef}>
            <form className='w-full h-10 flex items-center space-x-2 transition-long p-2'>
                <input placeholder='Type message' className='w-full h-9 p-3 border-solid border-2 border-gray-300 focus:border-primary rounded-3xl shadow-md transition-long' onChange={handleInput} value={newMessage} onFocus={handleOnFocus} onBlur={handleOnBlur}/>
                <button type='submit' onClick={handleSubmit} className={`${newMessage ? 'w-11' : 'w-0 '} h-10 flex justify-center items-center bg-primary rounded-full shadow-md transition-all duration-200 ease-in-out`}><ChevronDoubleRightIcon className='w-5 h-5'/></button>
            </form>
        </div>
    )
}

function NewChatDisplay({message}) {
    return (
        <div className='w-full h-full flex items-center justify-center'>
            <p className='text-gray-500'>{message}</p>
        </div>
    )
}

export default InboxChannel;