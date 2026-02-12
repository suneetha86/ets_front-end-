import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { X, User, Phone, Mail, Briefcase, Activity, CheckCircle, XCircle, Edit } from 'lucide-react'

const Employees = () => {
    const { userData, setUserData } = useContext(AuthContext)
    const [selectedUser, setSelectedUser] = useState(null)

    const toggleStatus = (id) => {
        const updatedData = userData.map(user => {
            if (user.id === id) {
                user.active = user.active !== undefined ? !user.active : false
            }
            return user
        })
        setUserData(updatedData)
        localStorage.setItem('employees', JSON.stringify(updatedData))
    }

    const handleViewUser = (user) => {
        setSelectedUser(user)
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative h-32 bg-purple-900">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6 flex justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center text-4xl font-bold text-purple-700 shadow-lg">
                                {editedUser.firstName.charAt(0)}
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            {isEditing ? (
                                <input
                                    name="firstName"
                                    value={editedUser.firstName}
                                    onChange={handleChange}
                                    className="text-2xl font-bold text-gray-900 text-center border-b border-gray-300 focus:border-purple-500 outline-none pb-1 mb-1 w-full"
                                />
                            ) : (
                                <h3 className="text-2xl font-bold text-gray-900">{user.firstName}</h3>
                            )}

                            {isEditing ? (
                                <input
                                    name="role"
                                    value={editedUser.role || ''}
                                    onChange={handleChange}
                                    placeholder="Role"
                                    className="text-purple-600 font-medium text-center border-b border-gray-300 focus:border-purple-500 outline-none pb-1 w-full"
                                />
                            ) : (
                                <p className="text-purple-600 font-medium">{user.role || 'Employee'}</p>
                            )}

                            <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${user.active !== false ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {user.active !== false ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                {user.active !== false ? 'Active Account' : 'Inactive Account'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">Email Address</p>
                                    {isEditing ? (
                                        <input
                                            name="email"
                                            value={editedUser.email}
                                            onChange={handleChange}
                                            className="text-sm text-gray-700 font-medium bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none w-full"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-700 font-medium">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">Phone Number</p>
                                    {isEditing ? (
                                        <input
                                            name="phone"
                                            value={editedUser.phone || ''}
                                            onChange={handleChange}
                                            className="text-sm text-gray-700 font-medium bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none w-full"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-700 font-medium">{user.phone || 'N/A'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm">
                                    <Briefcase size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">Department</p>
                                    {isEditing ? (
                                        <input
                                            name="department"
                                            value={editedUser.department || ''}
                                            onChange={handleChange}
                                            className="text-sm text-gray-700 font-medium bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none w-full"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-700 font-medium">{user.department || 'General'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">Performance</p>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded border border-green-200">
                                            {user.taskCounts?.completed || 0} Completed
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded border border-red-200">
                                            {user.taskCounts?.failed || 0} Failed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className='flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className='flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-purple-200'
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='mt-8 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-purple-200'
                            >
                                <Edit size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-xl h-full overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h2 className='text-3xl font-bold text-purple-900'>Manage Employees</h2>
                    <p className='text-gray-500 text-xs mt-1'>View and manage all active team members</p>
                </div>
                <div className='flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-lg border border-purple-100'>
                    <div className='w-2 h-2 rounded-full bg-purple-500 animate-pulse'></div>
                    <span className='text-sm font-medium text-purple-900'>Active Users: <span className='text-purple-700 font-bold'>{userData.filter(u => u.active !== false).length}</span></span>
                </div>
            </div>

            <div className='flex-1 overflow-auto rounded-xl border border-gray-200 shadow-md'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-purple-50 sticky top-0 z-10'>
                        <tr className='text-purple-900 text-xs uppercase tracking-wider font-semibold'>
                            <th className='p-4 border-b border-purple-100'>Name</th>
                            <th className='p-4 border-b border-purple-100'>Contact</th>
                            <th className='p-4 border-b border-purple-100'>Task Performance</th>
                            <th className='p-4 border-b border-purple-100'>Status</th>
                            <th className='p-4 border-b border-purple-100 text-right'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {userData.map((user, idx) => (
                            <tr key={idx} className='hover:bg-purple-50 group transition-colors duration-200'>
                                <td className='p-4'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold shadow-sm text-purple-700 border border-purple-200'>
                                            {user.firstName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className='font-medium text-gray-900'>{user.firstName}</p>
                                            <p className='text-xs text-purple-600'>{user.role || 'Employee'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className='p-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-gray-700 text-sm'>{user.email}</span>
                                        <span className='text-gray-500 text-xs'>{user.phone || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className='p-4'>
                                    <div className='flex gap-4 text-xs font-medium'>
                                        <div className='flex items-center gap-1.5'>
                                            <div className='w-2 h-2 rounded-full bg-yellow-500'></div>
                                            <span className='text-gray-700'>{user.taskCounts?.active || 0}</span>
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                            <span className='text-gray-700'>{user.taskCounts?.completed || 0}</span>
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <div className='w-2 h-2 rounded-full bg-red-500'></div>
                                            <span className='text-gray-700'>{user.taskCounts?.failed || 0}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className='p-4'>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${user.active !== false
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-red-100 text-red-700 border-red-200'}`}>
                                        {user.active !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className='p-4 text-right'>
                                    <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <button
                                            onClick={() => handleViewUser(user)}
                                            className='bg-white hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-colors'
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(user.id)}
                                            className={`${user.active !== false ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'} text-xs px-3 py-1.5 rounded-lg border transition-all w-24`}
                                        >
                                            {user.active !== false ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
    )
}

export default Employees
