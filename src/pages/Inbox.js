import { MailOpenIcon } from '@heroicons/react/outline';
import { BellIcon } from '@heroicons/react/solid';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import InboxChannel from '../components/InboxChannel';
import LoadingIndicator from '../components/LoadingIndicator';
import MainPageStructure from '../components/MainPageStructure';
import useAuth from '../hooks/useAuth';
import { timeSince } from '../lib/date';
import { auth, db } from '../lib/firebase';
import { getUserDetails } from '../lib/storage';

function Inbox() {
    const { inboxId } = useParams();
    const navigate = useNavigate();
    const userDetails = useRecoilValue(userState)
    const { promiseInProgress } = usePromiseTracker();
    const [loading, setLoading] = useState(true)
    const [selectedChannel, setSelectedChannel] = useState(null)
    const [order, setOrder] = useState([])
    
    useEffect(() => {
        if (inboxId) {
            setSelectedChannel(inboxId)
        } else {
            setSelectedChannel(null)
        }
    }, [inboxId])

    useEffect(() => {
        if(!userDetails) return
        if(userDetails.messageChannels.length < 1) return
        if(order.length > 1) return
        // setOrder([])
        userDetails.messageChannels.forEach((channel) => {
            setOrder(prevOrder => ([
                ...prevOrder,
                channel.id
            ]))
        })

    }, [userDetails])

    useEffect(() => {
        if (order.length < 1 || !auth.currentUser) return
        // const inbox = doc(collection(db, `users/${auth.currentUser.uid}/messageChannels`))
        
        // setDoc(inbox, {
        //     users: [auth.currentUser.uid, experience.owner.id]
        // })

    }, [order])

    function isSelected() {
        return (selectedChannel === inboxId)
    }

    return (
        <MainPageStructure name='inboxPage'>
            <div className='p-2'>
                <h1 className='font-bold text-2xl'>Inbox</h1>
                <hr className='w-full h-1 bg-gray-900'/>
                {/* <LoadingIndicator loading={loading}/> */}
                <div className='flex flex-wrap'>
                    <div className='w-full md:w-1/3 relative'>
                        {userDetails?.messageChannels.length > 0 ? 
                        userDetails?.messageChannels?.map((channel, i) => {
                            // navigate(`/inbox/${channel.id}`)
                            return <InboxChannelPreview order={order} setOrder={setOrder} loading={loading} setLoading={setLoading} channelId={channel.id} onClick={() => navigate(`/inbox/${channel.id}`)} selectedChannel={selectedChannel} key={channel.id}/>
                        })
                        :
                        <div className={`${promiseInProgress && 'hidden'}`}>
                            {/* {setLoaded(true)} */}
                            <p>You don't have any messages</p>
                        </div>}
                    </div>

                    <div className='w-full h-full md:w-2/3 md:h-[55vh]'>     
                    {/* <InboxChannel inboxId={selectedChannel} selected={(selectedChannel === inboxId)} onExit={() => {navigate('/inbox'); setSelectedChannel(null)}}/>                */}
                        {selectedChannel ?
                            <InboxChannel key={selectedChannel} inboxId={selectedChannel} selected={isSelected()} onExit={() => {setSelectedChannel(null); navigate('/inbox'); }}/>
                        :
                        <div className='h-full hidden md:flex flex-col items-center justify-center'>
                            <MailOpenIcon className='w-20 h-20'/>
                            <p>Select a chat</p>
                        </div>} 
                    </div>
                </div>
                
            </div>          
        </MainPageStructure>
    );
}

export default Inbox;

function InboxChannelPreview(props) {

    const { inboxId } = useParams();
    const [users, setUsers] = useState([])
    const [lastMessage, setLastMessage] = useState({});
    const [loading, setLoading] = useState(true)
    const [showNotification, setShowNotification] = useState(false)
    const {user} = useAuth()
    const [selected, setSelected] = useState(false)
    const [position, setPosition] = useState(props.order.indexOf(props.channelId))
    const [timeFromMessage, setTimeFromMessage] = useState()

    useEffect(() => {
        if (!user) return

        // let unsubscribe
        

        const setup = async() => {
            const userIdsResponse = await getDoc(doc(db, `messageChannels/${props.channelId}`))
            const userIds = userIdsResponse.data().users
            userIds.forEach(async(userId) => {
                if (user.uid !== userId) {
                    const userData = await getUserDetails(userId)
                    setUsers(userData.data())
                }
            })
            
            
        }
        
        setup()

        const unsubscribe = onSnapshot(query(collection(db, `messageChannels/${props.channelId}/messages`), limit(1), orderBy('sentOn', 'desc')), (querySnapshot) => {
            
            querySnapshot.forEach((doc) => {
                setLastMessage(doc.data())
                setTimeFromMessage(timeSince(doc.data().sentOn))
            });
            
        })
       
        return unsubscribe
        
    }, [user])

    useEffect(() => {
        const timeCheckInterval = setInterval(function() {
            setTimeFromMessage(timeSince(lastMessage.sentOn))
        }, 1000);

        return () => clearInterval(timeCheckInterval)
    }, [lastMessage])
    

    useEffect(() => {
        if (!user?.uid || !lastMessage?.author || loading) return
        if ((user.uid !== lastMessage.author) && !lastMessage.seenOn) {
            setShowNotification(true)
        } else {
            setShowNotification(false)
        }

    }, [lastMessage, loading, selected, inboxId])

    useEffect(() => {
        if (!user?.uid || !lastMessage?.author || loading) return
        moveToTop()
    }, [lastMessage])

    useEffect(() => {
        setSelected(props.selectedChannel === props.channelId)
    }, [props.selectedChannel])

    useEffect(() => {
        setPosition(props.order.indexOf(props.channelId))
    }, [props.order])

    function moveToTop(){
        let currentIndex = props.order.indexOf(props.channelId);
        const arr = [...props.order];
        arr.splice(0, 0, ...arr.splice(currentIndex, 1));
        props.setOrder(arr)
        return arr;
    }

    return (
        <div className={`absolute w-full h-16 ${selected ? 'bg-gray-400' : 'bg-gray-300'} flex items-center p-2 mt-3 space-x-2 rounded-md ${loading && 'hidden'} transition-long cursor-pointer`} onClick={props.onClick} style={{transform: `translateY(${position*4.5}rem)`}}>
            <img className={`w-11 h-10 object-cover rounded-full`} src={users?.picture} onLoad={() => setLoading(false)}/>
            <div className='w-full flex flex-col -space-y-1 max-w-[80%]'>
                <div className='flex items-center space-x-2'>
                    <p>{users?.name}</p>
                    {showNotification && <BellIcon className='w-5 h-5 text-red-500'/>}
                </div>
                {lastMessage.text && <div className='flex text-sm text-gray-600 space-x-3'>
                    <p className=' truncate'>{lastMessage.text}</p>
                    <p>•</p>
                    <p className='whitespace-nowrap'>{timeFromMessage}</p>
                </div>}
            </div>
            
        </div>    
    )
}