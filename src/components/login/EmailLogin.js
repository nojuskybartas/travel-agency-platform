import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase';


function EmailLogin({handleLoginShow, setParentState}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    const signIn = e => {
        e.preventDefault()

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (userCredential) {
                navigate('/home')
                handleLoginShow()
            }
        })
        .catch(error => {
            setError(error.code)
            switch (error.code) {
                case 'auth/wrong-password':
                    console.log('wrong pass')
                    break
                case 'auth/user-not-found':
                    console.log('user not found')
                    break
                case 'auth/network-request-failed':
                    console.log('check network')
                    break
                case 'auth/too-many-requests':
                    console.log('too many requests')
                    break
                case 'auth/user-disabled':
                    console.log('user banned')
                    break
                default:
                    console.log(error.code)
            }
        })

    }

    return (
        <div className='w-full h-fit flex flex-col'>
            <form className='space-y-4 flex flex-col'>
                <h2 className='font-semibold text-lg'>Email</h2>
                <input className={`w-full h-10 border border-solid ${error === 'auth/user-not-found' ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`} type='text' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>

                <h2 className='font-semibold text-lg'>Password</h2>
                <input className={`w-full h-10 border border-solid ${error === 'auth/wrong-password' ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`} type='password' placeholder='Password' value={password} onChange={e => {setPassword(e.target.value)}}/>
                <button className='w-2/3 h-10 bg-black text-white rounded-3xl ml-auto mr-auto' onClick={signIn} type='submit'>Sign In</button>
            </form>
            <div className='flex items-center justify-between w-full'>
                <div className='bg-gray-200 w-full h-1'></div>
                <p className='w-fit whitespace-nowrap p-2'>Not a member?</p>
                <div className='bg-gray-200 w-full h-1'></div>
            </div>
            
            {/*  */}
            <button className='underline font-semibold' onClick={() => setParentState('registerEmail')}>Create account</button>
        </div>
    )
}

export default EmailLogin
