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
