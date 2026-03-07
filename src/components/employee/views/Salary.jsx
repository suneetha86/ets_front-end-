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

    // 6 Quality Static Records
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
        alert(`Initiating download for ${record.month} Payslip PDF...`)
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
                        <p className='text-slate-500 text-xs font-semibold uppercase tracking-wider'>Selected Period Net</p>
                        <h3 className='text-2xl font-bold text-slate-800 tracking-tight'>₹{salaryData.netPay.toLocaleString()}</h3>
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
                        <button
                            onClick={() => { setItemsPerPage(processedHistory.length); setCurrentPage(1); }}
                            className='text-[10px] font-black bg-white px-3 py-1 rounded-lg shadow-sm text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all active:scale-95 flex items-center gap-1.5'
                            title="Show All Records"
                        >
                            <FileText size={12} /> {processedHistory.length} Total Records (View All)
                        </button>
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
                                        <span className='bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest'>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className='p-6'>
                                        <div className='flex justify-center gap-3'>
                                            <button
                                                onClick={() => handleViewSlip(record)}
                                                className='p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter'
                                            >
                                                <Eye size={16} /> View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(record)}
                                                className='p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm'
                                                title="Download PDF"
                                            >
                                                <Download size={16} />
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
                    <div className='bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
                        <div className='bg-blue-600 p-6 flex justify-between items-center text-white'>
                            <div className='flex items-center gap-3'>
                                <FileText size={24} />
                                <div>
                                    <h3 className='font-bold text-xl'>Pay Slip Details</h3>
                                    <p className='text-xs opacity-80 uppercase tracking-widest'>{currentSlip.month} | Transaction Confirmed</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-white/20 rounded-full transition-colors'>
                                <X size={20} />
                            </button>
                        </div>
                        <div className='p-8 space-y-8'>
                            <div className='grid grid-cols-2 gap-8'>
                                <div className='space-y-4'>
                                    <h4 className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2'>Earnings</h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Basic Compensation</span><span className='font-bold text-slate-800'>₹45,000</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>HRA Support</span><span className='font-bold text-slate-800'>₹18,000</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Special Allowances</span><span className='font-bold text-slate-800'>₹5,450</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Medical/Conveyance</span><span className='font-bold text-slate-800'>₹3,250</span></div>
                                    </div>
                                    <div className='pt-2 border-t border-dashed border-slate-200 flex justify-between text-sm font-black'><span className='text-slate-800'>Total Gross</span><span className='text-emerald-600'>₹{currentSlip.gross.toLocaleString()}</span></div>
                                </div>
                                <div className='space-y-4'>
                                    <h4 className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2'>Deductions</h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Provident Fund</span><span className='font-bold text-slate-800'>₹1,800</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Professional Tax</span><span className='font-bold text-slate-800'>₹200</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Tax Deducted (TDS)</span><span className='font-bold text-slate-800'>₹3,500</span></div>
                                        <div className='flex justify-between text-sm'><span className='text-slate-500 font-medium'>Health Insurance</span><span className='font-bold text-slate-800'>₹500</span></div>
                                    </div>
                                    <div className='pt-2 border-t border-dashed border-slate-200 flex justify-between text-sm font-black'><span className='text-slate-800'>Total Deductions</span><span className='text-red-500'>₹{currentSlip.deductions.toLocaleString()}</span></div>
                                </div>
                            </div>

                            <div className='bg-slate-50 p-6 rounded-xl border border-slate-100 flex justify-between items-center'>
                                <div>
                                    <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1'>Net Transmission</p>
                                    <h2 className='text-4xl font-black text-blue-600 tracking-tighter'>₹{currentSlip.netPay.toLocaleString()}</h2>
                                </div>
                                <div className='text-right'>
                                    <span className='block text-[10px] font-black text-emerald-600 uppercase mb-2'>Digital Signature Verified</span>
                                    <button
                                        onClick={() => handleDownload(currentSlip)}
                                        className='bg-blue-600 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20'
                                    >
                                        <Download size={14} /> Download PDF
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

export default Salary

