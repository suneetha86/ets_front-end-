import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { getLocalStorage } from '../../../utils/localStorage'
import { createAdminEmployee, registerEmployee, createProfile } from '../../../api/employeeApi'
import { fetchDepartments } from '../../../api/departmentApi'
import { postUser } from '../../../api/userApi'

import { Loader2, UserPlus } from 'lucide-react'

const AddUser = () => {

    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [department, setDepartment] = useState('')
    const [phone, setPhone] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' })
    const { userData, setUserData } = useContext(AuthContext)

    const [deptOptions, setDeptOptions] = useState([])
    const [isLoadingDepts, setIsLoadingDepts] = useState(true)

    useEffect(() => {
        const loadDepts = async () => {
            try {
                setIsLoadingDepts(true)
                const data = await fetchDepartments()
                setDeptOptions(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to synchronize departments:", error)
            } finally {
                setIsLoadingDepts(false)
            }
        }
        loadDepts()
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Prepare high-density payload for admin-specific backend API
            const adminEmployeePayload = {
                name: firstName,
                designation: department || "Developer",
                email: email,
                phone: phone,
                pendingTasks: 0,
                completedTasks: 0,
                failedTasks: 0,
                active: true
            }

            console.log("Syncing with Admin Repository:", adminEmployeePayload)
            const response = await createAdminEmployee(adminEmployeePayload)
            console.log("Admin API Response:", response)

            // Prepare registration payload for global employee auth service
            const registerPayload = {
                username: firstName,
                email: email,
                password: password,
                role: 'employee'
            }

            console.log("Initializing Global Registration:", registerPayload)
            const registerResponse = await registerEmployee(registerPayload)
            console.log("Registration API Response:", registerResponse)

            // Primary User Integration: POST /api/users
            const userPayload = {
                nameUsername: firstName,
                emailAddress: email,
                accessPassword: password,
                phone: phone,
                dept: department || "General"
            }
            
            console.log("Transmitting identity parameters to User Repository:", userPayload)
            const userResponse = await postUser(userPayload)
            console.log("User API Response:", userResponse)
            
            // Strategic Profile Initialization: POST /api/profiles/create
            const profilePayload = {
                profileImage: "profile1.png",
                name: firstName,
                designation: department || "Developer",
                systemName: "AJABench System",
                cohort: "C2",
                location: "Hyderabad, India",
                email: email,
                phone: phone,
                employeeId: String(response.id || "5"),
                attendance: 100,
                codingScore: 0
            };

            console.log("Initializing Digital Identity in core repository:", profilePayload)
            const profileResponse = await createProfile(profilePayload)
            console.log("Profile Initialization Complete:", profileResponse)


            // Update local state for immediate UI feedback
            const newUser = {
                ...response,
                firstName: response.name || firstName,
                id: response.id || Date.now(),
                active: true,
                password: password, // Store password for local login fallback
                taskCounts: { 
                    active: response.pendingTasks || 0, 
                    newTask: 0, 
                    completed: response.completedTasks || 0, 
                    failed: response.failedTasks || 0 
                }
            }

            const updatedData = [...userData, newUser]
            setUserData(updatedData)
            localStorage.setItem('employees', JSON.stringify(updatedData))

            setModal({
                show: true,
                title: "Node Established",
                message: `Node "${firstName}" successfully established in the administrative directory. Identity and profile datasets have been synchronized.`,
                type: 'success'
            });

            // Reset Form Layer
            setFirstName('')
            setEmail('')
            setPassword('')
            setDepartment('')
            setPhone('')

        } catch (error) {
            console.error("Administrative Sync Failure:", error)
            setModal({
                show: true,
                title: "Link Error",
                message: "Critical Link Error: Unable to synchronize with the Administrative Gateway. Identity propagation failed.",
                type: 'error'
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='p-8 bg-gray-50/30 shadow-sm border border-gray-100 rounded-xl flex justify-center items-center h-full overflow-auto'>
            <form onSubmit={submitHandler} className='flex flex-col w-full max-w-lg p-10 border border-purple-100 rounded-3xl bg-white shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-purple-100/50'>
                <div className='absolute top-0 left-0 w-full h-1.5 bg-purple-600 animate-pulse'></div>
                <h2 className='text-3xl font-black mb-2 text-purple-900 text-center tracking-tight'>Employee Registration</h2>
                <p className='text-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-10'>Add new member to the workspace</p>

                <div className='w-full mb-6'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1'>Name / Username</label>
                    <input
                        required
                        value={firstName}
                        disabled={isSubmitting}
                        onChange={(e) => { setFirstName(e.target.value) }}
                        className='w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-300 transition-all font-bold text-sm' type="text" placeholder='e.g. Keerthi'
                    />
                </div>

                <div className='w-full mb-6'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1'>Email Address</label>
                    <input
                        required
                        value={email}
                        disabled={isSubmitting}
                        onChange={(e) => { setEmail(e.target.value) }}
                        className='w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-300 transition-all font-bold text-sm' type="email" placeholder='keerthi@example.com'
                    />
                </div>

                <div className='w-full mb-6'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1'>Access Password</label>
                    <input
                        required
                        value={password}
                        disabled={isSubmitting}
                        onChange={(e) => { setPassword(e.target.value) }}
                        className='w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-300 transition-all font-bold text-sm' type="password" placeholder='Minimum 6 characters'
                    />
                </div>

                <div className='grid grid-cols-2 gap-4 mb-10'>
                    <div className='w-full'>
                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1'>Phone</label>
                        <input
                            required
                            value={phone}
                            disabled={isSubmitting}
                            onChange={(e) => { setPhone(e.target.value) }}
                            className='w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-300 transition-all font-bold text-sm' type="text" placeholder='+91 999...'
                        />
                    </div>
                    <div className='w-full'>
                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1'>Dept</label>
                        <select
                            required
                            value={department}
                            disabled={isSubmitting}
                            onChange={(e) => { setDepartment(e.target.value) }}
                            className='w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 transition-all font-bold text-sm appearance-none cursor-pointer'
                        >
                            <option value="" className='text-gray-500'>Select</option>
                            {deptOptions.map(dept => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
                            {!deptOptions.length && <option value="General">General</option>}
                        </select>
                    </div>
                </div>

                <button 
                    disabled={isSubmitting}
                    className='w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-black py-5 px-4 rounded-2xl transition-all shadow-xl shadow-purple-200 hover:-translate-y-1 transform active:scale-[0.98] flex items-center justify-center gap-3 group'
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                    {isSubmitting ? 'Finalizing Setup...' : 'Register Employee'}
                    {!isSubmitting && <div className='w-2 h-2 rounded-full bg-white group-hover:scale-150 transition-all'></div>}
                </button>
            </form>

            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${
                            modal.type === 'success' ? 'bg-emerald-500' : 
                            modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                        }`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                <UserPlus size={100} className="text-white" />
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <UserPlus className="text-emerald-500" size={32} /> : 
                                 <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold">!</div>}
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl text-white tracking-tight">{modal.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                                {modal.message}
                            </p>
                            <button 
                                onClick={() => setModal({ ...modal, show: false })}
                                className={`w-full py-4 ${
                                    modal.type === 'success' ? 'bg-emerald-500' : 
                                    modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-600'
                                } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                            >
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddUser
