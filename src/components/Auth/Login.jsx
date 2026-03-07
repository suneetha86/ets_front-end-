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
        <div className='flex h-screen w-screen bg-white overflow-hidden font-sans'>
            {/* Left Side: Illustration/Image */}
            <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900'>
                <img
                    src="../../assets/aja-login-hero.png"
                    alt="AJA Branding Architecture"
                    className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000'
                />
                <div className='absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/60 to-purple-900/80'></div>

                <div className='relative z-10 flex flex-col justify-between p-16 h-full text-white'>
                    <div className='flex items-center gap-4'>
                        <img
                            src="../../assets/aja-logo.png"
                            alt="AJA Logo"
                            className='w-12 h-12 bg-white rounded-2xl object-contain shadow-2xl'
                        />
                        <h1 className='text-3xl font-black tracking-widest uppercase'>AJA</h1>
                    </div>

                    <div className='max-w-lg'>
                        <h2 className='text-6xl font-black leading-none tracking-tighter mb-4'>
                            AJA <br />
                            <span className='text-blue-400'>Systems.</span>
                        </h2>
                        <p className='text-slate-200 text-lg font-medium leading-relaxed opacity-90 max-w-sm'>
                            Elevating structural intelligence through precision architecture and integrated protocols.
                        </p>
                    </div>

                    <div className='flex items-center gap-8'>
                        <div className='flex flex-col'>
                            <span className='text-3xl font-black text-white'>v3.1</span>
                            <span className='text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]'>System Core</span>
                        </div>
                        <div className='h-12 w-px bg-white/20'></div>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                            <span className='text-[10px] text-slate-400 font-black uppercase tracking-widest'>Encryption Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative'>
                {/* Mobile Logo Only */}
                <div className='absolute top-8 left-8 flex items-center gap-3 lg:hidden'>
                    <img
                        src="../../assets/aja-logo.png"
                        alt="AJA Logo"
                        className='w-8 h-8 rounded-lg object-contain'
                    />
                    <span className='font-black text-sm uppercase tracking-widest text-slate-800'>AJA</span>
                </div>

                <div className='w-full max-w-md'>
                    <div className='mb-10'>
                        <h2 className='text-4xl font-black text-slate-900 tracking-tight mb-2'>
                            {isAdmin ? 'Commander Sync' : 'Access Terminal'}
                        </h2>
                        <p className='text-slate-500 font-medium'>
                            Input your encrypted credentials to initialize session.
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='space-y-1.5'>
                            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                                {isAdmin ? 'Operator ID' : 'Network Identity'}
                            </label>
                            <div className='relative group'>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className='w-full border-2 border-slate-100 bg-slate-50 text-sm rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-blue-500 focus:bg-white text-slate-900 group-hover:border-slate-200'
                                    type="text"
                                    placeholder={isAdmin ? 'Operator-01' : 'user@aja.network'}
                                />
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                                    {isAdmin ? <User size={20} /> : <Mail size={20} />}
                                </div>
                            </div>
                        </div>

                        <div className='space-y-1.5'>
                            <div className='flex justify-between items-center px-1'>
                                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>Access Key</label>
                                <a href="#" className='text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700'>Recovery?</a>
                            </div>
                            <div className='relative group'>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className='w-full border-2 border-slate-100 bg-slate-50 text-sm rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-blue-500 focus:bg-white text-slate-900 group-hover:border-slate-200'
                                    type="password"
                                    placeholder='••••••••'
                                />
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                                    <Lock size={20} />
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 px-1'>
                            <input type="checkbox" id="remember" className='w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer' />
                            <label htmlFor="remember" className='text-xs font-bold text-slate-500 cursor-pointer select-none'>Maintain Active Connection</label>
                        </div>

                        <div className='pt-2'>
                            <button className='w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 hover:shadow-slate-300 active:scale-[0.98] uppercase tracking-[0.2em] text-xs'>
                                Authenticate Session
                            </button>
                        </div>
                    </form>

                    <div className='mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4'>
                        <button
                            type="button"
                            onClick={() => setIsAdmin(!isAdmin)}
                            className='w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-100 transition-all'
                        >
                            Switch to {isAdmin ? 'Standard Member' : 'System Commander'} Terminal
                        </button>

                        <div className='bg-slate-50 p-4 rounded-xl border border-slate-100'>
                            <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-60 text-center'>Sandbox Node Access</p>
                            <div className='text-[11px] font-mono text-center'>
                                {isAdmin ? (
                                    <span className='text-slate-600'>ID: <b className='text-blue-600'>admin</b> | KEY: <b className='text-blue-600'>admin@123</b></span>
                                ) : (
                                    <span className='text-slate-600'>ID: <b className='text-slate-800'>suneetha@gmail.com</b> | KEY: <b className='text-slate-800'>suni@123</b></span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
