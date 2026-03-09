import React, { useState, useContext } from 'react'
import { User, Lock, Mail } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthProvider'
import { adminLogin, adminForgotPassword, registerEmployee, employeeLogin, employeeForgotPassword } from '../../api/employeeApi'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(location.state?.type === 'admin')
    const { userData, setUserData, setCurrentUser } = useContext(AuthContext)

    const submitHandler = async (e) => {
        e.preventDefault()

        if (isAdmin) {
            try {
                // Determine whether backend expects 'username' or 'email'
                // Assuming email based on standard and the payload we know
                const response = await adminLogin({ email, password });

                if (response.token) {
                    const user = { role: 'admin', token: response.token }
                    setCurrentUser(user)
                    localStorage.setItem('loggedInUser', JSON.stringify(user))
                    localStorage.setItem('adminToken', response.token) // store token separately if needed
                    navigate('/admin/dashboard')
                } else {
                    alert(response.message || "Invalid Admin Credentials")
                }
            } catch (error) {
                console.error("Admin login failed:", error);
                alert("Login failed. Please check your credentials.");
            }
        } else {
            // Employee Login Integration
            try {
                const response = await employeeLogin({ email, password });

                // Handling both string "Login successful" and object responses
                const isSuccess = typeof response === 'string'
                    ? response.includes("successful")
                    : (response.token || response.id || response.message?.includes("successful"));

                if (isSuccess) {
                    const user = {
                        role: 'employee',
                        data: typeof response === 'object' ? response : { email },
                        token: response.token
                    }
                    setCurrentUser(user)
                    localStorage.setItem('loggedInUser', JSON.stringify(user))
                    navigate('/employee/dashboard')
                } else {
                    alert(response.message || "Invalid Credentials")
                }
            } catch (error) {
                console.error("Employee login failed:", error);

                // Fallback to local data for offline/dev mode if API fails
                if (userData) {
                    const employee = userData.find((e) => email === e.email && e.password === password)
                    if (employee) {
                        const user = { role: 'employee', data: employee }
                        setCurrentUser(user)
                        localStorage.setItem('loggedInUser', JSON.stringify(user))
                        navigate('/employee/dashboard')
                        return;
                    }
                }
                alert("Login failed. Please check your network or credentials.");
            }
        }

        // Only clear password, keeping email is good UX
        setPassword("")
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            alert("Please enter your Operator ID / Email first.");
            return;
        }

        if (isAdmin) {
            try {
                const response = await adminForgotPassword({ email });
                alert(response.message || "If account exists, reset link sent.");
            } catch (error) {
                console.error("Forgot password failed:", error);
                alert("Failed to send reset request.");
            }
        } else {
            try {
                // Email-based verification for employees
                const response = await employeeForgotPassword({ email });

                // Handle string or object responses
                const message = typeof response === 'string' ? response : (response.message || "");
                if (message.includes("verified")) {
                    alert(message);
                    // Navigate if needed, or just let them know
                } else {
                    alert(message || "Email verified. You can reset your password now");
                }
            } catch (error) {
                console.error("Employee password verification failed:", error);
                alert("Verification failed. Please check your email.");
            }
        }
    }

    return (
        <div
            className='flex h-screen w-screen overflow-hidden font-sans'
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Background Overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-purple-900/85 to-purple-800/90'></div>

            {/* Left Side: Illustration/Image */}
            <div
                className='hidden lg:flex lg:w-1/2 relative overflow-hidden'
                style={{
                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-purple-900/60'></div>

                <div className='relative z-10 flex flex-col justify-between p-16 h-full text-white'>
                    <div className='flex items-center gap-4'>
                        <img
                            src="../../assets/aja-logo.png"
                            alt="AJA Logo"
                            className='w-12 h-12 bg-white/20 rounded-2xl object-contain shadow-2xl'
                        />
                        <h1 className='text-3xl font-black tracking-widest uppercase'>AJA</h1>
                    </div>

                    <div className='max-w-lg'>
                        <h2 className='text-6xl font-black leading-none tracking-tighter mb-4'>
                            AJA <br />
                            <span className='text-cyan-300'>Systems.</span>
                        </h2>
                        <p className='text-indigo-100 text-lg font-medium leading-relaxed opacity-95 max-w-sm'>
                            Elevating structural intelligence through precision architecture and integrated protocols.
                        </p>
                    </div>

                    <div className='flex items-center gap-8'>
                        {/* <div className='flex flex-col'>
                            <span className='text-3xl font-black text-white'>v3.1</span>
                            <span className='text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]'>System Core</span>
                        </div> */}
                        <div className='h-12 w-px bg-white/20'></div>
                        {/* <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                            <span className='text-[10px] text-slate-400 font-black uppercase tracking-widest'>Encryption Active</span>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white to-indigo-50 relative z-20'>
                {/* Mobile Logo Only */}
                <div className='absolute top-8 left-8 flex items-center gap-3 lg:hidden'>
                    <img
                        src="../../assets/aja-logo.png"
                        alt="AJA Logo"
                        className='w-8 h-8 rounded-lg object-contain'
                    />
                    <span className='font-black text-sm uppercase tracking-widest text-indigo-900'>AJA</span>
                </div>

                <div className='w-full max-w-md'>
                    <div className='mb-10'>
                        <h2 className='text-4xl font-black text-indigo-900 tracking-tight mb-2'>
                            {isAdmin ? 'Admin' : 'Employee'} Login
                        </h2>
                        <p className='text-indigo-600 font-medium'>
                            Input your credentials to initialize session.
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='space-y-1.5'>
                            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 ml-1'>
                                {isAdmin ? 'Operator ID' : 'Network Identity'}
                            </label>
                            <div className='relative group'>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className='w-full border-2 border-indigo-200 bg-white text-sm rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-indigo-600 focus:bg-indigo-50 text-indigo-900 group-hover:border-indigo-300'
                                    type="text"
                                    placeholder={isAdmin ? 'Operator-01' : 'user@aja.network'}
                                />
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400 group-focus-within:text-indigo-600 transition-colors'>
                                    {isAdmin ? <User size={20} /> : <Mail size={20} />}
                                </div>
                            </div>
                        </div>

                        <div className='space-y-1.5'>
                            <div className='flex justify-between items-center px-1'>
                                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700'>Access Key</label>
                                <button type="button" onClick={handleForgotPassword} className='text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700'>Recovery?</button>
                            </div>
                            <div className='relative group'>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className='w-full border-2 border-indigo-200 bg-white text-sm rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-indigo-600 focus:bg-indigo-50 text-indigo-900 group-hover:border-indigo-300'
                                    type="password"
                                    placeholder='••••••••'
                                />
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400 group-focus-within:text-indigo-600 transition-colors'>
                                    <Lock size={20} />
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 px-1'>
                            <input type="checkbox" id="remember" className='w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer' />
                            <label htmlFor="remember" className='text-xs font-bold text-indigo-600 cursor-pointer select-none'>Maintain Active Connection</label>
                        </div>

                        <div className='pt-2'>
                            <button className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-300 hover:shadow-indigo-400 active:scale-[0.98] uppercase tracking-[0.2em] text-xs'>
                                Login
                            </button>
                        </div>
                    </form>

                    <div className='mt-8 pt-8 border-t border-indigo-200 flex flex-col gap-4'>
                        <button
                            type="button"
                            onClick={() => setIsAdmin(!isAdmin)}
                            className='w-full py-4 border-2 border-indigo-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300 transition-all'
                        >
                            Switch to {isAdmin ? 'Standard Member' : 'System Commander'} Terminal
                        </button>

                        <div className='bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl border border-indigo-300'>
                            <p className='text-[9px] font-black text-indigo-700 uppercase tracking-widest mb-2 opacity-70 text-center'>Sandbox Node Access</p>
                            <div className='text-[11px] font-mono text-center'>
                                {isAdmin ? (
                                    <span className='text-indigo-800'>ID: <b className='text-indigo-600'>admin</b> | KEY: <b className='text-indigo-600'>admin@123</b></span>
                                ) : (
                                    <span className='text-indigo-800'>ID: <b className='text-indigo-700'>suneetha@gmail.com</b> | KEY: <b className='text-indigo-700'>suni@123</b></span>
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
