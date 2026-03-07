import React, { useState } from 'react';
import { KeyRound, Lock, ShieldCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { employeeResetPassword } from '../../../api/employeeApi';

const ResetPassword = ({ data }) => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            // Payload based on requirements
            const response = await employeeResetPassword({ 
                email: data?.email,
                token, 
                newPassword 
            });
            
            const responseMessage = typeof response === 'string' ? response : (response.message || "Password reset successfully");
            
            if (responseMessage.toLowerCase().includes("success")) {
                setMessage(responseMessage);
                setToken('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(responseMessage);
            }
        } catch (err) {
            console.error("Employee reset password failed:", err);
            setError(err.response?.data?.message || "Failed to reset password. Security token may be incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 h-full overflow-y-auto pb-20 scrollbar-hide">
            <div className='flex items-center gap-3 mb-8 pb-6 border-b border-gray-100'>
                <div className='p-3 bg-blue-50 text-blue-600 rounded-2xl'>
                    <KeyRound size={28} />
                </div>
                <div>
                    <h2 className='text-3xl font-black tracking-tight text-gray-900'>Security Terminal</h2>
                    <p className='text-gray-400 text-xs font-bold uppercase tracking-widest mt-1'>Update Access Credentials</p>
                </div>
            </div>

            <div className="max-w-md mx-auto mt-10">
                <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

                    <div className="text-center mb-6 relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm border border-gray-100">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Identity Overwrite</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-4 mt-2 opacity-60">Enter verification hash <br/> to set new credentials</p>
                    </div>

                    {message && (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                <CheckCircle size={16} className="text-emerald-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{message}</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                <AlertCircle size={16} className="text-red-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                        </div>
                    )}

                    <div className="space-y-1.5 relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Verification Token</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Enter Security Token"
                                required
                                className="w-full border-2 border-slate-100 bg-white text-sm font-bold rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-blue-500 text-slate-900 group-hover:border-slate-200 shadow-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Access Key</label>
                        <div className="relative group">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full border-2 border-slate-100 bg-white text-sm rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-blue-500 text-slate-900 group-hover:border-slate-200 shadow-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Lock size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Access Key</label>
                        <div className="relative group">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full border-2 border-slate-100 bg-white text-sm rounded-2xl block p-4 pl-12 outline-none transition-all focus:border-blue-500 text-slate-900 group-hover:border-slate-200 shadow-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Lock size={20} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 mt-4 relative z-10"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <KeyRound size={16} />}
                        {loading ? 'Re-initializing Identity...' : 'Execute Key Overwrite'}
                    </button>
                    
                    <div className="text-center pt-2 relative z-10">
                         <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 opacity-40">System Node Security Protocol Active</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
