import React, { useState, useEffect, useContext } from 'react'
import { Bell, Check, Clock, Trash2, Info, AlertTriangle, CheckCircle2, MoreVertical, Search, Filter, Eye, X, Loader2 } from 'lucide-react'
import { fetchEmployeeNotifications, markAsRead as apiMarkAsRead, fetchNotificationById, fetchEmployeeUnreadNotifications, deleteNotification as apiDeleteNotification } from '../../../api/notificationApi'
import { AuthContext } from '../../../context/AuthProvider'




const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedNotif, setSelectedNotif] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filterUnread, setFilterUnread] = useState(false)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' })
    const { userData } = useContext(AuthContext)
    const email = userData?.email


    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true)
                const data = filterUnread ? await fetchEmployeeUnreadNotifications(email) : await fetchEmployeeNotifications(email)
                setNotifications(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Transmission Interruption:", error)
            } finally {
                setLoading(false)
            }
        }
        loadNotifications()
    }, [filterUnread])


    const handleMarkAsRead = async (id) => {
        try {
            await apiMarkAsRead(id)
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))

        } catch (error) {
            console.error("Handshake Failure:", error)
        }
    }

    const deleteNotification = async (id) => {
        try {
            await apiDeleteNotification(id)
            setNotifications(notifications.filter(n => n.id !== id))
        } catch (error) {
            console.error("Signal Termination Failed:", error)
        }
    }


    const markAllAsRead = async () => {
        try {
            const unreadItems = notifications.filter(n => !n.read)
            await Promise.all(unreadItems.map(item => apiMarkAsRead(item.id)))
            setNotifications(notifications.map(n => ({ ...n, read: true })))
            setModal({
                show: true,
                title: "Acknowledge Success",
                message: "All active signals have been acknowledged and synchronized.",
                type: 'success'
            });
        } catch (error) {
            console.error("Batch Acknowledgement Failed:", error)
        }
    }



    const clearAll = () => {
        setNotifications([])
    }

    const handleView = async (notif) => {
        try {
            // Fetch fresh data for the modal
            const freshNotif = await fetchNotificationById(notif.id)
            setSelectedNotif(freshNotif)
            setIsModalOpen(true)
            if (!freshNotif.read) handleMarkAsRead(freshNotif.id)
        } catch (error) {
            console.error("Failed to fetch detailed notification:", error)
        }
    }



    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />
            case 'warning': return <AlertTriangle className="text-amber-500" size={20} />
            case 'error': return <Info className="text-red-500" size={20} />
            default: return <Info className="text-blue-500" size={20} />
        }
    }

    const getTimeDisplay = (createdAt) => {
        if (!createdAt) return "Recent"
        return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

            {loading ? (
                <div className='flex flex-col items-center justify-center h-96 gap-4'>
                    <Loader2 className='text-indigo-500 animate-spin' size={48} />
                    <span className='text-slate-400 text-[10px] font-black uppercase tracking-widest'>Decrypting Signal...</span>
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className='flex flex-wrap gap-4 items-center'>
                        <div className='relative flex-1 min-w-[300px]'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                            <input
                                type="text"
                                placeholder="Filter alerts..."
                                className='w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium'
                            />
                        </div>
                        <button
                            onClick={() => setFilterUnread(!filterUnread)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filterUnread
                                ? 'bg-blue-600 text-white border-blue-400 shadow-lg'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            {filterUnread ? 'Showing Unread' : 'Show Unread Only'}
                        </button>
                    </div>


                    {/* List */}
                    <div className='space-y-4'>
                        {notifications.length === 0 ? (
                            <div className='bg-white rounded-xl border border-dashed border-slate-200 p-20 flex flex-col items-center justify-center gap-4 text-center'>
                                <div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300'>
                                    <Bell size={32} />
                                </div>
                                <div className='uppercase italic'>
                                    <h4 className='font-black text-slate-400 text-lg tracking-widest'>Silence in the Network</h4>
                                    <p className='text-[10px] text-slate-400 font-black mt-2 tracking-widest opacity-50 underline'>No Active Intelligence Streams</p>
                                </div>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleView(notif)}
                                    className={`group bg-white p-4 rounded-xl border-l-4 shadow-sm transition-all duration-200 cursor-pointer 
                                        ${notif.read ? 'border-l-slate-200 opacity-70 grayscale-[0.3]' : 'border-l-indigo-600 hover:shadow-md'}
                                        ${notif.read ? 'bg-slate-50/50' : 'bg-white'} 
                                        border-y border-r border-slate-100
                                    `}

                                >
                                    <div className='flex gap-4 items-start'>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center 
                                            ${notif.type?.toUpperCase() === 'SUCCESS' ? 'bg-emerald-50' : notif.type?.toUpperCase() === 'WARNING' ? 'bg-amber-50' : 'bg-blue-50'}
                                        `}>

                                            {getIcon(notif.type)}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex justify-between items-start mb-1'>
                                                <div className='flex flex-col gap-0.5'>
                                                    <div className='flex items-center gap-2'>
                                                        <h3 className={`text-base font-black truncate tracking-tight uppercase ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}>
                                                            {notif.title}
                                                        </h3>
                                                        {!notif.read && <span className='w-2 h-2 rounded-full bg-indigo-600 shadow-lg animate-pulse'></span>}

                                                    </div>
                                                    <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>{notif.category}</span>
                                                </div>
                                                <span className='text-[10px] items-center flex gap-1 text-slate-400 font-bold uppercase shrink-0'>
                                                    <Clock size={12} className='text-slate-300' /> {getTimeDisplay(notif.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-sm leading-relaxed truncate ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>
                                                {notif.message}
                                            </p>

                                            <div className='flex gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <button 
                                                    onClick={() => handleView(notif)}
                                                    className='text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-1'
                                                >
                                                    <Eye size={14} /> Full View
                                                </button>
                                                {!notif.read && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleMarkAsRead(notif.id)
                                                        }}
                                                        className='text-[10px] font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center gap-1'
                                                    >
                                                        <Check size={14} /> Mark Read
                                                    </button>
                                                )}

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
                </>
            )}

            {/* Notification Detail Modal */}
            {isModalOpen && selectedNotif && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300'>
                    <div className='bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20'>
                        <div className={`p-8 flex justify-between items-center text-white ${selectedNotif.type?.toUpperCase() === 'SUCCESS' ? 'bg-emerald-600' :
                                selectedNotif.type?.toUpperCase() === 'WARNING' ? 'bg-amber-500' : 'bg-indigo-600'
                            }`}>

                            <div className='flex items-center gap-4'>
                                <div className='p-3 bg-white/10 rounded-2xl backdrop-blur-sm'>
                                    {getIcon(selectedNotif.type)}
                                </div>
                                <div>
                                    <h3 className='font-black text-xl leading-tight uppercase tracking-tight'>{selectedNotif.title}</h3>
                                    <p className='text-[9px] opacity-70 uppercase font-black tracking-[0.2em] mt-1'>{selectedNotif.category} Analysis</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-white/20 rounded-full transition-colors'>
                                <X size={24} />
                            </button>
                        </div>
                        <div className='p-10'>
                            <div className='flex items-center gap-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-fit'>
                                <Clock size={16} className='text-slate-400' />
                                <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Protocol Logged: {getTimeDisplay(selectedNotif.createdAt)}</span>
                            </div>
                            <div className='p-6 bg-slate-900 rounded-3xl text-slate-300 text-sm font-medium leading-relaxed border border-white/5 shadow-inner'>
                                {selectedNotif.message}
                            </div>
                            <div className='mt-12 pt-8 border-t border-slate-100 flex justify-end gap-3'>
                                <button
                                    onClick={() => deleteNotification(selectedNotif.id) || setIsModalOpen(false)}
                                    className='px-6 py-2.5 rounded-xl text-[10px] font-black text-white bg-blue-500 hover:bg-blue-600 transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100'
                                >
                                    <Trash2 size={14} /> PURGE ALERT
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className='px-8 py-2.5 rounded-xl text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all uppercase tracking-widest border border-transparent'
                                >
                                    Close Terminal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${
                            modal.type === 'success' ? 'bg-emerald-500' : 
                            modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                        }`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                <Bell size={100} className="text-white" />
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={32} /> : 
                                 modal.type === 'error' ? <AlertTriangle className="text-rose-500" size={32} /> : 
                                 <Bell className="text-blue-500" size={32} />}
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl text-white tracking-tight">{modal.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                                {modal.message}
                            </p>
                            <button 
                                onClick={() => setModal({ ...modal, show: false })}
                                className={`w-full py-4 ${
                                    modal.type === 'success' ? 'bg-emerald-500' : 
                                    modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-600'
                                } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                            >
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notifications

