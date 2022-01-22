import { signInWithPopup, getRedirectResult, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from '../../lib/firebase';

const GoogleLogin = async({handleLoginShow}) => {

    signInWithRedirect(auth, googleProvider);

    getRedirectResult(auth)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log('Google login success > ',result)
        handleLoginShow()
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log('Google login fail > ', error)
    });

    // return signInWithPopup(auth, googleProvider)
    // .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;

    //     console.log(result)
    //     // ...
    // }).catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //     console.log(error)
    // });

    // return (
    //     <div>

    //     </div>
    // )

    
}

export default GoogleLogin