import React, { useState } from 'react'
import { Link } from "react-router-dom";
import AuthService from '../services/AuthService';
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const {currentUser} = useAuth()

    if(currentUser) {
        navigate('/profile');
    }

    const handleSignin = async () => {

        try {
            await AuthService.login(email, password);
            // Redirect to login or dashboard page
        } catch (error) {
            alert(error.message);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSignin();
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="mt-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Sign in
                </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{' '}
                <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Start a 14 day free trial
                </Link>
            </p>
        </form>
    );
}

export default LoginPage