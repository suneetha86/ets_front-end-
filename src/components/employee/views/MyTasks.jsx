import React, { useState, useEffect } from 'react'
import { Wallet, Bell, ChevronRight, TrendingUp, X, Clock, Eye, Download, FileText, CheckCircle, LayoutDashboard, Activity, Loader2 } from 'lucide-react'
import { fetchEmployeeNotifications } from '../../../api/notificationApi'

import TaskListNumbers from '../../other/TaskListNumbers'
import Analytics from './Analytics'

const MyTasks = ({ data }) => {
    const [selectedNotif, setSelectedNotif] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false)
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
    const [currentSlip, setCurrentSlip] = useState(null)

    const monthlySalaries = [
        { id: 1, month: "September 2025", date: "2025-09-30", netPay: 65700, gross: 71700, deductions: 6000, status: "Paid" },
        { id: 2, month: "August 2025", date: "2025-08-31", netPay: 65700, gross: 71700, deductions: 6000, status: "Paid" },
        { id: 3, month: "July 2025", date: "2025-07-31", netPay: 65700, gross: 71700, deductions: 6000, status: "Paid" },
        { id: 4, month: "June 2025", date: "2025-06-30", netPay: 64200, gross: 70200, deductions: 6000, status: "Paid" },
        { id: 5, month: "May 2025", date: "2025-05-31", netPay: 64200, gross: 70200, deductions: 6000, status: "Paid" },
        { id: 6, month: "April 2025", date: "2025-04-30", netPay: 64200, gross: 70200, deductions: 6000, status: "Paid" },
        { id: 7, month: "March 2025", date: "2025-03-31", netPay: 62500, gross: 68500, deductions: 6000, status: "Paid" },
        { id: 8, month: "February 2025", date: "2025-02-28", netPay: 62500, gross: 68500, deductions: 6000, status: "Paid" },
        { id: 9, month: "January 2025", date: "2025-01-31", netPay: 62500, gross: 68500, deductions: 6000, status: "Paid" },
        { id: 10, month: "December 2024", date: "2024-12-31", netPay: 60000, gross: 66000, deductions: 6000, status: "Paid" },
        { id: 11, month: "November 2024", date: "2024-11-30", netPay: 60000, gross: 66000, deductions: 6000, status: "Paid" },
        { id: 12, month: "October 2024", date: "2024-10-31", netPay: 60000, gross: 66000, deductions: 6000, status: "Paid" },
    ]

    const [notifications, setNotifications] = useState([])
    const [loadingNotifs, setLoadingNotifs] = useState(true)

    useEffect(() => {
        const loadNotifs = async () => {
            try {
                setLoadingNotifs(true)
                const responseData = await fetchEmployeeNotifications(data?.email)
                setNotifications(Array.isArray(responseData) ? responseData.slice(0, 3) : [])
            } catch (error) {
                // Silently ignore network errors (backend offline)
                if (error?.message !== 'Network Error') {
                    console.error("Dashboard Signal Interrupted:", error)
                }
                setNotifications([])
            } finally {
                setLoadingNotifs(false)
            }
        }
        loadNotifs()
    }, [])

    const handleViewNotif = (notif) => {
        setSelectedNotif(notif)
        setIsModalOpen(true)
    }


    const handleViewSalary = (slip) => {
        setCurrentSlip(slip)
        setIsSalaryModalOpen(true)
    }

    const handleDownload = (record) => {
        const docContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #334155; line-height: 1.5; }
        .payslip-card { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .header { background: #2563eb; color: white; padding: 30px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .header p { margin: 5px 0 0; font-size: 12px; opacity: 0.9; }
        .payslip-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 10px; font-weight: 800; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
        
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 30px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .info-item { display: flex; flex-direction: column; }
        .info-label { font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 13px; font-weight: 700; color: #1e293b; }

        .tables-container { display: flex; border-bottom: 1px solid #e2e8f0; }
        .section-table { flex: 1; padding: 0; }
        .section-header { padding: 12px 20px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: white; display: flex; align-items: center; gap: 8px; }
        .earnings-header { background: #10b981; }
        .deductions-header { background: #ef4444; }
        
        table { width: 100%; border-collapse: collapse; }
        td { padding: 12px 20px; font-size: 12px; }
        .label { color: #64748b; font-weight: 500; }
        .value { text-align: right; font-weight: 700; color: #1e293b; }
        .total-row { border-top: 1px solid #e2e8f0; font-weight: 900 !important; }
        
        .footer-net { padding: 25px; background: #f0fdf4; border: 2px solid #bcf0da; margin: 30px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .net-amount { font-size: 32px; font-weight: 900; color: #166534; margin: 5px 0 0; }
        .sys-footer { text-align: center; font-size: 10px; color: #94a3b8; padding: 20px; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="payslip-card">
        <div class="header">
            <h1>AJA Pvt. Ltd.</h1>
            <p>4th Floor, Infinity Tower, Bangalore - 560001</p>
            <p>CIN: U12345KA2D2DPTC123456</p>
            <div class="payslip-badge">PAYSLIP — ${record.month.toUpperCase()}</div>
        </div>
        
        <div class="info-grid">
            <div class="info-item"><span class="info-label">Employee Name</span><span class="info-value">Suneetha Reddy</span></div>
            <div class="info-item"><span class="info-label">Employee ID</span><span class="info-value">EMP-AJA-082</span></div>
            <div class="info-item"><span class="info-label">Designation</span><span class="info-value">Systems Engineer</span></div>
            
            <div class="info-item"><span class="info-label">Department</span><span class="info-value">Architecture</span></div>
            <div class="info-item"><span class="info-label">PAN (Tax ID)</span><span class="info-value">ABCPK1234D</span></div>
            <div class="info-item"><span class="info-label">UAN (PF Number)</span><span class="info-value">100987654321</span></div>
            
            <div class="info-item"><span class="info-label">Bank Account</span><span class="info-value">**** **** **** 8821</span></div>
            <div class="info-item"><span class="info-label">IFSC Code</span><span class="info-value">AJA0001234</span></div>
            <div class="info-item"><span class="info-label">Pay Date</span><span class="info-value">${record.date}</span></div>
            
            <div class="info-item"><span class="info-label">Days Worked</span><span class="info-value">22</span></div>
            <div class="info-item"><span class="info-label">LOP Days</span><span class="info-value">0</span></div>
            <div class="info-item"><span class="info-label">Pay Period</span><span class="info-value">${record.month}</span></div>
        </div>

        <div class="tables-container">
            <div class="section-table" style="border-right: 1px solid #e2e8f0;">
                <div class="section-header earnings-header">Earnings</div>
                <table>
                    <tr><td class="label">Basic Salary</td><td class="value">₹${(record.gross * 0.6).toLocaleString()}</td></tr>
                    <tr><td class="label">HRA</td><td class="value">₹${(record.gross * 0.2).toLocaleString()}</td></tr>
                    <tr><td class="label">Transport Allowance</td><td class="value">₹2,000</td></tr>
                    <tr><td class="label">Medical Allowance</td><td class="value">₹1,250</td></tr>
                    <tr><td class="label">Special Allowance</td><td class="value">₹${(record.gross - (record.gross * 0.8) - 3250).toLocaleString()}</td></tr>
                    <tr class="total-row"><td class="label">Gross Pay</td><td class="value">₹${record.gross.toLocaleString()}</td></tr>
                </table>
            </div>
            <div class="section-table">
                <div class="section-header deductions-header">Deductions</div>
                <table>
                    <tr><td class="label">Provident Fund (PF)</td><td class="value">₹2,500</td></tr>
                    <tr><td class="label">ESIC</td><td class="value">₹200</td></tr>
                    <tr><td class="label">Professional Tax</td><td class="value">₹300</td></tr>
                    <tr><td class="label">TDS (Income Tax)</td><td class="value">₹3,000</td></tr>
                    <tr><td style="padding: 24px;"></td><td></td></tr>
                    <tr class="total-row"><td class="label">Total Deductions</td><td class="value">₹${record.deductions.toLocaleString()}</td></tr>
                </table>
            </div>
        </div>

        <div class="footer-net">
            <div>
                <span class="info-label" style="color: #059669">Net Take-Home Pay</span>
                <div class="net-amount">₹${record.netPay.toLocaleString()}</div>
                <div style="font-size: 10px; color: #059669; font-weight: 700; margin-top: 5px;">Credited to **** 8821 on ${record.date}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Generated on</div>
                <div style="font-size: 13px; font-weight: 700;">${new Date().toLocaleDateString()}</div>
                <div style="margin-top: 15px; color: #10b981; font-weight: 800; font-size: 11px;">Authorised Signatory</div>
            </div>
        </div>

        <div class="sys-footer">This is a system-generated payslip and does not require a physical signature. | AJA Pvt Ltd. - Confidential</div>
    </div>
</body>
</html>`;

        const element = document.createElement("a");
        const file = new Blob([docContent], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `AJA_Payslip_${record.month.replace(' ', '_')}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <div className='h-full overflow-auto pr-2 custom-scrollbar pb-10'>
            <TaskListNumbers data={data} />

            {/* Summary Cards */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
                {/* Salary Overview Card */}
                <div className='bg-gradient-to-br from-sky-400 to-sky-600 p-6 rounded-2xl shadow-lg border border-white/10 text-white relative overflow-hidden group hover:shadow-sky-500/20 hover:scale-[1.01] transition-all duration-300'>
                    <div className='absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:rotate-12 transition-transform duration-500'>
                        <Wallet size={120} />
                    </div>

                    <div className='relative z-10 flex flex-col h-full justify-between'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-xs font-bold uppercase tracking-widest text-blue-100 opacity-80'>Net Compensation</p>
                                <h3 className='text-3xl font-black mt-1 tracking-tighter'>₹65,700</h3>
                            </div>
                            <button
                                onClick={() => setIsStatsModalOpen(true)}
                                className='bg-white/20 p-2 rounded-xl backdrop-blur-sm hover:bg-white/40 transition-all text-white shadow-lg'
                                title="View Performance Stats"
                            >
                                <TrendingUp size={20} />
                            </button>
                        </div>

                        <div className='mt-6 pt-4 border-t border-white/10 flex justify-between items-center'>
                            <div>
                                <p className='text-[10px] uppercase font-black text-blue-100 opacity-60'>Expected Cycle</p>
                                <p className='text-sm font-bold'>30 Sept, 2025</p>
                            </div>
                            <button
                                onClick={() => setIsHistoryModalOpen(true)}
                                className='bg-white text-blue-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-blue-50 transition-colors'
                            >
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
                                <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>{notifications.length} New Alerts</p>
                            </div>
                        </div>
                        <ChevronRight className='text-slate-300 group-hover:translate-x-1 transition-transform' size={20} />
                    </div>

                    <div className='space-y-4'>
                        {loadingNotifs ? (
                            <div className='flex items-center justify-center p-10'>
                                <Loader2 className='animate-spin text-slate-300' size={24} />
                            </div>
                        ) : notifications.length === 0 ? (
                            <p className='text-[10px] text-slate-400 font-bold uppercase text-center py-4'>No Active Streams</p>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleViewNotif(notif)}
                                    className='flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-transparent hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm hover:shadow-md'
                                >
                                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${notif.type?.toUpperCase() === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse`}></div>
                                    <div className='flex-1'>
                                        <p className='text-xs font-bold text-slate-700 leading-tight group-hover:text-blue-700 transition-colors'>{notif.title}</p>
                                        <p className='text-[9px] text-slate-400 font-medium mt-0.5'>{notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>




            <Analytics />

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
                                    <p className='text-[10px] opacity-80 uppercase tracking-widest'>{selectedNotif.type} Alert</p>
                                </div>

                            </div>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-white/20 rounded-full transition-colors'>
                                <X size={20} />
                            </button>
                        </div>
                        <div className='p-8'>
                            <div className='flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 w-fit'>
                                <Clock size={16} className='text-slate-400' />
                                <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>{selectedNotif.createdAt ? new Date(selectedNotif.createdAt).toLocaleString() : 'Recent'}</span>
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
            {/* Salary Payslip Modal */}
            {isSalaryModalOpen && currentSlip && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-md z-[80] flex items-center justify-center p-4'>
                    <div className='bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
                        <div className='bg-blue-600 p-8 flex justify-between items-center text-white relative overflow-hidden'>
                            {/* Background Logo Watermark */}
                            <img src="../../assets/aja-logo.png" className='absolute right-0 top-0 w-48 h-48 opacity-10 translate-x-12 -translate-y-12 rotate-12' alt="" />

                            <div className='relative z-10 flex items-center gap-4'>
                                <div className='bg-white p-2 rounded-2xl shadow-xl'>
                                    <img src="../../assets/aja-logo.png" className='w-10 h-10 object-contain' alt="AJA Logo" />
                                </div>
                                <div>
                                    <h3 className='font-black text-2xl tracking-tight'>AJA Payslip</h3>
                                    <p className='text-[10px] opacity-80 uppercase font-black tracking-widest'>{currentSlip.month} • Digital Receipt</p>
                                </div>
                            </div>
                            <button onClick={() => setIsSalaryModalOpen(false)} className='relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors'>
                                <X size={20} />
                            </button>
                        </div>

                        <div className='p-8 space-y-8'>
                            <div className='grid grid-cols-2 gap-8'>
                                <div className='space-y-4'>
                                    <h4 className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2'>Earnings Structure</h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Basic Pay</span><span className='font-bold text-slate-800'>₹{(currentSlip.gross * 0.6).toLocaleString()}</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Performance Bonus</span><span className='font-bold text-slate-800'>₹{(currentSlip.gross * 0.2).toLocaleString()}</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>System Allowance</span><span className='font-bold text-slate-800'>₹{(currentSlip.gross * 0.2).toLocaleString()}</span></div>
                                    </div>
                                    <div className='pt-2 border-t border-dashed border-slate-200 flex justify-between text-sm font-black'><span className='text-slate-800'>Total Gross</span><span className='text-emerald-600'>₹{currentSlip.gross.toLocaleString()}</span></div>
                                </div>
                                <div className='space-y-4'>
                                    <h4 className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2'>Mandatory Deductions</h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Node Security Fund</span><span className='font-bold text-slate-800'>₹2,500</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Network Tax (TDS)</span><span className='font-bold text-slate-800'>₹3,500</span></div>
                                    </div>
                                    <div className='pt-2 border-t border-dashed border-slate-200 flex justify-between text-sm font-black'><span className='text-slate-800'>Total Deductions</span><span className='text-red-500'>₹{currentSlip.deductions.toLocaleString()}</span></div>
                                </div>
                            </div>

                            <div className='bg-blue-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center'>
                                <div>
                                    <p className='text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1'>Net Settlement Amount</p>
                                    <h2 className='text-4xl font-black text-blue-700 tracking-tighter'>₹{currentSlip.netPay.toLocaleString()}</h2>
                                </div>
                                <img src="../../assets/aja-logo.png" className='w-14 h-14 object-contain opacity-20' alt="" />
                            </div>

                            <div className='flex justify-center'>
                                <button
                                    onClick={() => handleDownload(currentSlip)}
                                    className='w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-[0.98]'
                                >
                                    Download AJA Authenticated Payslip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Salary History Modal */}
            {isHistoryModalOpen && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 transition-all'>
                    <div className='bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]'>
                        <div className='bg-slate-900 p-6 flex justify-between items-center text-white'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-blue-600 p-2 rounded-lg shadow-lg'>
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <h3 className='font-black text-lg tracking-tight'>Remuneration Archive</h3>
                                    <p className='text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]'>Annual Payment Intelligence</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsHistoryModalOpen(false)}
                                className='p-2 hover:bg-white/10 rounded-full transition-colors'
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className='p-8 overflow-y-auto custom-scrollbar bg-slate-50'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {monthlySalaries.map((slip) => (
                                    <div key={slip.id} className='bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group'>
                                        <div className='flex justify-between items-start mb-6'>
                                            <div>
                                                <p className='text-xs font-black text-slate-800 tracking-tight uppercase'>{slip.month}</p>
                                                <p className='text-[9px] text-slate-400 font-bold mt-1 tracking-widest uppercase'>{slip.date}</p>
                                            </div>
                                            <div className='flex flex-col items-end'>
                                                <span className='text-xs font-black text-blue-600'>₹{slip.netPay.toLocaleString()}</span>
                                                <div className='flex items-center gap-1 mt-1'>
                                                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                                                    <span className='text-[8px] font-black uppercase text-slate-400'>{slip.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-2 pt-4 border-t border-slate-50'>
                                            <button
                                                onClick={() => {
                                                    setIsHistoryModalOpen(false);
                                                    handleViewSalary(slip);
                                                }}
                                                className='flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 text-[9px] font-black uppercase text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm'
                                            >
                                                <Eye size={12} /> View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(slip)}
                                                className='flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 text-[9px] font-black uppercase text-slate-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm'
                                            >
                                                <Download size={12} /> Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='bg-white p-4 border-t border-slate-100 text-center'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Secure AJA Financial Record • Confidential</p>
                        </div>
                    </div>
                </div>
            )}
            {/* Performance Stats Modal */}
            {isStatsModalOpen && (
                <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-all'>
                    <div className='bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]'>
                        <div className='bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex justify-between items-center text-white'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-white/20 p-3 rounded-2xl'>
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h3 className='font-black text-2xl tracking-tight'>Performance Intelligence</h3>
                                    <p className='text-[10px] opacity-70 uppercase font-black tracking-[0.2em]'>Real-time Analytics & Engagement Metrics</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsStatsModalOpen(false)}
                                className='p-2 hover:bg-white/20 rounded-full transition-colors'
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className='p-10 overflow-y-auto custom-scrollbar bg-slate-50'>
                            <Analytics />

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
                                <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:scale-[1.05] transition-all duration-300 cursor-default group'>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors'>Task Velocity</p>
                                    <h4 className='text-3xl font-black text-slate-800 tracking-tighter'>+14%</h4>
                                    <p className='text-xs text-emerald-500 font-bold mt-1'>Higher than last week</p>
                                </div>
                                <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)] hover:scale-[1.05] transition-all duration-300 cursor-default group'>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors'>Quality Score</p>
                                    <h4 className='text-3xl font-black text-slate-800 tracking-tighter'>9.8/10</h4>
                                    <p className='text-xs text-blue-500 font-bold mt-1'>Top 5% in Architecture</p>
                                </div>
                                <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_rgba(100,116,139,0.15)] hover:scale-[1.05] transition-all duration-300 cursor-default group'>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-800 transition-colors'>System Uptime</p>
                                    <h4 className='text-3xl font-black text-slate-800 tracking-tighter'>100%</h4>
                                    <p className='text-xs text-slate-400 font-bold mt-1'>No incidents reported</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-6 border-t border-slate-100 flex justify-center'>
                            <button
                                onClick={() => setIsStatsModalOpen(false)}
                                className='bg-slate-900 text-white px-12 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl'
                            >
                                Close Intelligence Hub
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyTasks
