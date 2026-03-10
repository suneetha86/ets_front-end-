import React, { useState, useEffect } from 'react'
import { fetchAdminTasks, deleteAdminTask } from '../../../api/taskApi'
import { deleteAssignTask } from '../../../api/assignTaskApi'
import { Loader2, ClipboardList, CheckCircle2, Clock, AlertCircle, RefreshCw, BarChart3, User, Calendar, Trash2 } from 'lucide-react'


const TaskStatus = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: null })

    const loadTasks = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchAdminTasks()
            setTasks(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Task Intelligence Feed Failure:", err)
            setError("Failed to synchronize with task repository.")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteTask = async (task) => {
        setModal({
            show: true,
            title: "CRITICAL PROTOCOL",
            message: "Are you sure you want to permanently purge this tactical objective from the repository? This action cannot be revoked.",
            type: 'warning',
            onConfirm: () => executeDelete(task)
        })
    }

    const executeDelete = async (task) => {
        
        try {
            // First attempt with the new Assign Task deletion protocol
            await deleteAssignTask(task.id, task);
            setTasks(tasks.filter(t => t.id !== task.id))
            setModal({
                show: true,
                title: "Purge Success",
                message: "Objective purged from core record successfully.",
                type: 'success'
            });
        } catch (err) {
            console.warn("New Protocol Failed, attempting legacy purge...")
            try {
                await deleteAdminTask(task.id)
                setTasks(tasks.filter(t => t.id !== task.id))
                setModal({
                    show: true,
                    title: "Legacy Purge Success",
                    message: "Legacy objective removed successfully.",
                    type: 'success'
                });
            } catch (legacyErr) {
                console.error("Archive Purge Blocked:", legacyErr)
                setModal({
                    show: true,
                    title: "Protocol Breach",
                    message: "Failed to remove objective from core repositories.",
                    type: 'error'
                });
            }
        }
    }


    useEffect(() => {
        loadTasks()
    }, [])

    const getStatusStyles = (status) => {
        const lowerStatus = status?.toLowerCase() || ''
        if (lowerStatus.includes('completed') || lowerStatus === 'done') 
            return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50'
        if (lowerStatus.includes('progress') || lowerStatus === 'active') 
            return 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50'
        if (lowerStatus.includes('failed') || lowerStatus.includes('overdue')) 
            return 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-50'
        return 'bg-slate-50 text-slate-500 border-slate-100 shadow-slate-50'
    }

    const getStatusIcon = (status) => {
        const lowerStatus = status?.toLowerCase() || ''
        if (lowerStatus.includes('completed') || lowerStatus === 'done') return <CheckCircle2 size={12} />
        if (lowerStatus.includes('progress') || lowerStatus === 'active') return <Clock size={12} />
        if (lowerStatus.includes('failed') || lowerStatus.includes('overdue')) return <AlertCircle size={12} />
        return <ClipboardList size={12} />
    }

    return (
        <div className='h-full flex flex-col gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
            {/* Analytics Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                <div>
                    <h2 className='text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase'>
                        <div className='p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-200'>
                            <BarChart3 size={24} />
                        </div>
                        Strategic Task Audit
                    </h2>
                    <p className='text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2 ml-1'>Protocol: Global Operational Monitoring</p>
                </div>

                <div className='flex items-center gap-4'>
                    <div className='flex items-center -space-x-2'>
                        <div className='bg-purple-50 px-5 py-3 rounded-2xl border border-purple-100 flex flex-col items-center min-w-[100px]'>
                            <span className='text-[9px] font-black text-purple-400 uppercase tracking-widest'>Tracked Units</span>
                            <span className='text-xl font-black text-purple-900'>{tasks.length}</span>
                        </div>
                        <div className='bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 flex flex-col items-center min-w-[100px]'>
                            <span className='text-[9px] font-black text-emerald-400 uppercase tracking-widest'>Success Rate</span>
                            <span className='text-xl font-black text-emerald-900'>
                                {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed || t.status?.toLowerCase().includes('comp')).length / tasks.length) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={loadTasks}
                        disabled={loading}
                        className='p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 border border-slate-100'
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Task Grid/Table Container */}
            <div className='flex-1 overflow-auto custom-scrollbar rounded-3xl border border-slate-50'>
                {loading ? (
                    <div className='h-full flex flex-col items-center justify-center gap-4 py-20 bg-slate-50/20'>
                        <div className='relative'>
                            <Loader2 className='animate-spin text-purple-600' size={48} />
                            <Clock className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-200' size={20} />
                        </div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse'>Compiling Tactical Intelligence...</p>
                    </div>
                ) : error ? (
                    <div className='h-full flex flex-col items-center justify-center gap-4 py-20'>
                        <AlertCircle className='text-rose-500' size={48} />
                        <p className='text-sm font-black text-rose-900 uppercase tracking-widest'>{error}</p>
                        <button 
                            onClick={loadTasks}
                            className='px-8 py-3 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100'
                        >
                            Retry Uplink
                        </button>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center gap-6 py-20 opacity-40'>
                        <div className='w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center'>
                            <ClipboardList size={40} className='text-slate-300' />
                        </div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic'>Task repository currently empty</p>
                    </div>
                ) : (
                    <table className='w-full border-collapse'>
                        <thead className='sticky top-0 bg-white/80 backdrop-blur-md z-10'>
                            <tr className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50'>
                                <th className='px-8 py-6 text-left'>Operational Agent</th>
                                <th className='px-8 py-6 text-left'>Tactical Objective</th>
                                <th className='px-8 py-6 text-center'>Mission Status</th>
                                <th className='px-8 py-6 text-center'>Efficiency Score</th>
                                <th className='px-8 py-6 text-center'>Management</th>
                                <th className='px-8 py-6 text-right'>Time Stamp</th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-50'>
                            {tasks.map((task, idx) => (
                                <tr key={task.id || idx} className='group hover:bg-purple-50/30 transition-all duration-300'>
                                    <td className='px-8 py-6'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xs font-black text-purple-600 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all'>
                                                <User size={16} />
                                            </div>
                                            <p className='text-sm font-black text-slate-900 tracking-tight'>{task.employeeName || task.firstName || 'Node-' + (idx+1)}</p>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6'>
                                        <div className='max-w-xs'>
                                            <p className='text-xs font-bold text-slate-700 group-hover:text-purple-700 transition-colors'>{task.taskTitle || task.title}</p>
                                            <p className='text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-tight line-clamp-1'>{task.description || 'No additional parameters provided'}</p>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6'>
                                        <div className='flex justify-center'>
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider shadow-sm ${getStatusStyles(task.status || (task.completed ? 'Completed' : task.active ? 'In Progress' : 'New'))}`}>
                                                {getStatusIcon(task.status || (task.completed ? 'Completed' : task.active ? 'In Progress' : 'New'))}
                                                {task.status || (task.completed ? 'Completed' : task.active ? 'In Progress' : 'New')}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-center'>
                                        <div className='inline-flex items-center justify-center w-12 h-12 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-lg transition-all'>
                                            <span className={`text-sm font-black ${task.score >= 8 ? 'text-emerald-500' : 'text-slate-900'}`}>{task.score || '--'}/10</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-center'>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task);
                                            }}
                                            className='p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 border border-rose-100 opacity-0 group-hover:opacity-100'
                                            title="Purge Objective"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                    <td className='px-8 py-6 text-right'>

                                        <div className='flex flex-col items-end opacity-60 group-hover:opacity-100 transition-opacity'>
                                            <div className='flex items-center gap-1.5 text-slate-500 font-bold text-[9px]'>
                                                <Calendar size={10} />
                                                {task.taskDate || task.date || 'TBD'}
                                            </div>
                                            <span className='text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1'>Cycle Ref: 2024.X</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── ACTION MODAL ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${
                            modal.type === 'success' ? 'bg-emerald-500' : 
                            modal.type === 'error' ? 'bg-rose-500' : 
                            modal.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                <BarChart3 size={100} className="text-white" />
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={32} /> : 
                                 modal.type === 'error' ? <AlertCircle className="text-rose-500" size={32} /> : 
                                 <BarChart3 className="text-amber-500" size={32} />}
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl text-white tracking-tight">{modal.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                                {modal.message}
                            </p>
                            <div className="flex gap-3">
                                {modal.onConfirm ? (
                                    <>
                                        <button 
                                            onClick={() => setModal({ ...modal, show: false })}
                                            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            Abort
                                        </button>
                                        <button 
                                            onClick={() => {
                                                modal.onConfirm();
                                                setModal({ ...modal, show: false });
                                            }}
                                            className={`flex-1 py-4 ${
                                                modal.type === 'warning' ? 'bg-amber-500' : 'bg-blue-600'
                                            } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                                        >
                                            Confirm
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setModal({ ...modal, show: false })}
                                        className={`w-full py-4 ${
                                            modal.type === 'success' ? 'bg-emerald-500' : 
                                            modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-600'
                                        } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                                    >
                                        Acknowledge
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskStatus

