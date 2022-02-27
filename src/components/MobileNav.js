import { ChatAltIcon, FingerPrintIcon, HeartIcon, MapIcon, SearchIcon, UserCircleIcon, UserIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import logo from '../logo_sized.png'
import LoginModal from './LoginModal';
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginState } from '../atoms/navbarAtom';

function MobileNav() {

    const location = useLocation()

    return (
        <footer className='flex md:hidden sticky bottom-0 h-14 w-full bg-white justify-around p-2 rounded-t-md z-10'>
            <NavBarItem label='Explore' linkTo='/home'>
                <SearchIcon className='w-12 h-12'/>
            </NavBarItem>
            <NavBarItem label='Saved' linkTo='/saved'>
                <HeartIcon className='w-12 h-12'/>
            </NavBarItem>
            {auth.currentUser ? 
            <>
                <NavBarItem label='Experiences' linkTo='/experiences'>
                    {/* <img src={logo} className='w-12 h-12 object-contain filter grayscale-0'/> */}
                    <MapIcon className='w-12 h-12'/>
                </NavBarItem>
                <NavBarItem label='Inbox' linkTo='/inbox'>
                    <ChatAltIcon className='w-12 h-12'/>
                </NavBarItem>
                <NavBarItem label='Profile' linkTo='/profile'>
                    <UserCircleIcon className='w-12 h-12'/>
                </NavBarItem>
            </> 
            : 
            <NavBarItem label='Log In' linkTo='/login'>
                <UserCircleIcon className='w-12 h-12'/>
            </NavBarItem>
            }
        </footer>
    );
}

export default MobileNav;

function NavBarItem({label, linkTo, ...props}) {

    const location = useLocation()

    return (
        <Link to={linkTo || location}>
            <div className={`flex flex-col justify-center items-center w-full h-full ${location.pathname === linkTo && 'text-primary'}`}>
                {props.children}
                <p className='text-xs'>{label}</p>
            </div>
        </Link>
    )
}
