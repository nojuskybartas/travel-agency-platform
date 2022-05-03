import React, { useEffect, useRef } from 'react';
import Footer from './Footer';
import Header from './Header';
import MobileNav from './MobileNav';
import { use100vh } from 'react-div-100vh'
import { motion, AnimatePresence } from 'framer-motion';
import useWindowDimensions from '../hooks/useWindowDimensions';
import LoadingSpinner from './LoadingSpinner';
import LoadingIndicator from './LoadingIndicator';

function MainPageStructure({ name, hideFooter, hideHeader, loading, ...props }) {

  // const height = use100vh()
  const { isMobile } = useWindowDimensions()
  const screenTopRef = useRef(null)

    useEffect(() => {
        if(screenTopRef && screenTopRef.current) {
            screenTopRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [screenTopRef])


  return (
    
    <div className="w-full min-h-screen h-full max-w-[1080px] ml-auto mr-auto flex flex-col justify-between">
      {!hideHeader && <Header/>}
        <div ref={screenTopRef} className='absolute -top-full'></div>
        <LoadingIndicator loading={loading}/>
        <motion.div 
        key={name}
        initial={isMobile ? { x: '-25%' } : { opacity: '40%' }}
        animate={{ x: '0%', opacity: '100%' }}
        transition={{ease: 'easeIn', duration: 0.2}}
        // overflow-x-hidden
        className={`w-full h-full flex-grow md:px-2`}>
          {props.children}
        </motion.div>
      
      {!hideFooter && <Footer/>}
      <MobileNav/>
    </div> 
    
  );
}

export default MainPageStructure;
