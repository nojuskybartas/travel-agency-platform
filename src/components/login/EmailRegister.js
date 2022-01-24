import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react'
import { auth } from '../../lib/firebase';


function EmailRegister({handleLoginShow}) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = e => {
        e.preventDefault()

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (userCredential) {
                updateProfile(userCredential.user, {
                    displayName: name,
                    photoURL: `https://avatars.dicebear.com/api/big-smile/${name}.svg`
                })
                console.log(userCredential.user)
                handleLoginShow()
                
            }
        })
        .catch(error => alert(error.message))
    }

    return (
        <div className='w-full h-fit flex flex-col'>
            <img className='bg-gray-900 rounded-full h-20 w-20 mr-auto ml-auto md:translate-y-6' src={`https://avatars.dicebear.com/api/big-smile/${name}.svg`} />
            <form className='space-y-3 flex flex-col'>
                <h2 className='font-semibold text-lg'>Full Name</h2>
                <input className='w-full h-10 border border-solid border-gray-300 rounded-md p-2' type='text' placeholder='Full Name' value={name} onChange={e => setName(e.target.value)}/>

                <h2 className='font-semibold text-lg'>Email</h2>
                <input className='w-full h-10 border border-solid border-gray-300 rounded-md p-2' type='text' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>

                <h2 className='font-semibold text-lg'>Password</h2>
                <input className='w-full h-10 border border-solid border-gray-300 rounded-md p-2' type='password' placeholder='Password' value={password} onChange={e => {setPassword(e.target.value)}}/>

                <button className='w-2/3 h-10 bg-black text-white rounded-3xl ml-auto mr-auto' onClick={register} type='submit'>Sign Up</button>
            </form>
        </div>
    )
}

export default EmailRegister
