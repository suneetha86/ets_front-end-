import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { Plus, X, Loader2, ShieldCheck, CheckCircle, Clock, Search, Filter, RefreshCw, Send, Layers } from 'lucide-react'
import { createSubmission, fetchSubmissions, approveSubmission, rejectSubmission, getPendingSubmissionsCount } from '../../../api/submissionApi'

const Submissions = () => {
    const { userData, setUserData } = useContext(AuthContext)
    const [submissions, setSubmissions] = useState([])
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [lastSynced, setLastSynced] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pendingCount, setPendingCount] = useState(0)
    
    // New submission form state
    const [formData, setFormData] = useState({
        employeeName: '',
        taskTitle: '',
        taskCategory: '',
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'PENDING'
    })

    const loadSubmissions = async () => {
        try {
            setLoading(true)
            // Synchronize with local state for fallback
            const allSubmissions = []
            if (userData) {
                userData.forEach((user, userIdx) => {
                    user.tasks?.forEach((task, taskIdx) => {
                        if (task.completed || task.adminStatus === 'Rejected') {
                            allSubmissions.push({
                                ...task,
                                id: task.id || `local-${userIdx}-${taskIdx}`,
                                userIdx,
                                taskIdx,
                                employeeName: user.firstName,
                                taskCategory: task.category || 'Mission',
                                submissionDate: task.taskDate || 'N/A',
                                status: task.adminStatus || 'PENDING'
                            })
                        }
                    })
                })
            }
            
            // Uplink with live repository if available
            try {
                const apiData = await fetchSubmissions()
                const countData = await getPendingSubmissionsCount()
                
                if (Array.isArray(apiData) && apiData.length > 0) {
                    setSubmissions([...apiData, ...allSubmissions])
                } else {
                    setSubmissions(allSubmissions)
                }
                
                if (countData && countData.pendingCount !== undefined) {
                    setPendingCount(countData.pendingCount)
                }
            } catch (apiErr) {
                console.warn("Live Hub Interrupted, using local archive")
                setSubmissions(allSubmissions)
                // Use local count as fallback
                setPendingCount(allSubmissions.filter(s => s.status === 'PENDING' || s.status === 'Pending Review').length)
            }
            
            setLastSynced(new Date().toLocaleTimeString())
        } catch (err) {
            console.error("Critical Synchronization Error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSubmissions()
    }, [userData])

    const handleCreateSubmission = async (e) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            console.log("Transmitting mission data to core repository:", formData)
            await createSubmission(formData)
            
            setIsFormVisible(false)
            setFormData({
                employeeName: '',
                taskTitle: '',
                taskCategory: '',
                submissionDate: new Date().toISOString().split('T')[0],
                status: 'PENDING'
            })
            
            alert("Handshake Success: Tactical submission has been established in the master repository.")
            loadSubmissions()
        } catch (error) {
            console.error("Transmission Breach:", error)
            alert("PROTOCOL BREACH: Unable to synchronize submission with the master gateway.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAction = async (sub, action) => {
        const { userIdx, taskIdx, id } = sub;

        if (action === 'Approve') {
            try {
                // If it's a persistent API record, execute the PUT handshake
                if (id && !id.toString().startsWith('local-')) {
                    await approveSubmission(id);
                    alert("Submission approved successfully: Protocol authorization verified.");
                    loadSubmissions();
                    return;
                }
                
                // Fallback for local state (mock data)
                const updatedUserData = [...userData]
                const user = updatedUserData[userIdx]
                const task = user.tasks[taskIdx]
                task.adminStatus = 'Approved'
                setUserData(updatedUserData)
                localStorage.setItem('employees', JSON.stringify(updatedUserData))
                alert("Local Handshake Success: Offline record authorized.");
                loadSubmissions()
            } catch (error) {
                console.error("Authorization Failure:", error)
                alert("PROTOCOL BREACH: Failed to transmit authorization handshake to the master repository.")
            }
        } else if (action === 'Reject') {
            try {
                // If it's a persistent API record, execute the PUT handshake
                if (id && !id.toString().startsWith('local-')) {
                    await rejectSubmission(id);
                    alert("Submission rejected successfully: Tactical refusal confirmed.");
                    loadSubmissions();
                    return;
                }

                // Fallback for local state (mock data)
                const updatedUserData = [...userData]
                const user = updatedUserData[userIdx]
                const task = user.tasks[taskIdx]

                if (task.completed) {
                    task.completed = false
                    task.failed = true
                    task.adminStatus = 'Rejected'
                    if (user.taskCounts.completed > 0) user.taskCounts.completed--
                    user.taskCounts.failed = (user.taskCounts.failed || 0) + 1
                }

                setUserData(updatedUserData)
                localStorage.setItem('employees', JSON.stringify(updatedUserData))
                alert("Local Handshake Success: Offline record refused.");
                loadSubmissions()
            } catch (error) {
                console.error("Refusal Failure:", error)
                alert("PROTOCOL BREACH: Failed to transmit refusal handshake to the master repository.")
            }
        }
    }

    return (
        <div className='bg-gray-50/30 p-8 rounded-[2rem] h-full overflow-hidden flex flex-col custom-scrollbar'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
                <div>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='bg-purple-600 p-2.5 rounded-2xl shadow-xl shadow-purple-200'>
                            <Layers size={24} className="text-white" />
                        </div>
                        <h2 className='text-4xl font-black text-slate-800 tracking-tight'>Mission Oversight</h2>
                    </div>
                    <p className='text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-14'>Review and authorize tactical mission completions</p>
                </div>
                
                <div className='flex items-center gap-4'>
                    <div className='bg-white px-5 py-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm'>
                        <div className='w-2 h-2 rounded-full bg-yellow-400 animate-pulse'></div>
                        <span className='text-[10px] font-black text-slate-600 uppercase tracking-widest'>{pendingCount} Awaiting Authorization</span>
                    </div>
                    <button
                        onClick={loadSubmissions}
                        className='p-4 bg-white text-slate-400 rounded-2xl border border-slate-100 hover:text-purple-600 hover:shadow-lg transition-all active:rotate-180 duration-500'
                        title="Sync with Repository"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-200 transition-all flex items-center gap-2'
                    >
                        <Plus size={18} /> Initialize Submission
                    </button>
                </div>
            </div>

            {isFormVisible && (
                <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'>
                    <form onSubmit={handleCreateSubmission} className='bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative'>
                        <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-indigo-600'></div>
                        <div className='p-8 flex justify-between items-center border-b border-slate-50'>
                            <h3 className='text-2xl font-black text-slate-800 tracking-tight'>Initialize Digital Handover</h3>
                            <button type="button" onClick={() => setIsFormVisible(false)} className='p-2 hover:bg-slate-50 rounded-xl transition-colors'>
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <div className='p-8 space-y-6'>
                            <div className='grid grid-cols-1 gap-6'>
                                <div>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'>Employee Designation</label>
                                    <input 
                                        required
                                        value={formData.employeeName}
                                        onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                                        className='w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold text-sm'
                                        placeholder='e.g. Suneetha'
                                    />
                                </div>
                                <div>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'>Strategic Task Title</label>
                                    <input 
                                        required
                                        value={formData.taskTitle}
                                        onChange={(e) => setFormData({...formData, taskTitle: e.target.value})}
                                        className='w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold text-sm'
                                        placeholder='e.g. Login Module'
                                    />
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'>Category</label>
                                        <input 
                                            required
                                            value={formData.taskCategory}
                                            onChange={(e) => setFormData({...formData, taskCategory: e.target.value})}
                                            className='w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold text-sm'
                                            placeholder='e.g. Development'
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'>Handover Date</label>
                                        <input 
                                            type="date"
                                            required
                                            value={formData.submissionDate}
                                            onChange={(e) => setFormData({...formData, submissionDate: e.target.value})}
                                            className='w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold text-sm'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className='p-8 bg-slate-50/50 flex gap-4'>
                            <button 
                                type="button"
                                onClick={() => setIsFormVisible(false)}
                                className='flex-1 py-4 px-6 rounded-2xl border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all'
                            >
                                Cancel Sync
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className='flex-[2] bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-2'
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                {isSubmitting ? 'Transmitting...' : 'Initialize POST Protocol'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                    <tbody className='divide-y divide-slate-100 bg-white'>
                        {submissions.length > 0 ? (
                            submissions.map((sub, idx) => (
                                <tr key={sub.id || idx} className='hover:bg-purple-50/30 transition-all group duration-300'>
                                    <td className='p-6'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-xs font-black text-purple-600 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0'>
                                                {sub.employeeName?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <span className='font-black text-slate-800 tracking-tight block'>{sub.employeeName}</span>
                                                <span className='text-[9px] text-slate-300 font-bold uppercase tracking-tighter'>Mission Operator</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='p-6'>
                                        <div className='font-black text-slate-700 tracking-tight text-sm'>{sub.taskTitle}</div>
                                        <div className='flex items-center gap-2 mt-1'>
                                            <div className='w-1 h-1 rounded-full bg-slate-300'></div>
                                            <div className='text-[10px] text-slate-400 font-black uppercase tracking-widest'>{sub.taskCategory}</div>
                                        </div>
                                    </td>
                                    <td className='p-6'>
                                        <div className='flex flex-col'>
                                            <span className='text-xs font-black text-slate-500 tracking-tight'>{sub.submissionDate}</span>
                                            <span className='text-[8px] text-slate-300 font-black uppercase tracking-widest'>Handover Target</span>
                                        </div>
                                    </td>
                                    <td className='p-6'>
                                        <span className={`inline-flex items-center gap-2 text-[9px] font-black px-4 py-1.5 rounded-full border shadow-sm transition-all duration-500 uppercase tracking-widest
                                            ${sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                sub.status === 'Rejected' || sub.status === 'FAILED' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Approved' ? 'bg-emerald-500' : (sub.status === 'Rejected' || sub.status === 'FAILED') ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className='p-6 text-right'>
                                        {(sub.status === 'PENDING' || sub.status === 'Pending Review') ? (
                                            <div className='flex gap-2 justify-end opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300'>
                                                <button
                                                    onClick={() => handleAction(sub, 'Approve')}
                                                    className='bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-100 active:scale-95'
                                                >
                                                    Authorize
                                                </button>
                                                <button
                                                    onClick={() => handleAction(sub, 'Reject')}
                                                    className='bg-white hover:bg-rose-50 text-rose-500 border border-slate-100 hover:border-rose-100 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all active:scale-95'
                                                >
                                                    Refuse
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='flex items-center justify-end gap-2 text-slate-300'>
                                                <ShieldCheck size={14} />
                                                <span className='text-[9px] font-black uppercase tracking-widest'>Protocol Locked</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center">
                                    <div className='flex flex-col items-center gap-4'>
                                        <RefreshCw size={48} className="text-slate-100 animate-spin-slow" />
                                        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">No tactical handovers awaiting review</p>
                                    </div>
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
