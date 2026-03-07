import React, { useState, useEffect } from 'react';
import { Bell, Send, Trash2, Clock, Info, AlertTriangle, CheckCircle2, Search, Filter, Loader2, Megaphone, Terminal } from 'lucide-react';
import { fetchNotifications, postNotification } from '../../../api/notificationApi';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const [type, setType] = useState('info');

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true);
                const data = await fetchNotifications();
                setNotifications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Central Intelligence Offline:", error);
            } finally {
                setLoading(false);
            }
        };
        loadNotifications();
    }, []);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newNotif = {
            title,
            message,
            category,
            type,
            isActive: true,
            isRead: false
        };

        try {
            const response = await postNotification(newNotif);
            setNotifications([response, ...notifications]);
            setTitle('');
            setMessage('');
            alert("Broadcast transmitted successfully to all active nodes.");
        } catch (error) {
            console.error("Transmission Failure:", error);
            alert("Emergency: Signal could not be broadcast.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'success': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    return (
        <div className='flex gap-8 h-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden'>
            <div className='w-full lg:w-1/3 p-10 bg-indigo-50/50 rounded-[3rem] border border-indigo-100 h-fit relative'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl -z-10'></div>
                <div className='flex items-center gap-4 mb-10'>
                    <div className='p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200'>
                        <Megaphone size={24} />
                    </div>
                    <div>
                        <h2 className='text-3xl font-black text-indigo-900 tracking-tight uppercase'>Broadcaster</h2>
                        <p className='text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1'>Global Transmission Hub</p>
                    </div>
                </div>

                <form onSubmit={handleBroadcast} className='flex flex-col gap-6 relative z-10'>
                    <div className='space-y-2'>
                        <label className='text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1'>Subject (Title)</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isSubmitting}
                            placeholder='e.g. System Protocol Update'
                            className='w-full p-4 bg-white rounded-2xl border border-indigo-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold shadow-sm'
                        />
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1'>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='w-full p-4 bg-white rounded-2xl border border-indigo-100 outline-none focus:border-indigo-500 text-sm font-bold shadow-sm cursor-pointer appearance-none'
                            >
                                <option value="GENERAL">General</option>
                                <option value="ATTENDANCE">Attendance</option>
                                <option value="SALARY">Salary</option>
                                <option value="TASK">Task</option>
                                <option value="SYSTEM">System</option>
                            </select>
                        </div>
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1'>Priority Level</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className='w-full p-4 bg-white rounded-2xl border border-indigo-100 outline-none focus:border-indigo-500 text-sm font-bold shadow-sm cursor-pointer appearance-none'
                            >
                                <option value="info">Information</option>
                                <option value="success">Confirmed</option>
                                <option value="warning">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1'>Payload (Message)</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            disabled={isSubmitting}
                            placeholder='Input detailed operative parameters...'
                            className='w-full p-4 bg-white rounded-2xl border border-indigo-100 outline-none focus:border-indigo-500 h-36 resize-none text-sm font-medium shadow-sm leading-relaxed'
                        ></textarea>
                    </div>

                    <button 
                        disabled={isSubmitting}
                        className='bg-indigo-900 hover:bg-black text-white py-5 rounded-2xl transition-all font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3 group px-8'
                    >
                        {isSubmitting ? <Loader2 size={16} className='animate-spin' /> : <Terminal size={16} className='group-hover:rotate-12 transition-transform' />}
                        {isSubmitting ? 'Transmitting Signal...' : 'Initiate Broadcast'}
                    </button>
                </form>
            </div>

            <div className='hidden lg:flex flex-1 p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 h-full flex-col overflow-hidden'>
                <div className='flex items-center justify-between mb-10'>
                    <div className='flex items-center gap-4'>
                        <div className='p-4 bg-white rounded-[1.5rem] shadow-sm border border-slate-100'>
                            <Bell size={24} className='text-indigo-600' />
                        </div>
                        <div>
                            <h2 className='text-3xl font-black text-slate-800 tracking-tight uppercase'>Transmission Log</h2>
                            <p className='text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1'>Global History Audit</p>
                        </div>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4'>
                    {loading ? (
                        <div className='flex flex-col items-center justify-center h-full gap-4 text-slate-400'>
                            <Loader2 className='animate-spin' size={48} />
                            <span className='text-[10px] font-black uppercase tracking-[0.3em]'>Decrypting Archive...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className='flex flex-col items-center justify-center h-full gap-4 opacity-30'>
                            <Megaphone size={64} />
                            <span className='text-[10px] font-black uppercase tracking-widest'>No transmissions recorded.</span>
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className='p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group animate-in slide-in-from-right duration-300'>
                                <div className='flex gap-6'>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
                                        ${notif.type === 'warning' ? 'bg-amber-50' : notif.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'}
                                    `}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex justify-between items-start mb-2'>
                                            <div>
                                                <h3 className='font-black text-lg text-slate-800 tracking-tight leading-tight uppercase group-hover:text-indigo-600 transition-colors'>{notif.title}</h3>
                                                <span className='text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1 block'>{notif.category} Analysis</span>
                                            </div>
                                            <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2'>
                                                <Clock size={12} /> {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Active'}
                                            </span>
                                        </div>
                                        <p className='text-sm text-slate-500 font-medium leading-relaxed'>{notif.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
