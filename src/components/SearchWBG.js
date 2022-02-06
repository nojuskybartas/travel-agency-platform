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

    const [results, setResults] = useState([])

    const navigate = useNavigate()

    // const searchClient = algoliasearch('X7XNECEGSI', 'b7af155aabe7ac707bb4c945a37b584f');

    const handleChange = async(e) => {
        const l = []
        const q = getSearchResults(e.target.value)

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            l.push(doc.data())
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data().title);
        });
        setResults(l)
    }

    return (
        <div className='w-full h-fit overflow-hidden relative group rounded-2xl'>
            {/* <InstantSearch searchClient={searchClient} indexName="appexperiencesearch"> */}
            <div className='bg-yellow-400 w-max h-fit'>
                <img src={background_img} className='w-full h-full object-fit'/>
            </div>

            {/* {results.map(result => {
                return <p>{result.title}</p>
            })} */}

            {/* <input placeholder='Search experiences!' className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-10 rounded-2xl p-2'/> */}
            {/* <div className='flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-10 rounded-2xl overflow-hidden bg-white searchBar_shadow group-hover:scale-110'> */}
                {/* <SearchIcon className='w-6 h-6 ml-2 mr-1' />
                <input placeholder='Find your next best experience!' className='w-full h-10 p-2 rounded-2xl outline-none text-xs md:text-base lg:text-lg' onChange={handleChange}/> */}
                {/* <SearchBox className='w-full h-10 p-2 rounded-2xl outline-none text-xs md:text-base lg:text-lg'/> */}
                {/* <AutoComplete/> */}
            {/* </div> */}

            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-10 searchBar_shadow group-hover:scale-110'>
                <AutoCompleteSearchBar navigate={navigate}/>
            </div>
            
            
            
                
                {/* <Hits/> */}
             
                        
            
            
            {/* </InstantSearch>    */}
        </div>
    )
}

export default SearchWBG