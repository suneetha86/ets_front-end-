import React, { useState, useContext } from 'react'
import { User, Lock, Mail, AlertTriangle, CheckCircle, X, Eye, EyeOff } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthProvider'
import { adminLogin, adminForgotPassword, registerEmployee, employeeLogin, employeeForgotPassword } from '../../api/employeeApi'
import loginBg from '../../assets/login-bg.png'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isAdmin, setIsAdmin] = useState(location.state?.type === 'admin')
    const [loading, setLoading] = useState(false)
    const { userData, setUserData, setCurrentUser } = useContext(AuthContext)

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [modalType, setModalType] = useState('error') // 'error' or 'success'

    const showAlert = (message, type = 'error') => {
        setModalMessage(message)
        setModalType(type)
        setShowModal(true)
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isAdmin) {
                const response = await adminLogin({ email, password });

                if (response.token) {
                    const user = { role: 'admin', token: response.token }
                    setCurrentUser(user)
                    localStorage.setItem('loggedInUser', JSON.stringify(user))
                    localStorage.setItem('adminToken', response.token) // store token separately if needed
                    navigate('/admin/dashboard')
                } else {
                    showAlert(response.message || "Invalid Admin Credentials")
                }
            } else {
                // Employee Login Integration
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
                    showAlert(response.message || "Invalid Credentials")
                }
            }
        } catch (error) {
            console.error(isAdmin ? "Admin login failed:" : "Employee login failed:", error);

            if (!isAdmin && userData) {
                // Fallback to local data for offline/dev mode if API fails
                const employee = userData.find((e) => email === e.email && e.password === password)
                if (employee) {
                    const user = { role: 'employee', data: employee }
                    setCurrentUser(user)
                    localStorage.setItem('loggedInUser', JSON.stringify(user))
                    navigate('/employee/dashboard')
                    return; // Early return prevents loading state from being cleared if we navigate
                }
            }

            const descriptiveError = error.apiMessage || "Login failed. Please check your credentials.";
            showAlert(descriptiveError);
        } finally {
            setLoading(false)
        }

        // Only clear password, keeping email is good UX
        setPassword("")
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            showAlert("Please enter your Operator ID / Email first.");
            return;
        }

        if (isAdmin) {
            try {
                const response = await adminForgotPassword({ email });
                showAlert(response.message || "If account exists, reset link sent.", "success");
            } catch (error) {
                console.error("Forgot password failed:", error);
                showAlert("Failed to send reset request.");
            }
        } else {
            try {
                // Email-based verification for employees
                const response = await employeeForgotPassword({ email });

                // Handle string or object responses
                const message = typeof response === 'string' ? response : (response.message || "");
                if (message.includes("verified")) {
                    showAlert(message, "success");
                    // Navigate if needed, or just let them know
                } else {
                    showAlert(message || "Email verified. You can reset your password now", "success");
                }
            } catch (error) {
                console.error("Employee password verification failed:", error);
                showAlert("Verification failed. Please check your email.");
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
            <div className='absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-purple-900/85 to-purple-800/90'></div>

            <div
                className='hidden lg:flex lg:w-1/2 relative overflow-hidden'
                style={{
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
            </div>

            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white to-indigo-50 relative z-20'>

                <div className='w-full max-w-md'>
                    <div className='mb-10'>
                        {/* Logo and Company Name */}

                        <h2 className='text-4xl font-black text-indigo-900 tracking-tight mb-2 text-center'>
                            {isAdmin ? 'Admin' : 'Employee'} Login
                        </h2>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='space-y-1.5'>
                            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 ml-1'>
                                {isAdmin ? 'Admin Username' : 'Email Address'}
                            </label>
                            <div className='relative group'>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className='w-full border-2 border-indigo-200 bg-white text-sm rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-indigo-600 focus:bg-indigo-50 text-indigo-900 group-hover:border-indigo-300'
                                    type="text"
                                    placeholder={isAdmin ? 'Username' : 'user@aja.network'}
                                />
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400 group-focus-within:text-indigo-600 transition-colors'>
                                    {isAdmin ? <User size={20} /> : <Mail size={20} />}
                                </div>
                            </div>
                        </div>

                        <div className='space-y-1.5'>
                            <div className='flex justify-between items-center px-1'>
                                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700'>Password</label>

                            </div>
                            <div className='relative group'>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className='w-full border-2 border-indigo-200 bg-white text-sm rounded-2xl block p-4 pl-12 pr-12 outline-none transition-all focus:border-indigo-600 focus:bg-indigo-50 text-indigo-900 group-hover:border-indigo-300'
                                    type={showPassword ? "text" : "password"}
                                    placeholder={isAdmin ? 'Password' : '••••••••'}
                                />
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400 group-focus-within:text-indigo-600 transition-colors'>
                                    <Lock size={20} />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400 hover:text-indigo-600 transition-colors'
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>


                        <div className='pt-2'>
                            <button
                                disabled={loading}
                                className={`w-full ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98] uppercase tracking-[0.2em] text-xs`}
                            >
                                {loading ? 'Authenticating...' : 'Login In'}
                            </button>
                        </div>
                    </form>

                    <div className='mt-8 pt-8 border-t border-indigo-200 flex flex-col gap-4'>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAdmin(!isAdmin)
                                setEmail('')
                                setPassword('')
                            }}
                            className='w-full py-4 border-2 border-indigo-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300 transition-all'
                        >
                            Switch to {isAdmin ? 'Employee' : 'Admin'}
                        </button>

                        <div className='bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl border border-indigo-300'>
                            <p className='text-[9px] font-black text-indigo-700 uppercase tracking-widest mb-2 opacity-70 text-center'>Sandbox Node Access</p>
                            <div className='text-[11px] font-mono text-center'>
                                {isAdmin ? (
                                    <span className='text-indigo-800'>ID: <b className='text-indigo-600'>admin@example.com</b> | KEY: <b className='text-indigo-600'>123</b></span>
                                ) : (
                                    <span className='text-indigo-800'>ID: <b className='text-indigo-700'>suneetha@aja.com</b> | KEY: <b className='text-indigo-700'>123</b></span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-black/10 rounded-full transition-colors z-20"
                        >
                            <X size={20} className={modalType === 'success' ? 'text-white' : 'text-gray-400'} />
                        </button>

                        <div className={`p-10 flex flex-col items-center gap-4 relative overflow-hidden ${modalType === 'success' ? 'bg-emerald-500' : 'bg-rose-50'}`}>
                            {modalType === 'success' ? (
                                <>
                                    <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                        <CheckCircle size={120} />
                                    </div>
                                    <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/20 animate-bounce">
                                        <CheckCircle className="text-emerald-500" size={40} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="font-black text-2xl text-white tracking-tight">Success</h3>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="absolute top-2 right-4 opacity-5 rotate-12">
                                        <AlertTriangle size={120} className="text-rose-500" />
                                    </div>
                                    <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-rose-200 animate-in zoom-in">
                                        <AlertTriangle className="text-rose-500" size={40} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="font-black text-2xl text-rose-900 tracking-tight">Notice</h3>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-8">
                            <p className="text-slate-700 font-bold text-sm leading-relaxed text-center">
                                {modalMessage}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 ${modalType === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                                >
                                    Acknowledge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default Login
