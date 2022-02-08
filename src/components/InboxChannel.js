import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

function InboxChannel({id}) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        
        const unsubscribe = onSnapshot(query(collection(db, `messageChannels/${id}/messages`)), (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
            });
        })
       
        return unsubscribe
    })
    return (
        <ul></ul>
    );
}

export default InboxChannel;
