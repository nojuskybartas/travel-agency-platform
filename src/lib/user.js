import { auth } from "./firebase";
import { getUserDetails } from "./storage";

export const getCurrentUserData = async() => {

    const user = auth.currentUser

    const details = await getUserDetails(user.uid)

    return {
        auth: user,
        details: details.data()
    }
    
}