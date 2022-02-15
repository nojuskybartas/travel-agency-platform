import { ThreeDots } from "react-loader-spinner"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"


const PrivateRoute = ({ children }) => {
  const { auth, isSignedIn, pending } = useAuth()
  const navigate = useNavigate()
  if (!pending && !isSignedIn) {
    console.log('not pending and not signed in -> navigating to /')
    navigate('/')
  }

  return (pending ? 
  <div className="w-full h-screen bg-gray-900 flex justify-center items-center">
    <ThreeDots color="#A393EB" height="100" width="100" />
  </div> 
  :
  children)
}

export default PrivateRoute