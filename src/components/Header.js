import logo from '../tripadvisor_logo.svg'
import { PencilIcon, SearchCircleIcon } from '@heroicons/react/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Login from './Login'
import { useRecoilValue } from 'recoil'
import { userState } from '../atoms/userAtom'

function Header ({transparent}) {

    const navigate = useNavigate()
    const location = useLocation()
    

    return (
        <div className={`sticky top-0 z-10 w-full h-14 flex justify-between items-center p-2 mt-3 ${!transparent && 'bg-white'}`}>
            <Link to='/'>
                <img src={logo} className='w-fit h-10'/>
            </Link>

            <div className='flex w-1/4 min-w-min max-w-md items-center justify-between'>
                
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