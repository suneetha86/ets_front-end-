import React from 'react'
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const TaskListNumbers = ({ data }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
            <div className='rounded-xl p-6 bg-blue-50 border border-blue-200 shadow-sm flex flex-col justify-between hover:shadow-xl hover:scale-105 transition-all cursor-pointer duration-300'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-bold text-blue-600'>{data.taskCounts.newTask}</h2>
                    <FileText className='text-blue-400' size={24} />
                </div>
                <h3 className='text-lg font-semibold text-blue-800 mt-2'>New Task</h3>
            </div>

            <div className='rounded-xl p-6 bg-purple-50 border border-purple-200 shadow-sm flex flex-col justify-between hover:shadow-xl hover:scale-105 transition-all cursor-pointer duration-300'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-bold text-purple-600'>{data.taskCounts.active}</h2>
                    <CheckCircle className='text-purple-400' size={24} />
                </div>
                <h3 className='text-lg font-semibold text-purple-800 mt-2'>Accepted Task</h3>
            </div>

            <div className='rounded-xl p-6 bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col justify-between hover:shadow-xl hover:scale-105 transition-all cursor-pointer duration-300'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-bold text-emerald-600'>{data.taskCounts.completed}</h2>
                    <CheckCircle className='text-emerald-400' size={24} />
                </div>
                <h3 className='text-lg font-semibold text-emerald-800 mt-2'>Completed Task</h3>
            </div>

            <div className='rounded-xl p-6 bg-red-50 border border-red-200 shadow-sm flex flex-col justify-between hover:shadow-xl hover:scale-105 transition-all cursor-pointer duration-300'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-4xl font-bold text-red-600'>{data.taskCounts.failed}</h2>
                    <AlertCircle className='text-red-400' size={24} />
                </div>
                <h3 className='text-lg font-semibold text-red-800 mt-2'>Failed Task</h3>
            </div>
        </div>
    )
}

export default TaskListNumbers
