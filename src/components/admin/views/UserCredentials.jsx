import React, { useState, useEffect } from 'react'
import { fetchUsers, fetchUserById, updateUser, deleteUser } from '../../../api/userApi'
import { Loader2, Shield, Key, Mail, Phone, Users, Search, RefreshCw, AlertTriangle, X, ShieldAlert, Cpu, Edit3, Save, Trash2, CheckCircle } from 'lucide-react'




const UserCredentials = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [isDetailLoading, setIsDetailLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({})
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: null })




    const loadUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchUsers()
            setUsers(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("User Authentication Feed Interrupted:", err)
            setError("Failed to decrypt user repository.")
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetail = async (userId) => {
        try {
            setIsDetailLoading(true)
            setIsEditing(false)
            const data = await fetchUserById(userId)
            setSelectedUser(data)
            setEditForm(data)
        } catch (err) {
            console.error("Detail Decryption Failed:", err)
        } finally {
            setIsDetailLoading(false)
        }
    }

    const handleUpdateNode = async () => {
        try {
            setIsSaving(true)
            const updated = await updateUser(selectedUser.id, editForm)
            setSelectedUser(updated)
            setIsEditing(false)
            loadUsers() // Refresh list
            setModal({
                show: true,
                title: "Protocol Success",
                message: "Node identity parameters synchronized successfully with the core repository.",
                type: 'success'
            });
        } catch (err) {
            console.error("Update Blocked:", err)
            setModal({
                show: true,
                title: "Sync Failed",
                message: "Encryption parameters rejected by core. Identity synchronization aborted.",
                type: 'error'
            });
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteNode = async () => {
        setModal({
            show: true,
            title: "CRITICAL WARNING",
            message: "This action will permanently terminate the selected node from the core repository. Proceed with decommissioning?",
            type: 'warning',
            onConfirm: async () => {
                await executeDeletion();
            }
        });
    }

    const executeDeletion = async () => {
        try {
            setIsDeleting(true)
            await deleteUser(selectedUser.id)
            setSelectedUser(null)
            loadUsers() // Refresh list
            setModal({
                show: true,
                title: "Node Decommissioned",
                message: "Identity wiped from core repository. Sector sanitized.",
                type: 'success'
            });
        } catch (err) {
            console.error("Decommissioning Failed:", err)
            setModal({
                show: true,
                title: "Termination Blocked",
                message: "Node integrity protected by emergency protocols. Decommissioning aborted.",
                type: 'error'
            });
        } finally {
            setIsDeleting(false)
        }
    }




    useEffect(() => {
        loadUsers()
    }, [])

    const filteredUsers = users.filter(user =>
        user.nameUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dept?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className='h-full flex flex-col gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                <div>
                    <h2 className='text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase'>
                        <div className='p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200'>
                            <Shield size={24} />
                        </div>
                        Credential Vault
                    </h2>
                    <p className='text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2 ml-1'>Access Protocol: Level 4 Administrative</p>
                </div>

                <div className='flex items-center gap-3 w-full md:w-auto'>
                    <div className='relative flex-1 md:w-64'>
                        <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                        <input
                            type="text"
                            placeholder="Identify Node..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all'
                        />
                    </div>
                    <button
                        onClick={loadUsers}
                        className='p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-90 border border-indigo-100 shadow-sm'
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className='flex-1 overflow-auto custom-scrollbar rounded-3xl border border-slate-50'>
                {loading ? (
                    <div className='h-full flex flex-col items-center justify-center gap-4 py-20 bg-slate-50/50'>
                        <div className='relative'>
                            <Loader2 className='animate-spin text-indigo-600' size={48} />
                            <Shield className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-200' size={20} />
                        </div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse'>Establishing Secure Link...</p>
                    </div>
                ) : error ? (
                    <div className='h-full flex flex-col items-center justify-center gap-4 py-20 bg-rose-50/30'>
                        <AlertTriangle className='text-rose-500' size={48} />
                        <p className='text-sm font-black text-rose-900 uppercase tracking-widest'>{error}</p>
                        <button
                            onClick={loadUsers}
                            className='px-8 py-3 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-100'
                        >
                            Retry Handshake
                        </button>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center gap-4 py-20 opacity-30'>
                        <Users size={64} className='text-slate-300' />
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest italic'>No matching archives found</p>
                    </div>
                ) : (
                    <table className='w-full border-collapse'>
                        <thead className='sticky top-0 bg-white/80 backdrop-blur-md z-10'>
                            <tr className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50'>
                                <th className='px-8 py-6 text-left'>Node Identity</th>
                                <th className='px-8 py-6 text-left'>Authentication Link</th>
                                <th className='px-8 py-6 text-left'>Department</th>
                                <th className='px-8 py-6 text-center'>Access Key</th>
                                <th className='px-8 py-6 text-right'>Integrity</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => handleViewDetail(user.id)}
                                    className='group hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer'
                                >

                                    <td className='px-8 py-6'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-lg font-black text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6'>
                                                {user.nameUsername?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className='text-sm font-black text-slate-900 tracking-tight'>{user.nameUsername}</p>
                                                <p className='text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5'>ID: NODE-{user.id.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6'>
                                        <div className='space-y-1'>
                                            <div className='flex items-center gap-2 text-slate-600'>
                                                <Mail size={12} className='text-indigo-400' />
                                                <span className='text-xs font-bold'>{user.emailAddress}</span>
                                            </div>
                                            <div className='flex items-center gap-2 text-slate-400'>
                                                <Phone size={12} />
                                                <span className='text-[10px] font-bold'>{user.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6'>
                                        <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200'>
                                            {user.dept}
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-center'>
                                        <div className='group/key relative inline-flex items-center gap-2 bg-slate-900 text-slate-100 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest cursor-pointer hover:bg-indigo-600 transition-all'>
                                            <Key size={12} />
                                            <span className='blur-[2px] group-hover/key:blur-none transition-all duration-300'>{user.accessPassword}</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right'>
                                        <div className='flex justify-end items-center gap-2'>
                                            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                                            <span className='text-[9px] font-black text-slate-300 uppercase italic'>Verified Node</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detailed Credential Modal */}
            {(selectedUser || isDetailLoading) && (
                <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300'>
                    <div className='bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100'>
                        {isDetailLoading ? (
                            <div className='p-24 flex flex-col items-center justify-center gap-6'>
                                <div className='relative'>
                                    <Loader2 className='animate-spin text-indigo-600' size={64} />
                                    <Cpu className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-200' size={24} />
                                </div>
                                <span className='text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]'>Accessing Secure Core...</span>
                            </div>
                        ) : (
                            <>
                                <div className='p-10 bg-indigo-600 text-white relative overflow-hidden'>
                                    {/* Abstract background decorative elements */}
                                    <div className='absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
                                    <div className='absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-900/50 rounded-full blur-3xl'></div>

                                    <div className='flex justify-between items-center relative z-10'>
                                        <div className='flex items-center gap-6'>
                                            <div className='w-20 h-20 bg-white rounded-[2rem] flex-shrink-0 flex items-center justify-center text-4xl font-black text-indigo-600 shadow-2xl border-4 border-white/20 transform-gpu hover:scale-105 hover:rotate-3 transition-all duration-300'>
                                                {selectedUser.nameUsername?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className='flex flex-col justify-center'>
                                                {isEditing ? (
                                                    <input
                                                        value={editForm.nameUsername}
                                                        onChange={(e) => setEditForm({ ...editForm, nameUsername: e.target.value })}
                                                        className='bg-white/10 border-b-2 border-white/30 text-white text-3xl font-black outline-none focus:border-white transition-all w-full py-1 rounded-t-lg px-2'
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <h3 className='text-3xl font-black tracking-tighter leading-none mb-1'>{selectedUser.nameUsername}</h3>
                                                )}
                                                <div className='flex items-center gap-2 mt-1'>
                                                    <span className='px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 shrink-0'>Node #{selectedUser.id}</span>
                                                    <div className='w-1 h-1 bg-white/40 rounded-full'></div>
                                                    {isEditing ? (
                                                        <select
                                                            value={editForm.dept}
                                                            onChange={(e) => setEditForm({ ...editForm, dept: e.target.value })}
                                                            className='bg-white/10 border-none rounded-full px-3 py-1 text-[9px] font-black text-white outline-none uppercase tracking-widest cursor-pointer hover:bg-white/20 transition-all font-sans'
                                                        >
                                                            <option value="Engineering" className='text-slate-800'>Engineering</option>
                                                            <option value="Finance" className='text-slate-800'>Finance</option>
                                                            <option value="Design" className='text-slate-800'>Design</option>
                                                            <option value="HR" className='text-slate-800'>HR</option>
                                                        </select>
                                                    ) : (
                                                        <span className='px-3 py-1 bg-indigo-500/50 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 shrink-0'>{selectedUser.dept}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-2 items-center'>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className='p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white border border-white/10 shadow-lg backdrop-blur-md'
                                                    title="Modify Node"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(null)
                                                    setIsEditing(false)
                                                }}
                                                className='p-3 bg-white/10 hover:bg-rose-500 rounded-2xl transition-all border border-white/10 shadow-lg backdrop-blur-md'
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className='p-10 space-y-8 bg-white overflow-y-auto max-h-[60vh] custom-scrollbar'>
                                    <div className='flex flex-col gap-6'>
                                        <div className='p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner relative overflow-hidden flex flex-col items-center'>
                                            <div className='absolute top-0 right-0 p-4 opacity-[0.03] scale-150 rotate-12'>
                                                <Key size={80} />
                                            </div>
                                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2'>
                                                <Key size={14} className='text-indigo-600' /> Authentication Token
                                            </p>
                                            <div className='w-full flex items-center justify-between bg-slate-900 px-8 py-5 rounded-2xl shadow-2xl relative z-10'>
                                                {isEditing ? (
                                                    <input
                                                        value={editForm.accessPassword}
                                                        onChange={(e) => setEditForm({ ...editForm, accessPassword: e.target.value })}
                                                        className='bg-transparent text-emerald-400 font-mono text-2xl font-black tracking-[0.2em] outline-none w-full border-b border-emerald-400/30 focus:border-emerald-400 pb-1'
                                                    />
                                                ) : (
                                                    <span className='text-emerald-400 font-mono text-2xl font-black tracking-[0.2em] drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]'>{selectedUser.accessPassword}</span>
                                                )}
                                                <ShieldAlert size={20} className='text-emerald-400 opacity-50' />
                                            </div>
                                            <p className='text-[10px] text-slate-400 font-black mt-4 text-center uppercase tracking-widest opacity-60'>Primary access key for administrative override</p>
                                        </div>

                                        <div className='flex flex-col gap-4'>
                                            <div className='flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] group hover:border-indigo-100 transition-all duration-300'>
                                                <div className='p-4 bg-indigo-50 rounded-2xl text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white shadow-sm flex items-center justify-center shrink-0'>
                                                    <Mail size={20} />
                                                </div>
                                                <div className='flex-1'>
                                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-70'>Encryption ID (Email)</p>
                                                    {isEditing ? (
                                                        <input
                                                            value={editForm.emailAddress}
                                                            onChange={(e) => setEditForm({ ...editForm, emailAddress: e.target.value })}
                                                            className='text-base font-bold text-slate-800 outline-none w-full bg-slate-50 rounded-xl px-4 py-2 mt-1 border border-slate-200 focus:border-indigo-500 transition-all'
                                                        />
                                                    ) : (
                                                        <p className='text-base font-bold text-slate-800 tracking-tight'>{selectedUser.emailAddress}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] group hover:border-indigo-100 transition-all duration-300'>
                                                <div className='p-4 bg-indigo-50 rounded-2xl text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white shadow-sm flex items-center justify-center shrink-0'>
                                                    <Phone size={20} />
                                                </div>
                                                <div className='flex-1'>
                                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-70'>Comms Link (Phone)</p>
                                                    {isEditing ? (
                                                        <input
                                                            value={editForm.phone}
                                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                            className='text-base font-bold text-slate-800 outline-none w-full bg-slate-50 rounded-xl px-4 py-2 mt-1 border border-slate-200 focus:border-indigo-500 transition-all'
                                                        />
                                                    ) : (
                                                        <p className='text-base font-bold text-slate-800 tracking-tight'>{selectedUser.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='pt-6 flex flex-col gap-4'>
                                        {isEditing ? (
                                            <div className='flex gap-4'>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className='flex-1 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-[0.98]'
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpdateNode}
                                                    disabled={isSaving}
                                                    className='flex-1 bg-indigo-600 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.98]'
                                                >
                                                    {isSaving ? <Loader2 size={18} className='animate-spin' /> : <Save size={18} />}
                                                    {isSaving ? 'Syncing...' : 'Save Parameters'}
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setSelectedUser(null)}
                                                    className='w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]'
                                                >
                                                    Disconnect Session
                                                </button>
                                                <button
                                                    onClick={handleDeleteNode}
                                                    disabled={isDeleting}
                                                    className='w-full group/del py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]'
                                                >
                                                    {isDeleting ? <Loader2 size={16} className='animate-spin' /> : <Trash2 size={16} className='group-hover/del:animate-bounce shrink-0' />}
                                                    {isDeleting ? 'Terminating Identity...' : 'Terminate Node Identity'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Summary */}

            <div className='flex justify-between items-center py-4 px-2 border-t border-slate-50'>
                <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 bg-indigo-600 rounded-md'></div>
                        <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Total Nodes: {users.length}</span>
                    </div>
                </div>
                <div className='text-[9px] font-black text-slate-300 uppercase tracking-widest italic'>
                    AJA Advanced Security Encryption Protocol Active
                </div>
            </div>

            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${
                            modal.type === 'success' ? 'bg-emerald-500' : 
                            modal.type === 'error' ? 'bg-rose-500' : 
                            modal.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                {modal.type === 'success' ? <CheckCircle size={100} /> : <AlertTriangle size={100} />}
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <CheckCircle className="text-emerald-500" size={32} /> : 
                                 modal.type === 'error' ? <ShieldAlert className="text-rose-500" size={32} /> : 
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
                                            className={`flex-1 py-4 ${
                                                modal.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-600'
                                            } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                                        >
                                            Confirm
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setModal({ ...modal, show: false })}
                                        className={`w-full py-4 ${
                                            modal.type === 'success' ? 'bg-emerald-500' : 
                                            modal.type === 'error' ? 'bg-rose-500' : 'bg-indigo-600'
                                        } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                                    >
                                        Acknowledge
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default UserCredentials;
