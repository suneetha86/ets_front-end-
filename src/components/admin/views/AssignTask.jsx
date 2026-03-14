import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthProvider'
import { createAssignTask } from '../../../api/assignTaskApi'
import { Loader2, Send, Database, ShieldCheck, Zap, Calendar as CalendarIcon, Target, X, User } from 'lucide-react'

const AssignTask = () => {
    const { userData, setUserData } = useContext(AuthContext)
    const navigate = useNavigate()

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [asignTo, setAsignTo] = useState([]) // Changed to array for multi-select
    const [category, setCategory] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' })

    // Date constraint: Today in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

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

            if (asignTo.length === 0) {
                setModal({ show: true, title: "Deployment Error", message: "Please select at least one agent for this mission.", type: 'error' });
                setIsSubmitting(false);
                return;
            }

            // API Integration - Create a separate task for each selected agent
            const submissionPromises = asignTo.map(agentName => {
                const apiPayload = {
                    taskTitle,
                    date: taskDate,
                    assignTo: agentName,
                    category,
                    description: taskDescription,
                    question,
                    optionA: option1,
                    optionB: option2,
                    optionC: option3,
                    optionD: option4,
                    correctAnswer: correctAnswerText
                }
                console.log(`Transmitting Mission Parameters for ${agentName}:`, apiPayload)
                return createAssignTask(apiPayload)
            });

            await Promise.all(submissionPromises)

            const data = [...userData]
            asignTo.forEach(agentName => {
                const newTask = {
                    taskTitle,
                    description: taskDescription,
                    date: taskDate,
                    category,
                    employeeName: agentName,
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

                data.forEach(function (elem) {
                    if (agentName == elem.firstName) {
                        if (!elem.tasks) elem.tasks = []
                        elem.tasks.push(newTask)
                        if (!elem.taskCounts) elem.taskCounts = { active: 0, newTask: 0, completed: 0, failed: 0 }
                        elem.taskCounts.newTask = (elem.taskCounts.newTask || 0) + 1
                    }
                })
            })
            setUserData(data)
            localStorage.setItem('employees', JSON.stringify(data))

            // Reset Form
            setTaskTitle('')
            setCategory('')
            setAsignTo([])
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
                title: "Created Successfully",
                message: "Task has been created and assigned successfully.",
                type: 'success',
                onSuccess: true
            });
        } catch (err) {
            console.error("Task Deployment Failed:", err)
            // Show detailed API message if available (helps debug 403/auth issues)
            const detailedMessage = err.apiMessage || (err.response?.status === 403 ? "Authorization Breach: Your session may have expired or you lack higher-level clearance. Please re-authenticate." : "Failed to synchronize mission parameters with the master gateway.");

            setModal({
                show: true,
                title: "Protocol Breach",
                message: detailedMessage,
                type: 'error'
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='p-8 bg-white text-black shadow-xl border border-gray-100 rounded-[2.5rem] h-full overflow-y-auto custom-scrollbar'>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className='text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3'>
                        <div className='p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-200'>
                            <Send size={24} />
                        </div>
                        Assign Task
                    </h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2 ml-1">Protocol: New Tactical Objective</p>
                </div>
            </div>

            <form onSubmit={submitHandler} className='max-w-6xl'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10'>
                    <div className='space-y-6'>
                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Task Title</label>
                            <input
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className='text-sm py-4 px-5 w-full rounded-2xl outline-none bg-slate-50 border border-slate-100 focus:border-purple-500 focus:bg-white transition-all shadow-sm font-bold'
                                type="text"
                                placeholder="Enter task title..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2'>
                                Target Date (Calendar)
                            </label>
                            <div className="relative group overflow-hidden rounded-2xl">
                                <input
                                    value={taskDate}
                                    onChange={(e) => setTaskDate(e.target.value)}
                                    min={today} // Prevents past dates
                                    className='text-sm py-4 pl-5 pr-12 w-full outline-none bg-slate-50 border border-slate-100 focus:border-purple-500 focus:bg-white transition-all shadow-sm font-bold cursor-pointer relative z-10'
                                    style={{ colorScheme: 'light' }}
                                    type="date"
                                    required
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-600 z-20 pointer-events-none group-hover:scale-110 transition-transform">
                                    <CalendarIcon size={20} />
                                </div>
                            </div>
                        </div>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Assign to Agents</label>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setAsignTo(userData.map(u => u.firstName))}
                                        className="text-[9px] font-black text-purple-600 uppercase hover:underline"
                                    >
                                        Select All
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setAsignTo([])}
                                        className="text-[9px] font-black text-slate-400 uppercase hover:underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                            
                            {/* Selected Badges Area */}
                            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                                {asignTo.length > 0 ? (
                                    asignTo.map(name => (
                                        <span key={name} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-full text-[10px] font-bold shadow-sm animate-in zoom-in-95">
                                            {name}
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAsignTo(prev => prev.filter(n => n !== name));
                                                }}
                                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                            >
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-slate-300 italic font-medium ml-1">No agents selected for deployment...</span>
                                )}
                            </div>

                            {/* Custom Toggle List */}
                            <div className='max-h-[220px] overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl bg-slate-50 p-2 space-y-1'>
                                {userData.map((user, idx) => {
                                    const isSelected = asignTo.includes(user.firstName);
                                    return (
                                        <div 
                                            key={`${user.id}-${idx}`}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setAsignTo(prev => prev.filter(n => n !== user.firstName));
                                                } else {
                                                    setAsignTo(prev => [...prev, user.firstName]);
                                                }
                                            }}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                                                isSelected 
                                                ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100' 
                                                : 'bg-white border-transparent text-slate-600 hover:border-purple-200 hover:bg-purple-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                    <User size={14} />
                                                </div>
                                                <span className="text-sm font-bold">{user.firstName}</span>
                                            </div>
                                            {isSelected && <ShieldCheck size={16} className="text-white" />}
                                        </div>
                                    )
                                })}
                            </div>
                            <p className='text-[8px] text-slate-400 font-bold ml-1 mt-2 uppercase tracking-tight'>Status: {asignTo.length} Agent(s) ready for briefing.</p>
                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Category</label>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='text-sm py-4 px-5 w-full rounded-2xl outline-none bg-slate-50 border border-slate-100 focus:border-purple-500 focus:bg-white transition-all shadow-sm font-bold'
                                type="text"
                                placeholder="e.g. Training, Engineering"
                                required
                            />
                        </div>
                    </div>

                    <div className='flex flex-col h-full space-y-2'>
                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Description / Mission Parameters</label>
                        <textarea
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className='w-full h-full min-h-[250px] text-sm py-4 px-5 rounded-2xl outline-none bg-slate-50 border border-slate-100 focus:border-purple-500 focus:bg-white transition-all shadow-sm font-bold resize-none'
                            placeholder="Enter detailed task parameters..."
                        ></textarea>
                    </div>
                </div>

                <div className='mb-10 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl'>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-white rounded-xl text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <Target size={18} />
                        </div>
                        <h3 className='text-lg font-black text-slate-900 tracking-tight'>Assessment</h3>
                    </div>

                    <div className='space-y-6'>
                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Validation Question</label>
                            <input
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className='bg-white text-slate-800 text-sm py-4 px-6 w-full rounded-2xl outline-none border border-slate-100 focus:border-purple-500 font-bold shadow-sm transition-all focus:ring-4 focus:ring-purple-50'
                                type="text"
                                placeholder="Enter a question for the agent to answer upon completion..."
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {[
                                { val: option1, set: setOption1, label: 'Option Alpha (A)' },
                                { val: option2, set: setOption2, label: 'Option Beta (B)' },
                                { val: option3, set: setOption3, label: 'Option Gamma (C)' },
                                { val: option4, set: setOption4, label: 'Option Delta (D)' }
                            ].map((opt, idx) => (
                                <div key={idx} className="space-y-1">
                                    <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1'>{opt.label}</label>
                                    <input
                                        value={opt.val}
                                        onChange={(e) => opt.set(e.target.value)}
                                        className='bg-white text-slate-800 text-sm py-3 px-5 w-full rounded-xl outline-none border border-slate-100 focus:border-purple-500 font-bold shadow-sm transition-all'
                                        type="text"
                                        placeholder={`Response Parameter ${opt.label.charAt(opt.label.length - 2)}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Correct Validation Key</label>
                            <select
                                value={correctOption}
                                onChange={(e) => setCorrectOption(e.target.value)}
                                className='bg-white text-slate-800 text-sm py-4 px-6 w-full rounded-2xl outline-none border border-slate-100 focus:border-purple-500 font-bold shadow-sm cursor-pointer'
                            >
                                <option value="" disabled>Select Validation Flag</option>
                                <option value="A">Correct A</option>
                                <option value="B">Correct B</option>
                                <option value="C">Correct C</option>
                                <option value="D">Correct D</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    disabled={isSubmitting}
                    className='w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 px-6 rounded-3xl shadow-2xl shadow-purple-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-95'
                >
                    {isSubmitting ? <Loader2 size={24} className='animate-spin' /> : <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    {isSubmitting ? 'ESTABLISHING HANDSHAKE...' : 'DEPLOY TACTICAL MISSION'}
                </button>
            </form>

            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${modal.type === 'success' ? 'bg-emerald-500' :
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
                                onClick={() => {
                                    const goToStatus = modal.onSuccess;
                                    setModal({ ...modal, show: false });
                                    if (goToStatus) navigate('/admin/task-status');
                                }}
                                className={`w-full py-4 ${modal.type === 'success' ? 'bg-emerald-500' :
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
