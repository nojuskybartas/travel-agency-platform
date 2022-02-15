import { ChevronDoubleRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { getUserDetails } from '../lib/storage';
import MainPageStructure from './MainPageStructure';

function InboxChannel() {
    const { inboxId } = useParams();
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        
        const unsubscribe = onSnapshot(query(collection(db, `messageChannels/${inboxId}/messages`), orderBy('sentOn', 'desc')), (querySnapshot) => {
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
            const fetchedMessages = []
            querySnapshot.forEach((doc) => {
                fetchedMessages.push(doc.data())
            });
            setMessages(fetchedMessages.reverse())
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

    return (
        <MainPageStructure>
        <div className='w-full h-full'>
            <div className='sticky top-14 w-full h-10 bg-white flex justify-between items-center px-2' onClick={() => navigate('/inbox')}>
                <ChevronLeftIcon className='w-6 h-6'/>
                <div className='flex-1 flex items-center justify-end space-x-2'> 
                    <div className='w-fit flex flex-col -space-y-1'>
                        <p>{users.name}</p>
                        <p className='text-right italic text-xs'>{users.type === 'creator' && 'Creator'}</p>
                    </div>
                    <img className='w-10 h-10 object-cover rounded-full' src={users.picture}/>
                </div>
            </div>
            {/* <div className='w-full h-full '> */}
                <div className='px-3 space-y-2 w-full h-full flex flex-col py-2'>
                    {messages.map((message, i) => {
                        const isOwner = auth.currentUser.uid === message.author
                        return (
                            <div className={`w-full h-fit flex ${isOwner ? 'justify-end' : 'justify-start'}`} key={i}>
                                <div className={`w-fit min-w-[10%] max-w-[80%] h-fit px-3 py-1 rounded-xl flex items-center ${isOwner ? 'bg-primary ' : 'bg-gray-400'}`}>
                                    <p className='break-all w-full h-full'>{message.text}</p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            {/* </div> */}

            <div className='w-full h-full bg-white sticky bottom-14'>
                <form className='w-full h-10 flex items-center space-x-2 transition-long p-2'>
                    <input placeholder='Type message' className='w-full h-9 p-3 outline outline-1 outline-gray-300 focus:outline-gray-500 rounded-3xl shadow-md transition-long' onChange={handleInput} value={newMessage}/>
                    <button type='submit' onClick={handleSubmit} className={`${newMessage ? 'w-11 ' : 'w-0 '} h-10 flex justify-center items-center bg-primary rounded-full shadow-md transition-all duration-200 ease-in-out`}><ChevronDoubleRightIcon className='w-5 h-5'/></button>
                </form>
            </div>

        </div>
        </MainPageStructure>
    );
}

export default InboxChannel;