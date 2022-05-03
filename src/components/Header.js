import logo from '../logo_text_black.svg'
import { PencilIcon, SearchCircleIcon } from '@heroicons/react/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { loginState } from '../atoms/navbarAtom'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser'
import { motion } from 'framer-motion'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'



function Header ({transparent}) {

    const navigate = useNavigate()
    const location = useLocation()

    const [showLogin, setShowLogin] = useRecoilState(loginState)
    const { userData, setUserData, loading } = useUser()

    const variants = {
        visible: {
            y: '0%',
        },
        hidden: {
            y: '-100%',
        }
    }

    return (
        <motion.div 
        animate={loading ? 'hidden' : 'visible'}
        variants={variants}
        className={`sticky top-0 z-10 h-14 w-full flex justify-center md:justify-between items-center backdrop-blur-3xl border-x-2 border-b-2 border-solid border-primary md:border-0 md:bg-background md:backdrop-blur-none rounded-b-md p-2 `}>

            <Link to='/home'>
                <img src={logo} className='w-48 h-full'/>
            </Link>

            <div className='hidden md:flex w-1/4 min-w-min max-w-md items-center justify-end'>
                
                {!location.pathname.includes('/create') && 
                    <div className='headerRight' onClick={() => navigate('/create')}>
                        <PencilIcon className='w-6 h-6'/>
                        <p className='headerText-primary'>Create</p>
                    </div>
                }

                {!location.pathname.includes('/experiences') && 
                <div className='headerRight' onClick={() => navigate('/experiences')}>
                    <SearchCircleIcon className='w-6 h-6'/>
                    <p className='headerText-primary'>Experience</p>
                </div>
                }

                {userData
                ?
                    <div className='headerRight w-fit h-10 bg-black text-white hover:bg-gray-800 group relative font-bold ml-auto mr-auto hover:rounded-b-none'><span onClick={() => navigate('/profile')}>Hello, {userData.name}</span>
                      <Submenu userData={userData}/>
                    </div>
                :
                    <div className='headerRight w-fit h-10 bg-black text-white hover:bg-gray-800 font-bold ml-auto mr-auto' onClick={() => setShowLogin(true)}>Sign In</div>
                }
            </div>
        </motion.div>
    )
}

export default Header


function Submenu({userData}) {
    
    return (
      <ul className="h-fit w-full p-2 absolute left-0 top-10 hidden group-hover:block bg-gray-800 rounded-b-xl transition-all ease-in-out">
        <Link to='/experiences'>
          <li className="hover:opacity-100 opacity-80">
            <span>Explore</span>
          </li>
        </Link>
        <Link to='/create'>
          <li className="hover:opacity-100 opacity-80">
            <span>Create</span>
          </li>
        </Link>
        <Link to='/inbox'>
          <li className="hover:opacity-100 opacity-80">
            <span>Inbox</span>
          </li>
        </Link>
        <Link to='/saved'>
          <li className="hover:opacity-100 opacity-80">
            <span>Saved</span>
          </li>
        </Link>
        <Link to='/profile'>
          <li className="hover:opacity-100 opacity-80">
              <span>My Profile</span>
          </li>
        </Link>
        <li className="hover:opacity-100 opacity-80" onClick={() => signOut(auth)}>
          <span>Sign Out</span>
        </li>
        
      </ul>
    )
  
}