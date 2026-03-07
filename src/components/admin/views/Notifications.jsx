import React, { useState, useMemo } from 'react'
import { Bell, Send, User, Users, Filter, Search, Clock, CheckCircle, Info, AlertTriangle, X, ChevronLeft, ChevronRight, Layout, Trash2 } from 'lucide-react'

/* ══════════════════════════════════════════════
   STATIC ADMIN NOTIFICATION DATA
   ══════════════════════════════════════════════ */
const initialNotifications = [
    { id: 'NOT-1001', title: 'System Maintenance', message: 'The server will be down for maintenance on March 15 from 12:00 AM to 04:00 AM.', target: 'All Employees', type: 'Alert', priority: 'High', date: '2026-03-05', status: 'Delivered', sender: 'System Admin' },
    { id: 'NOT-1002', title: 'Q2 Performance Reviews', message: 'Managers strictly need to complete all Q2 Performance Reviews by March 10.', target: 'All Departments', type: 'Information', priority: 'Medium', date: '2026-03-04', status: 'Delivered', sender: 'HR Admin' },
    { id: 'NOT-1003', title: 'New Leave Policy', message: 'The new leave policy regarding carry-forward days has been updated in the handbook.', target: 'Design Department', type: 'Success', priority: 'Low', date: '2026-03-03', status: 'Delivered', sender: 'Admin' },
    { id: 'NOT-1004', title: 'Monthly Town Hall', message: 'Join us for the monthly town hall meeting on March 1st at 11 AM.', target: 'Engineering Department', type: 'Information', priority: 'Medium', date: '2026-02-28', status: 'Expired', sender: 'System Admin' },
    { id: 'NOT-1005', title: 'Office Resumption', message: 'Full office resumption from March 01. Please collect your new access badges.', target: 'All Employees', type: 'Alert', priority: 'High', date: '2026-02-25', status: 'Delivered', sender: 'Operations' },
];

