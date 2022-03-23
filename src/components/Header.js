import logo from '../logo_text_black.svg'
import { PencilIcon, SearchCircleIcon } from '@heroicons/react/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Login from './Login'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userState } from '../atoms/userAtom'
import NavBar from './NavBar'
import { loginState } from '../atoms/navbarAtom'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser'
import { motion } from 'framer-motion'



function Header ({transparent}) {

    const navigate = useNavigate()
    const location = useLocation()

    const [showLogin, setShowLogin] = useRecoilState(loginState)
    const { userData, setUserData, loading } = useUser()

    const variants = {
        visible: {
            y: '0%',
            // height: '3.5rem',
            // transition: {
            //     type: 'spring',
            //     duration: 0.75,
            // }
        },
        hidden: {
            y: '-100%',
            // height: '0px'
        }
    }

    return (
        <motion.div 
        animate={loading ? 'hidden' : 'visible'}
        variants={variants}
        className={`sticky top-0 z-10 h-14 w-full flex justify-center md:justify-between items-center rounded-b-md p-2 backdrop-blur-2xl overflow-hidden ${!transparent && 'bg-background'}`}>
            {/* <NavBar /> */}

            <Link to='/home'>
                <img src={logo} className='w-48 h-full'/>
            </Link>

            <div className='hidden md:flex w-1/4 min-w-min max-w-md items-center justify-end'>
                
                {location.pathname != '/create' && 
                    <div className='headerRight' onClick={() => navigate('/create')}>
                        <PencilIcon className='w-6 h-6'/>
                        <p className='headerText-primary'>Create</p>
                    </div>
                }

                {location.pathname != '/experiences' && 
                <div className='headerRight' onClick={() => navigate('/experiences')}>
                    <SearchCircleIcon className='w-6 h-6'/>
                    <p className='headerText-primary'>Experience</p>
                </div>
                }

                <div className='headerRight w-fit h-10 bg-black text-white hover:bg-gray-800 group relative'>
                    {userData
                    ?
                        <div className='font-bold ml-auto mr-auto' onClick={() => setShowLogin(true)}>{userData.name}</div>
                    :
                        <div className='font-bold ml-auto mr-auto' onClick={() => setShowLogin(true)}>Sign In</div>
                    }
                    {/* <div className='font-bold ml-auto mr-auto' onClick={() => setShowLogin(true)}>{user ? `Hello, ${userDetails?.name || user.email}` : 'Sign In'}</div> */}
                    {/* {user && <Submenu/>} */}
                </div>

                {/* <Login/> */}
            </div>
        </motion.div>
    )
}

export default Header