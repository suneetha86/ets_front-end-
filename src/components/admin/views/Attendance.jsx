import React, { useState, useEffect } from 'react'
import { fetchAllAttendance, fetchAdminAttendanceDashboard, markAdminAttendance, fetchEmployeeDetailedStats } from '../../../api/attendanceApi'
import { X, Clock, Calendar, Info, LogIn, LogOut, Loader2, AlertCircle, ArrowRightCircle, History, LayoutDashboard, Users, CheckSquare, BarChart3, CheckCircle2, XCircle, Target, TrendingUp } from 'lucide-react'

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([])
    const [adminDashboard, setAdminDashboard] = useState([])
    const [loading, setLoading] = useState(true)
    const [dashLoading, setDashLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [selectedStats, setSelectedStats] = useState(null)
    const [viewMode, setViewMode] = useState('list') // 'list' or 'dashboard'
    const [isMarking, setIsMarking] = useState(false)
    const [statsLoading, setStatsLoading] = useState(false)

    const loadData = async () => {
        try {
            setLoading(true)
            setDashLoading(true)

            // Fetch basic attendance logs
            const logsData = await fetchAllAttendance()
            setAttendanceRecords(Array.isArray(logsData) ? logsData : [])

            // Fetch high-level admin dashboard for today
            const today = new Date().toISOString().split('T')[0]
            const dashData = await fetchAdminAttendanceDashboard(today)
            console.log("Admin Attendance Dashboard fetched:", dashData)
            setAdminDashboard(Array.isArray(dashData) ? dashData : [])

        } catch (err) {
            console.error("Failed to fetch attendance data:", err)
            setError("Unable to load organizational attendance repository.")
        } finally {
            setLoading(false)
            setDashLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleMarkAttendance = async (emp) => {
        if (isMarking) return

        const confirmMark = window.confirm(`Establish manual "PRESENT" status for ${emp.name} today?`)
        if (!confirmMark) return

        try {
            setIsMarking(true)
            const payload = {
                name: emp.name,
                department: emp.department,
                date: new Date().toISOString().split('T')[0],
                status: "PRESENT",
                loginTime: "09:00:00",
                logoutTime: "18:00:00"
            }

            console.log("Navigating mark command for node:", payload)
            const response = await markAdminAttendance(payload)
            console.log("Marking Sequence Response:", response)

            alert(`🚀 Node "${emp.name}" status updated to PRESENT. Sync complete.`)
            loadData() // Refresh directory telemetry

        } catch (err) {
            console.error("Manual Marking Sequence Failure:", err)
            alert("⚠️ Error: Administrative gateway rejected the manual presence override.")
        } finally {
            setIsMarking(false)
        }
    }

    const handleViewStats = async (emp) => {
        try {
            setStatsLoading(true)
            const today = new Date().toISOString().split('T')[0]
            const stats = await fetchEmployeeDetailedStats(emp.name, today)
            setSelectedStats(stats)
        } catch (err) {
            console.error("Failed to fetch performance profile:", err)
            alert("Unable to reach analytical gateway.")
        } finally {
            setStatsLoading(false)
        }
    }

    const EmployeeStatsModal = ({ stats, onClose }) => {
        if (!stats) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-500 border border-gray-100" onClick={e => e.stopPropagation()}>
                    <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-10 text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl scale-125"></div>
                        <div className="absolute top-0 right-0 p-6 opacity-30">
                            <TrendingUp size={140} className="rotate-12" />
                        </div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-3xl font-black border border-white/30 shadow-2xl">
                                {stats.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight leading-none mb-1">{stats.name}</h3>
                                <div className="flex items-center gap-2 opacity-80">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stats.department}</span>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stats.date}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 backdrop-blur-md">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-10 space-y-8 bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 group hover:bg-indigo-600 transition-all duration-300">
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-indigo-100 transition-colors"><Target size={12} /> Goal Achievement</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <span className="text-3xl font-black text-indigo-900 group-hover:text-white transition-colors">{stats.monthScore?.toFixed(0)}%</span>
                                    <span className="text-[10px] text-indigo-400 font-black mb-2 uppercase tracking-tighter group-hover:text-indigo-200">Monthly</span>
                                </div>
                            </div>
                            <div className="bg-purple-50/50 p-6 rounded-[2rem] border border-purple-100 group hover:bg-purple-600 transition-all duration-300">
                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-purple-100 transition-colors"><BarChart3 size={12} /> Week Consistency</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <span className="text-3xl font-black text-purple-900 group-hover:text-white transition-colors">{stats.lastWeekScore?.toFixed(0)}%</span>
                                    <span className="text-[10px] text-purple-400 font-black mb-2 uppercase tracking-tighter group-hover:text-indigo-200">Weekly</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Monthly Retention</p>
                                        <p className="text-sm font-black text-gray-800">{stats.monthPresentDays} Standard Shifts</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                        <XCircle size={18} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Total Absences</p>
                                        <p className="text-sm font-black text-gray-800">{stats.absenceCount} Incidents</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-blue-50/30 rounded-2xl border border-blue-50">
                                <div className="flex items-center gap-4">
                                    <Clock size={18} className="text-blue-500" />
                                    <span className="text-xs font-black text-gray-400 uppercase">Registered Activity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 bg-white border border-blue-100 rounded-xl text-xs font-black text-blue-700">{stats.loginTime} - {stats.logoutTime}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={onClose} className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black hover:bg-black transition-all shadow-2xl hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest">
                            Sync Completed
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const AttendanceModal = ({ record, onClose }) => {
        if (!record) return null;

        const employee = record.employee || {}
        const loginStr = record.loginTime ? new Date(record.loginTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'
        const logoutStr = record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Still Active'

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                    <div className="bg-blue-600 p-8 text-white flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Clock size={120} />
                        </div>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black border border-white/30 shadow-xl">
                                {employee.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">{employee.username || 'User'}</h3>
                                <p className="text-blue-100 text-sm font-bold opacity-80 uppercase tracking-widest">{employee.role || 'Employee'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 space-y-6 bg-white">
                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Date</span>
                                <span className="text-sm font-black text-gray-700 flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {record.date}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1"><LogIn size={10} className="text-green-500" /> Entrance</p>
                                    <p className="text-lg font-black text-gray-800">{loginStr}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1"><LogOut size={10} className="text-red-500" /> Departure</p>
                                    <p className="text-lg font-black text-gray-800">{logoutStr}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Duration</span>
                                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-black text-sm">{record.workingHours || '0h 0m'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Contact Information</p>
                            <p className="text-sm font-bold text-gray-700">{employee.email}</p>
                        </div>

                        <button onClick={onClose} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200">
                            Dismiss Record
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-2xl h-full overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-10'>
                <div>
                    <h2 className='text-3xl font-black text-gray-900 flex items-center gap-3'>
                        {viewMode === 'list' ? <History className="text-blue-600" /> : <LayoutDashboard className="text-purple-600" />}
                        {viewMode === 'list' ? 'Attendance Ledger' : 'Team Presence Hub'}
                    </h2>
                    <p className='text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest'>
                        {viewMode === 'list' ? 'Review comprehensive employee entrance activity' : 'Real-time overview of organizational presence'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Log View
                        </button>
                        <button
                            onClick={() => setViewMode('dashboard')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'dashboard' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Dashboard
                        </button>
                    </div>
                    <div className="flex items-center gap-3 bg-blue-50/50 px-5 py-3 rounded-2xl border border-blue-100/50 shadow-inner">
                        <Calendar size={18} className="text-blue-500" />
                        <span className='text-sm font-black text-blue-900'>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className='flex-1 overflow-auto rounded-3xl border border-gray-100 shadow-xl custom-scrollbar'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-gray-50/80 backdrop-blur-md sticky top-0 z-10'>
                            <tr className='text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100'>
                                <th className='p-6'>Employee Details</th>
                                <th className='p-6'>Shift Date</th>
                                <th className='p-6 text-center'>Punch Activity</th>
                                <th className='p-6 text-center'>Total Hours</th>
                                <th className='p-6 text-center'>Status</th>
                                <th className='p-6 text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50'>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <Loader2 className="animate-spin" size={40} />
                                            <p className="font-black text-xs uppercase tracking-widest">Syncing Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-red-400">
                                            <AlertCircle size={40} />
                                            <p className="font-black text-sm uppercase tracking-widest">{error}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : attendanceRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center text-gray-400 font-black uppercase tracking-widest">No activity found</td>
                                </tr>
                            ) : (
                                attendanceRecords.map((record, idx) => {
                                    const employee = record.employee || {}
                                    const lTime = record.loginTime ? new Date(record.loginTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--'
                                    const oTime = record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--'

                                    return (
                                        <tr key={idx} className='hover:bg-blue-50/30 group transition-all duration-300'>
                                            <td className='p-6'>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-black text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rounded-xl">
                                                        {employee.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className='font-black text-gray-900 text-sm'>{employee.username}</span>
                                                        <span className='text-[10px] text-gray-400 font-bold tracking-tight'>{employee.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='p-6 text-gray-600 text-sm font-black flex items-center gap-2'>
                                                <Calendar size={14} className="text-gray-300" /> {record.date}
                                            </td>
                                            <td className='p-6 text-center'>
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">In</span>
                                                        <span className="text-xs font-black text-gray-700">{lTime}</span>
                                                    </div>
                                                    <ArrowRightCircle size={14} className="text-gray-200" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Out</span>
                                                        <span className={`text-xs font-black ${record.logoutTime ? 'text-gray-700' : 'text-blue-500 animate-pulse italic'}`}>
                                                            {record.logoutTime ? oTime : 'Active'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='p-6 text-center text-sm font-black text-gray-800 tracking-tighter'>
                                                {record.workingHours}
                                            </td>
                                            <td className='p-6 text-center'>
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm border ${record.status === 'Present'
                                                        ? 'bg-green-50 text-green-600 border-green-100'
                                                        : record.status === 'Half Day'
                                                            ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                            : 'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className='p-6 text-right'>
                                                <button
                                                    onClick={() => setSelectedRecord(record)}
                                                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                                                >
                                                    <Info size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='flex-1 overflow-auto rounded-3xl border border-gray-100 shadow-xl custom-scrollbar p-6'>
                    {dashLoading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-3 text-purple-400">
                            <Loader2 className="animate-spin" size={48} />
                            <p className="font-black text-xs uppercase tracking-widest">Optimizing Presence Hub...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {adminDashboard.map((emp, idx) => (
                                <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all group relative overflow-hidden flex flex-col">
                                    <div className={`absolute top-0 right-0 w-2 h-full ${emp.todayStatus === 'PRESENT' ? 'bg-green-500' : 'bg-red-400 opacity-20'}`}></div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${emp.todayStatus === 'PRESENT' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                            {emp.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 tracking-tight">{emp.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{emp.department}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto gap-2">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${emp.todayStatus === 'PRESENT'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {emp.todayStatus === 'PRESENT' ? 'Present Today' : 'Not Marked'}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewStats(emp)}
                                                className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                title="Analytical Profile"
                                            >
                                                <BarChart3 size={16} />
                                            </button>

                                            {emp.todayStatus === 'NOT_MARKED' && (
                                                <button
                                                    onClick={() => handleMarkAttendance(emp)}
                                                    disabled={isMarking}
                                                    className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-black transition-all shadow-md active:scale-90 disabled:opacity-50 flex items-center gap-2 group/mark"
                                                    title="Mark as Present"
                                                >
                                                    {isMarking ? <Loader2 size={16} className="animate-spin" /> : <CheckSquare size={16} />}
                                                    <span className="text-[9px] font-black uppercase hidden group-hover/mark:block">Mark Present</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedRecord && <AttendanceModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
            {selectedStats && <EmployeeStatsModal stats={selectedStats} onClose={() => setSelectedStats(null)} />}

            {statsLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 border border-gray-100">
                        <Loader2 className="animate-spin text-purple-600" size={48} />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Fetching Analytical Matrix...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Attendance