const Notifications = () => {
    const [notifications, setNotifications] = useState(initialNotifications)
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('All Types')
    
    // Form state for new notification
    const [newNotif, setNewNotif] = useState({
        title: '',
        message: '',
        target: 'All Employees',
        type: 'Information',
        priority: 'Medium'
    })

    const filteredNotifs = useMemo(() => {
        return notifications.filter(n => {
            const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = selectedType === 'All Types' || n.type === selectedType
            return matchesSearch && matchesType
        })
    }, [searchQuery, selectedType, notifications])

    const handleSendNotification = (e) => {
        e.preventDefault()
        const id = `NOT-${1000 + notifications.length + 1}`
        const date = new Date().toISOString().split('T')[0]
        const created = {
            ...newNotif,
            id,
            date,
            status: 'Delivered',
            sender: 'Admin'
        }
        setNotifications([created, ...notifications])
        setIsComposeOpen(false)
        setNewNotif({ title: '', message: '', target: 'All Employees', type: 'Information', priority: 'Medium' })
    }

    const deleteNotif = (id) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const typeIcons = {
        Information: <Info className="text-sky-500" size={16} />,
        Alert: <AlertTriangle className="text-rose-500" size={16} />,
        Success: <CheckCircle className="text-emerald-500" size={16} />,
    }

    const priorityColors = {
        High: 'bg-rose-50 text-rose-600 border-rose-100',
        Medium: 'bg-amber-50 text-amber-600 border-amber-100',
        Low: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }

    return (
        <div className='h-full flex flex-col gap-6 font-sans text-slate-800'>
            {/* ── Header ────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Admin Notifications</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Communication Command Center</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-purple-200 transition-all flex items-center gap-2"
                    >
                        <Send size={18} /> Compose
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* ── Filter Sidebar ───────────────────────────── */}
                <div className="lg:w-72 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Search</p>
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus-within:ring-2 ring-purple-100 transition-all">
                                <Search size={16} className="text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Keywords..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent text-sm font-bold outline-none w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Notice Type</p>
                            <div className="flex flex-col gap-2">
                                {['All Types', 'Information', 'Alert', 'Success'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setSelectedType(t)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedType === t ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {t !== 'All Types' && (t === 'Information' ? <Info size={14} /> : t === 'Alert' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />)}
                                            {t}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl shadow-xl space-y-4">
                        <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Broadcast Stats</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-white">
                                <span className="text-xs font-medium opacity-70">Weekly Sent</span>
                                <span className="text-lg font-black">{notifications.length}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-[80%]" />
                            </div>
                            <p className="text-[10px] text-purple-200 leading-relaxed font-black opacity-80 uppercase italic tracking-tighter cursor-pointer">Overall reach is exceptionally high this quarter. Proceed with further communications.</p>
                        </div>
                    </div>
                </div>

                {/* ── Notification Feed ───────────────────────────── */}
                <div className="flex-1 flex flex-col gap-4 min-h-0 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest">Broadcast History</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">{filteredNotifs.length} Notices Logged</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-1 gap-4">
                            {filteredNotifs.length > 0 ? filteredNotifs.map(n => (
                                <div key={n.id} className="group flex flex-col md:flex-row gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:border-purple-200 transition-all relative overflow-hidden">
                                    <div className="flex-1 space-y-3 relative z-10">
                                        <div className="flex items-center gap-3">
                                            {typeIcons[n.type]}
                                            <h3 className="text-lg font-black text-slate-800 leading-tight">{n.title}</h3>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${priorityColors[n.priority]}`}>
                                                {n.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                            {n.message}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5"><Layout size={12} /> Target: <span className="text-slate-800">{n.target}</span></div>
                                            <div className="flex items-center gap-1.5"><Clock size={12} /> Sent: <span className="text-slate-800">{n.date}</span></div>
                                            <div className="flex items-center gap-1.5"><User size={12} /> From: <span className="text-slate-800">{n.sender}</span></div>
                                        </div>
                                    </div>
                                    <div className="flex md:flex-col justify-between items-end gap-4 relative z-10 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            <span className={`text-xs font-black uppercase ${n.status === 'Delivered' ? 'text-emerald-500' : 'text-slate-300'}`}>{n.status}</span>
                                        </div>
                                        <button 
                                            onClick={() => deleteNotif(n.id)}
                                            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mb-16 blur-3xl opacity-50 group-hover:bg-purple-50 transition-colors" />
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                    <Bell size={64} className="mb-4" />
                                    <p className="font-black uppercase tracking-[0.2em]">No notices match the filter</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400"><ChevronLeft size={16} /></button>
                            <span className="text-[10px] font-black text-slate-800">Page 1 of 1</span>
                            <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Compose Modal ──────────────────── */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                        <div className="bg-purple-600 p-8 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Compose Broadcast</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1">Designate Target & Transmit</p>
                            </div>
                            <button 
                                onClick={() => setIsComposeOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSendNotification} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Broadcast Title</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. Q4 Townhall Meeting"
                                        value={newNotif.title}
                                        onChange={(e) => setNewNotif({...newNotif, title: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 ring-purple-200 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Audience</label>
                                    <select 
                                        value={newNotif.target}
                                        onChange={(e) => setNewNotif({...newNotif, target: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 ring-purple-200 transition-all"
                                    >
                                        <option>All Employees</option>
                                        <option>All Departments</option>
                                        <option>Engineering Team</option>
                                        <option>Design Team</option>
                                        <option>Sales Force</option>
                                        <option>Management Only</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Priority Level</label>
                                    <div className="flex gap-2">
                                        {['Low', 'Medium', 'High'].map(p => (
                                            <button 
                                                key={p}
                                                type="button"
                                                onClick={() => setNewNotif({...newNotif, priority: p})}
                                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${newNotif.priority === p ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Notice Category</label>
                                    <select 
                                        value={newNotif.type}
                                        onChange={(e) => setNewNotif({...newNotif, type: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 ring-purple-200 transition-all"
                                    >
                                        <option>Information</option>
                                        <option>Alert</option>
                                        <option>Success</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Detailed Message</label>
                                <textarea 
                                    required
                                    rows="4"
                                    placeholder="Enter your detailed broadcast message here..."
                                    value={newNotif.message}
                                    onChange={(e) => setNewNotif({...newNotif, message: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 ring-purple-200 transition-all placeholder:text-slate-300 resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsComposeOpen(false)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all"
                                >
                                    Discard
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={16} /> Transmit Broadcast
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notifications
