import React, { useState, useContext } from 'react'
import { User, Lock, Mail } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthProvider'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(location.state?.type === 'admin')
    const { userData, setCurrentUser } = useContext(AuthContext)

    const submitHandler = (e) => {
        e.preventDefault()

        if (isAdmin && email === 'admin' && password === 'admin@123') {
            const user = { role: 'admin' }
            setCurrentUser(user)
            localStorage.setItem('loggedInUser', JSON.stringify(user))
            navigate('/admin/dashboard')
        } else if (userData) {
            const employee = userData.find((e) => email === e.email && e.password === password)
            if (employee) {
                const user = { role: 'employee', data: employee }
                setCurrentUser(user)
                localStorage.setItem('loggedInUser', JSON.stringify(user))
                navigate('/employee/dashboard')
            } else {
                alert("Invalid Credentials")
            }
        } else {
            alert("Invalid Credentials")
        }

        setEmail("")
        setPassword("")
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-slate-50'>
            <div className='relative w-full max-w-md p-8'>
                {/* Decorative background effects - Varied based on type */}
                <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ${isAdmin ? 'bg-purple-300' : 'bg-gray-300'}`}></div>
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 ${isAdmin ? 'bg-indigo-300' : 'bg-slate-300'}`}></div>

                <div className='bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 relative z-10'>
                    <div className='text-center mb-8'>
                        <h2 className='text-3xl font-bold mb-2 text-gray-900'>
                            {isAdmin ? 'Admin Portal' : 'Employee Login'}
                        </h2>
                        <p className='text-sm text-gray-500'>
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form
                        onSubmit={submitHandler}
                        className='flex flex-col gap-5'
                    >
                        {/* Toggle User Type */}
                        <div className='flex justify-center mb-2'>
                            <button
                                type="button"
                                onClick={() => setIsAdmin(!isAdmin)}
                                className='text-xs text-blue-600 hover:underline'
                            >
                                Switch to {isAdmin ? 'Employee' : 'Admin'} Login
                            </button>
                        </div>

                        <div>
                            <label className='text-xs font-bold uppercase tracking-wider mb-1 block ml-1 text-gray-600'>
                                {isAdmin ? 'Username' : 'Email Address'}
                            </label>
                            <div className='relative'>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`w-full border text-sm rounded-lg focus:ring-2 block p-3 pl-10 outline-none transition-all bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 ${isAdmin
                                        ? 'focus:ring-purple-500 focus:border-purple-500'
                                        : 'focus:ring-gray-500 focus:border-gray-500'
                                        }`}
                                    type="text"
                                    placeholder={isAdmin ? 'admin' : 'suneetha@gmail.com'}
                                />
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                                    {isAdmin ? <User size={18} /> : <Mail size={18} />}
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className='text-xs font-bold uppercase tracking-wider mb-1 block ml-1 text-gray-600'>
                                Password
                            </label>
                            <div className='relative'>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`w-full border text-sm rounded-lg focus:ring-2 block p-3 pl-10 outline-none transition-all bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 ${isAdmin
                                        ? 'focus:ring-purple-500 focus:border-purple-500'
                                        : 'focus:ring-gray-500 focus:border-gray-500'
                                        }`}
                                    type="password"
                                    placeholder='••••••••'
                                />
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                                    <Lock size={18} />
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-between text-xs mt-1 text-gray-500'>
                            <label className='flex items-center gap-2 cursor-pointer hover:opacity-80'>
                                <input type="checkbox" className={`rounded border-gray-700 focus:ring-offset-0 focus:ring-0 bg-gray-200 ${isAdmin ? 'text-purple-600' : 'text-gray-600'}`} />
                                Remember me
                            </label>
                            <a href="#" className={`transition-colors ${isAdmin ? 'hover:text-purple-600' : 'hover:text-gray-900'}`}>Forgot password?</a>
                        </div>

                        <button className={`mt-4 w-full font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:translate-y-[-1px] shadow-lg text-white ${isAdmin
                            ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'
                            : 'bg-gray-800 hover:bg-gray-900 shadow-gray-500/20'
                            }`}>
                            Sign In
                        </button>
                    </form>

                    <div className='mt-8 text-center text-xs text-gray-500'>
                        <p className='uppercase tracking-widest opacity-70 mb-2'>Demo Credentials</p>
                        {isAdmin ? (
                            <p className='font-mono bg-gray-100 py-2 rounded border border-gray-200'>
                                <span className='text-purple-600 font-bold'>admin</span> / <span className='text-purple-600 font-bold'>admin@123</span>
                            </p>
                        ) : (
                            <p className='font-mono bg-gray-100 py-2 rounded border border-gray-200'>
                                <span className='text-gray-700 font-bold'>suneetha@gmail.com</span> / <span className='text-gray-700 font-bold'>suni@123</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
