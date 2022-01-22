import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAmEmIsmK9SdQkx-6_0fvo-BQCCA9J2To",
  authDomain: "tripadvisor-clone-432ea.firebaseapp.com",
  projectId: "tripadvisor-clone-432ea",
  storageBucket: "tripadvisor-clone-432ea.appspot.com",
  messagingSenderId: "800397740807",
  appId: "1:800397740807:web:8eb3f8fabe04936684d3a2",
  measurementId: "G-D3HC4G2WM0"
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const storage = getStorage(firebaseApp)

const db = getFirestore();
const auth = getAuth();
auth.useDeviceLanguage()
const googleProvider = new GoogleAuthProvider();
export { db, storage, auth, googleProvider };
