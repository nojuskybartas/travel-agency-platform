import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { loginState } from '../atoms/navbarAtom';
import LoginModal from '../components/LoginModal';
import MainPageStructure from '../components/MainPageStructure';

function Login() {
    const navigate = useNavigate()
    return null
    // return (
    //     <MainPageStructure>
    //         <div className='h-screen'/>
    //         <LoginModal onExit={() => navigate(-1)} label='Sign in to unlock the best of Explored.Life'/>
    //     </MainPageStructure>
    // );
}

export default Login;
