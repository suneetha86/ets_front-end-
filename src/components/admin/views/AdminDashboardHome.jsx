import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowDownRight, Star, Target, Zap, Shield, X, Eye, DollarSign, Download, Printer, CheckCircle, Users, Clock, CheckSquare, AlertCircle, BarChart2, TrendingUp, Award, Bell, Loader2, Activity, Calendar
} from 'lucide-react'
import { fetchNotifications } from '../../../api/notificationApi'


/* ══════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════ */

const stats = [
    { id: 1, label: 'Total Employees', value: '128', change: '+4', up: true, icon: Users, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', iconColor: 'text-violet-600', detail: 'Active headcount across all departments as of today.' },
    { id: 2, label: 'Present Today', value: '104', change: '+6', up: true, icon: Clock, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', iconColor: 'text-emerald-600', detail: 'Employees who have marked their attendance today.' },
    { id: 3, label: 'Tasks Completed', value: '342', change: '+18', up: true, icon: CheckSquare, color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50', iconColor: 'text-sky-600', detail: 'Total tasks marked done in the current sprint cycle.' },
    { id: 4, label: 'Pending Tasks', value: '57', change: '-3', up: false, icon: AlertCircle, color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', iconColor: 'text-rose-500', detail: 'Tasks not yet completed.' },
    { id: 5, label: 'Total Payroll', value: '₹9.4L', change: '+₹1.2L', up: true, icon: DollarSign, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', iconColor: 'text-amber-600', detail: 'Total gross salary for the current month.' },
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
]

const recentSalaries = [
    { id: 'PAY-2901', name: 'Riya Sharma', amount: '₹68,500', status: 'Generated', date: 'Feb 28', avatar: 'RS', avatarBg: 'bg-violet-500', dept: 'Engineering', role: 'Software Engineer', gross: 75000, net: 68500, deductions: 6500 },
    { id: 'PAY-2903', name: 'Priya Nair', amount: '₹59,500', status: 'Generated', date: 'Feb 28', avatar: 'PN', avatarBg: 'bg-emerald-500', dept: 'Design', role: 'UI Designer', gross: 65000, net: 59500, deductions: 5500 },
    { id: 'PAY-2904', name: 'Dev Kumar', amount: '₹64,000', status: 'Generated', date: 'Feb 28', avatar: 'DK', avatarBg: 'bg-amber-500', dept: 'HR', role: 'HR Manager', gross: 70000, net: 64000, deductions: 6000 },
    { id: 'PAY-2906', name: 'Anita Kapoor', amount: '₹62,000', status: 'Generated', date: 'Feb 28', avatar: 'AK', avatarBg: 'bg-teal-500', dept: 'Operations', role: 'Ops Lead', gross: 68000, net: 62000, deductions: 6000 },
]

const handleDownloadPayslip = (record) => {
    const docContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #334155; line-height: 1.5; background: #f1f5f9; }
        .payslip-card { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); background: white; }
        .header { background: #7c3aed; color: white; padding: 40px; position: relative; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.025em; }
        .header p { margin: 5px 0 0; font-size: 13px; opacity: 0.8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .payslip-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 30px; font-size: 11px; font-weight: 900; margin-top: 20px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid rgba(255,255,255,0.3); }
        
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 35px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .info-item { display: flex; flex-direction: column; }
        .info-label { font-size: 10px; color: #94a3b8; font-weight: 900; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em; }
        .info-value { font-size: 14px; font-weight: 800; color: #1e293b; }

        .tables-container { display: flex; border-bottom: 1px solid #e2e8f0; }
        .section-table { flex: 1; padding: 0; }
        .section-header { padding: 15px 25px; font-size: 11px; font-weight: 900; text-transform: uppercase; color: white; display: flex; align-items: center; gap: 8px; letter-spacing: 0.1em; }
        .earnings-header { background: #10b981; }
        .deductions-header { background: #ef4444; }
        
        table { width: 100%; border-collapse: collapse; }
        td { padding: 15px 25px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        .label { color: #64748b; font-weight: 600; }
        .value { text-align: right; font-weight: 800; color: #1e293b; }
        .total-row { background: #f8fafc; }
        .total-row td { border-top: 2px solid #e2e8f0; font-weight: 900 !important; color: #020617; font-size: 14px; }
        
        .footer-net { padding: 35px; background: #ecfdf5; border: 2px solid #bbf7d0; margin: 35px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; }
        .net-amount { font-size: 40px; font-weight: 950; color: #065f46; margin: 5px 0 0; letter-spacing: -0.05em; }
        .sys-footer { text-align: center; font-size: 11px; color: #94a3b8; padding: 30px; border-top: 1px solid #f1f5f9; font-weight: 600; background: #fafafa; }
    </style>
</head>
<body>
    <div class="payslip-card">
        <div class="header">
            <h1>AJA CONSULTING SERVICRES LLP</h1>
            <p>the square 4th floor , Gachibowli, Hyderabad • Official Payroll Statement</p>
            <div class="payslip-badge">Salary Slip — ${record.date} 2026</div>
        </div>
        
        <div class="info-grid">
            <div class="info-item"><span class="info-label">Employee Name</span><span class="info-value">${record.name}</span></div>
            <div class="info-item"><span class="info-label">Employee ID</span><span class="info-value">${record.id}</span></div>
            <div class="info-item"><span class="info-label">Designation</span><span class="info-value">${record.role || 'Personnel'}</span></div>
            
            <div class="info-item"><span class="info-label">Department</span><span class="info-value">${record.dept || 'Engineering'}</span></div>
            <div class="info-item"><span class="info-label">PAN (Tax ID)</span><span class="info-value">AJA_TAX_${record.id}</span></div>
            <div class="info-item"><span class="info-label">Account No</span><span class="info-value">**** **** 4242</span></div>
            
            <div class="info-item"><span class="info-label">Payment Date</span><span class="info-value">${record.date} 2026</span></div>
            <div class="info-item"><span class="info-label">Payroll Status</span><span class="info-value" style="color:#10b981">Verified</span></div>
            <div class="info-item"><span class="info-label">Reference</span><span class="info-value">REF-${record.id}-DASH</span></div>
        </div>

        <div class="tables-container">
            <div class="section-table" style="border-right: 1px solid #e2e8f0;">
                <div class="section-header earnings-header">Earnings</div>
                <table>
                    <tr><td class="label">Basic Component</td><td class="value">₹${(record.gross * 0.6).toLocaleString()}</td></tr>
                    <tr><td class="label">House Rent (HRA)</td><td class="value">₹${(record.gross * 0.2).toLocaleString()}</td></tr>
                    <tr><td class="label">Special Allowance</td><td class="value">₹${(record.gross * 0.11).toLocaleString()}</td></tr>
                    <tr><td class="label">Medical Benefit</td><td class="value">₹2,500</td></tr>
                    <tr class="total-row"><td class="label">Total Earnings</td><td class="value">₹${record.gross.toLocaleString()}</td></tr>
                </table>
            </div>
            <div class="section-table">
                <div class="section-header deductions-header">Deductions</div>
                <table>
                    <tr><td class="label">Income Tax (TDS)</td><td class="value">₹${(record.deductions * 0.6).toLocaleString()}</td></tr>
                    <tr><td class="label">Provident Fund</td><td class="value">₹${(record.deductions * 0.3).toLocaleString()}</td></tr>
                    <tr><td class="label">Professional Tax</td><td class="value">₹${(record.deductions * 0.1).toLocaleString()}</td></tr>
                    <tr><td style="padding: 30px;"></td><td></td></tr>
                    <tr class="total-row"><td class="label">Total Deductions</td><td class="value">₹${record.deductions.toLocaleString()}</td></tr>
                </table>
            </div>
        </div>

        <div class="footer-net">
            <div>
                <span class="info-label" style="color: #065f46">Consolidated Net Payable</span>
                <div class="net-amount">${record.amount}</div>
                <div style="font-size: 11px; color: #059669; font-weight: 800; margin-top: 8px;">Credited to registered account on ${record.date}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 11px; color: #94a3b8; font-weight: 900; text-transform: uppercase;">Generated by</div>
                <div style="font-size: 14px; font-weight: 900; color: #1e293b; margin-top: 4px;">AJA Admin Console</div>
                <div style="margin-top: 20px; color: #10b981; font-weight: 900; font-size: 12px; border-top: 2px solid #bbf7d0; pt-2">Authorized Electronic Signatory</div>
            </div>
        </div>

        <div class="sys-footer">© 2026 Admin Payroll Hub | This is an encrypted system document. | AJA CONSULTING SERVICRES LLP</div>
    </div>
</body>
</html>`;

    const element = document.createElement("a");
    const file = new Blob([docContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `AJA_Payslip_${record.name.replace(' ', '_')}_${record.id}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

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
   SALARY MODAL CONTENT
   ══════════════════════════════════════════════ */
function SalaryModalContent({ onView, onDownload }) {
    return (
        <div className="flex flex-col gap-3">
            {recentSalaries.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:bg-violet-50 transition-all">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${s.avatarBg} flex items-center justify-center text-white font-bold text-xs`}>{s.avatar}</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.id}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-violet-700">{s.amount}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{s.date}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onView(s)} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-violet-600 hover:text-white transition-all"><Eye size={14} /></button>
                        <button onClick={() => onDownload(s)} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><Download size={14} /></button>
                    </div>
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
    const navigate = useNavigate()
    const [modal, setModal] = useState(null) // 'stats' | 'activity' | 'employees' | 'metrics' | 'departments' | 'events' | 'salaries'
    const [selectedSalarySlip, setSelectedSalarySlip] = useState(null)
    const [notifications, setNotifications] = useState([])
    const [loadingNotifs, setLoadingNotifs] = useState(true)

    React.useEffect(() => {
        const loadNotifs = async () => {
            try {
                setLoadingNotifs(true)
                const data = await fetchNotifications()
                setNotifications(Array.isArray(data) ? data.slice(0, 4) : [])
            } catch (error) {
                console.error("Admin Dashboard Interrupted:", error)
            } finally {
                setLoadingNotifs(false)
            }
        }
        loadNotifs()
    }, [])

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
                    {stats.map(s => <StatCard key={s.id} stat={s} />) }
                </div>
            </div>

            {/* ── Salary List ───────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <DollarSign size={16} className="text-emerald-500" /> Recent Salary Receipts
                    </h2>
                    <button
                        onClick={() => openModal('salaries')}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Eye size={11} /> Salary Archive
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentSalaries.map(s => (
                        <div key={s.id} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col gap-3 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-xl ${s.avatarBg} flex items-center justify-center text-white font-bold text-xs ring-4 ring-white shadow-sm`}>
                                    {s.avatar}
                                </div>
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                                    {s.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800 leading-tight">{s.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{s.id}</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                                <span className="text-sm font-black text-violet-700">{s.amount}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => setSelectedSalarySlip(s)} className="p-1.5 bg-white text-slate-400 hover:text-violet-600 rounded-lg shadow-sm border border-slate-100"><Eye size={12} /></button>
                                    <button onClick={() => handleDownloadPayslip(s)} className="p-1.5 bg-white text-slate-400 hover:text-emerald-600 rounded-lg shadow-sm border border-slate-100"><Download size={12} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
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

                {/* System Notifications (replaces static Events) */}
                <SectionCard title="System Notifications" icon={Bell} accentColor="text-rose-500" onViewAll={() => navigate('/admin/notifications')}>
                    <div className="flex flex-col gap-3">
                        {loadingNotifs ? (
                            <div className="flex items-center justify-center p-10"><Loader2 className="animate-spin text-slate-300" size={24} /></div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 text-[10px] font-black uppercase tracking-widest">No Alerts</div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors cursor-pointer group">
                                    <div className={`w-2 h-2 rounded-full ${notif.type?.toUpperCase() === 'WARNING' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse flex-shrink-0`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-rose-700 transition-colors uppercase font-black text-[11px] tracking-tight">{notif.title}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Just Now'}</p>
                                    </div>
                                </div>
                            ))
                        )}
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
            {modal === 'salaries' && <Modal title="Recent Salary Receipts" icon={DollarSign} accentColor="text-emerald-700" onClose={closeModal}><SalaryModalContent onView={(s) => { closeModal(); setSelectedSalarySlip(s); }} onDownload={handleDownloadPayslip} /></Modal>}

            {/* Detailed Salary View Modal */}
            {selectedSalarySlip && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                        {/* Left Side: Branding */}
                        <div className="md:w-[40%] bg-violet-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 mb-6 shadow-xl">
                                    <DollarSign size={32} />
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter mb-2">AJA CONSULTING SERVICRES LLP</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 leading-relaxed max-w-xs">
                                    Official Remuneration Receipt<br />
                                    Employee Confidential Record
                                </p>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1 font-bold italic">Transaction ID</p>
                                    <p className="text-sm font-black text-white">TXN-{selectedSalarySlip.id}-AJA</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                    <p className="text-[9px] font-black text-white/80 uppercase tracking-widest mb-2 font-bold">Employee Name</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full ${selectedSalarySlip.avatarBg} border-2 border-white/50 flex items-center justify-center text-white font-bold text-lg`}>
                                            {selectedSalarySlip.avatar}
                                        </div>
                                        <div>
                                            <p className="font-black text-white">{selectedSalarySlip.name}</p>
                                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-tighter">{selectedSalarySlip.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative z-10 pt-4 flex items-center gap-4 opacity-70">
                                <Printer size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest italic">System Verified</span>
                            </div>
                        </div>

                        {/* Right Side: Details */}
                        <div className="flex-1 p-8 bg-white flex flex-col">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Financial Statement</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedSalarySlip.date} 2026 Cycle</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedSalarySlip(null)}
                                    className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-colors text-slate-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Employment</p>
                                    <div><p className="text-xs font-bold text-slate-400">Department</p><p className="text-sm font-bold text-slate-800">{selectedSalarySlip.dept}</p></div>
                                    <div><p className="text-xs font-bold text-slate-400">Payroll Cycle</p><p className="text-sm font-bold text-slate-800">{selectedSalarySlip.date} 2026</p></div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Financial Breakdown</p>
                                    <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Gross Salary</span><span className="text-sm font-black text-slate-800">₹{selectedSalarySlip.gross.toLocaleString()}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Total Deductions</span><span className="text-sm font-black text-rose-500">- ₹{selectedSalarySlip.deductions.toLocaleString()}</span></div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-sm font-black text-slate-800 italic uppercase tracking-widest">Net Payable</span>
                                        <span className="text-2xl font-black text-emerald-600">{selectedSalarySlip.amount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-4">
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Payment Status</p>
                                        <p className="text-xs text-emerald-600 font-bold">Credited successfully to employee's primary bank account.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-violet-200 transition-all flex items-center justify-center gap-2">
                                        <Printer size={16} /> Print Receipt
                                    </button>
                                    <button onClick={() => handleDownloadPayslip(selectedSalarySlip)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                                        <Download size={16} /> Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboardHome
