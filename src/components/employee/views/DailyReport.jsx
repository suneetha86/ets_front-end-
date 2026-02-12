import React, { useState } from 'react'
import { Calendar, Clock, FileText, AlertTriangle, Upload, CheckCircle, File, Image as ImageIcon, ExternalLink, History } from 'lucide-react'

const DailyReport = ({ onViewHistory }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        description: '',
        challenges: '',
        solution: '',
    })

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

    const handleSubmit = (e) => {
        e.preventDefault()

        const challengesFilesProcessed = files.challenges.map(file => ({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file)
        }))

        const solutionFilesProcessed = files.solution.map(file => ({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file)
        }))

        // In a real app, here we would send the data to a backend
        console.log("Submitting:", {
            ...formData,
            challengesFiles: challengesFilesProcessed,
            solutionFiles: solutionFilesProcessed
        })

        // Reset form
        setFormData({
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            description: '',
            challenges: '',
            solution: '',
        })
        setFiles({ challenges: [], solution: [] })

        // Reset file inputs manually
        document.getElementById('challenges-upload').value = ''
        document.getElementById('solution-upload').value = ''

        alert("Daily Report Submitted Successfully!")
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar'>
            <div className='max-w-4xl mx-auto'>
                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8'>
                    <div className='flex justify-between items-center mb-8'>
                        <div>
                            <h2 className='text-3xl font-bold mb-2 text-gray-800 flex items-center gap-3'>
                                <FileText className='text-blue-600' /> Daily Work Report
                            </h2>
                            <p className='text-gray-500'>Submit your daily progress, challenges, and solutions.</p>
                        </div>
                        <button
                            type="button"
                            onClick={onViewHistory}
                            className='flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors'
                        >
                            <History size={18} /> View History
                        </button>
                    </div>

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
                                value={formData.description}
                                onChange={handleChange}
                                className='w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors text-gray-700 resize-none'
                                placeholder='Describe the tasks you worked on today...'
                            ></textarea>
                        </div>

                        <div className='bg-yellow-50 p-6 rounded-xl border border-yellow-100 space-y-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <AlertTriangle size={16} className='text-yellow-600' /> Challenges Faced
                                </label>
                                <textarea
                                    name="challenges"
                                    value={formData.challenges}
                                    onChange={handleChange}
                                    className='w-full h-24 p-4 bg-white border border-gray-200 rounded-xl focus:border-yellow-500 outline-none transition-colors text-gray-700 resize-none'
                                    placeholder='What blocks or issues did you encounter?'
                                ></textarea>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <Upload size={16} className='text-yellow-600' /> Upload Screenshots/Docs (Challenges)
                                </label>
                                <div className='flex items-center justify-center w-full'>
                                    <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-yellow-50 transition-colors'>
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
                                    <div className='text-xs text-yellow-700 font-medium'>
                                        {files.challenges.length} file(s) selected
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='bg-green-50 p-6 rounded-xl border border-green-100 space-y-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <CheckCircle size={16} className='text-green-600' /> Solutions Implemented
                                </label>
                                <textarea
                                    name="solution"
                                    value={formData.solution}
                                    onChange={handleChange}
                                    className='w-full h-24 p-4 bg-white border border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors text-gray-700 resize-none'
                                    placeholder='How did you resolve the issues?'
                                ></textarea>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                                    <Upload size={16} className='text-green-600' /> Upload Solution Docs
                                </label>
                                <div className='flex items-center justify-center w-full'>
                                    <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-green-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-green-50 transition-colors'>
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
                                    <div className='text-xs text-green-700 font-medium'>
                                        {files.solution.length} file(s) selected
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-end pt-4 gap-4'>
                            <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-1'>
                                Submit Report
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default DailyReport
