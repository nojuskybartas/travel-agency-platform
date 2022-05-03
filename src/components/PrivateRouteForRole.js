import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useUser from "../hooks/useUser"
import LoadingSpinner from "./LoadingSpinner"


const PrivateRouteForRole = ({ children, role }) => {
  const { isSignedIn, pending } = useAuth()
  const {userData, loading} = useUser()

  const authenticate = () => {
    if (pending || loading) return <LoadingSpinner/>
    if (isSignedIn && userData && userData.roles.includes(role)) return children
    return <Navigate to={-1}/>
  }

  return authenticate()
}

export default PrivateRouteForRole