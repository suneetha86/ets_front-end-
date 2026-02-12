import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { getLocalStorage } from '../../../utils/localStorage'

const AddUser = () => {

    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [department, setDepartment] = useState('')
    const [phone, setPhone] = useState('')
    const { userData, setUserData } = useContext(AuthContext)

    const [deptOptions, setDeptOptions] = useState([])

    useEffect(() => {
        const { departments } = getLocalStorage()
        if (departments) setDeptOptions(departments)
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()

        const newUser = {
            id: Date.now(),
            firstName,
            email,
            password,
            phone,
            department,
            active: true,
            role: "employee",
            taskCounts: {
                active: 0,
                newTask: 0,
                completed: 0,
                failed: 0
            },
            tasks: [],
            attendance: []
        }

        const updatedData = [...userData, newUser]
        setUserData(updatedData)
        localStorage.setItem('employees', JSON.stringify(updatedData))

        setFirstName('')
        setEmail('')
        setPassword('')
        setDepartment('')
        setPhone('')

        alert("User Created Successfully")
    }

    return (
        <div className='p-8 bg-white shadow-sm border border-gray-200 rounded-xl flex justify-center items-center h-full overflow-auto'>
            <form onSubmit={submitHandler} className='flex flex-col w-full max-w-lg p-10 border border-purple-100 rounded-2xl bg-white shadow-2xl relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1 bg-purple-600'></div>
                <h2 className='text-3xl font-bold mb-8 text-purple-900 text-center'>Create New Employee</h2>

                <div className='w-full mb-4'>
                    <label className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block'>First Name</label>
                    <input
                        required
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value) }}
                        className='w-full py-3.5 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-400 transition-all font-medium' type="text" placeholder='e.g. John'
                    />
                </div>

                <div className='w-full mb-4'>
                    <label className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block'>Email Address</label>
                    <input
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        className='w-full py-3.5 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-400 transition-all font-medium' type="email" placeholder='john@example.com'
                    />
                </div>

                <div className='w-full mb-4'>
                    <label className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block'>Password</label>
                    <input
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        className='w-full py-3.5 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-400 transition-all font-medium' type="password" placeholder='******'
                    />
                </div>

                <div className='w-full mb-4'>
                    <label className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block'>Phone Number</label>
                    <input
                        required
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value) }}
                        className='w-full py-3.5 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 placeholder-gray-400 transition-all font-medium' type="text" placeholder='+91 99999 99999'
                    />
                </div>

                <div className='w-full mb-8'>
                    <label className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block'>Department</label>
                    <select
                        required
                        value={department}
                        onChange={(e) => { setDepartment(e.target.value) }}
                        className='w-full py-3.5 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-gray-800 transition-all font-medium appearance-none cursor-pointer'
                    >
                        <option value="" className='text-gray-500'>Select Department</option>
                        {deptOptions.map(dept => (
                            <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                        {!deptOptions.length && <option value="General">General (Default)</option>}
                    </select>
                </div>

                <button className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-purple-200 hover:-translate-y-0.5 transform active:scale-[0.98]'>
                    Create Account
                </button>
            </form>
        </div>
    )
}

export default AddUser
