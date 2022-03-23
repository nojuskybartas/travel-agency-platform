import { ChevronDownIcon, ChevronUpIcon, HeartIcon, ReplyIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { loginState } from '../atoms/navbarAtom';
import LoginModal from '../components/LoginModal';
import { registerUserToEmailList, setIntroViewed, updateStatisticsUserVote } from '../lib/storage';
import logo from '../logo_text_custom.svg'
import background_img from '../static/images/scenery/friends-laughing.jpg'

import sceneryIllustration1 from '../static/illustrations/scenery/svg/landscape_and_scenery (1).svg'
import sceneryIllustration2 from '../static/illustrations/scenery/svg/landscape_and_scenery (2).svg'
import sceneryIllustration3 from '../static/illustrations/scenery/svg/landscape_and_scenery (3).svg'
import sceneryIllustration4 from '../static/illustrations/scenery/svg/landscape_and_scenery (4).svg'
import sceneryIllustration5 from '../static/illustrations/scenery/svg/landscape_and_scenery (5).svg'
import sceneryIllustration6 from '../static/illustrations/scenery/svg/landscape_and_scenery (6).svg'
import sceneryIllustration7 from '../static/illustrations/scenery/svg/landscape_and_scenery (7).svg'
import { motion, useAnimation, useTransform, useViewportScroll } from 'framer-motion'
import { useInView } from 'react-intersection-observer';
import ScrollForMoreIcon from '../components/ScrollForMoreIcon.js'

export default function Intro() {

    const [inputState, setInputState] = useState({email: '', error: null})
    const [viewed, setViewed] = useState(JSON.parse(localStorage.getItem("viewed")) || false)
    const [showLogin, setShowLogin] = useRecoilState(loginState)
    // const controls = useAnimation();
    // const { ref, inView } = useInView();

    const [displaceY, setDisplaceY] = useState(0)
    // const [currentlyVisibleSection, setCurrentlyVisibleSection] = useState(0)
    const { scrollYProgress } = useViewportScroll();
    const yRange = useTransform(scrollYProgress, [0, 0.4], [20, 80]);
    // const section = useTransform(scrollYProgress, [0, 1], [0, 3]);

    const handleEmailSubmit = (e) => {
        e.preventDefault()
        if (!inputState.email.includes('@') || !inputState.email.includes('.')) {
            setInputState(inputState => ({
                ...inputState,
                error: true
            }))
        } else {
            setInputState(inputState => ({
                ...inputState,
                error: false,
                submitted: true,
            }))
            registerUserToEmailList(inputState.email)
            console.log('registering ', inputState.email)
        }
    }

    useEffect(() => {
        if (!viewed) {
            setIntroViewed()
            localStorage.setItem("viewed", JSON.stringify(true));
            setViewed(true)
        }
    },[viewed])

    // useEffect(() => {
    //     yRange.onChange(val => {
    //         setCurrentScrollPercent(val)
    //     })
    // }, [yRange])

    useEffect(() => {
        yRange.onChange(val => {
            setDisplaceY(val)
        })
        return () => yRange.clearListeners()
    }, [])
    

    // useEffect(() => {
    //     if (inView) {
    //       controls.start('visible');
    //     }
    // }, [controls, inView]);

    // useEffect(() => {
    //     section.onChange(() => {
    //         setCurrentlyVisibleSection((section.current))
    //     })
    // },[section]);

    // useEffect(() => {
    //     console.log(currentlyVisibleSection)
    // }, [currentlyVisibleSection])

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
    
    return (
        <div className='h-full w-full text-primary pb-20 overflow-x-hidden'>
            <section className='h-screen snap-center flex flex-col justify-center items-center p-8' aria-label='Welcome to explored life'>
            
                <motion.img 
                initial='hidden' 
                animate='visible'
                variants={logoVariants}
                src={logo} 
                alt='explored life' 
                className='w-full max-w-2xl aspect-auto mt-[40vh] glow'
                />
                <motion.h1 
                initial='hidden' 
                animate='visible'
                variants={logoTextVariants}
                className='italic font-semibold text-xs lg:text-lg mt-9 mb-[30vh] w-fit'>
                    Bringing back the spark of travel
                </motion.h1>
        
                <ScrollForMoreIcon/>
            </section>

            
            <div className='md:p-8'>
                <motion.img 
                style={{objectPosition: `100% ${displaceY}%`}}
                src={background_img} className={`w-full h-[30vh] lg:h-fit max-h-[50vh] object-cover md:rounded-2xl shadow-md`}/>          
            </div>

            <FadeInWhenVisible>  
                <Section label='Accessibility of travel has created some problems...'>
                    <Paragraph>
                        Ever been to a place like Bali? It's way too crowded - so filled with tourists that it doesn't feel natural anymore. 
                    </Paragraph>
                    
                    <Paragraph>
                        It's disappointing when you go on holidays to escape the busy urban life, and instead end up in its epicentre...
                    </Paragraph>
                    
                    <Paragraph>
                        Wouldn't you agree?
                    </Paragraph>
                    
                    {/* <CityBubbles/> */}
                </Section>
            </FadeInWhenVisible>

            <FadeInWhenVisible>  
                <Section label='Our mission'>
                    <Paragraph>
                        We want to remove the boring shopping, endless marketing and consumption out of travel. 
                        Give it <span className='italic'>a little detox.</span>
                    </Paragraph>

                    <Paragraph>
                        <span className='font-bold'>
                        And bring you the <span className='text-3xl font-semibold'>natural</span>, the <span className='text-3xl font-semibold'>unknown</span>, the <span className='text-3xl font-semibold'>exciting</span> and the <span className='text-3xl font-semibold'>unexplored</span>.
                        </span>
                    </Paragraph>

                    <CityBubbles/>
                </Section>
            </FadeInWhenVisible>

            <FadeInWhenVisible>  
                <Section label="This is how we will do it!">
                    <Paragraph>
                        Explored.life is a platform where people of all backgrounds will be welcomed to share their wildest experiences with the rest of the world. 
                    </Paragraph>
                    
                    <Paragraph>
                        Ever (accidentaly) been on an adventure that you remember to this day? Something that made you feel alive? 
                    </Paragraph>

                    <Paragraph>
                        Then submit it to explored.life and create the opportunity for other people to experience what you did! And the best part? You can earn a compensation for it, too 😏
                    </Paragraph>

                    <Paragraph>
                        And if you haven't yet lived through an experience like that, then we'll help you do that! That is exactly our goal - to help you find and create valuable memories. Here you will be able to make new friends (perhaps you'll book a trip with a guide, who'll invite you to his home for a cup of local tea), or maybe you'll just find the best place to stargaze from in Lagos, Portugal. 
                    </Paragraph>

                </Section>
            </FadeInWhenVisible>

            <FadeInWhenVisible>
                <Section label="The platform">
                    <ParagraphContainer>
                        <h1 className='text-3xl font-semibold'>Target audience:</h1>
                        the travel plan makers, let's call them <span className='glow'>creators</span>,<br/>
                        and the travellers, or as we say: <span className='glow'>explorers</span>. 
                    </ParagraphContainer>

                    <ParagraphContainer>
                        <h1 className='text-2xl font-semibold'>Creators:</h1>
                        <ul className='space-y-3'>
                            <li>1. Create the travel plan. Choose where to go, what to visit, where to stay & eat… You decide the length of the trip and if you want to guide it yourself (in that case, you also choose how often you offer the trip, the type of travellers that are suited for it, and your desired profit margin).</li>
                            <li>2. Submit the trip for verificiation. We will evaluate your submission and create a backup plan, to ensure our explorers' safety. This is also where we can help you with completing the travel plan by making some general suggestions.</li>
                            <li>3. Launch! If your submitted plan matches all our requirements, we will post your trip in the platform, and it will be open for any travellers to check it out and book it!</li>
                        </ul>
                    </ParagraphContainer>

                    <ParagraphContainer>
                        <h1 className='text-2xl font-semibold'>Explorers:</h1>
                        <ul className='space-y-3'>
                            <li>1. Enter the platform. Scroll through the options available for you. You can select your preferences of what type of trip you are interested in. You might want it to be for a certain age group, more, or less, adventurous, with a guide or without, etc… You will also be able to check reviews and pictures of the trips offered to help you decide.</li>
                            <li>2. You see a trip you love. You book it!</li>
                            <li>3. You receive the fully-detailed travel plan. The trip will be organized for you, you will only need to take care of the travel to/from starting destination (flight/train tickets etc…).</li>
                        </ul>
                    </ParagraphContainer>
                </Section>
            </FadeInWhenVisible>
            
            {/* We aim to connect people living in the most remote, unknown places, 
                            and provide them with an opportunity to share their world with total strangers.
                            Or as we see it, upcoming friends. */}

            <FadeInWhenVisible>
                <Section label='Current progress'>
                    <p className='w-full max-w-2xl mb-10 text-justify'>
                        Our team is currently working on launching the platform as soon as possible.
                    </p>
                    <p className='w-full max-w-2xl mb-10 text-justify'>
                        If you like the idea, <span className='font-bold'>let us know</span> 😉
                    </p>

                    <SupportButton/>
                </Section>
            </FadeInWhenVisible>

            <FadeInWhenVisible>
                <Section label='Interested?'>
                    <p className='w-full max-w-2xl mb-10 text-justify'>
                        Be the first one to hear about our launch!
                        <br/><span className='font-light text-gray-500 text-sm lg:text-base'>And no, we won't bother you with useless emails. We hate spam too</span>
                    </p>
                   
                    <form className='w-full h-fit flex flex-col items-center'>
                        <input type='email'  placeholder='Email' className={`w-full max-w-2xl h-12 border-2 border-solid ${inputState.error ? 'border-red-400' : inputState.submitted? 'border-green-600' : 'border-primary'} bg-transparent rounded-2xl p-4`} onChange={(e) => {setInputState(inputState => ({...inputState, email: e.target.value}))}}/>
                        {inputState.email && <button  type='submit' className='mt-5' onClick={handleEmailSubmit}>Sign me up 🚀</button>}
                    </form>

                </Section>
            </FadeInWhenVisible>

            <div className='absolute top-2 right-2 text-transparent hover:text-primary cursor-pointer group w-32 h-10' onClick={() => setShowLogin(true)}>
                <h6 className='hidden group-hover:inline italic'>Super Secret</h6>
            </div>
        </div>
    )
}


function Section({ children, label }) {

    return (
        <section aria-label={label} className='h-fit min-h-[50vh] snap-center mt-24 relative'>
            <h1 className='w-fit h-fit min-h-[6rem] text-5xl lg:text-7xl font-bold lg:ml-48 p-4 glow'>{label}</h1>
            <div className='w-full h-full min-h-[30vh] flex flex-col items-center p-8 md:text-xl'>
                {children}
            </div>
        </section>
    )
}

function Paragraph({children}) {

    return (
        <p className='w-full max-w-2xl mb-10 text-justify z-10'>
            {children}
        </p>
    )
}

function ParagraphContainer({children}) {

    return (
        <div className='w-full max-w-2xl mb-10 text-justify z-10'>
            {children}
        </div>
    )
}


function FadeInWhenVisible({ children }) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        variants={{
          visible: { opacity: 1, scale: 1 },
          hidden: { opacity: 0, scale: 0 }
        }}
      >
        {children}
      </motion.div>
    );
  }


  
