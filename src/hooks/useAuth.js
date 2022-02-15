import { onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { userState } from '../atoms/userAtom'
import { auth } from '../lib/firebase'
import { refreshUserData } from '../lib/storage'

export function useAuth() {
  const [userData, setUserData] = useRecoilState(userState)
  const [authState, setAuthState] = useState({
    isSignedIn: false,
    pending: true,
    user: null,
  })

  useEffect(() => {
    console.log('loaded useAuth')
    const unregisterAuthObserver = onAuthStateChanged(auth, user => {
      console.log('updated auth state: ', user)
      setAuthState({ user, pending: false, isSignedIn: !!user })
      refreshUserData().then(data => {
        setUserData(data)
      })
    })
    return () => unregisterAuthObserver()
  }, [])

  return { auth, ...authState }
}
