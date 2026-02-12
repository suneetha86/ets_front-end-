import React, { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthProvider'

const AssignTask = () => {
    const { userData, setUserData } = useContext(AuthContext)

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [asignTo, setAsignTo] = useState('')
    const [category, setCategory] = useState('')

    // MCQ Specific Fields
    const [question, setQuestion] = useState('')
    const [option1, setOption1] = useState('')
    const [option2, setOption2] = useState('')
    const [option3, setOption3] = useState('')
    const [option4, setOption4] = useState('')
    const [correctOption, setCorrectOption] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()

        const newTask = {
            taskTitle,
            taskDescription,
            taskDate,
            category,
            active: false,
            newTask: true,
            failed: false,
            completed: false,
            // Add MCQ data if provided
            mcq: question ? {
                question,
                options: [option1, option2, option3, option4],
                correctOption
            } : null
        }

        const data = userData

        data.forEach(function (elem) {
            if (asignTo == elem.firstName) {
                elem.tasks.push(newTask)
                elem.taskCounts.newTask = elem.taskCounts.newTask + 1
            }
        })
        setUserData(data)

        // Update localStorage
        localStorage.setItem('employees', JSON.stringify(data))

        setTaskTitle('')
        setCategory('')
        setAsignTo('')
        setTaskDate('')
        setTaskDescription('')
        setQuestion('')
        setOption1('')
        setOption2('')
        setOption3('')
        setOption4('')
        setCorrectOption('')

        alert("Task Assigned Successfully!")
    }

    return (
        <div className='p-8 bg-white shadow-sm border border-gray-200 rounded-xl h-full overflow-y-auto'>
            <h2 className='text-3xl font-bold mb-8 text-purple-900'>Assign Task</h2>

            <form onSubmit={(e) => { submitHandler(e) }} className='max-w-4xl'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                    <div className='space-y-6'>
                        <div>
                            <h3 className='text-sm text-gray-500 mb-0.5'>Task Title</h3>
                            <input
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className='text-sm py-3 px-4 w-full rounded-xl outline-none bg-gray-50 border border-gray-200 focus:border-purple-500 transition-colors'
                                type="text"
                                placeholder="e.g. Complete onboarding quiz"
                                required
                            />
                        </div>
                        <div>
                            <h3 className='text-sm text-gray-500 mb-0.5'>Date</h3>
                            <input
                                value={taskDate}
                                onChange={(e) => setTaskDate(e.target.value)}
                                className='text-sm py-3 px-4 w-full rounded-xl outline-none bg-gray-50 border border-gray-200 focus:border-purple-500 transition-colors text-gray-700'
                                type="date"
                                required
                            />
                        </div>
                        <div>
                            <h3 className='text-sm text-gray-500 mb-0.5'>Assign to</h3>
                            <select
                                value={asignTo}
                                onChange={(e) => setAsignTo(e.target.value)}
                                className='text-sm py-3 px-4 w-full rounded-xl outline-none bg-gray-50 border border-gray-200 focus:border-purple-500 transition-colors text-gray-700'
                                required
                            >
                                <option value="" disabled>Select Employee</option>
                                {userData.map((user) => (
                                    <option key={user.id} value={user.firstName}>{user.firstName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h3 className='text-sm text-gray-500 mb-0.5'>Category</h3>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='text-sm py-3 px-4 w-full rounded-xl outline-none bg-gray-50 border border-gray-200 focus:border-purple-500 transition-colors'
                                type="text"
                                placeholder="e.g. Training, Development"
                                required
                            />
                        </div>
                    </div>

                    <div className='flex flex-col h-full'>
                        <h3 className='text-sm text-gray-500 mb-0.5'>Description</h3>
                        <textarea
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className='w-full h-full text-sm py-3 px-4 rounded-xl outline-none bg-gray-50 border border-gray-200 focus:border-purple-500 transition-colors resize-none'
                            rows="6"
                            placeholder="Detailed description of the task..."
                        ></textarea>
                    </div>
                </div>

                <div className='mb-8 p-6 bg-purple-50 rounded-xl border border-purple-100'>
                    <h3 className='text-lg font-bold text-purple-900 mb-4'>Add MCQ Question (Optional)</h3>

                    <div className='space-y-4'>
                        <div>
                            <label className='text-xs font-bold text-purple-700 uppercase tracking-wide mb-1 block'>Question</label>
                            <input
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className='bg-white text-gray-800 text-sm py-3 px-4 w-full rounded-lg outline-none border border-purple-200 focus:border-purple-500'
                                type="text"
                                placeholder="Enter your question here..."
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {[
                                { val: option1, set: setOption1, label: 'Option A' },
                                { val: option2, set: setOption2, label: 'Option B' },
                                { val: option3, set: setOption3, label: 'Option C' },
                                { val: option4, set: setOption4, label: 'Option D' }
                            ].map((opt, idx) => (
                                <div key={idx}>
                                    <label className='text-xs text-purple-600 mb-1 block'>{opt.label}</label>
                                    <input
                                        value={opt.val}
                                        onChange={(e) => opt.set(e.target.value)}
                                        className='bg-white text-gray-800 text-sm py-2 px-3 w-full rounded-lg outline-none border border-purple-200 focus:border-purple-500'
                                        type="text"
                                        placeholder={`Answer for ${opt.label}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className='text-xs font-bold text-purple-700 uppercase tracking-wide mb-1 block'>Correct Answer</label>
                            <select
                                value={correctOption}
                                onChange={(e) => setCorrectOption(e.target.value)}
                                className='bg-white text-gray-800 text-sm py-3 px-4 w-full rounded-lg outline-none border border-purple-200 focus:border-purple-500'
                            >
                                <option value="" disabled>Select Correct Option</option>
                                <option value="A">Option A</option>
                                <option value="B">Option B</option>
                                <option value="C">Option C</option>
                                <option value="D">Option D</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-200 transition-all'>
                    Create Task
                </button>
            </form>
        </div>
    )
}

export default AssignTask
