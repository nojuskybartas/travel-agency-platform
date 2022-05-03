import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import LoadingSpinner from "./LoadingSpinner"


const PrivateRoute = ({ children }) => {
  const { isSignedIn, pending } = useAuth()

  const authenticate = () => {
    if (pending) return <LoadingSpinner/>
    if (isSignedIn) return children
    return <Navigate to='/'/>
  }

  return authenticate()
}

export default PrivateRoute