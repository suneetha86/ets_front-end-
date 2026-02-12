import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AllTask = () => {

    const { userData, setUserData } = useContext(AuthContext)

    return (
        <div className='bg-[#1c1c1c] p-8 rounded-xl mt-8 shadow-2xl border border-gray-800 h-64 overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-white'>Task Status Overview</h2>
            </div>

            <div className='flex-1 overflow-auto pr-2'>
                <div className='bg-[#111] mb-2 py-3 px-4 flex justify-between rounded-lg sticky top-0 border-b border-gray-700 z-10'>
                    <h2 className='text-sm font-semibold w-1/5 text-gray-400 uppercase tracking-wider'>Employee</h2>
                    <h3 className='text-sm font-semibold w-1/5 text-gray-400 uppercase tracking-wider text-center'>New Task</h3>
                    <h5 className='text-sm font-semibold w-1/5 text-gray-400 uppercase tracking-wider text-center'>Active</h5>
                    <h5 className='text-sm font-semibold w-1/5 text-gray-400 uppercase tracking-wider text-center'>Completed</h5>
                    <h5 className='text-sm font-semibold w-1/5 text-gray-400 uppercase tracking-wider text-center'>Failed</h5>
                </div>
                <div className='space-y-2'>
                    {userData.map(function (elem, idx) {
                        return <div key={idx} className='bg-[#111]/50 border border-gray-800 hover:bg-[#252525] transition-colors py-3 px-4 flex justify-between rounded-lg items-center group'>
                            <h2 className='text-sm font-medium w-1/5 text-white flex items-center gap-2'>
                                <div className='w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs'>
                                    {elem.firstName.charAt(0)}
                                </div>
                                {elem.firstName}
                            </h2>
                            <h3 className='text-sm font-bold w-1/5 text-blue-400 text-center'>{elem.taskCounts.newTask}</h3>
                            <h5 className='text-sm font-bold w-1/5 text-yellow-400 text-center'>{elem.taskCounts.active}</h5>
                            <h5 className='text-sm font-bold w-1/5 text-green-400 text-center'>{elem.taskCounts.completed}</h5>
                            <h5 className='text-sm font-bold w-1/5 text-red-400 text-center'>{elem.taskCounts.failed}</h5>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default AllTask
