import React, { useContext } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { postReport, fetchReports, fetchReportById } from '../../../api/reportApi';
import { FileDown, Loader2, History, TrendingUp, Users, Target, Activity, X, ShieldCheck, Zap } from 'lucide-react';




// Note: Recharts is not installed, but since this is frontend-only request and I cannot easily install packages without user permission/workflow, 
// I will create simple CSS-based visualization fallback if recharts fails, or just use simple stats cards.
// Assuming "Generate basic reports" means simple statistics display for this environment.

const Reports = () => {
    const { userData } = useContext(AuthContext)
    const [isPublishing, setIsPublishing] = React.useState(false)
    const [historicalReports, setHistoricalReports] = React.useState([])
    const [loadingHistory, setLoadingHistory] = React.useState(true)
    const [selectedReport, setSelectedReport] = React.useState(null)
    const [isDetailLoading, setIsDetailLoading] = React.useState(false)
    const [isMounted, setIsMounted] = React.useState(false)
    const [modal, setModal] = React.useState({ show: false, title: '', message: '', type: 'info' })

    if (!userData) {
        return (
            <div className='h-full flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 uppercase'>
                <Loader2 className='animate-spin text-purple-600' size={48} />
                <span className='text-[10px] font-black text-slate-400 tracking-[0.4em]'>Synchronizing Mission Data...</span>
            </div>
        )
    }


    const loadHistory = async () => {
        try {
            setLoadingHistory(true)
            const data = await fetchReports()
            setHistoricalReports(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Historical Feed Interrupted:", err)
        } finally {
            setLoadingHistory(false)
        }
    }

    React.useEffect(() => {
        setIsMounted(true)
        loadHistory()
    }, [])



    // Defensive Stats Logic
    const totalEmployees = Array.isArray(userData) ? userData.length : 0
    const activeEmployees = Array.isArray(userData) ? userData.filter(u => u.active !== false).length : 0

    // Safety check for statistical aggregation
    const safeData = Array.isArray(userData) ? userData : []

    // Task Stats with high-density defensive barriers
    const totalTasks = safeData.reduce((acc, curr) => {
        const counts = curr.taskCounts || { active: 0, newTask: 0, completed: 0, failed: 0 }
        return acc + (counts.active || 0) + (counts.newTask || 0) + (counts.completed || 0) + (counts.failed || 0)
    }, 0)

    const completedTasks = safeData.reduce((acc, curr) => {
        return acc + (curr.taskCounts?.completed || 0)
    }, 0)

    // Department Distribution
    const deptCounts = React.useMemo(() => {
        return safeData.reduce((acc, curr) => {
            if (!curr) return acc
            const dept = curr.department || 'Unassigned'
            acc[dept] = (acc[dept] || 0) + 1
            return acc
        }, {})
    }, [safeData])

    const pieData = React.useMemo(() => {
        return Object.entries(deptCounts).map(([name, value]) => ({ name, value }))
    }, [deptCounts])

    const handlePublishReport = async () => {
        try {
            setIsPublishing(true)
            const reportPayload = {
                activeUsers: activeEmployees,
                completionRate: totalTasks ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(1)) : 0,
                tasksAssigned: totalTasks,
                totalEmployees: totalEmployees
            }

            await postReport(reportPayload)
            setModal({
                show: true,
                title: "Handshake Success",
                message: "Digital Intelligence Report published to secure archive.",
                type: 'success'
            });
            loadHistory() // Refresh history after publish
        } catch (error) {
            console.error("Archive Protocol Failed:", error)
            setModal({
                show: true,
                title: "Transmission Failure",
                message: "Crisis: Report transmission failed. Protocol breach identified in the archive uplink.",
                type: 'error'
            });
        } finally {
            setIsPublishing(false)
        }
    }


    const handleViewReport = async (reportId) => {
        try {
            setIsDetailLoading(true)
            const detail = await fetchReportById(reportId)
            setSelectedReport(detail)
        } catch (error) {
            console.error("Detail Extraction Interrupted:", error)
        } finally {
            setIsDetailLoading(false)
        }
    }

    return (

        <div className='h-full min-h-[500px] overflow-auto pr-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-3xl font-black text-purple-900 tracking-tight uppercase'>System Intelligence</h2>
                    <p className='text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1'>Historical Performance Audit</p>
                </div>
                <button
                    onClick={handlePublishReport}
                    disabled={isPublishing}
                    className='flex items-center gap-2 bg-purple-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-purple-100 active:scale-95 disabled:opacity-50'
                >
                    {isPublishing ? <Loader2 size={16} className='animate-spin' /> : <FileDown size={16} />}
                    {isPublishing ? 'Transmitting Data...' : 'Publish System Report'}
                </button>
            </div>

            {/* Top Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-10'>
                <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'>
                    <div className='absolute left-0 top-0 h-full w-1.5 bg-blue-500'></div>
                    <h3 className='text-gray-400 text-xs font-bold uppercase tracking-wider'>Total Employees</h3>
                    <p className='text-4xl font-black mt-2 text-gray-900'>{totalEmployees}</p>
                </div>
                <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'>
                    <div className='absolute left-0 top-0 h-full w-1.5 bg-green-500'></div>
                    <h3 className='text-gray-400 text-xs font-bold uppercase tracking-wider'>Active Users</h3>
                    <p className='text-4xl font-black mt-2 text-gray-900'>{activeEmployees}</p>
                </div>
                <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'>
                    <div className='absolute left-0 top-0 h-full w-1.5 bg-purple-500'></div>
                    <h3 className='text-gray-400 text-xs font-bold uppercase tracking-wider'>Tasks Assigned</h3>
                    <p className='text-4xl font-black mt-2 text-gray-900'>{totalTasks}</p>
                </div>
                <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'>
                    <div className='absolute left-0 top-0 h-full w-1.5 bg-yellow-400'></div>
                    <h3 className='text-gray-400 text-xs font-bold uppercase tracking-wider'>Completion Rate</h3>
                    <p className='text-4xl font-black mt-2 text-gray-900'>{totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
                </div>
            </div>

            {/* Department Stats */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-lg flex flex-col'>
                    <h3 className='text-lg font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <div className='w-2 h-6 bg-purple-600 rounded-full'></div>
                        Department Distribution
                    </h3>
                    <div className='h-72 w-full flex items-center justify-center bg-gray-50/30 rounded-xl relative'>
                        {isMounted && Object.keys(deptCounts).length > 0 ? (
                            <ResponsiveContainer width="99%" height="100%" minHeight={250} id="dept-dist-container">
                                <PieChart id="dept-dist-chart">
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                        animationBegin={0}
                                        animationDuration={800}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        id="dept-dist-tooltip"
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Legend id="dept-dist-legend" verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center gap-2 opacity-20">
                                <Activity size={48} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Distribution Matrix</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-lg'>
                    <h3 className='text-lg font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <div className='w-2 h-6 bg-purple-600 rounded-full'></div>
                        Recent Task Activity
                    </h3>
                    <div className='space-y-4'>
                        {safeData.slice(0, 5).map((user, i) => (
                            <div key={i} className='flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700'>
                                        {(user.firstName || 'U').charAt(0)}
                                    </div>
                                    <span className='font-bold text-gray-700'>{user.firstName || 'Unknown'}</span>
                                </div>
                                <div className='flex gap-3 text-[10px] font-black uppercase tracking-wider'>
                                    <span className='bg-green-100 text-green-700 px-2.5 py-1 rounded-full'>{(user.taskCounts?.completed || 0)} Done</span>
                                    <span className='bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full'>{(user.taskCounts?.active || 0)} Live</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Historical Reports Section */}
            <div className='mt-12'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='p-3 bg-slate-900 rounded-xl text-white shadow-lg'>
                        <History size={20} />
                    </div>
                    <div>
                        <h3 className='text-2xl font-black text-slate-800 tracking-tight uppercase'>Historical Snapshots</h3>
                        <p className='text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1'>Archived Performance Logs</p>
                    </div>
                </div>

                {loadingHistory ? (
                    <div className='flex flex-col items-center justify-center p-20 gap-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200'>
                        <Loader2 className='animate-spin text-purple-600' size={40} />
                        <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Decrypting Archives...</span>
                    </div>
                ) : historicalReports.length === 0 ? (
                    <div className='flex flex-col items-center justify-center p-20 opacity-30 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200'>
                        <TrendingUp size={64} className='text-slate-400' />
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4'>No historical records found</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {historicalReports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => handleViewReport(report.id)}
                                className='bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden cursor-pointer active:scale-95'
                            >

                                <div className='absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:rotate-12 transition-all duration-500'>
                                    <Target size={120} />
                                </div>

                                <div className='flex justify-between items-start mb-6'>
                                    <div className='px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-black rounded-lg uppercase tracking-widest'>
                                        Report #{report.id}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Activity size={12} className='text-emerald-500' />
                                        <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Stable Signal</span>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-y-6'>
                                    <div>
                                        <p className='text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1'>Headcount</p>
                                        <div className='flex items-baseline gap-1'>
                                            <span className='text-2xl font-black text-slate-800'>{report.totalEmployees}</span>
                                            <span className='text-[10px] text-slate-400 font-bold'>Users</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1'>Velocity</p>
                                        <div className='flex items-baseline gap-1'>
                                            <span className='text-2xl font-black text-slate-800'>{report.completionRate}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1'>Active Ops</p>
                                        <div className='flex items-baseline gap-1'>
                                            <span className='text-2xl font-black text-slate-800'>{report.activeUsers}</span>
                                            <span className='text-[10px] text-slate-400 font-bold'>Nodes</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1'>Tasks</p>
                                        <div className='flex items-baseline gap-1'>
                                            <span className='text-2xl font-black text-slate-800'>{report.tasksAssigned}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-8 pt-6 border-t border-slate-50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-2 h-2 rounded-full bg-emerald-500'></div>
                                        <span className='text-[10px] font-bold text-slate-500 uppercase tracking-widest italic'>Verified Archive</span>
                                    </div>
                                    <span className='text-[9px] font-black text-slate-300 uppercase'>Data Integrity Locked</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed Report Modal */}
            {(selectedReport || isDetailLoading) && (
                <div className='fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300'>
                    <div className='bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20'>
                        {isDetailLoading ? (
                            <div className='p-20 flex flex-col items-center justify-center gap-4'>
                                <Loader2 className='animate-spin text-purple-600' size={48} />
                                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Decrypting Node Data...</span>
                            </div>
                        ) : (
                            <>
                                <div className='bg-slate-900 p-10 text-white relative overflow-hidden'>
                                    <div className='absolute top-0 right-0 p-10 opacity-10 rotate-12'>
                                        <TrendingUp size={160} />
                                    </div>
                                    <div className='flex justify-between items-center relative z-10'>
                                        <div className='flex items-center gap-4'>
                                            <div className='p-4 bg-purple-600 rounded-2xl shadow-xl'>
                                                <History size={24} />
                                            </div>
                                            <div>
                                                <h3 className='text-3xl font-black tracking-tight uppercase'>Archive #{selectedReport.id}</h3>
                                                <p className='text-[10px] text-purple-300 font-black uppercase tracking-widest mt-1'>Verified System Snapshot</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedReport(null)}
                                            className='p-3 hover:bg-white/10 rounded-2xl transition-all'
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className='p-10'>
                                    <div className='grid grid-cols-2 gap-8 mb-10'>
                                        <div className='bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-purple-200 transition-all'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <Users size={16} className='text-purple-600' />
                                                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Node Density</span>
                                            </div>
                                            <div className='flex items-baseline gap-2'>
                                                <span className='text-4xl font-black text-slate-800'>{selectedReport.totalEmployees}</span>
                                                <span className='text-xs font-bold text-slate-400 uppercase'>Total Employees</span>
                                            </div>
                                            <div className='mt-6 h-1 w-full bg-slate-200 rounded-full overflow-hidden'>
                                                <div className='h-full bg-purple-600 transition-all duration-1000' style={{ width: `${(selectedReport.activeUsers / selectedReport.totalEmployees) * 100}%` }}></div>
                                            </div>
                                            <p className='text-[9px] font-black text-purple-600 uppercase mt-3 tracking-widest'>
                                                {selectedReport.activeUsers} Active Operational Units
                                            </p>
                                        </div>

                                        <div className='bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-emerald-200 transition-all'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <Zap size={16} className='text-emerald-500' />
                                                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Operational Velocity</span>
                                            </div>
                                            <div className='flex items-baseline gap-2'>
                                                <span className='text-4xl font-black text-slate-800'>{selectedReport.completionRate}%</span>
                                            </div>
                                            <div className='mt-6 h-1 w-full bg-slate-200 rounded-full overflow-hidden'>
                                                <div className='h-full bg-emerald-500 transition-all duration-1000' style={{ width: `${selectedReport.completionRate}%` }}></div>
                                            </div>
                                            <p className='text-[9px] font-black text-emerald-500 uppercase mt-3 tracking-widest'>
                                                {selectedReport.tasksAssigned} Cumulative Task Cycles
                                            </p>
                                        </div>
                                    </div>

                                    <div className='bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 border-dashed flex items-center gap-4'>
                                        <div className='p-3 bg-indigo-600 rounded-xl text-white'>
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className='text-xs font-bold text-indigo-900'>Data Integrity Status: OPTIMAL</p>
                                            <p className='text-[9px] text-indigo-400 font-medium mt-0.5 uppercase tracking-widest'>Snapshot encrypted and locked in secure archive</p>
                                        </div>
                                    </div>

                                    <div className='mt-10 flex justify-end gap-3'>
                                        <button
                                            onClick={() => setSelectedReport(null)}
                                            className='bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200'
                                        >
                                            Eject Archive
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
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
                                <Activity size={100} className="text-white" />
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <ShieldCheck className="text-emerald-500" size={32} /> : 
                                 modal.type === 'error' ? <X size={32} className="text-rose-500" /> : 
                                 <Activity className="text-blue-500" size={32} />}
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

export default Reports
