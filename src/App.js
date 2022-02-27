import { onAuthStateChanged } from "firebase/auth";
import { cloneDeep } from "lodash";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { conversionRateAtom } from "./atoms/currencyAtom";
import { userState } from "./atoms/userAtom";
import InboxChannel from "./components/InboxChannel";
import PrivateRoute from "./components/PrivateRoute";
import { getConversionRatesEUR } from "./lib/currency";
import { auth } from "./lib/firebase";
import { getCurrentUserDetails, getCurrentUserFinancials, getUserDetails, getUserFinancials, refreshUserData, setDefaultUserDetailsOnRegister } from "./lib/storage";
import { getCurrentUserData } from "./lib/user";
import CreateExperience from "./pages/CreateExperience";
import Experience from "./pages/Experience";
import Experiences from "./pages/Experiences";
import Home from "./pages/Home";
import Inbox from "./pages/Inbox";
import Intro from "./pages/Intro";
import Profile from "./pages/Profile";
import RegisterCreator from "./pages/RegisterCreator";
import SavedExperiences from "./pages/SavedExperiences";


function App() {

  // const [userData, setUserData] = useRecoilState(userState)
  const [conversionRates, setConversionRates] = useRecoilState(conversionRateAtom)
  const navigate = useNavigate()

  useEffect(() => {

    getConversionRatesEUR().then(res => {
      setConversionRates(res)
    })

    // const unregisterAuthObserver = onAuthStateChanged(auth, authUser => {
    //   if (authUser) {

    //     refreshUserData().then(data => {
    //       setUserData(data)
    //     })

    //   } else {
    //     setUserData(null)
    //     // navigate('/')
    //   }
    // })

    // return () => unregisterAuthObserver()
  }, [])

  // useEffect(() => {
  //   console.log(userData)
  // }, [userData])


  return (
      <Routes>
        <Route path="/" element={<Intro/>}/>
        <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>}/>
        {/* <Route path="/login" element={<PrivateRoute><Login/></PrivateRoute>}/> */}
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path="/create" element={<PrivateRoute><CreateExperience/></PrivateRoute>}/>
        <Route path="/creator/register" element={<PrivateRoute><RegisterCreator/></PrivateRoute>}/>
        <Route path="/experiences" element={<PrivateRoute><Experiences/></PrivateRoute>}/>
        <Route path="/experience/:experienceId" element={<PrivateRoute><Experience/></PrivateRoute>}/>
        <Route path="/saved" element={<PrivateRoute><SavedExperiences/></PrivateRoute>}/>
        <Route path="/inbox" element={<PrivateRoute><Inbox/></PrivateRoute>}/>
        <Route path="/inbox/:inboxId" element={<PrivateRoute><Inbox/></PrivateRoute>}/>
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
  );
}

export default App;
