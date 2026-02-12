import React from 'react'
import { Activity, Code, Clock } from 'lucide-react'

const Analytics = () => {

    // Mock Data for Charts
    const attendanceData = [
        { day: 'Mon', hours: 8.5, max: 10 },
        { day: 'Tue', hours: 9, max: 10 },
        { day: 'Wed', hours: 8, max: 10 },
        { day: 'Thu', hours: 9.5, max: 10 },
        { day: 'Fri', hours: 7.5, max: 10 },
        { day: 'Sat', hours: 0, max: 10 },
        { day: 'Sun', hours: 0, max: 10 },
    ]

    const codingData = [
        { day: 'Mon', score: 20, max: 100 },
        { day: 'Tue', score: 35, max: 100 },
        { day: 'Wed', score: 10, max: 100 },
        { day: 'Thu', score: 50, max: 100 },
        { day: 'Fri', score: 25, max: 100 },
        { day: 'Sat', score: 60, max: 100 },
        { day: 'Sun', score: 30, max: 100 },
    ]

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8'>

            {/* Attendance Analytics */}
            <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
                <h3 className='text-lg font-bold text-gray-800 mb-6 flex items-center gap-2'>
                    <Clock className='text-emerald-600' size={20} />
                    Weekly Attendance (Hours)
                </h3>
                <div className='h-64 w-full flex items-end justify-between gap-2 px-2'>
                    {attendanceData.map((d, i) => (
                        <div key={i} className='flex flex-col items-center gap-2 w-full group cursor-pointer'>
                            <div className='relative w-full bg-gray-100 rounded-t-lg h-48 overflow-hidden flex items-end'>
                                <div
                                    className='w-full bg-emerald-500 rounded-t-lg transition-all duration-1000 group-hover:bg-emerald-400'
                                    style={{ height: `${(d.hours / d.max) * 100}%` }}
                                ></div>
                                {/* Tooltip */}
                                <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10'>
                                    {d.hours} hrs
                                </div>
                            </div>
                            <span className='text-xs font-medium text-gray-500'>{d.day}</span>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between mt-6 text-sm text-gray-500 border-t border-gray-100 pt-4'>
                    <span>Total Hours: <span className='font-bold text-gray-800'>42.5 hrs</span></span>
                    <span>Avg: <span className='font-bold text-gray-800'>8.5 hrs/day</span></span>
                </div>
            </div>

            {/* Coding Performance */}
            <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
                <h3 className='text-lg font-bold text-gray-800 mb-6 flex items-center gap-2'>
                    <Code className='text-blue-600' size={20} />
                    Coding Performance (Score)
                </h3>
                <div className='h-64 w-full flex items-end justify-between gap-2 px-2'>
                    {codingData.map((d, i) => (
                        <div key={i} className='flex flex-col items-center gap-2 w-full group cursor-pointer'>
                            <div className='relative w-full bg-gray-100 rounded-t-lg h-48 overflow-hidden flex items-end'>
                                <div
                                    className='w-full bg-blue-600 rounded-t-lg transition-all duration-1000 group-hover:bg-blue-500'
                                    style={{ height: `${(d.score / d.max) * 100}%` }}
                                ></div>
                                {/* Tooltip */}
                                <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10'>
                                    Score: {d.score}
                                </div>
                            </div>
                            <span className='text-xs font-medium text-gray-500'>{d.day}</span>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between mt-6 text-sm text-gray-500 border-t border-gray-100 pt-4'>
                    <span>Total Score: <span className='font-bold text-gray-800'>230</span></span>
                    <span>Top Day: <span className='font-bold text-gray-800'>Sat</span></span>
                </div>
            </div>

        </div>
    )
}

export default Analytics
