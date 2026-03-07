import React, { useState, useMemo } from 'react'
import { DollarSign, Download, Eye, TrendingUp, CreditCard, PieChart, X, FileText, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

const Salary = () => {
    const [selectedYear, setSelectedYear] = useState('2025-26')
    const [selectedMonth, setSelectedMonth] = useState('All Months')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentSlip, setCurrentSlip] = useState(null)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

    const years = ['2025-26', '2024-25', '2023-24']
    const months = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // 12 Quality Static Records (Covering Every Month)
    const salaryData = {
        netPay: 65700,
        grossPay: 71700,
        totalDeductions: 6000,
        history: [
            { id: 1, month: "September 2025", year: "2025-26", netPay: 65700, status: "Paid", date: "2025-09-30", gross: 71700, deductions: 6000 },
            { id: 2, month: "August 2025", year: "2025-26", netPay: 65700, status: "Paid", date: "2025-08-31", gross: 71700, deductions: 6000 },
            { id: 3, month: "July 2025", year: "2025-26", netPay: 65700, status: "Paid", date: "2025-07-31", gross: 71700, deductions: 6000 },
            { id: 4, month: "June 2025", year: "2025-26", netPay: 64200, status: "Paid", date: "2025-06-30", gross: 70200, deductions: 6000 },
            { id: 5, month: "May 2025", year: "2025-26", netPay: 64200, status: "Paid", date: "2025-05-31", gross: 70200, deductions: 6000 },
            { id: 6, month: "April 2025", year: "2025-26", netPay: 64200, status: "Paid", date: "2025-04-30", gross: 70200, deductions: 6000 },
            { id: 7, month: "March 2025", year: "2025-26", netPay: 62500, status: "Paid", date: "2025-03-31", gross: 68500, deductions: 6000 },
            { id: 8, month: "February 2025", year: "2025-26", netPay: 62500, status: "Paid", date: "2025-02-28", gross: 68500, deductions: 6000 },
            { id: 9, month: "January 2025", year: "2025-26", netPay: 62500, status: "Paid", date: "2025-01-31", gross: 68500, deductions: 6000 },
            { id: 10, month: "December 2024", year: "2025-26", netPay: 60000, status: "Paid", date: "2024-12-31", gross: 66000, deductions: 6000 },
            { id: 11, month: "November 2024", year: "2025-26", netPay: 60000, status: "Paid", date: "2024-11-30", gross: 66000, deductions: 6000 },
            { id: 12, month: "October 2024", year: "2025-26", netPay: 60000, status: "Paid", date: "2024-10-31", gross: 66000, deductions: 6000 },
        ]
    }

    // Filtering, Sorting and Pagination logic
    const processedHistory = useMemo(() => {
        let filtered = salaryData.history.filter(record => {
            const matchesYear = record.year === selectedYear;
            const matchesMonth = selectedMonth === 'All Months' || record.month.startsWith(selectedMonth);
            return matchesYear && matchesMonth;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [selectedYear, selectedMonth, sortConfig]);

    const totalPages = Math.ceil(processedHistory.length / itemsPerPage);
    const paginatedHistory = processedHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleViewSlip = (record) => {
        setCurrentSlip(record)
        setIsModalOpen(true)
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
            <div class="info-item"><span class="info-label">Employee Name</span><span class="info-value">Ravi Kumar</span></div>
            <div class="info-item"><span class="info-label">Employee ID</span><span class="info-value">EMP-2041</span></div>
            <div class="info-item"><span class="info-label">Designation</span><span class="info-value">Software Engineer</span></div>
            
            <div class="info-item"><span class="info-label">Department</span><span class="info-value">Engineering</span></div>
            <div class="info-item"><span class="info-label">PAN (Tax ID)</span><span class="info-value">ABCPK1234D</span></div>
            <div class="info-item"><span class="info-label">UAN (PF Number)</span><span class="info-value">100987654321</span></div>
            
            <div class="info-item"><span class="info-label">Bank Account</span><span class="info-value">**** **** **** 8821</span></div>
            <div class="info-item"><span class="info-label">IFSC Code</span><span class="info-value">HDFC0001234</span></div>
            <div class="info-item"><span class="info-label">Pay Date</span><span class="info-value">${record.date}</span></div>
            
            <div class="info-item"><span class="info-label">Days Worked</span><span class="info-value">28</span></div>
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
        <div className='flex flex-col gap-6 h-full overflow-y-auto pb-20 pr-2 custom-scrollbar scroll-smooth'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100'>
                <div>
                    <h2 className='text-2xl font-bold text-slate-800 flex items-center gap-2'>
                        <DollarSign className="text-blue-600" /> Salary Management
                    </h2>
                    <p className='text-slate-500 text-sm'>Access your monthly remuneration and download financial records</p>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 shadow-inner'>
                        <Filter size={16} className='text-slate-400 ml-1' />
                        <select
                            value={selectedYear}
                            onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                            className='bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer pr-2'
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 shadow-inner'>
                        <select
                            value={selectedMonth}
                            onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                            className='bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer'
                        >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow'>
                    <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center'>
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className='text-slate-500 text-xs font-semibold uppercase tracking-wider'>Annual Net Package</p>
                        <h3 className='text-2xl font-bold text-slate-800 tracking-tight'>₹{ (salaryData.netPay * 12).toLocaleString()}</h3>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow'>
                    <div className='w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center'>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className='text-slate-500 text-xs font-semibold uppercase tracking-wider'>Selected Period Gross</p>
                        <h3 className='text-2xl font-bold text-slate-800 tracking-tight'>₹{salaryData.grossPay.toLocaleString()}</h3>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow'>
                    <div className='w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center'>
                        <PieChart size={24} />
                    </div>
                    <div>
                        <p className='text-slate-500 text-xs font-semibold uppercase tracking-wider'>Selected Period Deductions</p>
                        <h3 className='text-2xl font-bold text-slate-800 tracking-tight'>₹{salaryData.totalDeductions.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className='bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative'>
                <div className='bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center'>
                    <h3 className='font-bold text-slate-800 text-sm uppercase tracking-wide'>Remuneration Archive</h3>
                    <div className='flex items-center gap-4'>
                        <span className='text-[10px] font-black bg-white px-3 py-1 rounded shadow-sm text-slate-500 border border-slate-200'>{processedHistory.length} Monthly Records Collected</span>
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-wider'>
                            <tr>
                                <th className='p-6 cursor-pointer hover:text-blue-600 transition-colors' onClick={() => handleSort('month')}>
                                    <div className='flex items-center gap-2'>Cycle <ArrowUpDown size={12} /></div>
                                </th>
                                <th className='p-6 cursor-pointer hover:text-blue-600 transition-colors' onClick={() => handleSort('date')}>
                                    <div className='flex items-center gap-2'>Transfer Date <ArrowUpDown size={12} /></div>
                                </th>
                                <th className='p-6 cursor-pointer hover:text-blue-600 transition-colors' onClick={() => handleSort('gross')}>
                                    <div className='flex items-center gap-2'>Gross <ArrowUpDown size={12} /></div>
                                </th>
                                <th className='p-6'>Deductions</th>
                                <th className='p-6 cursor-pointer hover:text-blue-600 transition-colors' onClick={() => handleSort('netPay')}>
                                    <div className='flex items-center gap-2'>Net Amount <ArrowUpDown size={12} /></div>
                                </th>
                                <th className='p-6'>Transaction</th>
                                <th className='p-6 text-center'>Interface</th>
                            </tr>
                        </thead>
                        <tbody className='text-slate-700 divide-y divide-slate-100 text-sm'>
                            {paginatedHistory.length > 0 ? paginatedHistory.map((record) => (
                                <tr key={record.id} className='hover:bg-blue-50/20 transition-colors group'>
                                    <td className='p-6 font-bold text-slate-800'>{record.month}</td>
                                    <td className='p-6 font-medium text-slate-500'>{record.date}</td>
                                    <td className='p-6 font-bold text-slate-600'>₹{record.gross.toLocaleString()}</td>
                                    <td className='p-6 font-bold text-red-500'>₹{record.deductions.toLocaleString()}</td>
                                    <td className='p-6 font-black text-blue-600 text-base'>₹{record.netPay.toLocaleString()}</td>
                                    <td className='p-6'>
                                        <div className='flex items-center gap-2'>
                                            <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                                            <span className='text-[10px] font-black uppercase text-slate-400'>{record.status}</span>
                                        </div>
                                    </td>
                                    <td className='p-6'>
                                        <div className='flex justify-center gap-3'>
                                            <button
                                                onClick={() => handleViewSlip(record)}
                                                className='p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap'
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(record)}
                                                className='p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap'
                                            >
                                                <Download size={14} /> Download
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No records found for this period</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className='p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between'>
                        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest'>
                            Showing <span className='text-blue-600'>{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className='text-blue-600'>{Math.min(currentPage * itemsPerPage, processedHistory.length)}</span> of {processedHistory.length}
                        </p>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className='p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all'
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className='p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all'
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Payslip Modal */}
            {isModalOpen && currentSlip && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4'>
                    <div className='bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
                        {/* Header matching reference image */}
                        <div className='bg-blue-600 p-8 text-white relative'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <h3 className='font-black text-3xl tracking-tight'>AJA Pvt. Ltd.</h3>
                                    <p className='text-[10px] opacity-80 mt-1 uppercase font-bold tracking-widest'>4th Floor, Infinity Tower, Bangalore - 560001</p>
                                    <p className='text-[10px] opacity-80 uppercase font-bold tracking-widest'>CIN: U12345KA2D2DPTC123456</p>
                                    <div className='mt-6 inline-block bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]'>
                                        Payslip — {currentSlip.month}
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-white/20 rounded-full transition-colors'>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Info Grid Card */}
                        <div className='p-8'>
                            <div className='bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-3 gap-y-6 gap-x-4 mb-8'>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Employee Name</p><p className='text-xs font-bold text-slate-800'>Ravi Kumar</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Employee ID</p><p className='text-xs font-bold text-slate-800'>EMP-2041</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Designation</p><p className='text-xs font-bold text-slate-800'>Software Engineer</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Department</p><p className='text-xs font-bold text-slate-800'>Engineering</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>PAN</p><p className='text-xs font-bold text-slate-800'>ABCPK1234D</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>UAN (PF)</p><p className='text-xs font-bold text-slate-800'>100987654321</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Bank Account</p><p className='text-xs font-bold text-slate-800'>**** **** **** 8821</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>IFSC Code</p><p className='text-xs font-bold text-slate-800'>HDFC0001234</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Pay Date</p><p className='text-xs font-bold text-slate-800'>{currentSlip.date}</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Days Worked</p><p className='text-xs font-bold text-slate-800'>28</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>LOP Days</p><p className='text-xs font-bold text-slate-800'>0</p></div>
                                <div><p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>Pay Period</p><p className='text-xs font-bold text-slate-800'>{currentSlip.month}</p></div>
                            </div>

                            <div className='grid grid-cols-2 gap-8'>
                                {/* Earnings */}
                                <div className='border border-slate-200 rounded-2xl overflow-hidden'>
                                    <div className='bg-emerald-500 p-3 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest'>
                                        <CheckCircle size={14} /> Earnings
                                    </div>
                                    <div className='p-4 space-y-3'>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>Basic Salary</span><span className='font-bold text-slate-800'>₹{(currentSlip.gross * 0.6).toLocaleString()}</span></div>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>HRA</span><span className='font-bold text-slate-800'>₹{(currentSlip.gross * 0.2).toLocaleString()}</span></div>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>Transport Allowance</span><span className='font-bold text-slate-800'>₹2,000</span></div>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>Medical Allowance</span><span className='font-bold text-slate-800'>₹1,250</span></div>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>Special Allowance</span><span className='font-bold text-slate-800'>₹{(currentSlip.gross - (currentSlip.gross * 0.8) - 3250).toLocaleString()}</span></div>
                                        <div className='pt-2 mt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-800'><span>Gross Pay</span><span>₹{currentSlip.gross.toLocaleString()}</span></div>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div className='border border-slate-200 rounded-2xl overflow-hidden'>
                                    <div className='bg-red-500 p-3 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest'>
                                        <PieChart size={14} /> Deductions
                                    </div>
                                    <div className='p-4 space-y-3'>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>Provident Fund (PF)</span><span className='font-bold text-slate-800'>₹2,500</span></div>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>ESIC</span><span className='font-bold text-slate-800'>₹200</span></div>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>Professional Tax</span><span className='font-bold text-slate-800'>₹300</span></div>
                                        <div className='flex justify-between text-xs'><span className='text-slate-500 font-medium'>TDS (Income Tax)</span><span className='font-bold text-slate-800'>₹3,000</span></div>
                                        <div className='pt-2 mt-10 border-t border-slate-100 flex justify-between text-sm font-black text-slate-800'><span>Total Deductions</span><span>₹{currentSlip.deductions.toLocaleString()}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay Footer */}
                            <div className='mt-8 bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 flex justify-between items-center'>
                                <div>
                                    <p className='text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1'>Net Take-Home Pay</p>
                                    <h2 className='text-4xl font-black text-emerald-700 tracking-tighter'>₹{currentSlip.netPay.toLocaleString()}</h2>
                                    <p className='text-[9px] font-bold text-emerald-600 mt-1 opacity-80'>Credited to **** 8821 on {currentSlip.date}</p>
                                </div>
                                <div className='text-right'>
                                    <button 
                                        onClick={() => handleDownload(currentSlip)}
                                        className='bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2'
                                    >
                                        <Download size={16} /> Download AJA Payslip
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='bg-slate-50 p-4 text-center border-t border-slate-100'>
                            <p className='text-[10px] text-slate-400 font-bold'>This is a system-generated payslip and does not require a physical signature. | AJA Pvt Ltd.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Salary

