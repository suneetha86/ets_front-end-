import React, { useState } from 'react'
import { Bell, Check, Clock, Trash2, Info, AlertTriangle, CheckCircle2, MoreVertical, Search, Filter, Eye, X } from 'lucide-react'

const Notifications = () => {
    // 6 Static items
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Salary Credited",
            message: "Your salary for September 2025 has been credited to your account.",
            time: "2 hours ago",
            type: "success",
            read: false,
            category: "Salary"
        },
        {
            id: 2,
            title: "Task Deadline Approaching",
            message: "The 'E-commerce API Integration' task is due in 4 hours. High priority!",
            time: "4 hours ago",
            type: "warning",
            read: false,
            category: "Task"
        },
        {
            id: 3,
            title: "Attendance Correction Approved",
            message: "Your attendance correction request for Aug 28th has been approved by Admin.",
            time: "Yesterday",
            type: "info",
            read: true,
            category: "Attendance"
        },
        {
            id: 4,
            title: "New Policy Update",
            message: "Please review the updated remote work policy in the documents section.",
            time: "2 days ago",
            type: "info",
            read: true,
            category: "General"
        },
        {
            id: 5,
            title: "System Maintenance",
            message: "Portal will be offline for 2 hours this Sunday (Oct 5) starting 10:00 PM.",
            time: "3 days ago",
            type: "warning",
            read: true,
            category: "System"
        },
        {
            id: 6,
            title: "New Training Video Available",
            message: "A new training video on 'Nexus Workflow' has been added to your dashboard.",
            time: "4 days ago",
            type: "info",
            read: true,
            category: "Training"
        }
    ])

    const [selectedNotif, setSelectedNotif] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const clearAll = () => {
        setNotifications([])
    }

    const handleView = (notif) => {
        setSelectedNotif(notif)
        setIsModalOpen(true)
        markAsRead(notif.id)
    }

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />
            case 'warning': return <AlertTriangle className="text-amber-500" size={20} />
            case 'error': return <Info className="text-red-500" size={20} />
            default: return <Info className="text-blue-500" size={20} />
        }
    }

    return (
        <div className='flex flex-col gap-6 h-full overflow-y-auto pb-10 custom-scrollbar'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 via-blue-400 to-white p-8 rounded-2xl shadow-lg border-b mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
                <div className='flex items-center gap-4'>
                    <div className='bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl'>
                        <Bell className="text-white" size={32} />
                    </div>
                    <div>
                        <h2 className='text-3xl font-black text-white tracking-tight drop-shadow-sm'>
                            Notifications
                        </h2>
                        <p className='text-blue-50 text-xs font-bold uppercase tracking-widest opacity-80'>AJA Event Monitoring</p>
                    </div>
                </div>
                <div className='flex gap-3 w-full md:w-auto'>
                    <button
                        onClick={markAllAsRead}
                        className='flex-1 md:flex-none text-[10px] font-black bg-blue-600 text-white px-6 py-3 rounded-xl border border-blue-400 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl'
                    >
                        <Check size={16} /> Mark all read
                    </button>
                    <button
                        onClick={clearAll}
                        className='flex-1 md:flex-none text-[10px] font-black bg-blue-600 backdrop-blur-md text-white px-6 py-3 rounded-xl border border-blue-400 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg'
                    >
                        <Trash2 size={16} /> Clear all
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className='flex flex-wrap gap-4 items-center'>
                <div className='relative flex-1 min-w-[300px]'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                    <input
                        type="text"
                        placeholder="Search alerts..."
                        className='w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium'
                    />
                </div>
                <button className='bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20'>
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* List */}
            <div className='space-y-4'>
                {notifications.length === 0 ? (
                    <div className='bg-white rounded-xl border border-dashed border-slate-200 p-20 flex flex-col items-center justify-center gap-4 text-center'>
                        <div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300'>
                            <Bell size={32} />
                        </div>
                        <div>
                            <h4 className='font-bold text-slate-800 text-lg'>All caught up!</h4>
                            <p className='text-sm text-slate-500'>You have no pending notifications at the moment.</p>
                        </div>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => handleView(notif)}
                            className={`group bg-white p-4 rounded-xl border-l-4 shadow-sm transition-all duration-200 cursor-pointer 
                                ${notif.read ? 'border-l-slate-200 opacity-70 grayscale-[0.3]' : 'border-l-blue-600 hover:shadow-md'}
                                ${notif.read ? 'bg-slate-50/50' : 'bg-white'} 
                                border-y border-r border-slate-100
                            `}
                        >
                            <div className='flex gap-4 items-start'>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center 
                                    ${notif.type === 'success' ? 'bg-emerald-50' : notif.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'}
                                `}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex justify-between items-start mb-1'>
                                        <div className='flex flex-col gap-0.5'>
                                            <div className='flex items-center gap-2'>
                                                <h3 className={`text-base font-bold truncate tracking-tight ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}>
                                                    {notif.title}
                                                </h3>
                                                {!notif.read && <span className='w-2 h-2 rounded-full bg-blue-600 shadow-lg animate-pulse'></span>}
                                            </div>
                                            <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>{notif.category}</span>
                                        </div>
                                        <span className='text-[10px] items-center flex gap-1 text-slate-400 font-bold uppercase shrink-0'>
                                            <Clock size={12} className='text-slate-300' /> {notif.time}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed truncate ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>
                                        {notif.message}
                                    </p>
                                    <div className='flex gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <button className='text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-1'>
                                            <Eye size={14} /> Full View
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deleteNotification(notif.id)
                                            }}
                                            className='text-[10px] font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest flex items-center gap-1 ml-auto'
                                        >
                                            <Trash2 size={14} /> Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Notification Detail Modal */}
            {isModalOpen && selectedNotif && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4'>
                    <div className='bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
                        <div className={`p-6 flex justify-between items-center text-white ${selectedNotif.type === 'success' ? 'bg-emerald-600' :
                                selectedNotif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-600'
                            }`}>
                            <div className='flex items-center gap-3'>
                                {getIcon(selectedNotif.type)}
                                <div>
                                    <h3 className='font-bold text-lg leading-tight'>{selectedNotif.title}</h3>
                                    <p className='text-[10px] opacity-80 uppercase tracking-widest'>{selectedNotif.category} Alert</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-white/20 rounded-full transition-colors'>
                                <X size={20} />
                            </button>
                        </div>
                        <div className='p-8'>
                            <div className='flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 w-fit'>
                                <Clock size={16} className='text-slate-400' />
                                <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Recorded: {selectedNotif.time}</span>
                            </div>
                            <p className='text-slate-700 leading-relaxed text-base font-medium whitespace-pre-wrap'>
                                {selectedNotif.message}
                            </p>
                            <div className='mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3'>
                                <button
                                    onClick={() => deleteNotification(selectedNotif.id) || setIsModalOpen(false)}
                                    className='px-6 py-2.5 rounded-xl text-[10px] font-black text-white bg-blue-500 hover:bg-blue-600 transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100'
                                >
                                    <Trash2 size={14} /> Delete Permanent
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className='px-8 py-2.5 rounded-xl text-[10px] font-black text-white bg-slate-800 hover:bg-slate-900 shadow-xl shadow-slate-200 transition-all uppercase tracking-widest border border-transparent'
                                >
                                    Close Terminal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notifications
