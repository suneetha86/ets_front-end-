import { fetchUsers, fetchUserById, updateUser, deleteUser } from '../../../api/userApi'
import { Loader2, Shield, Key, Mail, Phone, Users, Search, RefreshCw, AlertTriangle, X, ShieldAlert, Cpu, Edit3, Save, Trash2 } from 'lucide-react'




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
            alert("Protocol Success: Node identity parameters synchronized.")
        } catch (err) {
            console.error("Update Blocked:", err)
            alert("Sync Failed: Encryption parameters rejected by core.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteNode = async () => {
        if (!window.confirm("CRITICAL WARNING: This action will permanently terminate the selected node. Proceed with decommissioning?")) return
        
        try {
            setIsDeleting(true)
            await deleteUser(selectedUser.id)
            setSelectedUser(null)
            loadUsers() // Refresh list
            alert("Node Decommissioned: Identity wiped from core repository.")
        } catch (err) {
            console.error("Decommissioning Failed:", err)
            alert("Termination Blocked: Node integrity protected by emergency protocols.")
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
                                    <div className='absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150'>
                                        <Shield size={160} />
                                    </div>
                                    <div className='flex justify-between items-start relative z-10'>
                                        <div className='flex items-center gap-5'>
                                            <div className='w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl font-black text-indigo-600 shadow-2xl transform hover:rotate-6 transition-transform'>
                                                {selectedUser.nameUsername?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                {isEditing ? (
                                                    <input 
                                                        value={editForm.nameUsername}
                                                        onChange={(e) => setEditForm({...editForm, nameUsername: e.target.value})}
                                                        className='bg-transparent border-b-2 border-white/50 text-white text-3xl font-black outline-none focus:border-white transition-all w-full mb-2'
                                                    />
                                                ) : (
                                                    <h3 className='text-3xl font-black tracking-tight'>{selectedUser.nameUsername}</h3>
                                                )}
                                                <div className='flex items-center gap-2 mt-2 opacity-80'>
                                                    <span className='px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest'>Node #{selectedUser.id}</span>
                                                    <div className='w-1 h-1 bg-white rounded-full'></div>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editForm.dept}
                                                            onChange={(e) => setEditForm({...editForm, dept: e.target.value})}
                                                            className='bg-white/10 border-none rounded px-2 py-0.5 text-[9px] font-black text-white outline-none uppercase tracking-widest'
                                                        />
                                                    ) : (
                                                        <span className='text-[9px] font-black uppercase tracking-widest'>{selectedUser.dept}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            {!isEditing && (
                                                <button 
                                                    onClick={() => setIsEditing(true)}
                                                    className='p-3 hover:bg-white/10 rounded-2xl transition-all text-white'
                                                    title="Modify Node"
                                                >
                                                    <Edit3 size={20} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => {
                                                    setSelectedUser(null)
                                                    setIsEditing(false)
                                                }}
                                                className='p-3 hover:bg-white/10 rounded-2xl transition-all'
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className='p-10 space-y-8'>
                                    <div className='grid grid-cols-1 gap-6'>
                                        <div className='p-6 bg-slate-50 rounded-3xl border border-slate-100'>
                                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                                                <Key size={14} className='text-indigo-600' /> Authentication Token
                                            </p>
                                            <div className='flex items-center justify-between bg-slate-900 px-6 py-4 rounded-2xl shadow-inner'>
                                                {isEditing ? (
                                                    <input 
                                                        value={editForm.accessPassword}
                                                        onChange={(e) => setEditForm({...editForm, accessPassword: e.target.value})}
                                                        className='bg-transparent text-emerald-400 font-mono text-xl font-bold tracking-[0.2em] outline-none w-full'
                                                    />
                                                ) : (
                                                    <span className='text-emerald-400 font-mono text-xl font-bold tracking-[0.2em]'>{selectedUser.accessPassword}</span>
                                                )}
                                                <ShieldAlert size={18} className='text-emerald-400 opacity-50' />
                                            </div>
                                            <p className='text-[9px] text-slate-400 font-bold mt-3 text-center uppercase tracking-tighter'>Primary access key for administrative override</p>
                                        </div>

                                        <div className='space-y-4'>
                                            <div className='flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-all'>
                                                <div className='p-3 bg-indigo-50 rounded-xl text-indigo-600'>
                                                    <Mail size={18} />
                                                </div>
                                                <div className='flex-1'>
                                                    <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Encryption ID (Email)</p>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editForm.emailAddress}
                                                            onChange={(e) => setEditForm({...editForm, emailAddress: e.target.value})}
                                                            className='text-sm font-bold text-slate-800 outline-none w-full bg-slate-50 rounded px-2 py-1 mt-1 border border-slate-100'
                                                        />
                                                    ) : (
                                                        <p className='text-sm font-bold text-slate-800'>{selectedUser.emailAddress}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-all'>
                                                <div className='p-3 bg-indigo-50 rounded-xl text-indigo-600'>
                                                    <Phone size={18} />
                                                </div>
                                                <div className='flex-1'>
                                                    <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Comms Link (Phone)</p>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editForm.phone}
                                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                            className='text-sm font-bold text-slate-800 outline-none w-full bg-slate-50 rounded px-2 py-1 mt-1 border border-slate-100'
                                                        />
                                                    ) : (
                                                        <p className='text-sm font-bold text-slate-800'>{selectedUser.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='pt-4'>
                                        {isEditing ? (
                                            <div className='flex gap-4'>
                                                <button 
                                                    onClick={() => setIsEditing(false)}
                                                    className='flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all'
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleUpdateNode}
                                                    disabled={isSaving}
                                                    className='flex-1 bg-indigo-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2'
                                                >
                                                    {isSaving ? <Loader2 size={16} className='animate-spin' /> : <Save size={16} />}
                                                    {isSaving ? 'Syncing...' : 'Save Parameters'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='flex flex-col gap-4'>
                                                <button 
                                                    onClick={() => setSelectedUser(null)}
                                                    className='w-full bg-slate-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-slate-100 active:scale-95'
                                                >
                                                    Disconnect Session
                                                </button>
                                                <button 
                                                    onClick={handleDeleteNode}
                                                    disabled={isDeleting}
                                                    className='w-full bg-rose-50 text-rose-500 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95'
                                                >
                                                    {isDeleting ? <Loader2 size={14} className='animate-spin' /> : <Trash2 size={14} />}
                                                    {isDeleting ? 'Terminating Node...' : 'Terminate Node identity'}
                                                </button>
                                            </div>
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
        </div>
    )
}

export default UserCredentials
