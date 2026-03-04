import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { fetchAdminEmployees, fetchAdminEmployeeById, deactivateEmployee, fetchActiveEmployeeCount } from '../../../api/employeeApi'
import { X, User, Phone, Mail, Briefcase, Activity, CheckCircle, XCircle, Edit, Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react'

const Employees = () => {
    const { userData, setUserData } = useContext(AuthContext)
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [modalLoading, setModalLoading] = useState(false)
    const [activeCount, setActiveCount] = useState(0)
    const [error, setError] = useState(null)

    const loadEmployees = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchAdminEmployees()
            const count = await fetchActiveEmployeeCount()
            console.log("Admin: Fetched metrics:", { data, count })
            
            setActiveCount(count)

            if (data && data.message) {
                console.log("API Message:", data.message)
                setUserData([])
                return
            }

            // Map API response to match existing UI structure (username -> firstName, empId -> id)
            const mappedEmployees = (Array.isArray(data) ? data : []).map(emp => ({
                ...emp,
                id: emp.empId,
                firstName: emp.username, 
                active: emp.active !== false 
            }))
            
            setUserData(mappedEmployees)
            localStorage.setItem('employees', JSON.stringify(mappedEmployees))
        } catch (err) {
            console.error("Failed to load admin employees:", err)
            setError("Could not retrieve admin directory.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadEmployees()
    }, [])

    const toggleStatus = async (id, currentStatus) => {
        if (currentStatus !== false) { // If currently active, execute deactivation link
            try {
                const response = await deactivateEmployee(id)
                console.log("Deactivation Node Response:", response)
                alert(`🛑 ${response.message || "Node Deactivated"}`)
            } catch (err) {
                console.error("Critical: Gateway Deactivation Link Failed:", err)
                alert("⚠️ Error: Administrative gateway rejected the deactivation request.")
                return 
            }
        }

        const updatedData = userData.map(user => {
            if (user.id === id) {
                user.active = user.active !== undefined ? !user.active : false
            }
            return user
        })
        setUserData(updatedData)
        localStorage.setItem('employees', JSON.stringify(updatedData))
    }

    const handleViewUser = async (user) => {
        try {
            setModalLoading(true)
            const data = await fetchAdminEmployeeById(user.id)
            console.log("Admin: Fetched specific employee details:", data)

            if (data && data.message) {
                alert(`⚠️ ${data.message}`)
                return
            }

            // Map and show
            const fullUser = {
                ...data,
                id: data.empId,
                firstName: data.username,
                active: data.active !== false
            }
            setSelectedUser(fullUser)
        } catch (err) {
            console.error("Failed to fetch employee details:", err)
            // Fallback to local data if API fails but we have the user object
            setSelectedUser(user)
        } finally {
            setModalLoading(false)
        }
    }

    const UserDetailModal = ({ user, onClose }) => {
        if (!user) return null;

        const [isEditing, setIsEditing] = useState(false)
        const [editedUser, setEditedUser] = useState({ ...user })

        const handleChange = (e) => {
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
        }

        const handleSave = () => {
            const updatedData = userData.map(u =>
                u.id === user.id ? { ...u, ...editedUser } : u
            )
            setUserData(updatedData)
            localStorage.setItem('employees', JSON.stringify(updatedData))

            // Update the selectedUser to reflect changes immediately in the modal
            setSelectedUser({ ...user, ...editedUser })
            setIsEditing(false)
        }

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative h-36 bg-purple-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.4)_0%,transparent_100%)]"></div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 blur-none rounded-xl text-white transition-all hover:scale-110 active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6 flex justify-center">
                            <div className="w-32 h-32 rounded-3xl border-8 border-white bg-purple-100 flex items-center justify-center text-5xl font-black text-purple-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                {editedUser.firstName?.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="text-center mb-10">
                            {isEditing ? (
                                <input
                                    name="firstName"
                                    value={editedUser.firstName}
                                    onChange={handleChange}
                                    className="text-2xl font-black text-gray-900 text-center border-b-2 border-purple-200 focus:border-purple-600 outline-none pb-2 mb-2 w-full transition-all bg-purple-50/50 rounded-lg px-2"
                                />
                            ) : (
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{user.firstName}</h3>
                            )}

                            {isEditing ? (
                                <input
                                    name="role"
                                    value={editedUser.role || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Developer"
                                    className="text-purple-600 font-black text-center border-b-2 border-purple-200 focus:border-purple-600 outline-none pb-1 w-full text-sm bg-purple-50/50 rounded-lg px-2"
                                />
                            ) : (
                                <p className="text-purple-600 font-black text-xs uppercase tracking-widest mt-1">{user.role || 'Employee'}</p>
                            )}

                            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${user.active !== false ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                <div className={`w-2 h-2 rounded-full ${user.active !== false ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                {user.active !== false ? 'Active Member' : 'Deactivated'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:border-purple-100">
                                <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm border border-gray-100 group-hover:border-purple-100">
                                    <Mail size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Email System</p>
                                    {isEditing ? (
                                        <input
                                            name="email"
                                            value={editedUser.email}
                                            onChange={handleChange}
                                            className="text-sm text-gray-800 font-bold bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-800 font-bold break-all">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:border-purple-100">
                                <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm border border-gray-100 group-hover:border-purple-100">
                                    <Phone size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Direct Contact</p>
                                    {isEditing ? (
                                        <input
                                            name="phone"
                                            value={editedUser.phone || ''}
                                            onChange={handleChange}
                                            className="text-sm text-gray-800 font-bold bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-800 font-bold">{user.phone || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:border-purple-100">
                                <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm border border-gray-100 group-hover:border-purple-100">
                                    <Briefcase size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Assigned Dept</p>
                                    {isEditing ? (
                                        <input
                                            name="department"
                                            value={editedUser.department || ''}
                                            onChange={handleChange}
                                            className="text-sm text-gray-800 font-bold bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-800 font-bold">{user.department || 'General'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="mt-10 flex gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className='flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl transition-all active:scale-95'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className='flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-purple-200 active:scale-95'
                                >
                                    Confirm
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='mt-10 w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white font-black py-4 px-4 rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 group'
                            >
                                <Edit size={18} className="transition-transform group-hover:rotate-12" /> Update Repository
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-3xl h-full overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-3xl font-black text-gray-900 tracking-tight'>Employee Ecosystem</h2>
                    <p className='text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1'>Manage your organization's human capital logs</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={loadEmployees}
                        className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-purple-600 hover:bg-purple-50 transition-all active:rotate-180 duration-500"
                        title="Reload Directory"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <div className='flex items-center gap-3 bg-purple-50 px-5 py-3 rounded-2xl border border-purple-100/50 shadow-inner'>
                        <div className='w-2 h-2 rounded-full bg-purple-600 animate-ping'></div>
                        <span className='text-xs font-black text-purple-900 uppercase tracking-widest'>Active Nodes: <span className='text-purple-700'>{activeCount || userData.filter(u => u.active !== false).length}</span></span>
                    </div>
                </div>
            </div>

            <div className='flex-1 overflow-auto rounded-[2rem] border border-gray-100 shadow-2xl custom-scrollbar'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-gray-50/80 backdrop-blur-md sticky top-0 z-10'>
                        <tr className='text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100'>
                            <th className='p-6'>Identification</th>
                            <th className='p-6'>Connect</th>
                            <th className='p-6 text-center'>Impact Score</th>
                            <th className='p-6 text-center'>Status</th>
                            <th className='p-6 text-right'>Action Layer</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-32 text-center">
                                    <div className="flex flex-col items-center gap-4 text-purple-400">
                                        <Loader2 className="animate-spin" size={48} />
                                        <p className="font-black text-xs uppercase tracking-[0.3em]">Syncing Directory...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="p-32 text-center">
                                    <div className="flex flex-col items-center gap-4 text-red-500">
                                        <AlertCircle size={48} />
                                        <p className="font-black text-sm uppercase tracking-widest">{error}</p>
                                        <button onClick={loadEmployees} className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-full font-black text-xs uppercase hover:bg-red-200 transition-all">Retry Link</button>
                                    </div>
                                </td>
                            </tr>
                        ) : userData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-32 text-center text-gray-300 font-black uppercase tracking-[0.2em] italic">Workspace is currently empty</td>
                            </tr>
                        ) : (
                            userData.map((user, idx) => (
                                <tr key={idx} className='hover:bg-purple-50/30 group transition-all duration-300'>
                                    <td className='p-6'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-lg font-black text-purple-600 shadow-sm transition-all group-hover:bg-purple-600 group-hover:text-white group-hover:rounded-xl group-hover:rotate-3'>
                                                {user.firstName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className='font-black text-gray-900 text-sm tracking-tight'>{user.firstName}</p>
                                                <p className='text-[10px] text-purple-600 font-black uppercase tracking-widest'>{user.role || 'Employee'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='p-6'>
                                        <div className='flex flex-col'>
                                            <span className='text-gray-800 text-xs font-bold'>{user.email}</span>
                                            <span className='text-gray-400 text-[10px] font-black uppercase tracking-tighter'>{user.phone || 'No Phone'}</span>
                                        </div>
                                    </td>
                                    <td className='p-6 text-center'>
                                        <div className='flex gap-4 justify-center text-[10px] font-black'>
                                            <div className='flex flex-col items-center gap-1 group/stat'>
                                                <div className='w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] group-hover/stat:scale-150 transition-all'></div>
                                                <span className='text-gray-600'>{user.taskCounts?.completed || 0}</span>
                                            </div>
                                            <div className='flex flex-col items-center gap-1 group/stat'>
                                                <div className='w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] group-hover/stat:scale-150 transition-all'></div>
                                                <span className='text-gray-600'>{user.taskCounts?.failed || 0}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='p-6 text-center'>
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all ${user.active !== false
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {user.active !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='p-6 text-right'>
                                        <div className='flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0'>
                                            <button
                                                onClick={() => handleViewUser(user)}
                                                className='p-3 bg-white hover:bg-gray-900 border border-gray-100 rounded-xl text-gray-400 hover:text-white transition-all shadow-sm active:scale-90'
                                                title="View Repository"
                                            >
                                                <Activity size={16} />
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(user.id, user.active)}
                                                className={`p-3 border rounded-xl transition-all shadow-sm active:scale-90 ${user.active !== false ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white'}`}
                                                title={user.active !== false ? "Kill Link" : "Activate Link"}
                                            >
                                                {user.active !== false ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
    )
}

export default Employees
