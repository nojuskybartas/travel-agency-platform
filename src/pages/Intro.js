import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { loginState } from '../atoms/navbarAtom';
import LoginModal from '../components/LoginModal';
import { setIntroViewed, updateStatisticsUserVote } from '../lib/storage';
import logo from '../logo_text_color.svg'

export default function Intro() {

    const [voted, setVoted] = useState(JSON.parse(localStorage.getItem("voted")) || false)
    const [viewed, setViewed] = useState(JSON.parse(localStorage.getItem("viewed")) || false)
    const [showLogin, setShowLogin] = useRecoilState(loginState)

    function vote(score) {
        if (!voted) {
            updateStatisticsUserVote(score)
            localStorage.setItem("voted", JSON.stringify(true));
            setVoted(true)
        }
    }

    useEffect(() => {
        if (!viewed) {
            setIntroViewed()
            localStorage.setItem("viewed", JSON.stringify(true));
            setViewed(true)
        }
    },[viewed])
    
    return (
        <div className='h-screen overflow-y-scroll snap-y snap-mandatory bg-gray-900 text-primary pb-20 scrollbar-hide p-8'>
            <section className='h-screen snap-center flex flex-col justify-center items-center'>
                <img src={logo} alt='explored life' className='w-full max-w-2xl aspect-auto mt-[40vh]'/>
                <h1 className='italic font-semibold text-xs lg:text-lg mt-9 mb-[30vh] w-fit'>Not just your new favourite travel agency...</h1>
            </section>
            <section className='h-screen snap-center flex flex-col justify-center items-center'>
                <p className='w-full max-w-2xl mb-10 text-justify'>
                        We aim to connect people living in the most remote, unknown places, 
                        and provide them with an opportunity to share their world with strangers.
                        Or rather, upcoming friends. We believe that strangers are just friends you haven't met yet.
                </p>
            </section>
            <section className='h-screen snap-center flex flex-col justify-center items-center'>
                <p className='w-full max-w-2xl mb-10 text-justify'>
                        Our team is currently working on launching the platform as soon as possible, in the mean time, 
                        we'd love to hear your opinion about it. You can use the buttons below to vote on whether you'd like to see what we can offer you.
                </p>
            </section>
            <section className='h-screen snap-center flex flex-col justify-center items-center'>
                <p className='w-full max-w-2xl mb-10 text-justify'>
                        If you would like to keep up with the progress, we invite you to visit this site on your phone and add the page to your homescreen. 
                        Why, you ask? Well, because then we'll be able to send you notifications! And don't worry, we hate spam, too. We'll only use it to inform you of the launch progress.
                </p>
                <h1 className='font-bold text-2xl custom-underline'>{!voted ? 'Ready to up your travel game?' : 'Thanks for voting!'}</h1>
                {!voted && <div className='flex w-1/2 max-w-sm h-fit justify-between items-center p-5'>
                    <div className={`bg-green-900 hover:bg-green-700 w-1/3 h-fit rounded-lg`} onClick={() => vote(1)}>
                        <ChevronUpIcon/>
                    </div>
                    <div className={`bg-red-900 hover:bg-red-700 w-1/3 h-fit rounded-lg`} onClick={() => vote(-1)}>
                        <ChevronDownIcon/>
                    </div>
                </div>}
            </section>
            <div className='absolute top-2 right-2 text-transparent hover:text-white cursor-pointer group w-32 h-10' onClick={() => setShowLogin(true)}>
                <h6 className='hidden group-hover:inline'>Admin panel</h6>
            </div>
            <LoginModal label='Hello! :)'/>
        </div>
    )
}