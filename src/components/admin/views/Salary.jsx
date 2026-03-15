import React, { useState, useEffect } from 'react';
import { fetchAdminEmployees } from '../../../api/employeeApi';
import { postSalary, fetchSalaries, fetchSalaryById, fetchSalariesByDepartment, searchSalariesByName, fetchSalariesByStatus, updateSalary, deleteSalary } from '../../../api/salaryApi';
import { postEmployeeSalary, fetchAllEmployeeSalaries, fetchEmployeeSalaryById, updateEmployeeSalary, deleteEmployeeSalary } from '../../../api/employeeSalaryApi';

import { DollarSign, Save, Loader2, Calendar, Trash2, History, PlusCircle, CheckCircle, XCircle, Eye, X, Building2, Briefcase, UserCircle, Receipt, Search, Filter, Pencil, Zap, Edit, AlertTriangle } from 'lucide-react';














const Salary = () => {
    const [employees, setEmployees] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('issue'); // 'issue', 'history', or 'quick'
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: null, onFinish: null });

    const [detailLoading, setDetailLoading] = useState(false);
    const [deptFilter, setDeptFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingQuick, setIsEditingQuick] = useState(false);
    const [editId, setEditId] = useState(null);








    // Form state corresponding to the ResponseBody 
    const [formData, setFormData] = useState({
        employeeCode: '',
        employeeName: '',
        department: '',
        designation: '',
        receiptDate: new Date().toISOString().split('T')[0],
        receiptIssued: true,
        status: 'PAID',

        // Financials
        grossSalary: 0,
        deductions: 0,
        netSalary: 0,

        // Granular components for calculation
        basicCompensation: 0,
        hraSupport: 0,
        medicalConveyance: 0,
        specialAllowances: 0,
        providentFund: 0,
        professionalTax: 0,
        healthInsurance: 0,
        tds: 0
    });

    const [quickFormData, setQuickFormData] = useState({
        employeeId: '',
        cycle: '',
        gross: 0,
        deductions: 0,
        netAmount: 0,
        transferDate: new Date().toISOString().split('T')[0],
        transactionStatus: 'PAID'
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
        loadSalaries();
    }, [employees.length]); // Re-run if employees load to get names right



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

    const handleViewDetail = async (item) => {
        try {
            setDetailLoading(true);
            // Immediately show what we have
            setSelectedSalary(item);

            // If it's a standard salary, try to fetch granular details from the archive
            if (item._type === 'standard') {
                const fullData = await fetchSalaryById(item.id);
                if (fullData && !fullData.message) {
                    setSelectedSalary(prev => ({ ...prev, ...fullData }));
                }
            } else if (item._type === 'simplified') {
                const fullData = await fetchEmployeeSalaryById(item.id);
                if (fullData && !fullData.message) {
                    setSelectedSalary(prev => ({ ...prev, ...fullData }));
                }
            }
        } catch (err) {
            console.error("Failed to fetch extended salary details", err);
            // We still show the base data we already have, so no hard error modal needed unless we want it
        } finally {
            setDetailLoading(false);
        }
    };

    const handleEdit = (salary) => {
        if (salary._type === 'simplified') {
            setIsEditingQuick(true);
            setEditId(salary.id);
            setQuickFormData({
                employeeId: salary._raw.employeeId,
                cycle: salary._raw.cycle,
                gross: salary._raw.gross,
                deductions: salary._raw.deductions,
                netAmount: salary._raw.netAmount,
                transferDate: salary._raw.transferDate,
                transactionStatus: salary._raw.transactionStatus
            });
            setActiveTab('quick');
        } else {
            setIsEditing(true);
            setEditId(salary.id);

            const emp = employees.find(e => e.username === salary.employeeName);

            setFormData({
                employeeId: emp ? emp.empId : '',
                employeeCode: salary.employeeCode,
                employeeName: salary.employeeName,
                department: salary.department,
                designation: salary.designation,
                receiptDate: salary.receiptDate,
                receiptIssued: salary.receiptIssued,
                status: salary.status,
                grossSalary: salary.grossSalary,
                deductions: salary.deductions,
                netSalary: salary.netSalary,
                basicCompensation: salary.grossSalary,
                hraSupport: 0,
                medicalConveyance: 0,
                specialAllowances: 0,
                providentFund: salary.deductions,
                professionalTax: 0,
                healthInsurance: 0,
                tds: 0
            });

            setActiveTab('issue');
        }
    };


    const handleDelete = async (salary) => {
        setModal({
            show: true,
            title: "CRITICAL ACTION",
            message: `Are you sure you want to permanently delete the salary record for ${salary.employeeName}? This operation is irreversible.`,
            type: 'warning',
            onConfirm: async () => {
                await executeDelete(salary);
            }
        });
    }

    const executeDelete = async (salary) => {

        try {
            setHistoryLoading(true);
            if (salary._type === 'simplified') {
                await deleteEmployeeSalary(salary.id);
            } else {
                await deleteSalary(salary.id);
            }
            setModal({
                show: true,
                title: "Record Terminated",
                message: "Salary archive has been wiped from the core successfully.",
                type: 'success'
            });
            loadSalaries(); // Refresh unified list
        } catch (err) {
            console.error("Failed to delete record", err);
            setModal({
                show: true,
                title: "Termination Blocked",
                message: "System protocols prevented the deletion of this record.",
                type: 'error'
            });
        } finally {
            setHistoryLoading(false);
        }
    };


    const handleQuickSubmit = async (e) => {
        e.preventDefault();
        if (!quickFormData.employeeId || quickFormData.employeeId === "") {
            setModal({
                show: true,
                title: "Validation Error",
                message: "Please select a valid employee before proceeding.",
                type: 'error'
            });
            return;
        }

        if (Number(quickFormData.gross) <= 0) {
            setModal({
                show: true,
                title: "Invalid Financials",
                message: "Gross amount must be greater than zero.",
                type: 'error'
            });
            return;
        }

        try {
            setSubmitLoading(true);
            const payload = {
                ...quickFormData,
                employeeId: Number(quickFormData.employeeId),
                netAmount: Number(quickFormData.gross) - Number(quickFormData.deductions)
            };

            if (isEditingQuick) {
                await updateEmployeeSalary(editId, payload);
                setModal({
                    show: true,
                    title: "Sync Success",
                    message: "Simplified salary record updated and synchronized with core.",
                    type: 'success'
                });
                setIsEditingQuick(false);
                setEditId(null);
            } else {
                await postEmployeeSalary(payload);
                setModal({
                    show: true,
                    title: "Issue Success",
                    message: "Simplified salary record issued successfully.",
                    type: 'success',
                });
            }

            // Show all data immediately after save
            setNameFilter('');
            setDeptFilter('');
            setStatusFilter('');
            loadSalaries();
            setActiveTab('history');

            setQuickFormData({
                employeeId: '',
                cycle: '',
                gross: 0,
                deductions: 0,
                netAmount: 0,
                transferDate: new Date().toISOString().split('T')[0],
                transactionStatus: 'PAID'
            });
        } catch (err) {
            console.error("Failed to process simplified salary:", err);
            setModal({
                show: true,
                title: "Transaction Failed",
                message: `Failed to ${isEditingQuick ? 'update' : 'post'} simplified salary record.`,
                type: 'error'
            });
        } finally {
            setSubmitLoading(false);
        }
    };


    const handleFilterSubmit = async (e) => {
        if (e) e.preventDefault();

        // If all are empty, load all
        if (!deptFilter.trim() && !nameFilter.trim() && !statusFilter.trim()) {
            loadSalaries();
            return;
        }

        try {
            setHistoryLoading(true);
            let data = [];

            if (nameFilter.trim()) {
                data = await searchSalariesByName(nameFilter);
            } else if (deptFilter.trim()) {
                data = await fetchSalariesByDepartment(deptFilter);
            } else if (statusFilter.trim()) {
                data = await fetchSalariesByStatus(statusFilter);
            }

            const normalizedData = (Array.isArray(data) ? data : []).map(s => normalizeSalaryRecord(s, 'standard'));
            setSalaries(normalizedData);
        } catch (err) {
            console.error("Failed to filter records", err);
            setSalaries([]);
        } finally {
            setHistoryLoading(false);
        }
    };



    const normalizeSalaryRecord = (s, type) => {
        const norm = {
            id: s.id || s.salaryId || s._id,
            employeeCode: s.employeeCode || s.emp_code || (type === 'simplified' ? `EMP${String(s.employeeId || '').padStart(3, '0')}` : ''),
            status: s.status || s.transactionStatus || 'PAID',
            receiptDate: s.receiptDate || s.transferDate || s.payment_date,
            department: s.department || 'N/A',
            designation: s.designation || s.cycle || 'N/A',
            _type: type,
            _raw: s
        };

        // Name resolution
        let name = s.employeeName || s.emp_name;
        if (!name || String(name).toLowerCase().includes('undefined')) {
            const empId = s.employeeId || s.emp_id || (s.employeeCode ? s.employeeCode.replace('EMP', '') : null);
            const emp = employees.find(e => String(e.empId) === String(empId) || String(e.id) === String(empId));
            name = emp ? (emp.username || `${emp.firstName || ''} ${emp.lastName || ''}`.trim()) : (s.employeeId ? `ID: ${s.employeeId}` : 'Unknown');
        }
        norm.employeeName = name;

        if (type === 'standard' || s.grossSalary !== undefined) {
            norm.grossSalary = Number(s.grossSalary || s.gross_salary || 0);
            norm.deductions = Number(s.deductions || 0);
            norm.netSalary = Number(s.netSalary || s.net_salary || (norm.grossSalary - norm.deductions));
            norm.receiptIssued = s.receiptIssued !== undefined ? s.receiptIssued : true;
        } else {
            norm.grossSalary = Number(s.gross || s.gross_salary || 0);
            norm.deductions = Number(s.deductions || 0);
            norm.netSalary = Number(s.netAmount || s.net_salary || (norm.grossSalary - norm.deductions));
            norm.receiptIssued = true;
        }
        return norm;
    };

    const loadSalaries = async () => {
        try {
            setHistoryLoading(true);
            const [standardData, simplifiedData] = await Promise.all([
                fetchSalaries(),
                fetchAllEmployeeSalaries()
            ]);

            const unified = [
                ...(Array.isArray(standardData) ? standardData.map(s => normalizeSalaryRecord(s, 'standard')) : []),
                ...(Array.isArray(simplifiedData) ? simplifiedData.map(s => normalizeSalaryRecord(s, 'simplified')) : [])
            ].filter(s => {
                const nameStr = String(s.employeeName || '').toLowerCase();
                const codeStr = String(s.employeeCode || '').toLowerCase();
                const isValidId = s.id !== undefined && s.id !== null && String(s.id) !== 'undefined';
                return isValidId && s.employeeName && !nameStr.includes('undefined') && !codeStr.includes('undefined') && s.receiptDate;
            });

            setSalaries(unified);
        } catch (err) {
            console.error("Failed to fetch salary history", err);
        } finally {
            setHistoryLoading(false);
        }
    };


    const handleChange = (e) => {


        const { name, value, type, checked } = e.target;

        if (name === 'employeeId') {
            const selectedEmp = employees.find(emp =>
                String(emp.empId) === String(value) ||
                String(emp.id) === String(value)
            );

            if (selectedEmp) {
                const effectiveEmpId = selectedEmp.empId || selectedEmp.id;
                const effectiveName = selectedEmp.username || (selectedEmp.firstName ? `${selectedEmp.firstName} ${selectedEmp.lastName || ''}`.trim() : `ID: ${effectiveEmpId}`);
                
                setFormData(prev => ({
                    ...prev,
                    employeeId: value,
                    employeeCode: selectedEmp.employeeCode || `EMP${String(effectiveEmpId).padStart(3, '0')}`,
                    employeeName: effectiveName,
                    department: selectedEmp.department || 'IT',
                    designation: selectedEmp.role || selectedEmp.designation || 'Staff'
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    employeeId: value,
                    employeeCode: '',
                    employeeName: '',
                    department: '',
                    designation: ''
                }));
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employeeCode || formData.employeeCode.includes('undefined')) {
            setModal({
                show: true,
                title: "Employee Unresolved",
                message: "Please select a valid employee from the list to populate their records.",
                type: 'error'
            });
            return;
        }

        if (Number(calculated.netAmount) <= 0) {
            setModal({
                show: true,
                title: "Review Required",
                message: "Net salary cannot be zero or negative. Please review earnings and deductions.",
                type: 'error'
            });
            return;
        }

        try {
            setSubmitLoading(true);

            // Construct payload matching the required ResponseBody format
            const payload = {
                employeeId: Number(formData.employeeId),
                employeeCode: formData.employeeCode || `EMP${Date.now().toString().slice(-3)}`,
                employeeName: formData.employeeName || 'Unknown Employee',
                department: formData.department || 'General',
                designation: formData.designation || 'Staff',
                grossSalary: Number(calculated.grossAmount) || 0,
                deductions: Number(calculated.totalDeductions) || 0,
                netSalary: Number(calculated.netAmount) || 0,
                receiptDate: formData.receiptDate || new Date().toISOString().split('T')[0],
                receiptIssued: formData.receiptIssued,
                status: formData.status
            };

            console.log("Salary Dispatch Payload:", payload);

            if (isEditing) {
                await updateSalary(editId, payload);
                setModal({
                    show: true,
                    title: "Update Authorized",
                    message: "Salary archive updated successfully.",
                    type: 'success'
                });
                setIsEditing(false);
                setEditId(null);
            } else {
                await postSalary(payload);
                setModal({
                    show: true,
                    title: "Issue Successful",
                    message: `Remuneration issued for ${formData.employeeName || 'the employee'} and logged in core repository.`,
                    type: 'success',
                });
            }

            // Show all data immediately after save
            setNameFilter('');
            setDeptFilter('');
            setStatusFilter('');
            loadSalaries();
            setActiveTab('history');

            // Reset form
            setFormData({
                employeeCode: '',
                employeeName: '',
                department: '',
                designation: '',
                receiptDate: new Date().toISOString().split('T')[0],
                receiptIssued: true,
                status: 'PAID',
                grossSalary: 0,
                deductions: 0,
                netSalary: 0,
                basicCompensation: 0,
                hraSupport: 0,
                medicalConveyance: 0,
                specialAllowances: 0,
                providentFund: 0,
                professionalTax: 0,
                healthInsurance: 0,
                tds: 0
            });

        } catch (err) {
            console.error("Full Error Response:", err.response);
            const errorMessage = err.response?.data?.message || err.response?.data || err.message;
            setModal({
                show: true,
                title: "Backend Violation",
                message: `Transaction Error: ${typeof errorMessage === 'string' ? errorMessage : 'Internal Protocol Error'}`,
                type: 'error'
            });
        } finally {
            setSubmitLoading(false);
        }
    };



    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 h-full overflow-y-auto pb-20 scrollbar-hide">
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-100'>
                <div className='flex items-center gap-3'>
                    <div className='p-3 bg-blue-50 text-blue-600 rounded-2xl'>
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <h2 className='text-3xl font-black tracking-tight text-gray-900'>Salary Management</h2>
                        <p className='text-gray-400 text-xs font-bold uppercase tracking-widest mt-1'>Generate & Manage Remuneration</p>
                    </div>
                </div>

                <div className='flex bg-gray-100 p-1 rounded-2xl'>
                    <button
                        onClick={() => {
                            setActiveTab('issue');
                            if (!isEditing) {
                                // Clear form if not editing
                                setFormData({
                                    employeeCode: '', employeeName: '', department: '', designation: '',
                                    receiptDate: new Date().toISOString().split('T')[0], receiptIssued: true, status: 'PAID',
                                    basicCompensation: 0, hraSupport: 0, medicalConveyance: 0, specialAllowances: 0,
                                    providentFund: 0, professionalTax: 0, healthInsurance: 0, tds: 0
                                });
                            }
                        }}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'issue' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <PlusCircle size={16} /> {isEditing ? 'Editing Salary' : 'Issue Salary'}
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('history');
                            setIsEditing(false);
                            setEditId(null);
                        }}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <History size={16} /> History
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('quick');
                            if (!isEditingQuick) {
                                setQuickFormData({
                                    employeeId: '', cycle: '', gross: 0, deductions: 0, netAmount: 0,
                                    transferDate: new Date().toISOString().split('T')[0], transactionStatus: 'PAID'
                                });
                            }
                        }}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'quick' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Zap size={16} /> {isEditingQuick ? 'Editing Quick' : 'Quick Issue'}
                    </button>



                </div>
            </div>

            {activeTab === 'issue' ? (


                <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">

                    {/* Core Info */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Calendar size={18} className="text-blue-500" /> {isEditing ? 'Update Transaction Details' : 'Administrative Details'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">Select Employee</label>
                                <select
                                    name="employeeId"
                                    value={formData.employeeId || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-200 text-black font-bold text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
                                >
                                    <option value="">-- Choose Employee --</option>
                                    {employees.map((emp, idx) => {
                                        const empId = emp.empId || emp.id;
                                        const name = emp.username || emp.firstName || 'Unknown';
                                        return (
                                            <option key={`emp-opt-${empId}-${idx}`} value={empId}>
                                                {name} (ID: {empId})
                                            </option>
                                        );
                                    })}
                                </select>
                                {formData.employeeName && (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setNameFilter(formData.employeeName);
                                            setActiveTab('history');
                                        }}
                                        className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <History size={12} /> View History for {formData.employeeName}
                                    </button>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">Employee Code</label>
                                <input
                                    type="text"
                                    name="employeeCode"
                                    value={formData.employeeCode}
                                    readOnly
                                    className="w-full bg-gray-50 border border-gray-200 text-black font-bold text-sm rounded-xl p-3 outline-none cursor-not-allowed shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">Receipt Date</label>
                                <input
                                    type="date"
                                    name="receiptDate"
                                    value={formData.receiptDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-200 text-black font-bold text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">Payment Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 text-black font-bold text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
                                >
                                    <option value="PAID">PAID</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                </select>
                            </div>
                        </div>

                        {formData.employeeName && (
                            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                                <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Employee:</span>
                                    <span className="text-sm font-bold text-blue-700">{formData.employeeName}</span>
                                </div>
                                <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Dept:</span>
                                    <span className="text-sm font-bold text-emerald-700">{formData.department}</span>
                                </div>
                                <div className="px-4 py-2 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Role:</span>
                                    <span className="text-sm font-bold text-purple-700">{formData.designation}</span>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Earnings */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest pb-3 border-b border-emerald-100">Earnings Components</h3>

                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-xs font-black text-black uppercase mb-1">Basic Compensation (₹)</label>
                                    <input type="number" name="basicCompensation" value={formData.basicCompensation || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-black font-bold" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-black text-black uppercase mb-1">HRA Support (₹)</label>
                                    <input type="number" name="hraSupport" value={formData.hraSupport || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-black font-bold" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-black text-black uppercase mb-1">Medical Conveyance (₹)</label>
                                    <input type="number" name="medicalConveyance" value={formData.medicalConveyance || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-black font-bold" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-black text-black uppercase mb-1">Special Allowances (₹)</label>
                                    <input type="number" name="specialAllowances" value={formData.specialAllowances || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-black font-bold" />
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
                                    <label className="text-xs font-black text-black uppercase mb-1">Provident Fund (₹)</label>
                                    <input type="number" name="providentFund" value={formData.providentFund || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500 text-black font-bold" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-black text-black uppercase mb-1">Professional Tax (₹)</label>
                                    <input type="number" name="professionalTax" value={formData.professionalTax || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500 text-black font-bold" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-black text-black uppercase mb-1">Health Insurance (₹)</label>
                                    <input type="number" name="healthInsurance" value={formData.healthInsurance || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500 text-black font-bold" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-black text-black uppercase mb-1">TDS (₹)</label>
                                    <input type="number" name="tds" value={formData.tds || ''} onFocus={(e) => e.target.select()} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-red-500 text-black font-bold" />
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
                                <input type="checkbox" name="receiptIssued" checked={formData.receiptIssued} onChange={handleChange} id="receiptIssued" className="w-5 h-5 rounded cursor-pointer" />
                                <label htmlFor="receiptIssued" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Receipt Issued</label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading || loading}
                                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-75 disabled:active:scale-100 border-2 border-transparent hover:border-blue-200"
                            >
                                {submitLoading ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? <CheckCircle size={20} /> : <Save size={20} />)}
                                {submitLoading ? 'Processing...' : (isEditing ? 'Update Record' : 'SUBMIT')}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditId(null);
                                        setActiveTab('history');
                                    }}
                                    className="bg-white/20 text-white hover:bg-white/30 px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                    </div>
                </form>
            ) : activeTab === 'quick' ? (
                <form onSubmit={handleQuickSubmit} className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap size={18} className="text-amber-500" /> Simplified Salary Issuance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">Select Employee</label>
                                <select
                                    value={quickFormData.employeeId}
                                    onChange={(e) => setQuickFormData({ ...quickFormData, employeeId: e.target.value })}
                                    required
                                    className="w-full bg-white border border-gray-200 text-black font-bold text-sm rounded-xl p-3 outline-none focus:border-amber-500 transition-colors shadow-sm"
                                >
                                    <option value="">-- Choose Employee --</option>
                                    {employees.map((emp, idx) => (
                                        <option key={`quick-emp-${emp.empId}-${idx}`} value={emp.empId}>
                                            {emp.username} (ID: {emp.empId})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">Billing Cycle</label>
                                <input
                                    type="text"
                                    placeholder="e.g. September 2025"
                                    value={quickFormData.cycle}
                                    onChange={(e) => setQuickFormData({ ...quickFormData, cycle: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-amber-500 text-black font-bold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">Transfer Date</label>
                                <input
                                    type="date"
                                    value={quickFormData.transferDate}
                                    onChange={(e) => setQuickFormData({ ...quickFormData, transferDate: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-amber-500 text-black font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-4 pt-4 border-t border-amber-100">
                                <div>
                                    <label className="text-xs font-black text-black uppercase mb-1">Gross Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={quickFormData.gross || ''}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => setQuickFormData({ ...quickFormData, gross: Number(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-amber-500 text-black font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-black uppercase mb-1">Deductions (₹)</label>
                                    <input
                                        type="number"
                                        value={quickFormData.deductions || ''}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => setQuickFormData({ ...quickFormData, deductions: Number(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-amber-500 text-black font-bold"
                                    />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-amber-100 flex flex-col justify-center items-center gap-2">
                                <p className="text-[10px] font-black text-black uppercase tracking-widest">Net Payable</p>
                                <p className="text-4xl font-black text-amber-600">₹{(quickFormData.gross - quickFormData.deductions).toLocaleString()}</p>
                                <div className="mt-4 w-full">
                                    <label className="block text-center text-xs font-black text-black uppercase mb-2">Status</label>
                                    <select
                                        value={quickFormData.transactionStatus}
                                        onChange={(e) => setQuickFormData({ ...quickFormData, transactionStatus: e.target.value })}
                                        className="w-full bg-amber-50 border border-amber-100 text-black font-bold text-sm rounded-xl p-2 outline-none text-center"
                                    >
                                        <option value="PAID">PAID</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="bg-amber-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95 flex items-center gap-3"
                            >
                                {submitLoading ? <Loader2 className="animate-spin" size={20} /> : (isEditingQuick ? <Edit size={20} /> : <Zap size={20} />)}
                                {submitLoading ? 'Processing...' : (isEditingQuick ? 'Update Record' : 'Quick Dispatch')}
                            </button>
                            {isEditingQuick && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingQuick(false);
                                        setEditId(null);
                                        setActiveTab('history');
                                    }}
                                    className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>

            ) : (




                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-[2rem] border border-gray-100 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm w-full md:w-60 focus-within:border-blue-500 transition-all">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Name..."
                                    value={nameFilter}
                                    onChange={(e) => { setNameFilter(e.target.value); setDeptFilter(''); setStatusFilter(''); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
                                    className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full placeholder:text-gray-300 placeholder:font-normal"
                                />
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm w-full md:w-60 focus-within:border-blue-500 transition-all">
                                <Filter size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by Dept..."
                                    value={deptFilter}
                                    onChange={(e) => { setDeptFilter(e.target.value); setNameFilter(''); setStatusFilter(''); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
                                    className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full placeholder:text-gray-300 placeholder:font-normal"
                                />
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm w-full md:w-56 focus-within:border-blue-500 transition-all">
                                <CheckCircle size={18} className="text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setNameFilter(''); setDeptFilter(''); }}
                                    className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="PAID">PAID</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleFilterSubmit}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                            >
                                Search
                            </button>
                            {(deptFilter || nameFilter || statusFilter) && (
                                <button
                                    onClick={() => { setDeptFilter(''); setNameFilter(''); setStatusFilter(''); loadSalaries(); }}
                                    className="px-6 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>



                    <div className="overflow-x-auto rounded-[2rem] border border-gray-100 shadow-sm custom-scrollbar">

                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80 backdrop-blur-md">
                                <tr className="text-black text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                    <th className="p-6">Employee</th>
                                    <th className="p-6">Financials</th>
                                    <th className="p-6">Timeline</th>
                                    <th className="p-6 text-center">Receipt</th>
                                    <th className="p-6 text-center">Status</th>
                                    <th className="p-6 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {historyLoading ? (
                                    <tr>
                                        <td colSpan="5" className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-4 text-blue-400">
                                                <Loader2 className="animate-spin" size={48} />
                                                <p className="font-black text-xs uppercase tracking-[0.3em]">Retrieving Records...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : salaries.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-32 text-center text-gray-300 font-black uppercase tracking-[0.2em] italic">No transaction records found</td>
                                    </tr>
                                ) : (
                                    salaries.map((salary, idx) => (
                                        <tr key={salary.id ? `salary-${salary.id}-${idx}` : `sal-idx-${idx}`} className="hover:bg-blue-50/30 group transition-all duration-300">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-sm font-black text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        {salary.employeeName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 text-sm tracking-tight">{salary.employeeName}</p>
                                                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{salary.employeeCode}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 text-xs font-black">₹{(salary.netSalary || 0).toLocaleString()}</span>
                                                    <span className="text-gray-400 text-[10px] font-bold">Gross: ₹{(salary.grossSalary || 0).toLocaleString()} / Ded: ₹{(salary.deductions || 0).toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700 text-xs font-bold">{salary.receiptDate ? new Date(salary.receiptDate).toLocaleDateString() : 'Invalid Date'}</span>
                                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">{(salary.department || 'N/A')} • {(salary.designation || 'N/A')}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center">
                                                    {salary.receiptIssued ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                                            <CheckCircle size={12} />
                                                            <span className="text-[10px] font-black uppercase">Issued</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-400 rounded-full border border-gray-100">
                                                            <XCircle size={12} />
                                                            <span className="text-[10px] font-black uppercase">Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all ${salary.status === 'PAID'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    {salary.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center border-l border-gray-50">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetail(salary)}
                                                        className="p-2.5 bg-white text-blue-600 rounded-xl border border-gray-100 shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(salary)}
                                                        className="p-2.5 bg-white text-amber-600 rounded-xl border border-gray-100 shadow-sm hover:bg-amber-600 hover:text-white transition-all active:scale-90"
                                                        title="Edit Record"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(salary)}
                                                        className="p-2.5 bg-white text-red-600 rounded-xl border border-gray-100 shadow-sm hover:bg-red-600 hover:text-white transition-all active:scale-90"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>

                                                </div>
                                            </td>


                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Detail Modal */}
                    {selectedSalary && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
                                {/* Modal Header */}
                                <div className="bg-blue-600 p-8 text-white relative">
                                    <button
                                        onClick={() => setSelectedSalary(null)}
                                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl font-black">
                                            {selectedSalary.employeeName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight">{selectedSalary.employeeName}</h3>
                                            <div className="flex items-center gap-2 mt-2 opacity-80">
                                                <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-lg">{selectedSalary.employeeCode}</span>
                                                <span className="text-xs font-bold">•</span>
                                                <span className="text-xs font-bold uppercase tracking-widest">{selectedSalary.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Gross Salary</p>
                                            <p className="text-lg font-black text-gray-900">₹{selectedSalary.grossSalary?.toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Deductions</p>
                                            <p className="text-lg font-black text-red-600">₹{selectedSalary.deductions?.toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Net Payable</p>
                                            <p className="text-lg font-black text-emerald-600">₹{selectedSalary.netSalary?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Professional Info */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Assignment Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Building2 size={18} /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-black uppercase">Department</p>
                                                    <p className="text-sm font-bold text-gray-800">{selectedSalary.department}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Briefcase size={18} /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-black uppercase">Designation</p>
                                                    <p className="text-sm font-bold text-gray-800">{selectedSalary.designation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Granular Breakdown (for Standard) */}
                                    {selectedSalary._type === 'standard' && (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Compensation Breakdown</h4>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 font-bold uppercase tracking-tight">Basic</span>
                                                    <span className="font-black text-gray-900">₹{selectedSalary._raw?.basicCompensation?.toLocaleString() || '0'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 font-bold uppercase tracking-tight">PF Contribution</span>
                                                    <span className="font-black text-red-600">₹{selectedSalary._raw?.providentFund?.toLocaleString() || '0'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 font-bold uppercase tracking-tight">HRA</span>
                                                    <span className="font-black text-gray-900">₹{selectedSalary._raw?.hraSupport?.toLocaleString() || '0'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 font-bold uppercase tracking-tight">Professional Tax</span>
                                                    <span className="font-black text-red-600">₹{selectedSalary._raw?.professionalTax?.toLocaleString() || '0'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 font-bold uppercase tracking-tight">Medical/Conv.</span>
                                                    <span className="font-black text-gray-900">₹{selectedSalary._raw?.medicalConveyance?.toLocaleString() || '0'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 font-bold uppercase tracking-tight">Health Insurance</span>
                                                    <span className="font-black text-red-600">₹{selectedSalary._raw?.healthInsurance?.toLocaleString() || '0'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bank Details (for Simplified) */}
                                    {selectedSalary._type === 'simplified' && (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Payment Repository</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Bank Name</p>
                                                    <p className="text-sm font-black text-gray-800">{selectedSalary._raw?.bank || 'AJA Internal Treasury'}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Account reference</p>
                                                    <p className="text-sm font-black text-gray-800 tracking-widest">{selectedSalary._raw?.account || 'XXXX-REF-000'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Receipt Info */}
                                    <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Receipt size={24} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Transaction Date</p>
                                                <p className="text-base font-black text-blue-900">{selectedSalary.receiptDate ? new Date(selectedSalary.receiptDate).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${selectedSalary.receiptIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {selectedSalary.receiptIssued ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {selectedSalary.receiptIssued ? 'Receipt Dispatched' : 'Physical Receipt Pending'}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => setSelectedSalary(null)}
                                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                                    >
                                        Close Portal
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── ACTION MODAL ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${modal.type === 'success' ? 'bg-emerald-500' :
                                modal.type === 'error' ? 'bg-rose-500' :
                                    modal.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                {modal.type === 'success' ? <CheckCircle size={100} /> : <AlertTriangle size={100} />}
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <CheckCircle className="text-emerald-500" size={32} /> :
                                    modal.type === 'error' ? <XCircle className="text-rose-500" size={32} /> :
                                        <AlertTriangle className="text-amber-500" size={32} />}
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl text-white tracking-tight">{modal.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                                {modal.message}
                            </p>
                            <div className="flex gap-3">
                                {modal.onConfirm ? (
                                    <>
                                        <button
                                            onClick={() => setModal({ ...modal, show: false })}
                                            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            onClick={() => {
                                                modal.onConfirm();
                                                setModal({ ...modal, show: false });
                                            }}
                                            className={`flex-1 py-4 ${modal.type === 'warning' ? 'bg-amber-500' : 'bg-blue-600'
                                                } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                                        >
                                            Confirm
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (modal.onFinish) modal.onFinish();
                                            setModal({ ...modal, show: false });
                                        }}
                                        className={`w-full py-4 ${modal.type === 'success' ? 'bg-emerald-500' :
                                                modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-600'
                                            } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                                    >
                                        {modal.type === 'success' ? 'View in History' : 'Acknowledge'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Salary;
