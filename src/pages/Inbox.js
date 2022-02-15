import { collection, doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import InboxChannel from '../components/InboxChannel';
import MainPageStructure from '../components/MainPageStructure';
import { timeSince } from '../lib/date';
import { auth, db } from '../lib/firebase';
import { getUserDetails } from '../lib/storage';

function Inbox() {

    const [expandedChannel, setExpandedChannel] = useState()
    const userDetails = useRecoilValue(userState)
    const navigate = useNavigate()

    return (
        <MainPageStructure>
            <div className='p-2'>
                <h1 className='font-bold text-2xl'>Inbox</h1>
                <hr className='w-full h-1 bg-gray-900 mb-3'/>
                {userDetails?.messageChannels.length > 0 ? 
                userDetails?.messageChannels?.map(channel => {
                    return <InboxChannelPreview channelId={channel.id} onClick={() => navigate(`/inbox/${channel.id}`)} key={channel.id}/>
                })
                :
                <div>
                    <p>You don't have any messages</p>
                </div>}
            </div>
            
                {/* {!expandedChannel ? 
                    
                :
                    <InboxChannel id={expandedChannel} onExit={() => {setExpandedChannel(null)}}/>
                } */}
            
            
            
        </MainPageStructure>
    );
}

export default Inbox;

function InboxChannelPreview(props) {

    const [users, setUsers] = useState([])
    const [lastMessage, setLastMessage] = useState({});

    useEffect(() => {
        
        const unsubscribe = onSnapshot(query(collection(db, `messageChannels/${props.channelId}/messages`), limit(1), orderBy('sentOn', 'desc')), (querySnapshot) => {
    
            getDoc(doc(db, `messageChannels/${props.channelId}`)).then(res => {
                // setUsers(res.data()?.users)
                res.data().users?.forEach(userId => {
                    if (auth.currentUser.uid !== userId) {
                        getUserDetails(userId).then(res => {
                            setUsers(res.data())
                        })
                    }
                    
                })
            })
            querySnapshot.forEach((doc) => {
                setLastMessage(doc.data())
            });
        })
       
        return unsubscribe
    }, [])

    return (
        <div className='w-full h-16 bg-gray-200 flex items-center p-2 space-x-2 rounded-md' onClick={props.onClick}>
            <img className='w-11 h-10 object-cover rounded-full' src={users?.picture}/>
            <div className='w-full flex flex-col -space-y-1'>
                <p>{users?.name}</p>
                <div className='flex text-sm text-gray-600 space-x-3'>
                    <p className='max-w-[60vw] truncate'>{lastMessage.text}</p>
                    <p>•</p>
                    <p>{timeSince(lastMessage.sentOn)}</p>
                </div>
            </div>
        </div>       
    )
}