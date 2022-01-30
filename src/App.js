import { onAuthStateChanged } from "firebase/auth";
import { cloneDeep } from "lodash";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "./atoms/userAtom";
import RequireAuth from "./components/RequireAuth";
import { auth } from "./lib/firebase";
import { getCurrentUserDetails, getCurrentUserFinancials, getUserDetails, getUserFinancials, refreshUserData, setDefaultUserDetailsOnRegister } from "./lib/storage";
import { getCurrentUserData } from "./lib/user";
import CreateExperience from "./pages/CreateExperience";
import Experience from "./pages/Experience";
import Experiences from "./pages/Experiences";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import RegisterCreator from "./pages/RegisterCreator";


function App() {

  const [userData, setUserData] = useRecoilState(userState)

  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser) {
        // const user = auth.currentUser

        const user = cloneDeep(authUser)

        // TODO: FOR DEV ONLY, REMOVE WHEN DEPLOY
        // setDefaultUserDetailsOnRegister(user.uid)

        // refreshUserData()

        refreshUserData().then(data => {
          setUserData(data)
        })

        // getUserDetails(authUser.uid).then(res => {
        //   let data = res.data()
        //   getUserFinancials(authUser.uid).then(res => {
        //     data = {
        //       ...data,
        //       financials: res.data()
        //     }
        //     setUserData(data)
        //   })
         
        // })

        // getUserFinancials(auth.currentUser.uid).then(res => {
        //   setUserData(data => ({
        //     ...data,
        //     financials: res.data()
        //   }))
        // })
        // // getUserDetails(auth.currentUser.uid).then(res => {
        // //   setUserData(data => ({
        // //     ...data,
        // //     details: res.data()
        // //   }))
        // // })

        
        // console.log(user)
        // console.log(userData)
        // setUser(user)
        // console.log(userData)
      } else {
        console.log('logged out')
        setUserData(null)
      }
    })
  }, [])

  useEffect(() => {
    console.log(userData)
  }, [userData])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/profile' element={<RequireAuth><Profile/></RequireAuth>}/>
        <Route path="/create" element={<CreateExperience/>}/>
        <Route path="/creator/register" element={<RegisterCreator/>}/> 
        <Route path="/experiences" element={<Experiences/>}/>
        <Route path="/experience/:experienceId" element={<Experience/>} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
