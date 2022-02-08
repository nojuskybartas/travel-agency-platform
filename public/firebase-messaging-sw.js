importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDAmEmIsmK9SdQkx-6_0fvo-BQCCA9J2To",
  authDomain: "tripadvisor-clone-432ea.firebaseapp.com",
  projectId: "tripadvisor-clone-432ea",
  storageBucket: "tripadvisor-clone-432ea.appspot.com",
  messagingSenderId: "800397740807",
  appId: "1:800397740807:web:8eb3f8fabe04936684d3a2",
  measurementId: "G-D3HC4G2WM0"
});

const messaging = firebase.messaging();

export const requestNotificationPermission = async() => {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('token:', token)
}
