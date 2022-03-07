import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import Intro from './createExperienceForm/Intro';
import FormPage from './createExperienceForm/FormPage';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { AnimatePresence, motion } from "framer-motion"
import MainIdea from './createExperienceForm/MainIdea';


export default function CreateExperienceForm2() {

    const [page, setPage] = useState(0)
    const [navOpen, setNavOpen] = useState(false)
    const [values, setValues] = useState({})

    useEffect(() => {
        console.log(values)
    }, [values])

    const handleChange = (event) => {
        setValues(values => ({...values, [event.target.name]: event.target.value}))
    }

    const nextPage = () => {
        setPage(page+1)
    }

    const previousPage = () => {
        setPage(page-1)
    }

    const renderFormPage = useCallback(() => {
        switch(page) {
            case 0:
                return <Intro nextPage={nextPage}/>
            case 1:
                return <MainIdea values={values} setValues={setValues} handleChange={handleChange}/>
            case 2:
                return <p>Expectations</p>
        }
    }, [page])

    return (
        <div className='w-full h-full flex md:rounded-2xl relative overflow-hidden'>
            {page > 0 && <Nav page={page} setPage={setPage} isOpen={navOpen} setIsOpen={setNavOpen} values={values}/>}
            <FormWrapper navOpen={navOpen}>
                {renderFormPage()}
            </FormWrapper>
        </div>
    )
}

function FormWrapper({navOpen, ...props}) {

    const form = {
        open: {
          width: '70%',
          x: '45%',
          transition: {
            delay: 0.3,
            type: "spring",
            stiffness: 100,
          }
        },
        closed: {
          width: '100%',
          x: '0%',
          transition: {
            ease: 'anticipate',
            duration: 0.6
          }
        }
    };

    return (
        <motion.div
        animate={navOpen ? "open" : "closed"}
        className='w-full h-full bg-secondary overflow-y-auto overflow-x-hidden'
        >
            <motion.form className='h-full bg-secondary' variants={form}>
                {props.children}
            </motion.form>

        </motion.div>
        
    )
}

function Nav({page, setPage, isOpen, setIsOpen, values}) {

    const validateCityLanguage = () => {
        if (!values.location) return false
        if (values.type === 'guide' && !values.language) return false
        return true
        
    }

    const validateMainIdea = () => {
        if (values.type  && values.category && validateCityLanguage()) return true
        return false
    }

    const navButton = {
        open: {
            height: '100%',
            transition: {
                ease: 'linear'
            }
        },
        closed: {
            height: '70px',
            transition: {
                ease: 'linear',
                delay: 1
            },
        }
    }

    const sidebar = {
        open: (height = 1000) => ({
          clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
          transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2
          }
        }),
        closed: {
          clipPath: "circle(27px at 40px 40px)",
          transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40
          },
        }
    };      

    return (
        <AnimatePresence exitBeforeEnter>
        
            <motion.nav 
            initial={false}
            animate={isOpen ? "open" : "closed"}
            className='absolute z-10 w-full md:w-[30%] h-full'
            variants={navButton}
            >
                <motion.div className="w-full h-full relative bg-form-navbar overflow-y-scroll" variants={sidebar}>
                
                    <FormNav>
                        <FormNavParent title='Main Idea' onClick={() => setPage(1)} selected={page === 1} complete={validateMainIdea()}>
                            <FormNavChild title='Type' onClick={() => setPage(1)} complete={values.type}/>
                            <FormNavChild title='City &#38; Language' onClick={() => setPage(1)} complete={validateCityLanguage()}/>
                            <FormNavChild title='Category' onClick={() => setPage(1)} complete={values.category}/>
                        </FormNavParent>
                        <FormNavParent title='Our Expectations' onClick={() => setPage(2)}></FormNavParent>
                        <FormNavParent title='Public Page' onClick={() => setPage(3)}></FormNavParent>
                    </FormNav>

                </motion.div>

                <MenuToggle toggle={() => setIsOpen(isOpen => !isOpen)}/>
                
            </motion.nav>
        
        </AnimatePresence>
    )
}

function FormNav(props) {
    
    const variants = {
        open: {
          transition: { staggerChildren: 0.07, delayChildren: 0.2 }
        },
        closed: {
          transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    return (
        <motion.ul variants={variants} className='absolute w-full py-3 px-4 overflow-y-auto scrollbar-hide'>
            <div className='mb-20'/>
            <h1 className='text-form-navbarText font-semibold text-3xl mb-5'>Let's get your experience published!</h1>
            {props.children}
        </motion.ul>
    )

}

function FormNavParent({title, onClick, complete, selected, ...props}) {

    const variants = {
        open: {
          y: 0,
          opacity: 1,
          transition: {
            y: { stiffness: 1000, velocity: -100 }
          }
        },
        closed: {
          y: 50,
          opacity: 0,
          transition: {
            y: { stiffness: 1000 }
          },
        }
    };

    return (
        <motion.li 
        className='w-full h-full border-2 border-solid border-form-navbarBorder rounded-2xl mt-2 px-2'
        variants={variants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        >
            <a className='w-full h-fit min-h-[3rem] cursor-pointer flex items-center justify-between' onClick={onClick}>
                <h3 className='text-form-navbarText'>{title}</h3>
                {complete ? <CheckCircleIcon className='w-5 h-5 text-form-navbarBorderActive'/> : <ExclamationCircleIcon className='w-5 h-5 text-form-navbarBorder'/>}
            </a> 
            <ul>
            {selected && props.children}
            </ul>
            
        </motion.li>
    )
}

function FormNavChild({title, onClick, complete}) {

    return (
        <li className='w-full h-fit min-h-7 text-sm mb-2'>
            <a className='w-full h-fit flex items-center justify-between cursor-pointer' onClick={onClick}>
                <h4 className='text-form-navbarText'>{title}</h4>
                {complete ? <CheckCircleIcon className='w-5 h-5 text-form-navbarBorderActive'/> : <ExclamationCircleIcon className='w-5 h-5 text-form-navbarBorder'/>}
            </a>
        </li>
    )
}

function MenuToggle({toggle}){

    return (
        <button onClick={toggle} className='absolute top-[17px] left-[17px] w-12 h-12 rounded-full flex items-center justify-center'>
            <svg width="23" height="23" viewBox="0 0 23 23" className='stroke-form-navbarText'>
            <Path
                variants={{
                closed: { d: "M 2 2.5 L 20 2.5" },
                open: { d: "M 3 16.5 L 17 2.5" }
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                closed: { d: "M 2 16.346 L 20 16.346" },
                open: { d: "M 3 2.5 L 17 16.346" }
                }}
            />
            </svg>
        </button>
    )
}

const Path = props => (
    <motion.path
      fill='transparent'
      strokeWidth="3"
      strokeLinecap="round"
      {...props}
    />
  );




