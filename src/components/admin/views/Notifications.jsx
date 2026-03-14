import React, { useState, useEffect } from 'react';
import { fetchNotifications, postNotification, updateNotification, deleteNotification, markAsRead } from '../../../api/notificationApi';
import { Bell, Send, Trash2, Clock, Info, AlertTriangle, CheckCircle2, Search, Filter, Loader2, Megaphone, Terminal, Edit, X, CheckCheck } from 'lucide-react';
import Modal from '../../common/Modal';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const [type, setType] = useState('INFO');
    const [editingId, setEditingId] = useState(null);

    // Modal state
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
        isConfirm: false,
        onConfirm: () => { }
    });

    const showModal = (title, message, type = 'success', isConfirm = false, onConfirm = () => { }) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type,
            isConfirm,
            onConfirm
        });
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await fetchNotifications();
            const sortedData = Array.isArray(data) ? data : [];
            setNotifications(sortedData);

            // Automatically mark unread ones as read when visiting the log
            const unreadIds = sortedData.filter(n => !n.read).map(n => n.id);
            if (unreadIds.length > 0) {
                // We do this in the background to avoid blocking the UI
                Promise.all(unreadIds.map(id => markAsRead(id))).catch(err =>
                    console.error("Archive Read Update Failed:", err)
                );
            }
        } catch (error) {
            console.error("Central Intelligence Offline:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length === 0) return;

        try {
            setIsSubmitting(true);
            await Promise.all(unreadIds.map(id => markAsRead(id)));
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            showModal("Success", "All transmissions marked as read.", "success");
        } catch (error) {
            console.error("Purge Read Status Failed:", error);
            showModal("Error", "Failed to update read status.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            title,
            message,
            category,
            type,
            read: false,
            createdAt: editingId ? notifications.find(n => n.id === editingId)?.createdAt : null
        };

        try {
            if (editingId) {
                const response = await updateNotification(editingId, payload);
                setNotifications(notifications.map(n => n.id === editingId ? response : n));
                showModal("Updated", "Archive entry recalibrated successfully.", "success");
            } else {
                await postNotification(payload);
                showModal("Broadcasted", "Submit successfully: Signal transmitted successfully to all active nodes.", "success");
                loadNotifications(); // Refresh all data from server
            }
            handleReset();
        } catch (error) {
            console.error("Transmission Failure:", error);
            showModal("Crisis", "Emergency: Signal could not be processed.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (notif) => {
        setEditingId(notif.id);
        setTitle(notif.title);
        setMessage(notif.message);
        setCategory(notif.category || 'GENERAL');
        setType(notif.type?.toUpperCase() || 'INFO');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        setEditingId(null);
        setTitle('');
        setMessage('');
        setCategory('GENERAL');
        setType('INFO');
    };


    const handleDelete = async (id) => {
        showModal(
            "Confirm Purge",
            "Are you sure you want to permanently delete this transmission record? This action is irreversible.",
            "warning",
            true,
            async () => {
                try {
                    await deleteNotification(id);
                    setNotifications(notifications.filter(n => n.id !== id));
                } catch (error) {
                    console.error("Purge Signal Failed:", error);
                    showModal("Crisis", "Transmission record could not be deleted.", "error");
                }
            }
        );
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
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                isConfirm={modalConfig.isConfirm}
                onConfirm={modalConfig.onConfirm}
            />

            <div className='w-full lg:w-1/3 p-10 text-black bg-indigo-50/50 rounded-[3rem] border border-indigo-100 h-fit relative'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl -z-10'></div>
                <div className='flex items-center gap-4 mb-10'>
                    <div className='p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200'>
                        <Megaphone size={24} />
                    </div>
                    <div>
                        <h2 className='text-3xl font-black text-indigo-900 tracking-tight uppercase'>
                            {editingId ? 'Modifier' : 'Notifications'}
                        </h2>
                        <p className='text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1'>
                            {editingId ? 'Adjusting Archive Entry' : 'Global Transmission Hub'}
                        </p>
                    </div>
                    {editingId && (
                        <button
                            onClick={handleReset}
                            className='ml-auto p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors'
                            title="Cancel Edit"
                        >
                            <X size={16} />
                        </button>
                    )}
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
                                <option value="INFO">Information</option>
                                <option value="SUCCESS">Confirmed</option>
                                <option value="WARNING">Critical</option>

                            </select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1'>Description (Message)</label>
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
                        className={`py-5 rounded-2xl transition-all font-black uppercase tracking-widest text-[11px] shadow-xl active:scale-95 flex items-center justify-center gap-3 group px-8 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-indigo-900 hover:bg-black shadow-indigo-100'
                            } text-white`}
                    >
                        {isSubmitting ? <Loader2 size={16} className='animate-spin' /> : <Terminal size={16} className='group-hover:rotate-12 transition-transform' />}
                        {isSubmitting ? 'Processing Signal...' : editingId ? 'Update Archive' : 'SUBMIT'}
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
                            <h2 className='text-3xl font-black text-slate-800 tracking-tight uppercase'>Notification Log</h2>
                            <p className='text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1'>Global History Audit</p>
                        </div>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllAsRead}
                            disabled={isSubmitting}
                            className='flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100'
                        >
                            <CheckCheck size={14} /> Clear Unread
                        </button>
                    )}
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
                                        ${notif.type?.toUpperCase() === 'WARNING' ? 'bg-amber-50' : notif.type?.toUpperCase() === 'SUCCESS' ? 'bg-emerald-50' : 'bg-blue-50'}
                                    `}>

                                        {getIcon(notif.type)}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex justify-between items-start mb-2'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <span className='text-[10px] font-black text-indigo-600 uppercase tracking-widest'>Subject:</span>
                                                    <h3 className='font-black text-lg text-slate-800 tracking-tight leading-tight uppercase group-hover:text-indigo-600 transition-colors'>{notif.title}</h3>
                                                </div>
                                                <span className='text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1 block'>{notif.category} Analysis</span>
                                            </div>
                                            <div className='flex flex-col items-end gap-2'>
                                                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2'>
                                                    <Clock size={12} /> {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Active'}
                                                </span>
                                                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-all'>
                                                    <button
                                                        onClick={() => handleEdit(notif)}
                                                        className='p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm'
                                                        title="Edit Entry"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(notif.id)}
                                                        className='p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm'
                                                        title="Purge Signal"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                            </div>
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
