import React, { useState, useEffect } from 'react'

const Attendance = ({ data }) => {

    const [status, setStatus] = useState('Checked Out') // Checked In, Checked Out
    const [loginTime, setLoginTime] = useState(null)
    const [logoutTime, setLogoutTime] = useState(null)
    const [duration, setDuration] = useState('0h 0m')

    const today = new Date().toDateString()

    // Static 1 Week History Data
    const attendanceHistory = [
        { name:'suneetha',date: '2024-02-10', login: '09:00 AM', logout: '06:00 PM', hours: '9h 0m', status: 'Present' },
        { name:'suneetha',date: '2024-02-09', login: '09:15 AM', logout: '06:15 PM', hours: '9h 0m', status: 'Present' },
        { name:'suneetha',date: '2024-02-08', login: '09:00 AM', logout: '05:30 PM', hours: '8h 30m', status: 'Present' },
        { name:'sravani',date: '2024-02-07', login: '09:10 AM', logout: '06:10 PM', hours: '9h 0m', status: 'Present' },
        { name:'sravani',date: '2024-02-06', login: '08:55 AM', logout: '06:00 PM', hours: '9h 5m', status: 'Present' },
        { name:'sravani',date: '2024-02-05', login: '-', logout: '-', hours: '0h 0m', status: 'Absent' },
        { name:'suneetha',date: '2024-02-04', login: '09:00 AM', logout: '01:00 PM', hours: '4h 0m', status: 'Half Day' },
    ]

    const handleCheckIn = () => {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        setLoginTime(time)
        setStatus('Checked In')
        alert(`Checked In at ${time}`)
    }

    const handleCheckOut = () => {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        setLogoutTime(time)
        setStatus('Checked Out')
        // Calculate duration logic (simplified for demo)
        setDuration('9h 0m')
        alert(`Checked Out at ${time}`)
    }

    return (
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar'>

            <div className='flex justify-between items-center mb-8'>
                <h2 className='text-3xl font-bold text-gray-800'>Attendance Tracker</h2>
                <div className='text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-600 font-medium'>
                    {today}
                </div>
            </div>

            {/* Today's Status Card */}
            <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col items-center justify-center text-center'>
                <div className='w-full max-w-md'>
                    <div className='flex justify-between items-center mb-8 text-gray-600'>




                       <div className='flex flex-col'>
                            <span className='text-xs uppercase font-bold tracking-wider text-gray-400'>Name</span>
                            <span className='text-xl font-bold text-gray-800'>{name || '-----'}</span>
                        </div>



                        
                        <div className='flex flex-col'>
                            <span className='text-xs uppercase font-bold tracking-wider text-gray-400'>Login Time</span>
                            <span className='text-xl font-bold text-gray-800'>{loginTime || '--:--'}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs uppercase font-bold tracking-wider text-gray-400'>Logout Time</span>
                            <span className='text-xl font-bold text-gray-800'>{logoutTime || '--:--'}</span>
                        </div>
                    </div>

                    <div className='bg-red-50 p-6 rounded-full w-48 h-48 mx-auto flex items-center justify-center border-4 border-red-100 mb-6 relative'>
                        {/* Timer Concept - simplified */}
                        <div className='text-center'>
                            <span className='block text-3xl font-bold text-red-600'>{duration}</span>
                            <span className='text-xs text-red-400 font-medium'>Working Hours</span>
                        </div>
                    </div>

                    <div className='flex gap-4 justify-center'>
                        {status === 'Checked Out' && !loginTime ? (
                            <button onClick={handleCheckIn} className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105'>Check In</button>
                        ) : (
                            status === 'Checked In' ? (
                                <button onClick={handleCheckOut} className='bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105'>Check Out</button>
                            ) : (
                                <button disabled className='bg-gray-300 text-gray-500 px-8 py-3 rounded-xl font-bold cursor-not-allowed'>Shift Completed</button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Attendance History */}
            <h3 className='text-xl font-bold text-gray-800 mb-4'>Weekly History</h3>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <table className='w-full text-left'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                            <th className='p-4 text-xs font-bold text-gray-500 uppercase'>Name</th>
                            <th className='p-4 text-xs font-bold text-gray-500 uppercase'>Date</th>
                            <th className='p-4 text-xs font-bold text-gray-500 uppercase'>Login</th>
                            <th className='p-4 text-xs font-bold text-gray-500 uppercase'>Logout</th>
                            <th className='p-4 text-xs font-bold text-gray-500 uppercase'>Hours</th>
                            <th className='p-4 text-xs font-bold text-gray-500 uppercase'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {attendanceHistory.map((record, index) => (
                            <tr key={index} className='hover:bg-gray-50 transition-colors'>
                                <td className='p-4 text-sm font-medium text-gray-800'>{record.name}</td>
                                <td className='p-4 text-sm font-medium text-gray-800'>{record.date}</td>
                                <td className='p-4 text-sm text-gray-600'>{record.login}</td>
                                <td className='p-4 text-sm text-gray-600'>{record.logout}</td>
                                <td className='p-4 text-sm text-gray-600'>{record.hours}</td>
                                <td className='p-4'>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                            record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Attendance
