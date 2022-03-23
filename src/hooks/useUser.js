import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { userState } from "../atoms/userAtom"
import { refreshUserData } from "../lib/storage"


export default function useUser() {
    const [userData, setUserData] = useRecoilState(userState)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        refreshUserData().then(data => {
            setUserData(data)
            setLoading(false)
        })
    }, [])

    return { loading, userData, setUserData }
  }
  