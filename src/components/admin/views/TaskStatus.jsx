import React, { useState, useEffect, useMemo } from 'react'
import { fetchAdminTasks, deleteAdminTask } from '../../../api/taskApi'
import { fetchAssignedTasks, deleteAssignTask } from '../../../api/assignTaskApi'
import {
    Loader2, ClipboardList, CheckCircle2, Clock, AlertCircle,
    RefreshCw, BarChart3, User, Calendar, Trash2,
    Search, ChevronUp, ChevronDown, ChevronsUpDown,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X
} from 'lucide-react'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

const TaskStatus = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: null })

    // ── Search ──
    const [searchQuery, setSearchQuery] = useState('')

    // ── Sorting ──
    const [sortKey, setSortKey] = useState('date')
    const [sortDir, setSortDir] = useState('desc') // 'asc' | 'desc'

    // ── Pagination ──
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // ─────────────────────────────────────────
    // Data fetching
    // ─────────────────────────────────────────
    const loadTasks = async () => {
        try {
            setLoading(true)
            setError(null)

            const [adminResult, assignedResult] = await Promise.allSettled([
                fetchAdminTasks(),
                fetchAssignedTasks()
            ])

            const adminTasks = adminResult.status === 'fulfilled' && Array.isArray(adminResult.value)
                ? adminResult.value : []
            const assignedTasks = assignedResult.status === 'fulfilled' && Array.isArray(assignedResult.value)
                ? assignedResult.value : []

            const assignedIds = new Set(assignedTasks.map(t => t.id).filter(Boolean))
            const filteredAdmin = adminTasks.filter(t => !assignedIds.has(t.id))
            const merged = [...assignedTasks, ...filteredAdmin]

            if (merged.length === 0 && adminResult.status === 'rejected' && assignedResult.status === 'rejected') {
                setError("Failed to synchronize with task repository.")
            } else {
                setTasks(merged)
            }
        } catch (err) {
            console.error("Task Intelligence Feed Failure:", err)
            setError("Failed to synchronize with task repository.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadTasks() }, [])

    // ─────────────────────────────────────────
    // Delete logic
    // ─────────────────────────────────────────
    const handleDeleteTask = (task) => {
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
            await deleteAssignTask(task.id, task)
            setTasks(prev => prev.filter(t => t.id !== task.id))
            setModal({ show: true, title: "Deleted Successfully", message: "The task has been permanently deleted from the repository.", type: 'success' })
        } catch {
            try {
                await deleteAdminTask(task.id)
                setTasks(prev => prev.filter(t => t.id !== task.id))
                setModal({ show: true, title: "Deleted Successfully", message: "The task has been permanently deleted from the repository.", type: 'success' })
            } catch (legacyErr) {
                console.error("Archive Purge Blocked:", legacyErr)
                setModal({ show: true, title: "Protocol Breach", message: "Failed to remove objective from core repositories.", type: 'error' })
            }
        }
    }

    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────
    // Resolve agent display name — checks all possible field names from both endpoints
    const getAgentName = (task) =>
        task.employeeName || task.firstName || task.assignTo || task.assignedTo || task.employee || 'Unknown'

    const getStatusLabel = (task) =>
        task.status || (task.completed ? 'Completed' : task.active ? 'In Progress' : 'New')

    const getStatusStyles = (status) => {
        const s = status?.toLowerCase() || ''
        if (s.includes('completed') || s === 'done') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        if (s.includes('progress') || s === 'active') return 'bg-amber-50 text-amber-600 border-amber-100'
        if (s.includes('failed') || s.includes('overdue')) return 'bg-rose-50 text-rose-600 border-rose-100'
        return 'bg-slate-50 text-slate-500 border-slate-100'
    }

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase() || ''
        if (s.includes('completed') || s === 'done') return <CheckCircle2 size={12} />
        if (s.includes('progress') || s === 'active') return <Clock size={12} />
        if (s.includes('failed') || s.includes('overdue')) return <AlertCircle size={12} />
        return <ClipboardList size={12} />
    }

    // ─────────────────────────────────────────
    // Search → Filter
    // ─────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return tasks
        return tasks.filter(t => {
            const name = getAgentName(t).toLowerCase()
            const title = (t.taskTitle || t.title || '').toLowerCase()
            const desc = (t.description || '').toLowerCase()
            const status = getStatusLabel(t).toLowerCase()
            const date = (t.taskDate || t.date || '').toLowerCase()
            return name.includes(q) || title.includes(q) || desc.includes(q) || status.includes(q) || date.includes(q)
        })
    }, [tasks, searchQuery])

    // ─────────────────────────────────────────
    // Sort
    // ─────────────────────────────────────────
    const sorted = useMemo(() => {
        const arr = [...filtered]
        arr.sort((a, b) => {
            let aVal, bVal
            switch (sortKey) {
                case 'agent':
                    aVal = getAgentName(a).toLowerCase()
                    bVal = getAgentName(b).toLowerCase()
                    break
                case 'title':
                    aVal = (a.taskTitle || a.title || '').toLowerCase()
                    bVal = (b.taskTitle || b.title || '').toLowerCase()
                    break
                case 'status':
                    aVal = getStatusLabel(a).toLowerCase()
                    bVal = getStatusLabel(b).toLowerCase()
                    break
                case 'score':
                    aVal = a.score ?? -1
                    bVal = b.score ?? -1
                    break
                case 'date':
                    aVal = new Date(a.taskDate || a.date || 0).getTime()
                    bVal = new Date(b.taskDate || b.date || 0).getTime()
                    break
                default:
                    return 0
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
            return 0
        })
        return arr
    }, [filtered, sortKey, sortDir])

    // ─────────────────────────────────────────
    // Pagination
    // ─────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const paginated = useMemo(() => {
        const start = (safePage - 1) * pageSize
        return sorted.slice(start, start + pageSize)
    }, [sorted, safePage, pageSize])

    // Reset to page 1 when search/sort/pageSize changes
    useEffect(() => { setCurrentPage(1) }, [searchQuery, sortKey, sortDir, pageSize])

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    const SortIcon = ({ colKey }) => {
        if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300" />
        return sortDir === 'asc'
            ? <ChevronUp size={13} className="text-purple-600" />
            : <ChevronDown size={13} className="text-purple-600" />
    }

    const successRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.completed || getStatusLabel(t).toLowerCase().includes('comp')).length / tasks.length) * 100)
        : 0

    // ─────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────
    return (
        <div className='h-full flex flex-col gap-5 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>

            {/* ── Header ── */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h2 className='text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase'>
                        <div className='p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-200'>
                            <BarChart3 size={24} />
                        </div>
                        Strategic Task Audit
                    </h2>
                    <p className='text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2 ml-1'>Protocol: Global Operational Monitoring</p>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='bg-purple-50 px-5 py-3 rounded-2xl border border-purple-100 flex flex-col items-center min-w-[90px]'>
                        <span className='text-[9px] font-black text-purple-400 uppercase tracking-widest'>Total</span>
                        <span className='text-xl font-black text-purple-900'>{tasks.length}</span>
                    </div>
                    <div className='bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 flex flex-col items-center min-w-[90px]'>
                        <span className='text-[9px] font-black text-emerald-400 uppercase tracking-widest'>Success</span>
                        <span className='text-xl font-black text-emerald-900'>{successRate}%</span>
                    </div>
                    <div className='bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 flex flex-col items-center min-w-[90px]'>
                        <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Filtered</span>
                        <span className='text-xl font-black text-slate-900'>{filtered.length}</span>
                    </div>
                    <button
                        onClick={loadTasks}
                        disabled={loading}
                        className='p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 border border-slate-100'
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ── Search Bar ── */}
            <div className='relative flex items-center gap-3'>
                <div className='relative flex-1'>
                    <Search size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by agent, title, status, date..."
                        className='w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300 transition-all'
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors'
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
                {/* Page size selector */}
                <div className='flex items-center gap-2'>
                    <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap'>Rows:</span>
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className='py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-black text-slate-700 outline-none focus:border-purple-400 cursor-pointer transition-all'
                    >
                        {PAGE_SIZE_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Table Container ── */}
            <div className='flex-1 overflow-auto custom-scrollbar rounded-3xl border border-slate-50 min-h-0'>
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
                ) : sorted.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center gap-6 py-20 opacity-40'>
                        <div className='w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center'>
                            <ClipboardList size={40} className='text-slate-300' />
                        </div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic'>
                            {searchQuery ? `No results for "${searchQuery}"` : 'Task repository currently empty'}
                        </p>
                    </div>
                ) : (
                    <table className='w-full border-collapse'>
                        <thead className='sticky top-0 bg-white/90 backdrop-blur-md z-10'>
                            <tr className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100'>
                                {/* Sortable headers */}
                                {[
                                    { key: 'agent', label: 'Operational Agent', align: 'left' },
                                    { key: 'title', label: 'Tactical Objective', align: 'left' },
                                    { key: 'status', label: 'Mission Status', align: 'center' },
                                    { key: 'score', label: 'Efficiency Score', align: 'center' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        className={`px-8 py-5 text-${col.align} cursor-pointer select-none group hover:text-purple-600 transition-colors`}
                                        onClick={() => handleSort(col.key)}
                                    >
                                        <span className={`inline-flex items-center gap-1.5 ${col.align === 'center' ? 'justify-center w-full' : ''}`}>
                                            {col.label}
                                            <SortIcon colKey={col.key} />
                                        </span>
                                    </th>
                                ))}
                                <th className='px-8 py-5 text-center'>Management</th>
                                <th
                                    className='px-8 py-5 text-right cursor-pointer select-none hover:text-purple-600 transition-colors'
                                    onClick={() => handleSort('date')}
                                >
                                    <span className='inline-flex items-center justify-end gap-1.5 w-full'>
                                        Time Stamp <SortIcon colKey='date' />
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-50'>
                            {paginated.map((task, idx) => {
                                const statusLabel = getStatusLabel(task)
                                return (
                                    <tr key={task.id || idx} className='group hover:bg-purple-50/30 transition-all duration-200'>
                                        <td className='px-8 py-5'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-xs font-black text-purple-600 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all flex-shrink-0'>
                                                    <User size={15} />
                                                </div>
                                                <p className='text-sm font-black text-slate-900 tracking-tight'>
                                                    {getAgentName(task)}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='px-8 py-5'>
                                            <div className='max-w-xs'>
                                                <p className='text-xs font-bold text-slate-700 group-hover:text-purple-700 transition-colors'>
                                                    {task.taskTitle || task.title || '—'}
                                                </p>
                                                <p className='text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-tight line-clamp-1'>
                                                    {task.description || 'No additional parameters provided'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='px-8 py-5'>
                                            <div className='flex justify-center'>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider ${getStatusStyles(statusLabel)}`}>
                                                    {getStatusIcon(statusLabel)}
                                                    {statusLabel}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-8 py-5 text-center'>
                                            <div className='inline-flex items-center justify-center w-14 h-10 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-lg transition-all px-3'>
                                                {task.score != null
                                                    ? <span className={`text-sm font-black ${task.score >= 8 ? 'text-emerald-500' : task.score >= 5 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                        {task.score}/10
                                                      </span>
                                                    : <span className='text-[9px] font-black text-slate-300 uppercase tracking-widest'>N/A</span>
                                                }
                                            </div>
                                        </td>
                                        <td className='px-8 py-5 text-center'>
                                            <button
                                                onClick={e => { e.stopPropagation(); handleDeleteTask(task) }}
                                                className='p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 border border-rose-100 opacity-0 group-hover:opacity-100'
                                                title="Purge Objective"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                        <td className='px-8 py-5 text-right'>
                                            <div className='flex flex-col items-end opacity-60 group-hover:opacity-100 transition-opacity'>
                                                <div className='flex items-center gap-1.5 text-slate-500 font-bold text-[9px]'>
                                                    <Calendar size={10} />
                                                    {task.taskDate || task.date || 'TBD'}
                                                </div>
                                                <span className='text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1'>Cycle Ref: 2024.X</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Pagination Bar ── */}
            {!loading && !error && sorted.length > 0 && (
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-1'>
                    {/* Info */}
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                        Showing&nbsp;
                        <span className='text-purple-600'>{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)}</span>
                        &nbsp;of&nbsp;
                        <span className='text-purple-600'>{sorted.length}</span>
                        &nbsp;records
                    </p>

                    {/* Page Buttons */}
                    <div className='flex items-center gap-1'>
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={safePage === 1}
                            className='p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90'
                            title="First Page"
                        >
                            <ChevronsLeft size={15} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className='p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90'
                            title="Previous Page"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        {/* Page number pills */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                            .reduce((acc, p, i, arr) => {
                                if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                                acc.push(p)
                                return acc
                            }, [])
                            .map((item, i) =>
                                item === '...'
                                    ? <span key={`dots-${i}`} className='px-2 text-slate-400 font-black text-xs'>…</span>
                                    : (
                                        <button
                                            key={item}
                                            onClick={() => setCurrentPage(item)}
                                            className={`min-w-[36px] h-9 rounded-xl text-xs font-black border transition-all active:scale-90
                                                ${safePage === item
                                                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200'
                                                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    )
                            )
                        }

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            className='p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90'
                            title="Next Page"
                        >
                            <ChevronRight size={15} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={safePage === totalPages}
                            className='p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90'
                            title="Last Page"
                        >
                            <ChevronsRight size={15} />
                        </button>
                    </div>
                </div>
            )}

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
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                                {modal.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={32} /> :
                                 modal.type === 'error' ? <AlertCircle className="text-rose-500" size={32} /> :
                                 <BarChart3 className="text-amber-500" size={32} />}
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl text-white tracking-tight">{modal.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">{modal.message}</p>
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
                                            onClick={() => { modal.onConfirm(); setModal({ ...modal, show: false }) }}
                                            className={`flex-1 py-4 ${modal.type === 'warning' ? 'bg-amber-500' : 'bg-blue-600'} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
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
