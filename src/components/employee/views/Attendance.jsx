import React, { useState, useEffect, useCallback } from 'react'
import { fetchWeeklyAttendance, checkIn, checkOut } from '../../../api/attendanceApi'
import { Loader2, AlertCircle, Clock, Calendar, User, History, CheckCircle } from 'lucide-react'

const Attendance = ({ data }) => {
    const [status, setStatus] = useState('Checked Out') // Checked In, Checked Out
    const [loginTime, setLoginTime] = useState(null)
    const [logoutTime, setLogoutTime] = useState(null)
    const [duration, setDuration] = useState('0h 0m')
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'success' }) // type: success, error

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

    useEffect(() => {
        const storedLogin = localStorage.getItem('tempLoginTimestamp');
        if (storedLogin) {
            setStatus('Checked In');
            setLoginTime(new Date(storedLogin).toLocaleTimeString('en-US'));
        }
    }, [])

    const handleCheckIn = async () => {
        try {
            setActionLoading(true)
            console.log(`Punching In for: ${userEmail}`)
            const response = await checkIn(userEmail)
            console.log("Check-in Response:", response)

            const now = new Date();
            localStorage.setItem('tempLoginTimestamp', now.toISOString());
            const time = now.toLocaleTimeString('en-US');

            setLoginTime(time)
            setStatus('Checked In')
            setModal({
                show: true,
                title: "Handshake Successful",
                message: `Biometric identity verified. Clocked In at ${time}`,
                type: 'success'
            });

            // Auto refresh history to show new record
            loadHistory()
        } catch (error) {
            console.error("Check-in API error:", error)
            setModal({
                show: true,
                title: "Handshake Failed",
                message: "Punch In failed. Please check your biometric gateway connection.",
                type: 'error'
            });
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

            const now = new Date();
            const time = now.toLocaleTimeString('en-US');

            const isPlainString = typeof response === 'string';
            const logMsg = isPlainString ? response : 'Checked out successfully';

            setStatus('Shift Completed')
            setLogoutTime(time)

            // Calculate duration
            const storedLogin = localStorage.getItem('tempLoginTimestamp');
            let finalDuration = '0h 0m 0s';

            if (storedLogin) {
                const loginDate = new Date(storedLogin);
                const diffMs = now - loginDate;
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

                finalDuration = `${hours}h ${minutes}m ${seconds}s`;
                setDuration(finalDuration);
                localStorage.removeItem('tempLoginTimestamp');

                setModal({
                    show: true,
                    title: "Shift Synchronized",
                    message: `Punch Out recorded at ${time}. Total Session: ${finalDuration}`,
                    type: 'success'
                });
            } else {
                setModal({
                    show: true,
                    title: "Shift Synchronized",
                    message: `Punch Out recorded at ${time}`,
                    type: 'success'
                });
            }

            // Refresh history immediately to get calculated hours from the backend mock API
            loadHistory()
        } catch (error) {
            console.error("Check-out API error:", error)
            setModal({
                show: true,
                title: "Synchronize Error",
                message: "Punch Out failed. Please try again.",
                type: 'error'
            });
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar pb-24'>

            <div className='bg-gradient-to-r from-blue-600 via-blue-400 to-white p-8 rounded-2xl shadow-lg border-b mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
                <div className='flex items-center gap-4'>
                    <div className='bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl'>
                        <Clock className="text-white" size={32} />
                    </div>
                    <div>
                        <h2 className='text-3xl font-black text-white tracking-tight drop-shadow-sm'>
                            Attendance Tracker
                        </h2>
                        <p className='text-blue-50 text-xs font-bold uppercase tracking-widest opacity-80'>AJA Workforce Intelligence</p>
                    </div>
                </div>
                <div className='text-sm bg-blue-600 px-6 py-3 rounded-2xl border border-blue-400 text-white font-black flex items-center gap-2 shadow-xl'>
                    <Calendar size={18} className="text-white" /> {today}
                </div>
            </div>

            {/* Today's Status Card */}
            <div className='bg-white p-10 rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 mb-10 flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all duration-500'>
                <div className='absolute top-0 right-0 p-4 opacity-5 text-blue-600'>
                    <Clock size={120} />
                </div>

                <div className='w-full max-w-2xl'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-gray-700 bg-gray-50 p-6 rounded-3xl border border-gray-100'>
                        <div className='flex flex-col items-center justify-center p-2 rounded-xl'>
                            <span className='text-[10px] uppercase font-black tracking-widest text-blue-500 mb-1 flex items-center gap-1'><User size={10} /> Attendance</span>
                            <span className='bg-blue-600 text-white px-6 py-2 rounded-2xl text-lg font-black shadow-lg shadow-blue-100 border border-blue-400'>{data?.fullName || data?.username || 'Attendance'}</span>
                        </div>

                        <div className='flex flex-col items-center justify-center p-4 rounded-3xl bg-[#9ce3e3] shadow-lg shadow-cyan-100'>
                            <span className='text-[10px] uppercase font-black tracking-widest text-white mb-1 flex items-center gap-1'><Clock size={10} /> Login Time</span>
                            <span className='text-2xl font-black text-white'>{loginTime || '--:--'}</span>
                        </div>

                        <div className='flex flex-col items-center justify-center p-4 rounded-3xl bg-red-500 shadow-lg shadow-red-100'>
                            <span className='text-[10px] uppercase font-black tracking-widest text-white mb-1 flex items-center gap-1'><Clock size={10} /> Logout Time</span>
                            <span className='text-2xl font-black text-white'>{logoutTime || '--:--'}</span>
                        </div>
                    </div>

                    <div className='bg-blue-50/50 p-8 rounded-full w-60 h-60 mx-auto flex items-center justify-center border-8 border-white shadow-xl mb-8 relative group'>
                        <div className='absolute inset-0 bg-blue-100/20 rounded-full animate-pulse'></div>
                        <div className='text-center z-10'>
                            <span className='block text-5xl font-black text-blue-600 leading-none mb-1 tracking-tighter'>{duration}</span>
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
                                    className={`bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 ${actionLoading ? 'opacity-80' : ''}`}
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
                                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center w-fit gap-1 shadow-sm ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                    record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${record.status === 'Present' ? 'bg-green-500' :
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


            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`${modal.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} p-8 flex flex-col items-center gap-4 relative overflow-hidden`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                {modal.type === 'success' ? <CheckCircle size={100} /> : <AlertCircle size={100} />}
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                                {modal.type === 'success' ? <CheckCircle className="text-emerald-500" size={32} /> : <AlertCircle className="text-rose-500" size={32} />}
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
                                className={`w-full py-4 ${modal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-100'} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
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

export default Attendance
