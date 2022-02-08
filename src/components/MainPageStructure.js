import React from 'react';
import Footer from './Footer';
import Header from './Header';
import MobileNav from './MobileNav';

function MainPageStructure(props) {
  return (
    <div className="w-full h-full">
        <div className="max-w-[1080px] w-full h-full ml-auto mr-auto sm:px-2 test-outline">
            <Header/>
            {props.children || <div className='h-screen'/>}
        </div>
        <Footer/>
        <MobileNav/>
    </div>
  );
}

export default MainPageStructure;
