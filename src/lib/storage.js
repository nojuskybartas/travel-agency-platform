import { collection, doc, endAt, getDoc, getDocs, limit, orderBy, query, setDoc, startAt } from "firebase/firestore"
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage"
import { db } from "./firebase"

const storage = getStorage()

const getImagesFromStorageUrl = async(url) => {

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
    const userRef = doc(db, `users/${uid}/account/details`)
    const data = {
        type: 'regular', // can be creator
    }
    await setDoc(userRef, data);
}

export const getUserDetails = async(uid) => {
    const userRef = doc(db, `users/${uid}/account/details`)
    const data = await getDoc(userRef)
    return data
}

export const getExperienceById = async(id) => {
    
    const experience = await getDoc(doc(db, `experiences/${id}`))
    const images = await getImagesFromStorageUrl(`experiences/${id}/images`)

    return {
        details: experience.data(),
        images: images
    }
    
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


