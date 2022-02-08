import logo from '../logo_text_black.svg'
import { PencilIcon, SearchCircleIcon } from '@heroicons/react/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Login from './Login'
import { useRecoilValue } from 'recoil'
import { userState } from '../atoms/userAtom'
import NavBar from './NavBar'



function Header ({transparent}) {

    const navigate = useNavigate()
    const location = useLocation()
    

    return (
        <div className={`sticky top-0 z-10 w-full h-14 flex justify-center md:justify-between items-center rounded-b-md test-outline p-2 ${!transparent && 'bg-white'}`}>
            {/* <NavBar /> */}

            <Link to='/'>
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

                <Login/>
            </div>
        </div>
    )
}

export default Header