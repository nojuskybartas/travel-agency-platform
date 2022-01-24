import { onAuthStateChanged } from "firebase/auth";
import { cloneDeep } from "lodash";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "./atoms/userAtom";
import RequireAuth from "./components/RequireAuth";
import { auth } from "./lib/firebase";
import { setDefaultUserDetailsOnRegister } from "./lib/storage";
import CreateExperience from "./pages/CreateExperience";
import Experience from "./pages/Experience";
import Experiences from "./pages/Experiences";
import Home from "./pages/Home";
import Profile from "./pages/Profile";


function App() {

  const [user, setUser] = useRecoilState(userState)

  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser) {
        // const user = auth.currentUser

        const user = cloneDeep(authUser)
        if (user.metadata.createdAt === user.metadata.lastLoginAt) {
          setDefaultUserDetailsOnRegister(user.uid)
        }
        
        console.log(user)
        setUser(user)
      } else {
        setUser(null)
      }
    })
  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/profile' element={<RequireAuth><Profile/></RequireAuth>}/>
        <Route path="/create" element={<CreateExperience/>}/>
        <Route path="/experiences" element={<Experiences/>}/>
        <Route path="/experience/:experienceId" element={<Experience/>} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
