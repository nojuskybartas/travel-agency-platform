import { SearchIcon } from '@heroicons/react/outline'
import { getDocs } from 'firebase/firestore'
import { useState } from 'react'
import background_img from '../illustration.webp'
import { getSearchResults } from '../lib/storage'
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import AutoCompleteSearchBar from './AutoCompleteSearchBar'
import { useNavigate } from 'react-router-dom'

function SearchWBG() {

    const navigate = useNavigate()

    return (
        <div className='w-full h-fit overflow-hidden relative group md:rounded-2xl test-outline'>
           
            <div className='bg-yellow-400 w-max h-fit'>
                <img src={background_img} className='w-full h-full object-fit'/>
            </div>

            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-1/2 searchBar_shadow'>
                <AutoCompleteSearchBar navigate={navigate}/>
            </div>
            
        </div>
    )
}

export default SearchWBG