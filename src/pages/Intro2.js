import React, { useEffect, useState } from 'react'
import logo from '../logo_text_color.svg'
import background_img from '../illustration1.webp'
import { motion, useAnimation, useSpring, useTransform, useViewportScroll } from 'framer-motion'
import { useInView } from 'react-intersection-observer';

function Intro2() {

    const transition = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] };
    const [currentPrecent, setCurrentPercent] = useState(null)
    const { scrollYProgress } = useViewportScroll();
    const yRange = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

    const logoVariants = {
        visible: {
            x: '0%',
            opacity: '100%',
            transition: {
                type: 'spring',
                duration: 1,
            }
        },
        hidden: {
            x: '-100%',
            opacity: '0%',
        }
    }
    const logoTextVariants = {
        visible: {
            x: '0%',
            opacity: '100%',
            transition: {
                type: 'spring',
                delay: 0.5,
                duration: 1,
            }
        },
        hidden: {
            x: '100%',
            opacity: '0%',
        }
    }

    useEffect(
        () =>
            yRange.onChange((v) => {
                setCurrentPercent(Math.trunc(yRange.current))
            }),
        [yRange]
    );

    useEffect(() => {
        console.log(currentPrecent)
    }, [currentPrecent])


    return (
        <div className='w-full h-full bg-gray-900 text-primary'>
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <motion.img 
                initial='hidden' 
                animate='visible'
                variants={logoVariants}
                src={logo} 
                alt='explored life' 
                className='w-full max-w-2xl aspect-auto mt-[40vh]'
                />
                <motion.h1 
                initial='hidden' 
                animate='visible'
                variants={logoTextVariants}
                className='italic font-semibold text-xs lg:text-lg mt-9 mb-[30vh] w-fit'>
                    Not just your new favourite travel agency...
                </motion.h1>
            </div>

            <AnimateWhenInView>
                <div className='w-full h-1/2 flex justify-center items-center'>
                        <p className='w-full h-fit md:text-lg max-w-2xl mb-10 text-justify'>
                            We believe that strangers are just friends you haven't met yet.
                        </p>
                </div>
            </AnimateWhenInView>
            <AnimateWhenInView>
                <div className='w-full h-1/2 flex flex-col justify-center items-center'>
                        <img src={background_img} className='w-full h-[50vh] object-cover'/>
                        <p className='w-full h-fit md:text-lg max-w-2xl mb-10 text-justify'>
                            Come on an adventure.
                        </p>
                </div>
            </AnimateWhenInView>


        </div>  
    )
}

export default Intro2

function AnimateWhenInView({children, delay=1, variants}) {

    const { ref, inView } = useInView();
    const controls = useAnimation();
    const transition = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] };

    const defaultVariants = {
        visible: {
            x: '0%',
            opacity: '100%',
            transition: { delay: delay, duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
          },
        hidden: {
            x: '80%',
            opacity: '0%',
            transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
          }
    }

    useEffect(() => {
        if (inView) {
          controls.start('visible');
        }
        // if (!inView) {
        //     console.log('hidden')
        //   controls.start('hidden');
        // }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial='hidden'
            animate={controls}
            variants={variants || defaultVariants}
            transition={transition}
        >
            {children}
        </motion.div>
    )
}