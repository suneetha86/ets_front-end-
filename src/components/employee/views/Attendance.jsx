import React, { useState, useEffect, useCallback } from 'react'
import { fetchWeeklyAttendance, checkIn, checkOut } from '../../../api/attendanceApi'
import { Loader2, AlertCircle, Clock, Calendar, User, History } from 'lucide-react'

const Attendance = ({ data }) => {
    const [status, setStatus] = useState('Checked Out') // Checked In, Checked Out
    const [loginTime, setLoginTime] = useState(null)
    const [logoutTime, setLogoutTime] = useState(null)
    const [duration, setDuration] = useState('0h 0m')
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    const today = new Date().toDateString()
    const userEmail = data?.email || 'vasu123@gmail.com'

    const loadHistory = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            console.log(`Refreshing attendance history for: ${userEmail}`)
            const response = await fetchWeeklyAttendance(userEmail)
            
            const mappedHistory = (Array.isArray(response) ? response : []).map(record => ({
                id: record.id,
                name: record.employee?.username || data?.fullName || 'User',
                date: record.date || 'N/A',
                login: record.loginTime ? new Date(record.loginTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
                logout: record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
                hours: record.workingHours || '0h 0m',
                status: record.status || 'Present'
            }))

            setHistory(mappedHistory.reverse())

            // Update Current Status from today's record if any
            const todayISO = new Date().toISOString().split('T')[0]
            const todaysRecord = response.find(r => r.date === todayISO)
            if (todaysRecord) {
                setLoginTime(todaysRecord.loginTime ? new Date(todaysRecord.loginTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null)
                setLogoutTime(todaysRecord.logoutTime ? new Date(todaysRecord.logoutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null)
                setDuration(todaysRecord.workingHours || '0h 0m')
                setStatus(todaysRecord.logoutTime ? 'Shift Completed' : 'Checked In')
            }

        } catch (err) {
            console.error("Failed to load attendance history:", err)
            setError("Could not retrieve attendance records from server.")
        } finally {
            setLoading(false)
        }
    }, [userEmail, data?.fullName])

    useEffect(() => {
        if (userEmail) {
            loadHistory()
        }
    }, [userEmail, loadHistory])

    const handleCheckIn = async () => {
        try {
            setActionLoading(true)
            console.log(`Punching In for: ${userEmail}`)
            const response = await checkIn(userEmail)
            console.log("Check-in Response:", response)
            
            const time = new Date(response.loginTime || new Date()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            setLoginTime(time)
            setStatus('Checked In')
            alert(`✅ Successfully Clocked In at ${time}`)
            
            // Auto refresh history to show new record
            loadHistory()
        } catch (error) {
            console.error("Check-in API error:", error)
            alert("❌ Punch In failed. Please check your connection.")
        } finally {
            setActionLoading(false)
        }
    }

    const handleCheckOut = async () => {
        try {
            setActionLoading(true)
            console.log(`Punching Out for: ${userEmail}`)
            const response = await checkOut(userEmail)
            console.log("Check-out Response:", response)
            
            // Handle both string response and object response
            const isPlainString = typeof response === 'string';
            const logMsg = isPlainString ? response : 'Checked out successfully';
            
            setStatus('Shift Completed')
            setLogoutTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
            
            alert(`✅ ${logMsg}`)
            
            // Refresh history immediately to get calculated hours from the backend
            loadHistory()
        } catch (error) {
            console.error("Check-out API error:", error)
            alert("❌ Punch Out failed. Please try again.")
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar pb-24'>

            <div className='flex justify-between items-center mb-8'>
                <h2 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                    <Clock className="text-blue-600" /> Attendance Tracker
                </h2>
                <div className='text-sm bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-200 text-gray-600 font-bold flex items-center gap-2'>
                    <Calendar size={16} className="text-blue-400" /> {today}
                </div>
            </div>

            {/* Today's Status Card */}
<<<<<<< HEAD
            <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-xl hover:shadow-blue-50 transition-all duration-500'>
                <div className='absolute top-0 right-0 p-4 opacity-5'>
                    <Clock size={120} />
                </div>
                
                <div className='w-full max-w-2xl'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-gray-600 bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200'>
                       <div className='flex flex-col items-center justify-center p-2 rounded-xl border border-transparent transition-all group-hover:bg-white'>
                            <span className='text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1 flex items-center gap-1'><User size={10} /> Employee</span>
                            <span className='text-lg font-black text-gray-800'>{data?.fullName || data?.username || 'Attendee'}</span>
                        </div>
                        
                        <div className='flex flex-col items-center justify-center p-2 rounded-xl border border-transparent transition-all group-hover:bg-white'>
                            <span className='text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1 flex items-center gap-1'><Clock size={10} className="text-green-500" /> Login Time</span>
                            <span className='text-lg font-black text-gray-800'>{loginTime || '--:--'}</span>
=======
            <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col items-center justify-center text-center'>
                <div className='w-full max-w-md'>
                    <div className='flex justify-between items-center mb-8 text-gray-600'>

                        <div className='flex flex-col'>
                            <span className='text-xs uppercase font-bold tracking-wider text-gray-400'>Login Time</span>
                            <span className='text-xl font-bold text-gray-800'>{loginTime || '--:--'}</span>
>>>>>>> 740923c89b925ef6cd1989df69e17797a278e662
                        </div>
                        
                        <div className='flex flex-col items-center justify-center p-2 rounded-xl border border-transparent transition-all group-hover:bg-white'>
                            <span className='text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1 flex items-center gap-1'><Clock size={10} className="text-red-500" /> Logout Time</span>
                            <span className='text-lg font-black text-gray-800'>{logoutTime || '--:--'}</span>
                        </div>
                    </div>

                    <div className='bg-blue-50/30 p-8 rounded-full w-56 h-56 mx-auto flex items-center justify-center border-8 border-white shadow-inner mb-8 relative group'>
                        <div className='absolute inset-0 bg-blue-100/20 rounded-full animate-pulse group-hover:animate-none'></div>
                        <div className='text-center z-10'>
                            <span className='block text-4xl font-black text-blue-600 leading-none mb-1'>{duration}</span>
                            <span className='text-[10px] text-blue-400 font-black uppercase tracking-widest'>Working Hours</span>
                        </div>
                    </div>

                    <div className='flex gap-4 justify-center'>
                        {status === 'Checked Out' && !loginTime ? (
                            <button 
                                onClick={handleCheckIn} 
                                disabled={actionLoading}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 ${actionLoading ? 'opacity-80' : ''}`}
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                                {actionLoading ? 'Clocking In...' : 'Punch In'}
                            </button>
                        ) : (
                            status === 'Checked In' ? (
                                <button 
                                    onClick={handleCheckOut} 
                                    disabled={actionLoading}
                                    className={`bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-red-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 ${actionLoading ? 'opacity-80' : ''}`}
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                                    {actionLoading ? 'Clocking Out...' : 'Punch Out'}
                                </button>
                            ) : (
                                <button disabled className='bg-gray-200 text-gray-400 px-10 py-4 rounded-2xl font-black cursor-not-allowed border border-gray-100'>Shift Ended</button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Attendance History */}
            <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <History className="text-blue-500" size={20} /> Weekly History
            </h3>
            
            {loading ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-20 flex flex-col items-center justify-center gap-3 text-gray-400">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="font-bold text-sm tracking-wider uppercase">Fetching records...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="p-4 bg-red-50 rounded-full text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-gray-800">Connection Failed</h4>
                        <p className="text-gray-500 text-sm max-w-md">{error}</p>
                    </div>
                </div>
            ) : (
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className="overflow-x-auto">
                        <table className='w-full text-left'>
                            <thead className='bg-gray-50/70 border-b border-gray-100'>
                                <tr>
                                    <th className='p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Name</th>
                                    <th className='p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Date</th>
                                    <th className='p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Log In</th>
                                    <th className='p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Log Out</th>
                                    <th className='p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Duration</th>
                                    <th className='p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-50'>
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-10 text-center text-gray-400 font-medium italic">No attendance records for this week.</td>
                                    </tr>
                                ) : (
                                    history.map((record, index) => (
                                        <tr key={index} className='hover:bg-blue-50/30 transition-colors group'>
                                            <td className='p-5 text-sm font-bold text-gray-800 group-hover:text-blue-600'>{record.name}</td>
                                            <td className='p-5 text-sm font-bold text-gray-600'>{record.date}</td>
                                            <td className='p-5 text-sm text-gray-500 font-medium'>{record.login}</td>
                                            <td className='p-5 text-sm text-gray-500 font-medium'>{record.logout}</td>
                                            <td className='p-5 text-sm font-black text-gray-700 tracking-tight'>{record.hours}</td>
                                            <td className='p-5'>
                                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center w-fit gap-1 shadow-sm ${
                                                    record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                    record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        record.status === 'Present' ? 'bg-green-500' :
                                                        record.status === 'Absent' ? 'bg-red-500' : 'bg-yellow-500'
                                                    }`}></div>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Attendance
