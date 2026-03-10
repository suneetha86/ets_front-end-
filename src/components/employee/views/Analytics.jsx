import React from 'react'
import { Activity, Code, Clock, TrendingUp } from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, ComposedChart, Line, Legend, Cell
} from 'recharts';

const Analytics = () => {

    // Mock Data for Charts
    const attendanceData = [
        { day: 'Mon', hours: 8.5, max: 10 },
        { day: 'Tue', hours: 9, max: 10 },
        { day: 'Wed', hours: 8, max: 10 },
        { day: 'Thu', hours: 9.5, max: 10 },
        { day: 'Fri', hours: 7.5, max: 10 },
        { day: 'Sat', hours: 0, max: 10 },
        { day: 'Sun', hours: 0, max: 10 },
    ]

    const codingData = [
        { day: 'Mon', score: 20, max: 100 },
        { day: 'Tue', score: 35, max: 100 },
        { day: 'Wed', score: 10, max: 100 },
        { day: 'Thu', score: 50, max: 100 },
        { day: 'Fri', score: 25, max: 100 },
        { day: 'Sat', score: 60, max: 100 },
        { day: 'Sun', score: 30, max: 100 },
    ]

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-10'>

            {/* Attendance Analytics */}
            <div className='bg-white p-5 rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-emerald-100/50'>
                <div className='flex justify-between items-center mb-6'>
                    <div className='flex items-center gap-4'>
                        <div className='bg-emerald-50 text-emerald-600 p-3 rounded-2xl'>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className='text-xl font-black text-slate-800 tracking-tight'>Weekly Attendance (Hours)</h3>
                            <p className='text-[10px] text-slate-400 font-black uppercase tracking-widest'>Weekly Temporal Intelligence</p>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className='text-xs font-black text-emerald-600 mb-1'>AVG 8.5H</span>
                        <div className='h-1 w-12 bg-emerald-100 rounded-full overflow-hidden'>
                            <div className='h-full bg-emerald-500 w-3/4'></div>
                        </div>
                    </div>
                </div>

                <div className='h-[200px] w-full'>
                    <ResponsiveContainer width="99%" height={200} minWidth={0}>
                        <AreaChart data={attendanceData}>
                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis hide domain={[0, 12]} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '10px' }}
                                cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="hours"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorHours)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className='flex justify-between mt-8 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                        <span className='text-[10px] font-black text-slate-600 uppercase tracking-widest'>Active Node Status</span>
                    </div>
                    <span className='text-[10px] font-black text-emerald-700 uppercase'>42.5 TOTAL HRS</span>
                </div>
            </div>

            {/* Coding Performance (Line-Bar Analytic) */}
            <div className='bg-white p-5 rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-blue-100/50'>
                <div className='flex justify-between items-center mb-6'>
                    <div className='flex items-center gap-4'>
                        <div className='bg-blue-50 text-blue-600 p-3 rounded-2xl'>
                            <Code size={24} />
                        </div>
                        <div>
                            <h3 className='text-xl font-black text-slate-800 tracking-tight'>Coding Performance</h3>
                            <p className='text-[10px] text-slate-400 font-black uppercase tracking-widest'>Performance Trend Analytics</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl'>
                        <TrendingUp size={14} className='text-blue-600' />
                        <span className='text-[10px] font-black text-blue-600'>+14%</span>
                    </div>
                </div>

                <div className='h-[200px] w-full'>
                    <ResponsiveContainer width="99%" height={200} minWidth={0}>
                        <ComposedChart data={codingData}>
                            <defs>
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '10px' }}
                            />
                            <Bar
                                dataKey="score"
                                barSize={24}
                                radius={[6, 6, 0, 0]}
                                fill="url(#colorBar)"
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#fff', stroke: '#2563eb', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                                animationDuration={2500}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className='flex justify-between mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50'>
                    <div className='flex items-center gap-2 text-blue-700'>
                        <Activity size={12} />
                        <span className='text-[10px] font-black uppercase tracking-widest'>Peak Performance: 60 (Sat)</span>
                    </div>
                    <span className='text-[10px] font-black text-blue-700 uppercase'>Aggregate Score: 230</span>
                </div>
            </div>

        </div>
    )
}

export default Analytics
