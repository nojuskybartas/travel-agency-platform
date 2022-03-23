import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import MobileNav from './MobileNav';
import { use100vh } from 'react-div-100vh'
import { motion, AnimatePresence } from 'framer-motion';

function MainPageStructure(props) {

  // const height = use100vh()

  return (
    
    <div className="w-full h-screen max-w-[1080px] ml-auto mr-auto flex flex-col justify-between overflow-y-hidden overflow-x-hidden">
      <Header/>
      <AnimatePresence exitBeforeEnter >
        <motion.div 
        key={props.key}
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '100%' }}
        className={`w-full h-full overflow-y-scroll scrollbar-hide md:px-2`}>
          {props.children}
          {!props.hideFooter && <Footer/>}
        </motion.div>
      </AnimatePresence>
      <MobileNav/>
    </div> 
    
  );
}

export default MainPageStructure;
