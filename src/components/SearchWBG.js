import { SearchIcon } from '@heroicons/react/outline'
import background_img from '../illustration.webp'

function SearchWBG() {

    return (
        <div className='w-full h-fit overflow-hidden relative group'>
            <div className='bg-yellow-400 w-max h-fit'>
                <img src={background_img} className='w-full h-full object-fit'/>
            </div>

            {/* <input placeholder='Search experiences!' className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-10 rounded-2xl p-2'/> */}
            <div className='flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-10 rounded-2xl overflow-hidden bg-white searchBar_shadow group-hover:scale-110'>
                <SearchIcon className='w-6 h-6 ml-2 mr-1' />
                <input placeholder='Find your next best experience!' className='w-full h-10 p-2 rounded-2xl outline-none text-xs md:text-base lg:text-lg'/>
            </div>
            
            

        </div>
    )
}

export default SearchWBG