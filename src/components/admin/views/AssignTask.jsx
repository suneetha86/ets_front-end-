import React, { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthProvider'
import { createAssignTask } from '../../../api/assignTaskApi'
import { Loader2, Send, Database, ShieldCheck, Zap } from 'lucide-react'

const AssignTask = () => {
    const { userData, setUserData } = useContext(AuthContext)

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [asignTo, setAsignTo] = useState('Suneetha')
    const [category, setCategory] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' })

    // MCQ Specific Fields
    const [question, setQuestion] = useState('')
    const [option1, setOption1] = useState('')
    const [option2, setOption2] = useState('')
    const [option3, setOption3] = useState('')
    const [option4, setOption4] = useState('')
    const [correctOption, setCorrectOption] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Map the correct answer text
            let correctAnswerText = "";
            if (correctOption === "A") correctAnswerText = option1;
            else if (correctOption === "B") correctAnswerText = option2;
            else if (correctOption === "C") correctAnswerText = option3;
            else if (correctOption === "D") correctAnswerText = option4;

            const apiPayload = {
                taskTitle,
                date: taskDate,
                assignTo: asignTo,
                category,
                description: taskDescription,
                question,
                optionA: option1,
                optionB: option2,
                optionC: option3,
                optionD: option4,
                correctAnswer: correctAnswerText
            }

            console.log("Transmitting Mission Parameters:", apiPayload)

            // API Integration
            await createAssignTask(apiPayload)

            // Internal state sync (Keeping for UI parity in existing architecture)
            const newTask = {
                taskTitle,
                description: taskDescription,
                date: taskDate,
                category,
                employeeName: asignTo,
                status: "NEW",
                active: false,
                newTask: true,
                failed: false,
                completed: false,
                mcq: question ? {
                    question,
                    options: [option1, option2, option3, option4],
                    correctOption,
                    correctAnswer: correctAnswerText
                } : null
            }

            const data = [...userData]
            data.forEach(function (elem) {
                if (asignTo == elem.firstName) {
                    if (!elem.tasks) elem.tasks = []
                    elem.tasks.push(newTask)
                    if (!elem.taskCounts) elem.taskCounts = { active: 0, newTask: 0, completed: 0, failed: 0 }
                    elem.taskCounts.newTask = (elem.taskCounts.newTask || 0) + 1
                }
            })
            setUserData(data)
            localStorage.setItem('employees', JSON.stringify(data))

            // Reset Form
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

            setModal({
                show: true,
                title: "Handshake Success",
                message: "Tactical task established and synchronized in the master vault.",
                type: 'success'
            });
        } catch (err) {
            console.error("Task Deployment Failed:", err)
            setModal({
                show: true,
                title: "Protocol Breach",
                message: "Failed to synchronize mission parameters with the master gateway.",
                type: 'error'
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='p-8 bg-white text-black shadow-sm border border-gray-200 rounded-xl h-full overflow-y-auto'>
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
                                className='text-sm py-3 px-4 w-full rounded-xl outline-none bg-gray-50 border border-gray-200 focus:border-purple-500 transition-colors text-gray-700 cursor-pointer'
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
                                {userData.map((user, idx) => (
                                    <option key={`${user.id}-${idx}`} value={user.firstName}>{user.firstName}</option>
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

                <button
                    disabled={isSubmitting}
                    className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? <Loader2 size={18} className='animate-spin' /> : <Send size={18} />}
                    {isSubmitting ? 'Deploying Objective...' : 'Create Tactical Task'}
                </button>
            </form>

            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${
                            modal.type === 'success' ? 'bg-emerald-500' : 
                            modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                        }`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                <Zap size={100} className="text-white" />
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <ShieldCheck className="text-emerald-500" size={32} /> : 
                                 modal.type === 'error' ? <Database className="text-rose-500" size={32} /> : 
                                 <Zap className="text-blue-500" size={32} />}
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl text-white tracking-tight">{modal.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                                {modal.message}
                            </p>
                            <button 
                                onClick={() => setModal({ ...modal, show: false })}
                                className={`w-full py-4 ${
                                    modal.type === 'success' ? 'bg-emerald-500' : 
                                    modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-600'
                                } text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                            >
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AssignTask
