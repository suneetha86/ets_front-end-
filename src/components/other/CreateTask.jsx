import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const CreateTask = () => {

    const { userData, setUserData } = useContext(AuthContext)

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [asignTo, setAsignTo] = useState('')
    const [category, setCategory] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()

        const newTask = { taskTitle, taskDescription, taskDate, category, active: false, newTask: true, completed: false, failed: false }

        const data = userData

        data.forEach(function (elem) {
            if (asignTo == elem.firstName) {
                elem.tasks.push(newTask)
                elem.taskCounts.newTask = elem.taskCounts.newTask + 1
            }
        })
        setUserData(data)
        console.log(data)

        setTaskTitle('')
        setCategory('')
        setAsignTo('')
        setTaskDate('')
        setTaskDescription('')
    }

    return (
        <div className='p-8 bg-[#1c1c1c] rounded-xl shadow-2xl border border-gray-800'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6'>Create New Task</h2>
            <form onSubmit={(e) => {
                submitHandler(e)
            }}
                className='flex flex-wrap w-full items-start justify-between gap-8'
            >
                <div className='w-full md:w-[48%] space-y-4'>
                    <div>
                        <h3 className='text-sm font-medium text-gray-300 mb-1.5 ml-1'>Task Title</h3>
                        <input
                            value={taskTitle}
                            onChange={(e) => {
                                setTaskTitle(e.target.value)
                            }}
                            className='text-sm py-3 px-4 w-full rounded-lg outline-none bg-[#111] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600' type="text" placeholder='e.g., UI Design for Dashboard'
                        />
                    </div>
                    <div>
                        <h3 className='text-sm font-medium text-gray-300 mb-1.5 ml-1'>Due Date</h3>
                        <input
                            value={taskDate}
                            onChange={(e) => {
                                setTaskDate(e.target.value)
                            }}
                            className='text-sm py-3 px-4 w-full rounded-lg outline-none bg-[#111] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600' type="date" />
                    </div>
                    <div>
                        <h3 className='text-sm font-medium text-gray-300 mb-1.5 ml-1'>Assign To</h3>
                        <input
                            value={asignTo}
                            onChange={(e) => {
                                setAsignTo(e.target.value)
                            }}
                            className='text-sm py-3 px-4 w-full rounded-lg outline-none bg-[#111] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600' type="text" placeholder='Employee Name' />
                    </div>
                    <div>
                        <h3 className='text-sm font-medium text-gray-300 mb-1.5 ml-1'>Category</h3>
                        <input
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value)
                            }}
                            className='text-sm py-3 px-4 w-full rounded-lg outline-none bg-[#111] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600' type="text" placeholder='design, dev, etc' />
                    </div>
                </div>

                <div className='w-full md:w-[48%] flex flex-col items-start'>
                    <h3 className='text-sm font-medium text-gray-300 mb-1.5 ml-1'>Description</h3>
                    <textarea value={taskDescription}
                        onChange={(e) => {
                            setTaskDescription(e.target.value)
                        }} className='w-full h-64 text-sm py-3 px-4 rounded-lg outline-none bg-[#111] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600 resize-none' name="" id="" cols="30" rows="10" placeholder='Detailed description of the task...'></textarea>
                    <button className='bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] shadow-lg shadow-emerald-500/20 mt-6 w-full'>Create Task</button>
                </div>

            </form>
        </div>
    )
}

export default CreateTask
