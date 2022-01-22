import Experiences from "../components/Experiences"
import Footer from "../components/Footer"
import Getaways from "../components/Getaways"
import Header from "../components/Header"
import SearchWBG from "../components/SearchWBG"

function Home () {

    return (
        <div>
            <div className="max-w-[1080px] h-full ml-auto mr-auto space-y-6 sm:px-2 sm:py-2">
                <Header/>
                <SearchWBG/>
                <Experiences/>
                <Getaways/>
            </div>
            <Footer/>
        </div>
    )
}

export default Home