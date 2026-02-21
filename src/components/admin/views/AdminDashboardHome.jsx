import React, { useState } from 'react'
import {
    Users, Clock, CheckSquare, BarChart2, TrendingUp,
    AlertCircle, Award, Briefcase, Calendar, Activity, ArrowUpRight,
    ArrowDownRight, Star, Target, Zap, Shield, X, Eye
} from 'lucide-react'

/* ══════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════ */

const stats = [
    { id: 1, label: 'Total Employees', value: '128', change: '+4', up: true, icon: Users, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', iconColor: 'text-violet-600', detail: 'Active headcount across all departments as of today.' },
    { id: 2, label: 'Present Today', value: '104', change: '+6', up: true, icon: Clock, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', iconColor: 'text-emerald-600', detail: 'Employees who have marked their attendance today.' },
    { id: 3, label: 'Tasks Completed', value: '342', change: '+18', up: true, icon: CheckSquare, color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50', iconColor: 'text-sky-600', detail: 'Total tasks marked done in the current sprint cycle.' },
    { id: 4, label: 'Pending Tasks', value: '57', change: '-3', up: false, icon: AlertCircle, color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', iconColor: 'text-rose-500', detail: 'Tasks not yet completed and awaiting action from team members.' },
    { id: 5, label: 'Departments', value: '9', change: '+1', up: true, icon: Briefcase, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', iconColor: 'text-amber-600', detail: 'Total active departments currently operational in the organisation.' },
    { id: 6, label: 'Reports Generated', value: '24', change: '+5', up: true, icon: BarChart2, color: 'from-fuchsia-400 to-pink-500', bg: 'bg-fuchsia-50', iconColor: 'text-fuchsia-600', detail: 'Admin and system reports generated in the current month.' },
]

const allStats = [
    { metric: 'Total Employees', value: '128', change: '+4', trend: '▲', status: 'Good', note: 'Includes permanent and contract staff' },
    { metric: 'Present Today', value: '104', change: '+6', trend: '▲', status: 'Good', note: '81% attendance rate' },
    { metric: 'On Leave', value: '10', change: '0', trend: '–', status: 'Normal', note: '5 approved, 5 pending' },
    { metric: 'Tasks Completed', value: '342', change: '+18', trend: '▲', status: 'Excellent', note: 'Current sprint cycle' },
    { metric: 'Pending Tasks', value: '57', change: '-3', trend: '▼', status: 'Review', note: 'Down from last week' },
    { metric: 'Overdue Tasks', value: '12', change: '+2', trend: '▲', status: 'Alert', note: 'Requires immediate attention' },
    { metric: 'Departments', value: '9', change: '+1', trend: '▲', status: 'Good', note: 'New: AI Research added' },
    { metric: 'Reports Generated', value: '24', change: '+5', trend: '▲', status: 'Good', note: 'Feb 2026' },
    { metric: 'New Joiners (Month)', value: '6', change: '+6', trend: '▲', status: 'Good', note: 'All onboarded successfully' },
    { metric: 'Resignations (Month)', value: '2', change: '0', trend: '–', status: 'Normal', note: 'Exit interviews scheduled' },
    { metric: 'Avg. Task Completion', value: '84%', change: '+3%', trend: '▲', status: 'Good', note: 'Across all teams' },
    { metric: 'Avg. Attendance Rate', value: '91%', change: '+2%', trend: '▲', status: 'Excellent', note: 'Rolling 30-day avg.' },
]

const allActivities = [
    { id: 1, user: 'Riya Sharma', action: 'Completed task', task: 'API Integration', time: '5 min ago', avatar: 'RS', avatarBg: 'bg-violet-500', dept: 'Engineering', type: 'Task' },
    { id: 2, user: 'Arjun Mehta', action: 'Submitted report', task: 'Q1 Finance Report', time: '22 min ago', avatar: 'AM', avatarBg: 'bg-sky-500', dept: 'Finance', type: 'Report' },
    { id: 3, user: 'Priya Nair', action: 'Marked attendance', task: 'Daily Check-in', time: '45 min ago', avatar: 'PN', avatarBg: 'bg-emerald-500', dept: 'Design', type: 'Attendance' },
    { id: 4, user: 'Dev Kumar', action: 'Added new employee', task: 'Sneha Joshi', time: '1 hr ago', avatar: 'DK', avatarBg: 'bg-amber-500', dept: 'HR', type: 'HR' },
    { id: 5, user: 'Neha Gupta', action: 'Updated department', task: 'Engineering Team', time: '2 hrs ago', avatar: 'NG', avatarBg: 'bg-rose-500', dept: 'HR', type: 'Admin' },
    { id: 6, user: 'Rahul Singh', action: 'Submitted coding task', task: 'React Components', time: '3 hrs ago', avatar: 'RS', avatarBg: 'bg-fuchsia-500', dept: 'Engineering', type: 'Task' },
    { id: 7, user: 'Anita Kapoor', action: 'Approved leave', task: 'Sick Leave – Mar 2', time: '4 hrs ago', avatar: 'AK', avatarBg: 'bg-teal-500', dept: 'HR', type: 'HR' },
    { id: 8, user: 'Vikram Das', action: 'Closed support ticket', task: 'Ticket #1042', time: '5 hrs ago', avatar: 'VD', avatarBg: 'bg-indigo-500', dept: 'Operations', type: 'Support' },
    { id: 9, user: 'Sonal Mehta', action: 'Completed daily task', task: 'Client Follow-up', time: '6 hrs ago', avatar: 'SM', avatarBg: 'bg-pink-500', dept: 'Sales', type: 'Task' },
    { id: 10, user: 'Karan Joshi', action: 'Submitted assignment', task: 'SQL Optimisation', time: '7 hrs ago', avatar: 'KJ', avatarBg: 'bg-orange-500', dept: 'Engineering', type: 'Task' },
    { id: 11, user: 'Deepa Rao', action: 'Generated report', task: 'Monthly HR Summary', time: '8 hrs ago', avatar: 'DR', avatarBg: 'bg-cyan-600', dept: 'HR', type: 'Report' },
    { id: 12, user: 'Mohit Verma', action: 'Updated attendance', task: 'Correction for Feb 18', time: 'Yesterday', avatar: 'MV', avatarBg: 'bg-lime-600', dept: 'Operations', type: 'Attendance' },
]

const allEmployees = [
    { rank: 1, name: 'Riya Sharma', dept: 'Engineering', tasks: 42, rating: 4.9, status: 'Active', joined: 'Jan 2023', avatar: 'RS', avatarBg: 'bg-violet-500' },
    { rank: 2, name: 'Arjun Mehta', dept: 'Finance', tasks: 38, rating: 4.8, status: 'Active', joined: 'Mar 2022', avatar: 'AM', avatarBg: 'bg-sky-500' },
    { rank: 3, name: 'Priya Nair', dept: 'Design', tasks: 35, rating: 4.7, status: 'Active', joined: 'Jun 2022', avatar: 'PN', avatarBg: 'bg-emerald-500' },
    { rank: 4, name: 'Dev Kumar', dept: 'HR', tasks: 30, rating: 4.6, status: 'Active', joined: 'Nov 2021', avatar: 'DK', avatarBg: 'bg-amber-500' },
    { rank: 5, name: 'Neha Gupta', dept: 'Engineering', tasks: 28, rating: 4.5, status: 'Active', joined: 'Aug 2023', avatar: 'NG', avatarBg: 'bg-rose-500' },
    { rank: 6, name: 'Rahul Singh', dept: 'Engineering', tasks: 25, rating: 4.4, status: 'Active', joined: 'Feb 2024', avatar: 'RS', avatarBg: 'bg-fuchsia-500' },
    { rank: 7, name: 'Anita Kapoor', dept: 'Operations', tasks: 22, rating: 4.3, status: 'On Leave', joined: 'Sep 2022', avatar: 'AK', avatarBg: 'bg-teal-500' },
    { rank: 8, name: 'Vikram Das', dept: 'Sales', tasks: 20, rating: 4.2, status: 'Active', joined: 'Apr 2023', avatar: 'VD', avatarBg: 'bg-indigo-500' },
    { rank: 9, name: 'Sonal Mehta', dept: 'Design', tasks: 18, rating: 4.1, status: 'Active', joined: 'Jul 2024', avatar: 'SM', avatarBg: 'bg-pink-500' },
    { rank: 10, name: 'Karan Joshi', dept: 'Finance', tasks: 17, rating: 4.0, status: 'Active', joined: 'Jan 2025', avatar: 'KJ', avatarBg: 'bg-orange-500' },
]

const allMetrics = [
    { label: 'Avg. Attendance', value: '91%', icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50', trend: '▲ +2%', note: 'Rolling 30-day average across all staff' },
    { label: 'On-time Tasks', value: '84%', icon: Shield, color: 'text-sky-600', bg: 'bg-sky-50', trend: '▲ +3%', note: 'Tasks submitted before the deadline' },
    { label: 'Productivity Index', value: '78%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '▲ +5%', note: 'Based on task output per employee' },
    { label: 'Employee Satisfaction', value: '82%', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', trend: '▲ +1%', note: 'Last monthly pulse survey result' },
    { label: 'Leave Utilisation', value: '34%', icon: Clock, color: 'text-pink-600', bg: 'bg-pink-50', trend: '– 0%', note: 'Of annual entitlement used this year' },
    { label: 'Training Completion', value: '67%', icon: Award, color: 'text-teal-600', bg: 'bg-teal-50', trend: '▲ +8%', note: 'Mandatory training modules completed' },
    { label: 'Overdue Task Rate', value: '9%', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '▼ -2%', note: 'Percentage of tasks past due date' },
    { label: 'Overall Performance', value: 'A-', icon: BarChart2, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '▲ +12%', note: 'Composite organisational score for Feb 2026' },
]

const allDepartments = [
    { name: 'Engineering', count: 42, percent: 33, color: 'bg-violet-500', head: 'Riya Sharma', budget: '₹18L', status: 'Active' },
    { name: 'Sales', count: 24, percent: 19, color: 'bg-fuchsia-500', head: 'Vikram Das', budget: '₹10L', status: 'Active' },
    { name: 'Finance', count: 18, percent: 14, color: 'bg-sky-500', head: 'Arjun Mehta', budget: '₹9L', status: 'Active' },
    { name: 'Operations', count: 18, percent: 14, color: 'bg-rose-500', head: 'Anita Kapoor', budget: '₹8L', status: 'Active' },
    { name: 'Design', count: 14, percent: 11, color: 'bg-emerald-500', head: 'Priya Nair', budget: '₹7L', status: 'Active' },
    { name: 'HR', count: 12, percent: 9, color: 'bg-amber-500', head: 'Dev Kumar', budget: '₹6L', status: 'Active' },
    { name: 'Marketing', count: 8, percent: 6, color: 'bg-teal-500', head: 'Sonal Mehta', budget: '₹5L', status: 'Active' },
    { name: 'AI Research', count: 5, percent: 4, color: 'bg-indigo-500', head: 'Karan Joshi', budget: '₹4L', status: 'New' },
    { name: 'Legal', count: 4, percent: 3, color: 'bg-pink-500', head: 'Deepa Rao', budget: '₹3L', status: 'Active' },
]

const allEvents = [
    { id: 1, title: 'Q2 Performance Review', date: 'Feb 25, 2026', time: '10:00 AM', type: 'Meeting', venue: 'Conf. Room A', organiser: 'Admin', color: 'bg-violet-100 text-violet-700' },
    { id: 2, title: 'Engineering Sprint Demo', date: 'Feb 27, 2026', time: '03:00 PM', type: 'Demo', venue: 'Online (Zoom)', organiser: 'Riya Sharma', color: 'bg-sky-100 text-sky-700' },
    { id: 3, title: 'HR Policy Update Session', date: 'Mar 01, 2026', time: '11:00 AM', type: 'Training', venue: 'Training Hall', organiser: 'Dev Kumar', color: 'bg-emerald-100 text-emerald-700' },
    { id: 4, title: 'Annual Leave Submission', date: 'Mar 05, 2026', time: '11:59 PM', type: 'Deadline', venue: 'HR Portal', organiser: 'HR Team', color: 'bg-rose-100 text-rose-700' },
    { id: 5, title: 'New Employee Orientation', date: 'Mar 08, 2026', time: '09:30 AM', type: 'Onboarding', venue: 'Conf. Room B', organiser: 'Dev Kumar', color: 'bg-amber-100 text-amber-700' },
    { id: 6, title: 'Sales Strategy Q2 Meeting', date: 'Mar 10, 2026', time: '02:00 PM', type: 'Meeting', venue: 'Boardroom', organiser: 'Vikram Das', color: 'bg-violet-100 text-violet-700' },
    { id: 7, title: 'React Training Workshop', date: 'Mar 12, 2026', time: '10:00 AM', type: 'Training', venue: 'Online (Meet)', organiser: 'Rahul Singh', color: 'bg-emerald-100 text-emerald-700' },
    { id: 8, title: 'Compliance Audit Preparation', date: 'Mar 15, 2026', time: '09:00 AM', type: 'Deadline', venue: 'Legal Dept.', organiser: 'Deepa Rao', color: 'bg-rose-100 text-rose-700' },
]

/* ══════════════════════════════════════════════
   UNIVERSAL MODAL
══════════════════════════════════════════════ */

function Modal({ title, icon: Icon, accentColor = 'text-violet-600', onClose, children }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,10,40,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden animate-fadeInScale"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className={`font-bold text-lg flex items-center gap-2 ${accentColor}`}>
                        {Icon && <Icon size={18} />} {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-rose-100 hover:text-rose-600 transition-colors text-gray-500"
                    >
                        <X size={16} />
                    </button>
                </div>
                {/* Body */}
                <div className="overflow-y-auto flex-1 custom-scrollbar px-6 py-4">
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.93) translateY(10px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
                .animate-fadeInScale { animation: fadeInScale 0.2s ease-out; }
            `}</style>
        </div>
    )
}

/* ══════════════════════════════════════════════
   MODAL CONTENT VARIANTS
══════════════════════════════════════════════ */

function StatsModalContent() {
    const statusColor = { Good: 'bg-emerald-100 text-emerald-700', Excellent: 'bg-violet-100 text-violet-700', Normal: 'bg-gray-100 text-gray-600', Review: 'bg-amber-100 text-amber-700', Alert: 'bg-rose-100 text-rose-600' }
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-lg">Metric</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Change</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-lg">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {allStats.map((row, i) => (
                        <tr key={i} className="border-t border-gray-50 hover:bg-purple-50 transition-colors">
                            <td className="px-3 py-3 font-medium text-gray-800">{row.metric}</td>
                            <td className="px-3 py-3 text-center font-bold text-violet-700">{row.value}</td>
                            <td className="px-3 py-3 text-center">
                                <span className={`font-semibold text-xs ${row.trend.startsWith('▲') ? 'text-emerald-600' : row.trend.startsWith('▼') ? 'text-rose-500' : 'text-gray-400'}`}>{row.change} {row.trend}</span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[row.status]}`}>{row.status}</span>
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-500">{row.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function ActivityModalContent() {
    const typeColor = { Task: 'bg-violet-100 text-violet-700', Report: 'bg-sky-100 text-sky-700', Attendance: 'bg-emerald-100 text-emerald-700', HR: 'bg-amber-100 text-amber-700', Admin: 'bg-rose-100 text-rose-600', Support: 'bg-indigo-100 text-indigo-700' }
    return (
        <div className="flex flex-col gap-3">
            {allActivities.map(a => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all">
                    <div className={`w-9 h-9 rounded-full ${a.avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{a.avatar}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">{a.user}</span>{' '}
                            <span className="text-gray-500">{a.action}:</span>{' '}
                            <span className="font-medium text-violet-700">{a.task}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{a.time}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                            <span className="text-xs text-gray-500">{a.dept}</span>
                        </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${typeColor[a.type] || 'bg-gray-100 text-gray-600'}`}>{a.type}</span>
                </div>
            ))}
        </div>
    )
}

function EmployeesModalContent() {
    const statusColor = { Active: 'bg-emerald-100 text-emerald-700', 'On Leave': 'bg-amber-100 text-amber-700' }
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        {['Rank', 'Employee', 'Department', 'Tasks', 'Rating', 'Joined', 'Status'].map(h => (
                            <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {allEmployees.map(emp => (
                        <tr key={emp.rank} className="border-t border-gray-50 hover:bg-purple-50 transition-colors">
                            <td className="px-3 py-3 font-bold text-gray-300">#{emp.rank}</td>
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full ${emp.avatarBg} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>{emp.avatar}</div>
                                    <span className="font-semibold text-gray-800">{emp.name}</span>
                                </div>
                            </td>
                            <td className="px-3 py-3 text-gray-500">{emp.dept}</td>
                            <td className="px-3 py-3 font-bold text-violet-700">{emp.tasks}</td>
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-1">
                                    <Star size={11} className="text-amber-400 fill-amber-400" />
                                    <span className="text-gray-700 font-medium">{emp.rating}</span>
                                </div>
                            </td>
                            <td className="px-3 py-3 text-gray-500 text-xs">{emp.joined}</td>
                            <td className="px-3 py-3">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[emp.status] || 'bg-gray-100 text-gray-600'}`}>{emp.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function MetricsModalContent() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allMetrics.map(m => {
                const Icon = m.icon
                const isPositive = m.trend.startsWith('▲')
                const isNegative = m.trend.startsWith('▼')
                return (
                    <div key={m.label} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all">
                        <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={18} className={m.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-700 truncate">{m.label}</p>
                                <span className={`text-xs font-bold flex-shrink-0 ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-500' : 'text-gray-400'}`}>{m.trend}</span>
                            </div>
                            <p className="text-2xl font-bold text-violet-700 mt-0.5">{m.value}</p>
                            <p className="text-xs text-gray-400 mt-1 leading-snug">{m.note}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function DepartmentsModalContent() {
    const statusColor = { Active: 'bg-emerald-100 text-emerald-700', New: 'bg-violet-100 text-violet-700' }
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        {['Department', 'Employees', 'Share', 'Head', 'Budget', 'Status'].map(h => (
                            <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {allDepartments.map(d => (
                        <tr key={d.name} className="border-t border-gray-50 hover:bg-purple-50 transition-colors">
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${d.color} flex-shrink-0`} />
                                    <span className="font-semibold text-gray-800">{d.name}</span>
                                </div>
                            </td>
                            <td className="px-3 py-3 font-bold text-violet-700">{d.count}</td>
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.percent}%` }} />
                                    </div>
                                    <span className="text-gray-500 text-xs">{d.percent}%</span>
                                </div>
                            </td>
                            <td className="px-3 py-3 text-gray-600">{d.head}</td>
                            <td className="px-3 py-3 font-medium text-gray-700">{d.budget}</td>
                            <td className="px-3 py-3">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[d.status] || 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function EventsModalContent() {
    return (
        <div className="flex flex-col gap-3">
            {allEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-purple-900 text-white text-center flex-shrink-0">
                        <span className="text-[10px] font-semibold leading-none opacity-70">{ev.date.split(' ')[0]}</span>
                        <span className="text-lg font-bold leading-none">{ev.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{ev.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-400">{ev.time}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                            <span className="text-xs text-gray-500">{ev.venue}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                            <span className="text-xs text-gray-500">By: {ev.organiser}</span>
                        </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${ev.color}`}>{ev.type}</span>
                </div>
            ))}
        </div>
    )
}

/* ══════════════════════════════════════════════
   CARD SECTION WRAPPER
══════════════════════════════════════════════ */
function SectionCard({ title, icon: Icon, accentColor = 'text-violet-500', onViewAll, children }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-shrink-0">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    {Icon && <Icon size={16} className={accentColor} />} {title}
                </h2>
                <button
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <Eye size={11} /> View All
                </button>
            </div>
            {children}
        </div>
    )
}

/* ══════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════ */
function StatCard({ stat }) {
    const Icon = stat.icon
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon size={20} className={stat.iconColor} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                </span>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
            <div className={`h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-60`} />
        </div>
    )
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const AdminDashboardHome = () => {
    const [modal, setModal] = useState(null) // 'stats' | 'activity' | 'employees' | 'metrics' | 'departments' | 'events'
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const openModal = (key) => setModal(key)
    const closeModal = () => setModal(null)

    return (
        <div className="h-full overflow-y-auto px-1 py-2 space-y-6 font-sans custom-scrollbar">

            {/* ── Header ────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{today}</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm self-start sm:self-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-gray-600 font-medium">Live Overview</span>
                </div>
            </div>

            {/* ── Stat Cards ───────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <BarChart2 size={16} className="text-violet-500" /> Organisation Overview
                    </h2>
                    <button
                        onClick={() => openModal('stats')}
                        className="flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Eye size={11} /> View All
                    </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map(s => <StatCard key={s.id} stat={s} />)}
                </div>
            </div>

            {/* ── Middle Row ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Activity Feed */}
                <div className="lg:col-span-2">
                    <SectionCard title="Recent Activity" icon={Activity} accentColor="text-violet-500" onViewAll={() => openModal('activity')}>
                        <div className="flex flex-col gap-3">
                            {allActivities.slice(0, 6).map(a => (
                                <div key={a.id} className="flex items-start gap-3 group">
                                    <div className={`w-8 h-8 rounded-full ${a.avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{a.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold text-gray-800">{a.user}</span>{' '}
                                            <span className="text-gray-500">{a.action}:</span>{' '}
                                            <span className="font-medium text-violet-700">{a.task}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>

                {/* Quick Metrics */}
                <div>
                    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-5 shadow-sm flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between flex-shrink-0">
                            <h2 className="font-semibold text-white flex items-center gap-2">
                                <BarChart2 size={16} className="text-purple-300" /> Quick Metrics
                            </h2>
                            <button
                                onClick={() => openModal('metrics')}
                                className="flex items-center gap-1 text-xs font-semibold text-purple-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Eye size={11} /> View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {allMetrics.slice(0, 3).map(m => {
                                const Icon = m.icon
                                return (
                                    <div key={m.label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                                        <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                                            <Icon size={16} className={m.color} />
                                        </div>
                                        <div className="flex-1"><p className="text-xs text-purple-200">{m.label}</p></div>
                                        <span className="text-lg font-bold text-white">{m.value}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-auto pt-2 border-t border-white/10 flex items-center gap-2">
                            <TrendingUp size={14} className="text-emerald-400" />
                            <p className="text-xs text-purple-200">Overall performance is <span className="text-emerald-400 font-semibold">up 12%</span> this month.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Row ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">

                {/* Top Performers */}
                <SectionCard title="Top Performers" icon={Award} accentColor="text-amber-500" onViewAll={() => openModal('employees')}>
                    <div className="flex flex-col gap-3">
                        {allEmployees.slice(0, 4).map((emp, i) => (
                            <div key={emp.name} className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                                <div className={`w-8 h-8 rounded-full ${emp.avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{emp.avatar}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{emp.name}</p>
                                    <p className="text-xs text-gray-400">{emp.dept}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-700">{emp.tasks} tasks</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        <Star size={10} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs text-gray-500">{emp.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Department Strength */}
                <SectionCard title="Department Strength" icon={Target} accentColor="text-sky-500" onViewAll={() => openModal('departments')}>
                    <div className="flex flex-col gap-3">
                        {allDepartments.slice(0, 6).map(d => (
                            <div key={d.name} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-700">{d.name}</span>
                                    <span className="text-xs text-gray-500">{d.count} emp · {d.percent}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${d.color} rounded-full transition-all duration-700`} style={{ width: `${d.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Upcoming Events */}
                <SectionCard title="Upcoming Events" icon={Calendar} accentColor="text-rose-500" onViewAll={() => openModal('events')}>
                    <div className="flex flex-col gap-3">
                        {allEvents.slice(0, 4).map(ev => (
                            <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors cursor-pointer group">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-violet-700 transition-colors">{ev.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{ev.date}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${ev.color}`}>{ev.type}</span>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* ── Modals ───────────────────────────────── */}
            {modal === 'stats' && <Modal title="All Organisation Metrics" icon={BarChart2} accentColor="text-violet-700" onClose={closeModal}><StatsModalContent /></Modal>}
            {modal === 'activity' && <Modal title="All Recent Activities" icon={Activity} accentColor="text-violet-700" onClose={closeModal}><ActivityModalContent /></Modal>}
            {modal === 'employees' && <Modal title="All Top Performers" icon={Award} accentColor="text-amber-600" onClose={closeModal}><EmployeesModalContent /></Modal>}
            {modal === 'metrics' && <Modal title="All Quick Metrics" icon={BarChart2} accentColor="text-violet-700" onClose={closeModal}><MetricsModalContent /></Modal>}
            {modal === 'departments' && <Modal title="All Departments" icon={Target} accentColor="text-sky-600" onClose={closeModal}><DepartmentsModalContent /></Modal>}
            {modal === 'events' && <Modal title="All Upcoming Events" icon={Calendar} accentColor="text-rose-600" onClose={closeModal}><EventsModalContent /></Modal>}
        </div>
    )
}

export default AdminDashboardHome
