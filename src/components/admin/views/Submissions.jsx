import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthProvider'

const Submissions = () => {
    const { userData, setUserData } = useContext(AuthContext)
    const [submissions, setSubmissions] = useState([])

    useEffect(() => {
        if (userData) {
            const allSubmissions = []
            userData.forEach((user, userIdx) => {
                user.tasks?.forEach((task, taskIdx) => {
                    if (task.completed || task.adminStatus === 'Rejected') {
                        allSubmissions.push({
                            ...task,
                            userIdx,
                            taskIdx,
                            employeeName: user.firstName,
                            status: task.adminStatus || 'Pending Review'
                        })
                    }
                })
            })
            setSubmissions(allSubmissions)
        }
    }, [userData])

    const handleAction = (userIdx, taskIdx, action) => {
        const updatedUserData = [...userData]
        const user = updatedUserData[userIdx]
        const task = user.tasks[taskIdx]

        if (action === 'Approve') {
            task.adminStatus = 'Approved'
            // Keep counts as is, just mark as approved
        } else if (action === 'Reject') {
            if (task.completed) {
                // If it was completed, move to failed
                task.completed = false
                task.failed = true
                task.adminStatus = 'Rejected'

                // Update counts
                if (user.taskCounts.completed > 0) user.taskCounts.completed--
                user.taskCounts.failed = (user.taskCounts.failed || 0) + 1
            }
        }

        setUserData(updatedUserData)
        localStorage.setItem('employees', JSON.stringify(updatedUserData))
    }

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-xl h-full overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-3xl font-bold text-purple-900'>Review Submissions</h2>
                    <p className='text-gray-500 text-xs mt-1'>Review and approve employee task submissions</p>
                </div>
                <div className='bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-yellow-400 animate-pulse'></span>
                    <span className='text-xs font-bold text-purple-900 uppercase tracking-widest'>{submissions.filter(s => s.status === 'Pending Review').length} Pending Review</span>
                </div>
            </div>

            <div className='flex-1 overflow-auto rounded-2xl border border-gray-200 shadow-lg'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-purple-50 sticky top-0 z-10'>
                        <tr className='text-purple-900 text-[10px] uppercase tracking-[0.2em] font-black'>
                            <th className='p-5 border-b border-purple-100'>Employee</th>
                            <th className='p-5 border-b border-purple-100'>Task</th>
                            <th className='p-5 border-b border-purple-100'>Date</th>
                            <th className='p-5 border-b border-purple-100'>Status</th>
                            <th className='p-5 border-b border-purple-100 text-right'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {submissions.length > 0 ? (
                            submissions.map((sub, idx) => (
                                <tr key={idx} className='hover:bg-purple-50/50 transition-colors group'>
                                    <td className='p-5'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700'>
                                                {sub.employeeName.charAt(0)}
                                            </div>
                                            <span className='font-bold text-gray-900'>{sub.employeeName}</span>
                                        </div>
                                    </td>
                                    <td className='p-5 font-medium text-gray-700'>
                                        <div>{sub.taskTitle}</div>
                                        <div className='text-xs text-gray-400'>{sub.category}</div>
                                    </td>
                                    <td className='p-5 font-medium text-gray-500 text-xs'>{sub.taskDate}</td>
                                    <td className='p-5'>
                                        <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full w-fit
                                            ${sub.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                sub.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-50 text-yellow-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Approved' ? 'bg-green-500' : sub.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className='p-5 text-right'>
                                        {sub.status === 'Pending Review' && (
                                            <div className='flex gap-2 justify-end opacity-80 group-hover:opacity-100 transition-opacity'>
                                                <button
                                                    onClick={() => handleAction(sub.userIdx, sub.taskIdx, 'Approve')}
                                                    className='bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md'
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(sub.userIdx, sub.taskIdx, 'Reject')}
                                                    className='bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all'
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-400 text-sm italic">
                                    No submissions pending review.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Submissions
