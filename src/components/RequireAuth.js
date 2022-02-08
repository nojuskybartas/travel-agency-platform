import React, { useLayoutEffect, useState } from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import { auth } from '../lib/firebase';

const RequireAuth = ({ children }) => {

    const [user, setUser] = useState(auth.currentUser)
    
    // const location = useLocation();
    // const user = auth.currentUser

    

    return user ? children : <Navigate to="/welcome" />


    // if (!user) {
    //   // Redirect them to the /login page, but save the current location they were
    //   // trying to go to when they were redirected. This allows us to send them
    //   // along to that page after they login, which is a nicer user experience
    //   // than dropping them off on the home page.
    //   return <Navigate to="/" 
    //   // state={{ from: location }} 
    //   />;
    // }
  
    // return children;
}

export default RequireAuth