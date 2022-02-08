import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { loginState } from '../atoms/navbarAtom';
import LoginModal from '../components/LoginModal';
import MainPageStructure from '../components/MainPageStructure';

function Login() {
    const [showLogin, setShowLogin] = useState(true)
    const navigate = useNavigate()
    return (
        <MainPageStructure>
            <div className='h-screen'/>
            <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} onExit={() => navigate(-1)} label='Sign in to unlock the best of Explored.Life'/>
        </MainPageStructure>
    );
}

export default Login;
