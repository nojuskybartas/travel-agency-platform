import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase';


function EmailLogin({handleLoginShow}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = e => {
        e.preventDefault()

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (userCredential) {
                // navigate('/')
                handleLoginShow()
            }
        })
        .catch(error => alert(error.message))

    }

    const register = e => {
        e.preventDefault()

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (userCredential) {
                handleLoginShow()
            }
        })
        .catch(error => alert(error.message))
    }

    return (
        <div className='w-full h-fit flex flex-col'>
            <form className='space-y-4 flex flex-col'>
                <h2 className='font-semibold text-lg'>Email</h2>
                <input className='w-full h-10 border border-solid border-gray-300 rounded-md p-2' type='text' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>

                <h2 className='font-semibold text-lg'>Password</h2>
                <input className='w-full h-10 border border-solid border-gray-300 rounded-md p-2' type='password' placeholder='Password' value={password} onChange={e => {setPassword(e.target.value)}}/>

                <button className='w-2/3 h-10 bg-black text-white rounded-3xl ml-auto mr-auto' onClick={signIn} type='submit'>Sign In</button>
            </form>
            <div className='flex items-center justify-between w-full'>
                <div className='bg-gray-200 w-full h-1'></div>
                <p className='w-full whitespace-nowrap p-2'>Not a member?</p>
                <div className='bg-gray-200 w-full h-1'></div>
            </div>
            
            <button className='underline font-semibold' onClick={register}>Create account</button>
        </div>
    )
}

export default EmailLogin
