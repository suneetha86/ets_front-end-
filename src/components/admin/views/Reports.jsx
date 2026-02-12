import React, { useContext } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Note: Recharts is not installed, but since this is frontend-only request and I cannot easily install packages without user permission/workflow, 
// I will create simple CSS-based visualization fallback if recharts fails, or just use simple stats cards.
// Assuming "Generate basic reports" means simple statistics display for this environment.

const Reports = () => {
    const { userData } = useContext(AuthContext)

    // Stats Logic
    const totalEmployees = userData.length
    const activeEmployees = userData.filter(u => u.active !== false).length

    // Task Stats
    const totalTasks = userData.reduce((acc, curr) => acc + curr.taskCounts.active + curr.taskCounts.newTask + curr.taskCounts.completed + curr.taskCounts.failed, 0)
    const completedTasks = userData.reduce((acc, curr) => acc + curr.taskCounts.completed, 0)

    // Department Distribution
    const deptCounts = userData.reduce((acc, curr) => {
        const dept = curr.department || 'Unassigned'
        acc[dept] = (acc[dept] || 0) + 1
        return acc
    }, {})

    return (
        <div className='h-full overflow-auto pr-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100'>
            <h2 className='text-3xl font-bold mb-8 text-purple-900'>System Reports</h2>

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
                    <div className='h-72 w-full'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(deptCounts).map(([name, value]) => ({ name, value }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {Object.entries(deptCounts).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-lg'>
                    <h3 className='text-lg font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <div className='w-2 h-6 bg-purple-600 rounded-full'></div>
                        Recent Task Activity
                    </h3>
                    <div className='space-y-4'>
                        {userData.slice(0, 5).map((user, i) => (
                            <div key={i} className='flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700'>
                                        {user.firstName.charAt(0)}
                                    </div>
                                    <span className='font-bold text-gray-700'>{user.firstName}</span>
                                </div>
                                <div className='flex gap-3 text-[10px] font-black uppercase tracking-wider'>
                                    <span className='bg-green-100 text-green-700 px-2.5 py-1 rounded-full'>{user.taskCounts.completed} Done</span>
                                    <span className='bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full'>{user.taskCounts.active} Live</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports
