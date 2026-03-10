import React from 'react'
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const TaskListNumbers = ({ data }) => {
    const taskCounts = data?.taskCounts || {
        newTask: 0,
        active: 0,
        completed: 0,
        failed: 0
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
            <div className='rounded-xl p-6 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-[1.03] transition-all cursor-pointer duration-300 group'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-black text-white'>{taskCounts.newTask}</h2>
                    <div className='bg-white/20 p-2 rounded-lg backdrop-blur-sm'>
                        <FileText className='text-white' size={24} />
                    </div>
                </div>
                <h3 className='text-lg font-bold text-blue-50 mt-2 uppercase tracking-tighter'>New Task</h3>
            </div>

            <div className='rounded-xl p-6 bg-gradient-to-br from-purple-500 to-indigo-700 shadow-lg flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:scale-[1.03] transition-all cursor-pointer duration-300 group'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-black text-white'>{taskCounts.active}</h2>
                    <div className='bg-white/20 p-2 rounded-lg backdrop-blur-sm'>
                        <CheckCircle className='text-white' size={24} />
                    </div>
                </div>
                <h3 className='text-lg font-bold text-purple-50 mt-2 uppercase tracking-tighter'>Accepted Task</h3>
            </div>

            <div className='rounded-xl p-6 bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.03] transition-all cursor-pointer duration-300 group'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-black text-white'>{taskCounts.completed}</h2>
                    <div className='bg-white/20 p-2 rounded-lg backdrop-blur-sm'>
                        <CheckCircle className='text-white' size={24} />
                    </div>
                </div>
                <h3 className='text-lg font-bold text-emerald-50 mt-2 uppercase tracking-tighter'>Completed Task</h3>
            </div>

            <div className='rounded-xl p-6 bg-gradient-to-br from-red-500 to-rose-700 shadow-lg flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:scale-[1.03] transition-all cursor-pointer duration-300 group'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-black text-white'>{taskCounts.failed}</h2>
                    <div className='bg-white/20 p-2 rounded-lg backdrop-blur-sm'>
                        <AlertCircle className='text-white' size={24} />
                    </div>
                </div>
                <h3 className='text-lg font-bold text-red-50 mt-2 uppercase tracking-tighter'>Failed Task</h3>
            </div>
        </div>
    )
}

export default TaskListNumbers
