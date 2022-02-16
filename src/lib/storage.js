import { collection, doc, endAt, getDoc, getDocs, limit, orderBy, query, setDoc, startAt, updateDoc, increment, where } from "firebase/firestore"
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage"
import { auth, db } from "./firebase"

const storage = getStorage()

export const getItemUrlFromStorage = async(storageRef) => {
    const url = await getDownloadURL(storageRef)
    return url
}

export const getImagesFromStorageUrl = async(url) => {

    let images = []

    const imageRef = ref(storage, url)

    const data = await listAll(imageRef)

    await Promise.all(data.items.map(async (image) => {
        const imageUrl = await getDownloadURL(image)
        images.push(imageUrl)
      }));

    // data.items.forEach(imageUrl => getDownloadURL(imageUrl)
    //     .then((url) => {
    //         images.push(url)
    //     })
    //     .catch((error) => {
    //         // A full list of error codes is available at
    //         // https://firebase.google.com/docs/storage/web/handle-errors
    //         console.log(error)
    //         switch (error.code) {
    //             case 'storage/object-not-found':
    //                 // File doesn't exist
    //                 break;
    //             case 'storage/unauthorized':
    //                 // User doesn't have permission to access the object
    //                 break;
    //             case 'storage/canceled':
    //                 // User canceled the upload
    //                 break;
    //             case 'storage/unknown':
    //                 // Unknown error occurred, inspect the server response
    //                 break;
    //             }
    // }))

    return images
}

export const setDefaultUserDetailsOnRegister = async(uid) => {
    const detailsRef = doc(db, `users/${uid}/account/details`)
    const detailsData = {
        type: 'regular', // can be creator
        picture: auth.currentUser.photoURL,
        name: auth.currentUser.displayName,
    }

    const financialsRef = doc(db, `users/${uid}/account/financials`)
    const financialsData = {
        currency: 'EUR',
    }


    setDoc(detailsRef, detailsData).then(() => {
        setDoc(financialsRef, financialsData).then(() => {
            console.log('data set')
        });
    });

}

export const setUserDetailsOnRegister = async(name, photoURL, currency) => {
    const detailsRef = doc(db, `users/${auth.currentUser.uid}/account/details`)
    const detailsData = {
        type: 'regular', // can be creator
        picture: photoURL,
        name: name,
    }

    const financialsRef = doc(db, `users/${auth.currentUser.uid}/account/financials`)
    const financialsData = {
        currency: currency,
    }


    await setDoc(detailsRef, detailsData)
    await setDoc(financialsRef, financialsData)
    // setDoc(detailsRef, detailsData).then(() => {
    //     setDoc(financialsRef, financialsData).then(() => {
    //         console.log('data set')
    //     });
    // });
}

export const setCurrentUserProfilePicture = async(url) => {

    const detailsRef = doc(db, `users/${auth.currentUser.uid}/account/details`)

    await updateDoc(detailsRef, {
        picture: url
    })
}

// export const updateCurrentUserProfilePicture = async(url) => {
//     const data = await getUserDetails(auth.currentUser.uid)
//     data.picture = url
//     const detailsRef = doc(db, `users/${auth.currentUser.uid}/account/details`)
    
//     await setDoc(detailsRef, data);
// }

export const refreshUserData = async() => {
    console.log('refreshing user data')
    if (!auth.currentUser) return null
    const details = await getCurrentUserDetails()
    const financials = await getCurrentUserFinancials()
    const messageChannels = await getCurrentUserMessageChannels()
    const savedExperiences = await getCurrentUserSavedExperiences()

    const userMessageChannels = []
    messageChannels.forEach((channel) => {
        const c = channel.data()
        // const channelData  = await getDoc(doc(db, `messageChannels/${c.id}`))
        // console.log(channelData.data()?.users)
        // c.users = channelData.data()?.users || []
        // console.log(c)
        userMessageChannels.push(c)
    })
    
    const userSavedExperiences = []
    savedExperiences.forEach((experience) => {
        const e = experience.data()
        userSavedExperiences.push(e)
    })


    const data = details.data()
    return {
        ...data,
        financials: financials.data(),
        messageChannels: userMessageChannels,
        savedExperiences: userSavedExperiences
    }
  }

export const getCurrentUserDetails = async() => {
    const data = await getUserDetails(auth.currentUser.uid)
    return data
}

export const getCurrentUserFinancials = async() => {
    const data = await getUserFinancials(auth.currentUser.uid)
    return data
}

export const getCurrentUserMessageChannels = async() => {
    const data = await getUserMessageChannels(auth.currentUser.uid)
    return data
}

export const getCurrentUserSavedExperiences = async() => {
    const data = await getUserSavedExperiences(auth.currentUser.uid)
    return data
}

export const getUserDetails = async(uid) => {
    const userRef = doc(db, `users/${uid}/account/details`)
    const data = await getDoc(userRef)
    return data
}

export const getUserFinancials = async(uid) => {
    const userRef = doc(db, `users/${uid}/account/financials`)
    const data = await getDoc(userRef)
    return data
}

export const getUserMessageChannels = async(uid) => {
    const messageChnRef = collection(db, `users/${uid}/messageChannels`)
    const data = await getDocs(messageChnRef)
    return data
}

export const getUserSavedExperiences = async(uid) => {
    const savedExpRef = collection(db, `users/${uid}/savedExperiences`)
    const data = await getDocs(savedExpRef)
    return data
}

export const getExperienceById = async(id) => {
    
    const experience = await getDoc(doc(db, `experiences/${id}`))
    // const images = await getImagesFromStorageUrl(`experiences/${id}/images`)

    return experience.data()
    
}

const experiencesRef = collection(db, 'experiences')

export const getExperiences = async() => {

    const data = await getDocs(experiencesRef)

    return data

}

export const getExperiencesQuery = async(start, end) => {
    const q = query(experiencesRef, orderBy("createdOn"), startAt(start), endAt(end));

    const data = await getDocs(q)

    return data
}

export const getUserExperiences = async(uid) => {

    const userExpRef = collection(db, `users/${uid}/created_experiences`)
    const data = await getDocs(userExpRef)
    return data
}

export const getExperienceOwner = async(ownerRef) => {
    const user = await getDoc(ownerRef)
    const details = await getUserDetails(user.id)
    const data = details.data()
    return {
        ...data,
        id: user.id
    }
}

export const setExperienceViewed = async(id) => {

    updateDoc(doc(db, `experiences/${id}`), {
        viewCount: increment(1)
    })


    // getDoc(doc(db, `experiences/${id}`)).then(res => {
    //     const data = res.data()
    //     data.viewCount ? data.viewCount+=1 : data.viewCount = 1
    //     setDoc(doc(db, `experiences/${id}`), data)
    // })
}

export const getExperienceReviews = async(id) => {
    const expReviewRef = collection(db, `experiences/${id}/reviews`)
    const data = await getDocs(expReviewRef)
    return data
}


export const getSearchResults = (input) => {
    const q = query(experiencesRef, where('location', '==', input));
    return q
}

export const updateStatisticsUserVote = (score) => {
    const increase = increment(1);
    const statsPredeploy = doc(db, 'statistics/predeploy')
    const updateDataWith = score > 0 ? {userVotePlus: increase, voteCount: increase} : {userVoteMinus: increase, voteCount: increase}
    updateDoc(statsPredeploy, updateDataWith)
}

export const setIntroViewed = () => {
    updateDoc(doc(db, 'statistics/predeploy'), {
        viewCount: increment(1)
    })
}