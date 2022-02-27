import React from 'react';
import Footer from './Footer';
import Header from './Header';
import MobileNav from './MobileNav';

function MainPageStructure(props) {
  return (
    // <div className='w-full h-screen overflow-y-scroll'>
    <div className="w-full h-full min-h-screen flex flex-col justify-between">
        <div className="max-w-[1080px] w-full h-full ml-auto mr-auto sm:px-2 test-outline">
            <Header/>
            <div className={`w-full h-full`}>
              {props.children}
            </div>
        </div>
        {!props.hideFooter && <Footer/>}
        <MobileNav/>
    </div>
    // </div>
  );
}

export default MainPageStructure;
