import React, { useState, useEffect } from 'react'
import { getLocalStorage } from '../../../utils/localStorage'
import { Plus, X } from 'lucide-react'

const Departments = () => {
    const [departments, setDepartments] = useState([])
    const [newDept, setNewDept] = useState('')
    const [isFormVisible, setIsFormVisible] = useState(false)

    useEffect(() => {
        const { departments } = getLocalStorage()
        if (departments) {
            setDepartments(departments)
        }
    }, [])

    const handleAddDept = (e) => {
        e.preventDefault()
        if (!newDept) return;

        const updatedDepts = [...departments, { id: Date.now(), name: newDept }]
        setDepartments(updatedDepts)
        localStorage.setItem('departments', JSON.stringify(updatedDepts))
        setNewDept('')
        setIsFormVisible(false)
    }

    const handleDelete = (id) => {
        const updated = departments.filter(d => d.id !== id)
        setDepartments(updated)
        localStorage.setItem('departments', JSON.stringify(updated))
    }

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-xl h-full overflow-auto'>
            <h2 className='text-3xl font-bold mb-8 text-purple-900'>Manage Departments</h2>

            {!isFormVisible ? (
                <button
                    onClick={() => setIsFormVisible(true)}
                    className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5 mb-10'
                >
                    <Plus size={20} /> Add Department
                </button>
            ) : (
                <div className='flex gap-4 mb-10 max-w-2xl animate-fade-in-down'>
                    <input
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        className='flex-1 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400'
                        placeholder='Enter new department name...'
                        autoFocus
                    />
                    <button
                        onClick={handleAddDept}
                        className='bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5'
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => setIsFormVisible(false)}
                        className='p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors'
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {departments.map((dept) => (
                    <div key={dept.id} className='bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group'>
                        <span className='font-bold text-lg text-gray-800'>{dept.name}</span>
                        <button
                            onClick={() => handleDelete(dept.id)}
                            className='text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium'
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Departments