function CityBubbles() {

    const { ref, inView } = useInView();

    const variants = {
        open: {
          transition: { staggerChildren: 0.5, delayChildren: 1 }
        },
        closed: {
          transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    return (
        <motion.ul 
        ref={ref}
        initial='closed'
        animate={inView && 'open'}
        variants={variants}
        className='w-full h-full absolute hidden md:inline'>
            <CityBubble img={sceneryIllustration1} marginLeft={'30vw'} marginTop={'30vh'}/>
            <CityBubble img={sceneryIllustration2} marginLeft={'70vw'} marginTop={'13vh'}/>
            <CityBubble img={sceneryIllustration3} marginLeft={'12vw'} marginTop={'8vh'}/>
            {/* <CityBubble img={sceneryIllustration4} marginLeft={'45vw'} marginTop={'20vh'}/> */}
            <CityBubble img={sceneryIllustration5} marginLeft={'83vw'} marginTop={'0vh'}/>
            <CityBubble img={sceneryIllustration6} marginLeft={'9vw'} marginTop={'60%'}/>
            <CityBubble img={sceneryIllustration7} marginLeft={'70%'} marginTop={'40%'}/>
        </motion.ul>
    )
}

function CityBubble({img, marginLeft, marginTop}) {

    const variants = {
        open: {
          y: 0,
          opacity: 0.7,
          brightness: 0.8,
          transition: {
            y: { stiffness: 1000, velocity: -100 }
          }
        },
        closed: {
          y: 50,
          opacity: 0,
          transition: {
            y: { stiffness: 1000 }
          }
        }
      };

    return (
        <motion.li 
            whileHover={{ scale: 1.3, opacity: 1, transition: {type: 'spring', stiffness: 300} }}
            variants={variants}
            className='w-24 h-24 rounded-full overflow-hidden md:absolute border-4 border-solid border-primary' 
            style={{marginLeft: marginLeft, marginTop: marginTop}}
        >
            <img src={img} className='w-fit h-40 -mt-8 object-cover brightness-[0.35] lg:brightness-100 bg-red-500'/>
        </motion.li>
    )
}

function SupportButton() {

    const [voted, setVoted] = useState(JSON.parse(localStorage.getItem("voted")) || false)
    const [clicked, setClicked] = useState(false)

    const handleClick = () => {
        if (!voted) {
            updateStatisticsUserVote()
            localStorage.setItem("voted", JSON.stringify(true));
            setVoted(true)
        }
        setClicked(clicked => !clicked)
    }

    
    return (
        <div className='w-full md:w-fit mt-20 md:mt-0 flex space-x-32 glow'>
            <ReplyIcon className='w-32 h-32 rotate-180'/>
            <motion.div
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.9 }}  
            initial={{ y: -130 }}                  
            animate={{
                rotate: [10, 10, 20, 15, 18, 10, 10],
            }}
            transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 3,
                scale: {duration: 0.5, type: 'spring'}
            }}
            className='absolute mt-16 text-secondary'
            >
                {clicked ? <HeartIconSolid className='w-48 h-48' onClick={handleClick}/> : <HeartIcon className='w-48 h-48' onClick={handleClick}/>}
            </motion.div>
        </div>
    )
}