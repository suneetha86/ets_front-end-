<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { DollarSign, Save, Loader2, Calendar } from 'lucide-react';
import { fetchAdminEmployees } from '../../../api/employeeApi';
import { postSalary } from '../../../api/salaryApi';

const Salary = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form state corresponding to the ResponseBody 
    const [formData, setFormData] = useState({
        employeeId: '',
        cycle: '',
        transferDate: new Date().toISOString().split('T')[0],
        digitalSignatureVerified: true,
        transactionStatus: 'PAID',
        
        // Earnings
        basicCompensation: 0,
        hraSupport: 0,
        medicalConveyance: 0,
        specialAllowances: 0,
        
        // Deductions
        providentFund: 0,
        professionalTax: 0,
        healthInsurance: 0,
        tds: 0
    });

    // Calculated fields
    const [calculated, setCalculated] = useState({
        grossAmount: 0,
        totalDeductions: 0,
        netAmount: 0
    });

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                setLoading(true);
                const data = await fetchAdminEmployees();
                if (data && !data.message) {
                    setEmployees(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to fetch employees for salary form", err);
            } finally {
                setLoading(false);
            }
        };
        loadEmployees();
    }, []);

    // Recalculate totals whenever form earnings/deductions change
    useEffect(() => {
        const gross = Number(formData.basicCompensation) + Number(formData.hraSupport) + Number(formData.medicalConveyance) + Number(formData.specialAllowances);
        const deductions = Number(formData.providentFund) + Number(formData.professionalTax) + Number(formData.healthInsurance) + Number(formData.tds);
        
        setCalculated({
            grossAmount: gross,
            totalDeductions: deductions,
            netAmount: gross - deductions
        });
    }, [
        formData.basicCompensation, formData.hraSupport, formData.medicalConveyance, formData.specialAllowances,
        formData.providentFund, formData.professionalTax, formData.healthInsurance, formData.tds
    ]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.employeeId || !formData.cycle) {
            alert('Please select an employee and specify the cycle');
            return;
        }

        try {
            setSubmitLoading(true);
            
            // Construct payload matching the required ResponseBody format
            const payload = {
                ...formData,
                grossAmount: calculated.grossAmount,
                totalDeductions: calculated.totalDeductions,
                netAmount: calculated.netAmount
            };

            const response = await postSalary(payload);
            console.log("Salary API Response:", response);
            alert("Salary record posted successfully!");

            // Optionally reset form but keep employee list
            setFormData(prev => ({
                 ...prev,
                 basicCompensation: 0, hraSupport: 0, medicalConveyance: 0, specialAllowances: 0,
                 providentFund: 0, professionalTax: 0, healthInsurance: 0, tds: 0
            }));

        } catch (err) {
            console.error("Failed to post salary:", err);
            alert("Failed to post salary record. Check console for details.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 h-full overflow-y-auto pb-20 scrollbar-hide">
            <div className='flex items-center gap-3 mb-8 pb-6 border-b border-gray-100'>
                <div className='p-3 bg-blue-50 text-blue-600 rounded-2xl'>
                    <DollarSign size={28} />
                </div>
                <div>
                    <h2 className='text-3xl font-black tracking-tight text-gray-900'>Salary Management</h2>
                    <p className='text-gray-400 text-xs font-bold uppercase tracking-widest mt-1'>Generate Remuneration Record</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
                
                {/* Core Info */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-500" /> Administrative Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Employee</label>
                            <select 
                                name="employeeId" 
                                value={formData.employeeId} 
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
                            >
                                <option value="">-- Choose Employee --</option>
                                {employees.map(emp => (
                                    <option key={emp.empId} value={emp.empId}>
                                        {emp.username} (ID: {emp.empId})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cycle (e.g. September 2025)</label>
                            <input 
                                type="text"
                                name="cycle"
                                value={formData.cycle}
                                onChange={handleChange}
                                required
                                placeholder="September 2025"
                                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Transfer Date</label>
                            <input 
                                type="date"
                                name="transferDate"
                                value={formData.transferDate}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Earnings */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest pb-3 border-b border-emerald-100">Earnings Components</h3>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Basic Compensation (₹)</label>
                                <input type="number" name="basicCompensation" value={formData.basicCompensation} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">HRA Support (₹)</label>
                                <input type="number" name="hraSupport" value={formData.hraSupport} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Medical Conveyance (₹)</label>
                                <input type="number" name="medicalConveyance" value={formData.medicalConveyance} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Special Allowances (₹)</label>
                                <input type="number" name="specialAllowances" value={formData.specialAllowances} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl flex justify-between items-center border border-emerald-100">
                            <span className="font-bold text-emerald-800">Gross Amount</span>
                            <span className="text-xl font-black text-emerald-600">₹{calculated.grossAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-red-600 uppercase tracking-widest pb-3 border-b border-red-100">Deductions</h3>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Provident Fund (₹)</label>
                                <input type="number" name="providentFund" value={formData.providentFund} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Professional Tax (₹)</label>
                                <input type="number" name="professionalTax" value={formData.professionalTax} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Health Insurance (₹)</label>
                                <input type="number" name="healthInsurance" value={formData.healthInsurance} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1">TDS (₹)</label>
                                <input type="number" name="tds" value={formData.tds} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500" />
                            </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl flex justify-between items-center border border-red-100">
                            <span className="font-bold text-red-800">Total Deductions</span>
                            <span className="text-xl font-black text-red-600">₹{calculated.totalDeductions.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Final Computation & Submission */}
                <div className="bg-blue-600 p-8 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-blue-500/20">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Final Disbursal Amount (Net Pay)</p>
                        <h2 className="text-5xl font-black tracking-tighter">₹{calculated.netAmount.toLocaleString()}</h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="digitalSignatureVerified" checked={formData.digitalSignatureVerified} onChange={handleChange} id="signature" className="w-5 h-5 rounded cursor-pointer" />
                            <label htmlFor="signature" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Digital Signature Verified</label>
                        </div>
                        <button 
                            type="submit" 
                            disabled={submitLoading || loading}
                            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-75 disabled:active:scale-100 border-2 border-transparent hover:border-blue-200"
                        >
                            {submitLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {submitLoading ? 'Posting...' : 'Issue Remuneration'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Salary;
=======
import React, { useState, useMemo } from 'react'
import { DollarSign, Search, Filter, Eye, Download, Printer, CheckCircle, X, User, Briefcase, Calendar, CreditCard, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'

/* ══════════════════════════════════════════════
   STATIC ADMIN SALARY DATA
   ══════════════════════════════════════════════ */
const initialPayrollData = [
    { id: 'PAY-2901', name: 'Riya Sharma', dept: 'Engineering', role: 'Software Engineer', month: 'February 2026', gross: 75000, net: 68500, deductions: 6500, status: 'Generated', date: '2026-02-28', avatar: 'RS', avatarBg: 'bg-violet-500' },
    { id: 'PAY-2902', name: 'Arjun Mehta', dept: 'Finance', role: 'Lead Accountant', month: 'February 2026', gross: 85000, net: 78000, deductions: 7000, status: 'Pending', date: '-', avatar: 'AM', avatarBg: 'bg-sky-500' },
    { id: 'PAY-2903', name: 'Priya Nair', dept: 'Design', role: 'UI Designer', month: 'February 2026', gross: 65000, net: 59500, deductions: 5500, status: 'Generated', date: '2026-02-28', avatar: 'PN', avatarBg: 'bg-emerald-500' },
    { id: 'PAY-2904', name: 'Dev Kumar', dept: 'HR', role: 'HR Manager', month: 'February 2026', gross: 70000, net: 64000, deductions: 6000, status: 'Generated', date: '2026-02-28', avatar: 'DK', avatarBg: 'bg-amber-500' },
    { id: 'PAY-2905', name: 'Rahul Singh', dept: 'Engineering', role: 'Frontend Developer', month: 'February 2026', gross: 60000, net: 54500, deductions: 5500, status: 'Pending', date: '-', avatar: 'RS', avatarBg: 'bg-fuchsia-500' },
    { id: 'PAY-2906', name: 'Anita Kapoor', dept: 'Operations', role: 'Ops Lead', month: 'February 2026', gross: 68000, net: 62000, deductions: 6000, status: 'Generated', date: '2026-02-28', avatar: 'AK', avatarBg: 'bg-teal-500' },
    { id: 'PAY-2907', name: 'Vikram Das', dept: 'Sales', role: 'Sales Manager', month: 'February 2026', gross: 72000, net: 66000, deductions: 6000, status: 'Generated', date: '2026-02-28', avatar: 'VD', avatarBg: 'bg-indigo-500' },
    { id: 'PAY-2908', name: 'Sonal Mehta', dept: 'Design', role: 'Creative Director', month: 'February 2026', gross: 90000, net: 82500, deductions: 7500, status: 'Pending', date: '-', avatar: 'SM', avatarBg: 'bg-pink-500' },
];

const Salary = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDept, setSelectedDept] = useState('All Departments')
    const [payroll, setPayroll] = useState(initialPayrollData)
    const [selectedSlip, setSelectedSlip] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const depts = ['All Departments', 'Engineering', 'Finance', 'Design', 'HR', 'Operations', 'Sales']

    const filteredPayroll = useMemo(() => {
        return payroll.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesDept = selectedDept === 'All Departments' || p.dept === selectedDept
            return matchesSearch && matchesDept
        })
    }, [searchQuery, selectedDept, payroll])

    const handleGenerateReceipt = (id) => {
        setIsGenerating(true)
        setTimeout(() => {
            setPayroll(prev => prev.map(p => 
                p.id === id ? { ...p, status: 'Generated', date: new Date().toISOString().split('T')[0] } : p
            ))
            setIsGenerating(false)
        }, 1500)
    }

    const handleDownload = (record) => {
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
            <div class="payslip-badge">Salary Slip — ${record.month.toUpperCase()}</div>
        </div>
        
        <div class="info-grid">
            <div class="info-item"><span class="info-label">Employee Name</span><span class="info-value">${record.name}</span></div>
            <div class="info-item"><span class="info-label">Employee ID</span><span class="info-value">${record.id}</span></div>
            <div class="info-item"><span class="info-label">Designation</span><span class="info-value">${record.role}</span></div>
            
            <div class="info-item"><span class="info-label">Department</span><span class="info-value">${record.dept}</span></div>
            <div class="info-item"><span class="info-label">PAN (Tax ID)</span><span class="info-value">AJA_TAX_${record.id}</span></div>
            <div class="info-item"><span class="info-label">Account No</span><span class="info-value">**** **** 4242</span></div>
            
            <div class="info-item"><span class="info-label">Payment Date</span><span class="info-value">${record.date}</span></div>
            <div class="info-item"><span class="info-label">Payroll Status</span><span class="info-value" style="color:#10b981">Verified</span></div>
            <div class="info-item"><span class="info-label">Reference</span><span class="info-value">REF-${record.id}-CONF</span></div>
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
                <div class="net-amount">₹${record.net.toLocaleString()}</div>
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

    return (
        <div className='h-full flex flex-col gap-6 font-sans text-slate-900'>
            {/* ── Header ────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Salary Management</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Payroll Control Hub</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                        <Filter size={16} className="text-slate-400" />
                        <select 
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="bg-transparent text-sm font-bold outline-none cursor-pointer text-slate-600"
                        >
                            {depts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-64 focus-within:ring-2 ring-violet-200 transition-all">
                        <Search size={16} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Find employee or ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm font-bold outline-none w-full placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            {/* ── Summary Cards ───────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payroll</p>
                    <h3 className="text-2xl font-black text-slate-800">₹{payroll.reduce((acc, curr) => acc + curr.gross, 0).toLocaleString()}</h3>
                    <div className="h-1 w-full bg-violet-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-violet-500 w-[70%]" />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Outflow</p>
                    <h3 className="text-2xl font-black text-emerald-600">₹{payroll.reduce((acc, curr) => acc + curr.net, 0).toLocaleString()}</h3>
                    <div className="h-1 w-full bg-emerald-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-500 w-[65%]" />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductions Total</p>
                    <h3 className="text-2xl font-black text-rose-500">₹{payroll.reduce((acc, curr) => acc + curr.deductions, 0).toLocaleString()}</h3>
                    <div className="h-1 w-full bg-rose-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-rose-500 w-[15%]" />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receipts Issued</p>
                    <h3 className="text-2xl font-black text-sky-600">{payroll.filter(p => p.status === 'Generated').length} / {payroll.length}</h3>
                    <div className="h-1 w-full bg-sky-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-sky-500" style={{ width: `${(payroll.filter(p => p.status === 'Generated').length / payroll.length) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* ── Main List ───────────────────────────── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest">Remuneration Ledger</h2>
                    <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full shadow-sm text-slate-400 border border-slate-100">
                        {filteredPayroll.length} Employees Matching
                    </span>
                </div>
                
                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                <th className="px-6 py-4">Employee Details</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Gross/Net</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Receipt Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPayroll.length > 0 ? filteredPayroll.map(p => (
                                <tr key={p.id} className="hover:bg-violet-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${p.avatarBg} flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-md`}>
                                                {p.avatar}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">{p.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{p.id} • {p.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                            {p.dept}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-700">₹{p.gross.toLocaleString()}</span>
                                            <span className="text-[10px] font-black text-emerald-500">NET: ₹{p.net.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === 'Generated' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {p.status}
                                            </span>
                                            {p.date !== '-' && <span className="text-[10px] text-slate-400 font-bold">{p.date}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {p.status === 'Generated' ? (
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => setSelectedSlip(p)}
                                                    className="p-2 bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="Quick View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(p)}
                                                    className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all shadow-sm"
                                                    title="Download"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleGenerateReceipt(p.id)}
                                                disabled={isGenerating}
                                                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                                            >
                                                {isGenerating ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Printer size={14} />}
                                                Generate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <Search size={48} />
                                            <p className="font-black uppercase tracking-[0.2em] text-sm">No matching records found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">© 2026 Admin Payroll Console | Managed State</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400"><ChevronLeft size={16} /></button>
                        <span className="text-[10px] font-black text-slate-800">Page 1 of 1</span>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* ── Detailed Receipt Modal ──────────────────── */}
            {selectedSlip && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                        {/* Left Side: Branding & Info */}
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
                                    <p className="text-sm font-black text-white">TXN-{selectedSlip.id}-AJA</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                    <p className="text-[9px] font-black text-white/80 uppercase tracking-widest mb-2 font-bold">Employee Spotlight</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full ${selectedSlip.avatarBg} border-2 border-white/50 flex items-center justify-center text-white font-bold text-lg`}>
                                            {selectedSlip.avatar}
                                        </div>
                                        <div>
                                            <p className="font-black text-white">{selectedSlip.name}</p>
                                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-tighter">{selectedSlip.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative z-10 pt-4 flex items-center gap-4 opacity-70">
                                <Printer size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest font-bold font-bold italic">System Verified</span>
                            </div>
                        </div>

                        {/* Right Side: Ledger Details */}
                        <div className="flex-1 p-8 bg-white flex flex-col">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Financial Statement</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedSlip.month}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedSlip(null)}
                                    className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-colors text-slate-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Employment</p>
                                    <div><p className="text-xs font-bold text-slate-400">Department</p><p className="text-sm font-bold text-slate-800">{selectedSlip.dept}</p></div>
                                    <div><p className="text-xs font-bold text-slate-400">Payroll Cycle</p><p className="text-sm font-bold text-slate-800">{selectedSlip.month}</p></div>
                                    <div><p className="text-xs font-bold text-slate-400">Payment ID</p><p className="text-sm font-bold text-slate-800 font-black font-black italic">{selectedSlip.id}</p></div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Financial Breakdown</p>
                                    <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Gross Salary</span><span className="text-sm font-black text-slate-800">₹{selectedSlip.gross.toLocaleString()}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Total Deductions</span><span className="text-sm font-black text-rose-500">- ₹{selectedSlip.deductions.toLocaleString()}</span></div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-sm font-black text-slate-800 font-bold font-bold italic uppercase tracking-widest">Net Payable</span>
                                        <span className="text-2xl font-black text-emerald-600">₹{selectedSlip.net.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-4">
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Payment Success</p>
                                        <p className="text-xs text-emerald-600 font-bold">Successfully credited to primary bank account on {selectedSlip.date}.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-violet-200 transition-all flex items-center justify-center gap-2">
                                        <Printer size={16} /> Print Receipt
                                    </button>
                                    <button 
                                        onClick={() => handleDownload(selectedSlip)}
                                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
                                    >
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

export default Salary
>>>>>>> 945600258e73804e7b192ca6aa590e4d024cd912
