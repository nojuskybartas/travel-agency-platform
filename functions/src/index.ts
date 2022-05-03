import * as functions from "firebase-functions";
import express = require('express');
import { Request, Response } from 'express';
import cors = require("cors");

// The Firebase Admin SDK to access Firestore.
import admin = require('firebase-admin');
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// functions.auth.user().onCreate((user) => {
//     const photoURL = user.photoURL; // The email of the user.
//     const displayName = user.displayName; // The display name of the user.

//     const publicDetailsData = {
//         roles: {
//             user: true
//         },
//         picture: photoURL,
//         name: displayName,
//     }
    
//     db.collection('users').doc(user.uid).collection('accountDetails').doc('public').set(publicDetailsData).catch(err => { console.log('Error writing document: ', err) })
//     db.collection('users').doc(user.uid).collection('accountDetails').doc('private').set({}).catch(err => { console.log('Error writing document: ', err) })

// });

app.post('/register/creator', async (request: Request, response: Response) => {

    const uid = String(request.query.uid);
    if (!uid) {response.status(404); return;}

    const startTime = new Date().valueOf()

    // await db.collection('users')
    // .doc(uid)
    // .collection('accountDetails')
    // .doc('roles')
    // .set({creator_pending: true, creator: false})
    // .catch(err => { 
    //     console.log('Error writing user roles: ', err); response.status(404) 
    // })

    await db.collection('users')
    .doc(uid)
    .set({
        roles: admin.firestore.FieldValue.arrayUnion('creator_pending')
    })
    .catch(err => { 
        console.log('Error writing user roles: ', err); response.status(404) 
    })

    // await db.collection('admin')
    // .doc('creators')
    // .collection('pending')
    // .doc(uid)
    // .set({
    //     time: startTime,
    // })
    // .catch(err => { 
    //     console.log('Error writing to admin panel: ', err); response.status(404) 
    // })

    await db.collection('admin')
    .doc('stats')
    .update({
        pending_creators: admin.firestore.FieldValue.increment(1)
    })

    const finishTime = new Date().valueOf()
    response.status(201).send({
        executionTime: finishTime - startTime
    })
})

app.post('/verifyCreator', async (request: Request, response: Response) => {
    
    const uid = String(request.query.uid);
    // if (!uid) {
    //     response.status(404); 
    //     return;
    // }

    const userRef = db.collection('users').doc(uid)
    
    await userRef.update({
        roles: admin.firestore.FieldValue.arrayUnion("creator")
    })

    await userRef.update({
        roles: admin.firestore.FieldValue.arrayRemove("creator_pending")
    })

    response.status(201)
})


exports.api = functions.https.onRequest(app);