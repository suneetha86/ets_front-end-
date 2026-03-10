import React, { useState, useEffect } from 'react'
import { Plus, X, Loader2, Database, ShieldCheck, RefreshCw, Trash2, Layers } from 'lucide-react'
import { fetchDepartments, createDepartment, deleteDepartment, updateDepartment } from '../../../api/departmentApi'
import Modal from '../../common/Modal'

const Departments = () => {
    const [departments, setDepartments] = useState([])
    const [newDept, setNewDept] = useState('')
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(null)
    const [editingDept, setEditingDept] = useState(null)
    const [editName, setEditName] = useState('')
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
        isConfirm: false,
        onConfirm: () => {}
    })

    const showModal = (config) => {
        setModalConfig({ ...modalConfig, isOpen: true, ...config })
    }

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false })
    }

    const loadDepartments = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchDepartments()
            console.log("Strategic Department Handshake:", data)
            setDepartments(Array.isArray(data) ? data : [])
            setLastUpdated(new Date().toLocaleTimeString())
        } catch (err) {
            console.error("Department Handshake Failed:", err)
            setError("Protocol Breach: Failed to synchronize with the department repository.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDepartments()
    }, [])

    const handleAddDept = async (e) => {
        e.preventDefault()
        if (!newDept) return;

        try {
            setIsSubmitting(true)
            await createDepartment(newDept)
            showModal({
                title: "Success",
                message: "Department created successfully",
                type: 'success'
            })
            setNewDept('')
            setIsFormVisible(false)
            loadDepartments()
        } catch (error) {
            showModal({
                title: "Sync Failure",
                message: "Administrative Sync Failure: Unable to establish new department node.",
                type: 'error'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateDept = async (e) => {
        e.preventDefault()
        if (!editName || !editingDept) return;

        try {
            setIsSubmitting(true)
            await updateDepartment(editingDept.id, editName)
            showModal({
                title: "Success",
                message: "Update successfully",
                type: 'success'
            })
            setEditingDept(null)
            setEditName('')
            loadDepartments()
        } catch (error) {
            showModal({
                title: "Update Failure",
                message: "Protocol Breach: Unable to synchronize changes to the department node.",
                type: 'error'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        showModal({
            title: "Confirm Delete",
            message: "Are you sure you want to delete this department?",
            type: 'warning',
            isConfirm: true,
            confirmText: "Delete",
            onConfirm: async () => {
                try {
                    await deleteDepartment(id)
                    showModal({
                        title: "Node Terminated",
                        message: "Department decommissioned successfully from the grid.",
                        type: 'success'
                    })
                    loadDepartments()
                } catch (error) {
                    showModal({
                        title: "Access Denied",
                        message: "Decommissioning Refused: This node may contain active dependencies or restricted assets.",
                        type: 'error'
                    })
                }
            }
        })
    }

    if (loading && departments.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-full gap-4 text-slate-300'>
                <Loader2 className="animate-spin" size={48} />
                <p className='text-xs font-black uppercase tracking-[0.3em]'>Synchronizing Vault...</p>
            </div>
        )
    }

    return (
        <div className='p-8 bg-gray-50/30 h-full overflow-y-auto rounded-3xl custom-scrollbar'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='bg-purple-600 p-2.5 rounded-2xl shadow-xl shadow-purple-200'>
                                <Layers size={24} className="text-white" />
                            </div>
                            <h2 className='text-4xl font-black text-slate-800 tracking-tight italic'>AJA Department Gallery</h2>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-14">Configure operational nodes for the administrative master repository</p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <button
                            onClick={loadDepartments}
                            className='p-4 bg-white text-slate-400 rounded-2xl border border-slate-100 hover:text-purple-600 hover:shadow-lg transition-all active:rotate-180 duration-500'
                            title="Refresh Repository"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className='flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 transition-all'
                        >
                            <Plus size={18} /> Create Department
                        </button>
                    </div>
                </div>

                <div className='flex items-center gap-6 mb-10 px-2'>
                    <div className='flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm'>
                        <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                        <span className='text-[10px] font-black text-emerald-700 uppercase tracking-widest'>Encryption: Active Pulse</span>
                    </div>
                    {lastUpdated && (
                        <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>
                            Last Sync: <span className='text-slate-600'>{lastUpdated}</span>
                        </p>
                    )}
                </div>

                {(isFormVisible || editingDept) && (
                    <div className='mb-12 animate-in fade-in slide-in-from-top-4 duration-500'>
                        <form onSubmit={editingDept ? handleUpdateDept : handleAddDept} className='bg-white p-8 rounded-[2.5rem] border border-purple-100 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center'>
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${editingDept ? 'bg-amber-500' : 'bg-purple-600'}`}></div>
                            <div className='flex-1 w-full'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1'>
                                    {editingDept ? 'Synchronize Designation' : 'Department Designation'}
                                </label>
                                <input
                                    value={editingDept ? editName : newDept}
                                    onChange={(e) => editingDept ? setEditName(e.target.value) : setNewDept(e.target.value)}
                                    className='w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-slate-800 font-bold placeholder-slate-300 transition-all'
                                    placeholder={editingDept ? 'UPDATE DESIGNATION' : 'e.g. CORE SYSTEMS'}
                                    autoFocus
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className='flex gap-4 w-full md:w-auto mt-6 md:mt-0'>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 md:flex-none px-10 py-5 ${editingDept ? 'bg-amber-500' : 'bg-purple-600'} text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                    {editingDept ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFormVisible(false)
                                        setEditingDept(null)
                                    }}
                                    className='p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-colors'
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {error && (
                    <div className='bg-red-50 border border-red-100 p-6 rounded-3xl text-red-700 text-sm mb-12 flex items-center gap-4 animate-pulse uppercase font-black tracking-widest'>
                        <ShieldCheck size={24} className="text-red-500" />
                        {error}
                        <button onClick={loadDepartments} className='ml-auto bg-red-100 px-6 py-2 rounded-xl text-[10px] hover:bg-red-200 transition-colors'>Retry Protocol</button>
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20'>
                    {departments.length === 0 && !loading && (
                        <div className='col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4'>
                            <Database size={64} className="text-slate-100" />
                            <p className='text-slate-300 font-black uppercase tracking-widest'>No department nodes identified in vault</p>
                        </div>
                    )}
                    
                    {departments.map((dept) => (
                        <div key={dept.id} className='bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-purple-100/50 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden'>
                            <div className='absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-[4rem] group-hover:bg-purple-600 transition-colors duration-500 -translate-y-12 translate-x-12 group-hover:-translate-y-8 group-hover:translate-x-8'></div>
                            
                            <div className='relative z-10'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div className='w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-all font-black text-xl'>
                                        {dept.name.charAt(0)}
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <span className='text-[8px] font-black text-slate-300 uppercase tracking-tighter mb-1'>Node Protocol</span>
                                        <span className='text-[10px] font-black text-slate-800'>#{dept.id}</span>
                                    </div>
                                </div>
                                
                                <h3 className='font-black text-2xl text-slate-800 tracking-tight group-hover:text-purple-950 truncate mb-10'>{dept.name}</h3>
                                
                                <div className='flex items-center justify-between pt-6 border-t border-slate-50 group-hover:border-purple-50 transition-colors'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-1.5 h-1.5 rounded-full bg-emerald-500'></div>
                                        <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Status: Stable</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <button
                                            onClick={() => {
                                                setEditingDept(dept)
                                                setEditName(dept.name)
                                                setIsFormVisible(false)
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                            className='p-3 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all'
                                            title="Recalibrate Node"
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dept.id)}
                                            className='p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all'
                                            title="Decommission Node"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal 
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                isConfirm={modalConfig.isConfirm}
                confirmText={modalConfig.confirmText}
                onConfirm={modalConfig.onConfirm}
            />
        </div>
    )
}

export default Departments

