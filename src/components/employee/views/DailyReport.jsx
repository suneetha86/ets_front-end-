import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, FileText, AlertTriangle, Upload, CheckCircle, File, Image as ImageIcon, ExternalLink, History, Loader2 } from 'lucide-react'
import { createTask } from '../../../api/taskApi'
import { AuthContext } from '../../../context/AuthProvider'

const DailyReport = ({ onViewHistory }) => {
    const { currentUser, setCurrentUser, setUserData } = useContext(AuthContext)
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        description: '',
        challenges: '',
        solution: '',
    })

    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'error' })

    const [files, setFiles] = useState({
        challenges: [],
        solution: []
    })

    const handleFileChange = (e, type) => {
        if (e.target.files) {
            setFiles(prev => ({
                ...prev,
                [type]: Array.from(e.target.files)
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.description.trim()) {
            setModal({
                show: true,
                title: "Validation Error",
                message: "Please provide a task description before submitting the report.",
                type: 'error'
            });
            return;
        }

        setSubmitting(true);

        // Convert files to Base64 for the mock server to persist "real" images
        const fileToBase64 = (file) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({
                name: file.name,
                type: file.type,
                data: reader.result // This is the Base64 string
            });
            reader.onerror = () => resolve(null);
        });

        const challengesFilesData = await Promise.all(files.challenges.map(fileToBase64));
        const solutionFilesData = await Promise.all(files.solution.map(fileToBase64));

        const apiPayload = {
            date: formData.date,
            time: formData.time,
            taskDescription: formData.description,
            challengesFaced: formData.challenges || "No major challenges",
            uploadScreenshots: challengesFilesData.filter(Boolean), // Send as array of objects
            solutionImplemented: formData.solution || "Working on it",
            uploadSolutionDocuments: solutionFilesData.filter(Boolean), // Send as array of objects
            status: "PENDING"
        };

        try {
            console.log("Executing Mission Log (POST /tasks/create):", apiPayload);
            const response = await createTask(apiPayload);
            console.log("Mission Log Synchronized:", response);

            // ── UPDATE TASK COUNTS ──
            const updatedUser = { ...currentUser };
            
            if (updatedUser.data) {
                if (!updatedUser.data.taskCounts) {
                    updatedUser.data.taskCounts = { active: 0, newTask: 0, completed: 0, failed: 0 };
                }
                
                updatedUser.data.taskCounts.completed = (updatedUser.data.taskCounts.completed || 0) + 1;
                
                if (updatedUser.data.taskCounts.active > 0) {
                    updatedUser.data.taskCounts.active -= 1;
                }
            }

            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
            
            const employees = JSON.parse(localStorage.getItem('employees')) || [];
            const updatedEmployees = employees.map(emp => 
                emp.email === updatedUser.data.email ? updatedUser.data : emp
            );
            localStorage.setItem('employees', JSON.stringify(updatedEmployees));

            setCurrentUser(updatedUser);
            if (setUserData) {
                setUserData(updatedEmployees);
            }

            setSubmitting(false);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                navigate('../dashboard'); 
            }, 2500);

        } catch (error) {
            console.error("Failed to submit task:", error);
            setModal({
                show: true,
                title: "Transmission Error",
                message: "Failed to submit report. Please check your network connection.",
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar pb-24'>
            <div className='max-w-4xl mx-auto'>
                <div className='bg-gradient-to-r from-blue-600 via-blue-400 to-white p-8 rounded-2xl shadow-lg border-b mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
                    <div className='flex items-center gap-4'>
                        <div className='bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl'>
                            <FileText className="text-white" size={32} />
                        </div>
                        <div>
                            <h2 className='text-3xl font-black text-white tracking-tight drop-shadow-sm'>
                                Daily Work Report
                            </h2>
                            <p className='text-blue-50 text-xs font-bold uppercase tracking-widest opacity-80'>AJA Productivity Log</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('../daily-history')}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200'
                    >
                        <History size={16} /> View History Archive
                    </button>
                </div>

                <div className='bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 mb-8'>

                    <form onSubmit={handleSubmit} className='space-y-6'>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
                                    <Calendar size={16} className='text-blue-500' /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors text-gray-700'
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
                                    <Clock size={16} className='text-blue-500' /> Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors text-gray-700'
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-sm font-bold text-gray-700'>Task Description</label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className='w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors text-gray-700 resize-none'
                                placeholder='Describe the tasks you worked on today...'
                            ></textarea>
                        </div>

                        <div className='bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <AlertTriangle size={16} className='text-blue-600' /> Challenges Faced
                                </label>
                                <textarea
                                    name="challenges"
                                    value={formData.challenges}
                                    onChange={handleChange}
                                    className='w-full h-24 p-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors text-gray-700 resize-none shadow-sm'
                                    placeholder='What blocks or issues did you encounter?'
                                ></textarea>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <Upload size={16} className='text-blue-600' /> Upload Screenshots/Docs (Challenges)
                                </label>
                                <div className='flex items-center justify-center w-full'>
                                    <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-colors shadow-sm'>
                                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                            <p className='mb-2 text-sm text-gray-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                            <p className='text-xs text-gray-500'>SVG, PNG, JPG or PDF (MAX. 800x400px)</p>
                                        </div>
                                        <input
                                            id="challenges-upload"
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(e, 'challenges')}
                                        />
                                    </label>
                                </div>
                                {files.challenges.length > 0 && (
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        {files.challenges.map((f, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-200 italic">
                                                {f.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <CheckCircle size={16} className='text-blue-600' /> Solutions Implemented
                                </label>
                                <textarea
                                    name="solution"
                                    value={formData.solution}
                                    onChange={handleChange}
                                    className='w-full h-24 p-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors text-gray-700 resize-none shadow-sm'
                                    placeholder='How did you resolve the issues?'
                                ></textarea>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <Upload size={16} className='text-blue-600' /> Upload Solution Docs
                                </label>
                                <div className='flex items-center justify-center w-full'>
                                    <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-colors shadow-sm'>
                                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                            <p className='mb-2 text-sm text-gray-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                            <p className='text-xs text-gray-500'>DOCS, PDF, Images</p>
                                        </div>
                                        <input
                                            id="solution-upload"
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(e, 'solution')}
                                        />
                                    </label>
                                </div>
                                {files.solution.length > 0 && (
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        {files.solution.map((f, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-200 italic">
                                                {f.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-end pt-4 gap-4'>
                            <button
                                disabled={submitting}
                                className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-1 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Submitting...
                                    </>
                                ) : "Submit Report"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>

            {/* ── SUCCESS MODAL ── */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className="bg-emerald-500 p-10 flex flex-col items-center gap-4 relative overflow-hidden">
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                <CheckCircle size={120} />
                            </div>
                            <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/20 animate-bounce">
                                <CheckCircle className="text-emerald-500" size={40} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-2xl text-white tracking-tight">Submit Successful</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-700 font-bold text-sm leading-relaxed text-center">
                                Your daily report has been <span className="text-emerald-600 font-black">saved successfully.</span>
                            </p>
                            <div className="mt-6 w-full bg-emerald-50 border border-emerald-100 rounded-2xl py-3 px-5 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-left">Redirecting...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className="bg-rose-500 p-8 flex flex-col items-center gap-4 relative overflow-hidden">
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                <AlertTriangle size={100} />
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <AlertTriangle className="text-rose-500" size={32} />
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
                                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-100 active:scale-95"
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

export default DailyReport
