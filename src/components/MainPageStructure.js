import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import MobileNav from './MobileNav';
import { use100vh } from 'react-div-100vh'

function MainPageStructure(props) {

  const height = use100vh()

  return (
    <div style={{ height: height }} className="w-full max-w-[1080px] ml-auto mr-auto flex flex-col justify-between bg-white">
      <Header/>
        <div className={`w-full h-full overflow-y-scroll scrollbar-hide md:px-2`}>
          {props.children}
          {!props.hideFooter && <Footer/>}
        </div>
      <MobileNav/>
    </div> 
  );
}

export default MainPageStructure;
