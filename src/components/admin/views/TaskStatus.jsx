import React, { useContext } from 'react'
import { AuthContext } from '../../../context/AuthProvider'

const TaskStatus = () => {
    const { userData } = useContext(AuthContext)

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-xl h-full overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-8'>
                <h2 className='text-3xl font-bold text-purple-900'>Task Status & Scores</h2>
                <div className='bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 flex items-center gap-2'>
                    <span className='text-xs font-bold text-purple-700 uppercase tracking-wide'>Total Completed:</span>
                    <span className='text-lg font-bold text-purple-900'>
                        {userData.reduce((acc, user) => acc + (user.taskCounts?.completed || 0), 0)}
                    </span>
                </div>
            </div>

            <div className='flex-1 overflow-auto rounded-xl border border-gray-200 shadow-md'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-purple-50 sticky top-0 z-10'>
                        <tr className='text-purple-900 text-xs uppercase tracking-wider font-semibold'>
                            <th className='p-4 border-b border-purple-100'>Employee Name</th>
                            <th className='p-4 border-b border-purple-100'>Task Title</th>
                            <th className='p-4 border-b border-purple-100'>Status</th>
                            <th className='p-4 border-b border-purple-100'>Score</th>
                            <th className='p-4 border-b border-purple-100'>Date</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {userData.map((user) => (
                            user.tasks?.map((task, idx) => (
                                <tr key={`${user.id}-${idx}`} className='hover:bg-purple-50/50 transition-colors'>
                                    <td className='p-4 font-medium text-gray-900'>{user.firstName}</td>
                                    <td className='p-4 text-gray-700'>{task.taskTitle}</td>
                                    <td className='p-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${task.completed ? 'bg-green-100 text-green-700 border border-green-200' :
                                            task.active ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                task.failed ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}>
                                            {task.completed ? 'Completed' : task.active ? 'In Progress' : task.failed ? 'Failed' : 'New'}
                                        </span>
                                    </td>
                                    <td className='p-4'>
                                        {task.completed ? (
                                            <span className='text-purple-700 font-bold'>
                                                {task.score ? `${task.score}/10` : '8/10'} {/* Mock score if not present */}
                                            </span>
                                        ) : (
                                            <span className='text-gray-400 text-xs italic'>Pending</span>
                                        )}
                                    </td>
                                    <td className='p-4 text-gray-500 text-sm'>{task.taskDate}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TaskStatus
