import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { X, Clock, Calendar, Info, LogIn, LogOut, Percent } from 'lucide-react'

const Attendance = () => {
    const { userData } = useContext(AuthContext)
    const [selectedUser, setSelectedUser] = useState(null)

    const getTodayStatus = (user) => {
        const today = new Date().toISOString().split('T')[0]
        const record = user.attendance?.find(a => a.date === today)
        return record ? record.status : 'Not Marked'
    }

    const AttendanceModal = ({ user, onClose }) => {
        if (!user) return null;

        // Mocking some data for the demo
        const loginTime = "09:12 AM"
        const logoutTime = "06:45 PM"
        const lastWeekScore = 92
        const lastMonthScore = 85
        const totalDays = 22
        const presentDays = Math.round(totalDays * (lastMonthScore / 100))
        const absentDays = totalDays - presentDays

        // SVG Pie Chart logic
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (lastMonthScore / 100) * circumference;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                    <div className="bg-purple-900 p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                                {user.firstName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{user.firstName}'s Attendance</h3>
                                <p className="text-purple-200 text-sm">{user.department} Department</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Summary Column */}
                        <div className="space-y-6">
                            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Clock size={16} /> Today's Session
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Login Time</p>
                                        <p className="text-sm font-bold text-green-600 flex items-center gap-1.5 line-height-none">
                                            <LogIn size={14} /> {loginTime}
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Logout Time</p>
                                        <p className="text-sm font-bold text-red-500 flex items-center gap-1.5">
                                            <LogOut size={14} /> {logoutTime}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Last Week Score</p>
                                    <p className="text-2xl font-black text-purple-900">{lastWeekScore}%</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Absence Count</p>
                                    <p className="text-2xl font-black text-red-500">{absentDays} Days</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart Column */}
                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Monthly Score Summary</h4>
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    {/* Background Circle */}
                                    <circle
                                        cx="80" cy="80" r={radius}
                                        stroke="white" strokeWidth="12" fill="transparent"
                                        className="text-gray-200"
                                    />
                                    {/* Progress Circle (Attendance) */}
                                    <circle
                                        cx="80" cy="80" r={radius}
                                        stroke="currentColor" strokeWidth="12" fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        className="text-purple-600"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-black text-purple-900">{lastMonthScore}%</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Attendance</span>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                    <span className="text-xs font-semibold text-gray-600">Present: {presentDays}d</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    <span className="text-xs font-semibold text-gray-600">Absent: {absentDays}d</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-xl h-full overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-3xl font-bold text-purple-900'>Attendance Monitor</h2>
                    <p className='text-gray-500 text-xs mt-1'>Monitor real-time উপস্থিতি and detailed historical scores</p>
                </div>
                <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                    <Calendar size={18} className="text-purple-600" />
                    <span className='text-sm font-bold text-purple-900'>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            <div className='flex-1 overflow-auto rounded-2xl border border-gray-200 shadow-lg'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-purple-50 sticky top-0 z-10'>
                        <tr className='text-purple-900 text-xs uppercase tracking-widest font-bold'>
                            <th className='p-5 border-b border-purple-100'>Employee</th>
                            <th className='p-5 border-b border-purple-100'>Department</th>
                            <th className='p-5 border-b border-purple-100 text-center'>Today Status</th>
                            <th className='p-5 border-b border-purple-100 text-center'>Quick History</th>
                            <th className='p-5 border-b border-purple-100 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {userData.map((user, idx) => {
                            const status = getTodayStatus(user)
                            return (
                                <tr key={idx} className='hover:bg-purple-50 group transition-all duration-200 cursor-pointer' onClick={() => setSelectedUser(user)}>
                                    <td className='p-5'>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 border border-purple-200">
                                                {user.firstName.charAt(0)}
                                            </div>
                                            <span className='font-bold text-gray-900'>{user.firstName}</span>
                                        </div>
                                    </td>
                                    <td className='p-5 text-gray-500 font-medium'>{user.department || 'N/A'}</td>
                                    <td className='p-5 text-center'>
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${status === 'Present'
                                            ? 'bg-green-100 text-green-700 border-green-200'
                                            : status === 'Absent'
                                                ? 'bg-red-100 text-red-700 border-red-200'
                                                : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className='p-5'>
                                        <div className='flex gap-1.5 justify-center'>
                                            {user.attendance?.slice(0, 5).map((rec, i) => (
                                                <div key={i} title={`${rec.date}: ${rec.status}`} className={`w-2.5 h-2.5 rounded-full shadow-sm ${rec.status === 'Present' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                                            ))}
                                            {(!user.attendance || user.attendance.length === 0) && <span className="text-[10px] text-gray-300 italic font-medium">No record</span>}
                                        </div>
                                    </td>
                                    <td className='p-5 text-right'>
                                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                                            <Info size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {selectedUser && <AttendanceModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    )
}

export default Attendance
