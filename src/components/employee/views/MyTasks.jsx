import React, { useState } from 'react'
import { Wallet, Bell, ChevronRight, TrendingUp, X, Clock } from 'lucide-react'
import TaskListNumbers from '../../other/TaskListNumbers'
import TaskList from '../../TaskList/TaskList'
import Analytics from './Analytics'

const MyTasks = ({ data }) => {
    const [selectedNotif, setSelectedNotif] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const dashboardNotifications = [
        {
            id: 1,
            title: "Q3 Performance Policy",
            message: "The new Q3 Performance Policy has been released. This includes updated KPIs for technical staff and new remote work guidelines that will be effective from October 1st. Please review carefully to ensure compliance with the new standards.",
            time: "2 hours ago",
            type: "info",
            category: "Policy"
        },
        {
            id: 2,
            title: "Daily Report Reminder",
            message: "Reminder: Please submit your daily work report before 6 PM today. Accurate reporting is essential for project tracking and resource allocation. If you encounter any issues with the reporting tool, contact the IT helpdesk immediately.",
            time: "4 hours ago",
            type: "warning",
            category: "System"
        },
        {
            id: 3,
            title: "System Maintenance",
            message: "The Nexus portal will be offline for 2 hours this Sunday (Oct 5) starting 10:00 PM for scheduled database optimization and security patches.",
            time: "Yesterday",
            type: "info",
            category: "System"
        }
    ]

    const handleViewNotif = (notif) => {
        setSelectedNotif(notif)
        setIsModalOpen(true)
    }

    return (
        <div className='h-full overflow-auto pr-2 custom-scrollbar pb-10'>
            <TaskListNumbers data={data} />

            {/* Summary Cards */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
                {/* Salary Overview Card */}
                <div className='bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-lg border border-white/10 text-white relative overflow-hidden group hover:shadow-indigo-500/20 hover:scale-[1.01] transition-all duration-300'>
                    <div className='absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:rotate-12 transition-transform duration-500'>
                        <Wallet size={120} />
                    </div>

                    <div className='relative z-10 flex flex-col h-full justify-between'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-xs font-bold uppercase tracking-widest text-blue-100 opacity-80'>Net Compensation</p>
                                <h3 className='text-3xl font-black mt-1 tracking-tighter'>₹65,700</h3>
                            </div>
                            <div className='bg-white/20 p-2 rounded-xl backdrop-blur-sm'>
                                <TrendingUp size={20} />
                            </div>
                        </div>

                        <div className='mt-6 pt-4 border-t border-white/10 flex justify-between items-center'>
                            <div>
                                <p className='text-[10px] uppercase font-black text-blue-100 opacity-60'>Expected Cycle</p>
                                <p className='text-sm font-bold'>30 Sept, 2025</p>
                            </div>
                            <button className='bg-white text-blue-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-blue-50 transition-colors'>
                                View Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications Card */}
                <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all duration-300'>
                    <div className='flex justify-between items-center mb-6'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-amber-50 text-amber-600 p-2.5 rounded-xl'>
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3 className='font-black text-slate-800 tracking-tight'>Pulse Updates</h3>
                                <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>{dashboardNotifications.length} New Alerts</p>
                            </div>
                        </div>
                        <ChevronRight className='text-slate-300 group-hover:translate-x-1 transition-transform' size={20} />
                    </div>

                    <div className='space-y-4'>
                        {dashboardNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => handleViewNotif(notif)}
                                className='flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-transparent hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm hover:shadow-md'
                            >
                                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse`}></div>
                                <div className='flex-1'>
                                    <p className='text-xs font-bold text-slate-700 leading-tight group-hover:text-blue-700 transition-colors'>{notif.title}</p>
                                    <p className='text-[9px] text-slate-400 font-medium mt-0.5'>{notif.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Analytics />
            <TaskList data={data} />

            {/* Notification Detail Modal */}
            {isModalOpen && selectedNotif && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 transition-all duration-300'>
                    <div className='bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300'>
                        <div className={`p-6 flex justify-between items-center text-white ${selectedNotif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-600'
                            }`}>
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <Bell size={20} />
                                </div>
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
                                <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>{selectedNotif.time}</span>
                            </div>
                            <p className='text-slate-700 leading-relaxed text-base font-medium whitespace-pre-wrap select-text'>
                                {selectedNotif.message}
                            </p>
                            <div className='mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3'>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className='px-8 py-2.5 rounded-xl text-[10px] font-black text-white bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-900/20 transition-all uppercase tracking-widest'
                                >
                                    Review Completed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyTasks
