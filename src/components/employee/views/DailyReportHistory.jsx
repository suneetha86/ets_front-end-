import React, { useState, useEffect } from 'react'
import { Calendar, Clock, FileText, AlertTriangle, CheckCircle, File, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react'
import { getTasks } from '../../../api/taskApi'

const DailyReportHistory = ({ onBack }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const data = await getTasks();
                console.log("History Data received:", data);
                
                // Map API data to UI structure
                const formattedReports = (Array.isArray(data) ? data : []).map((item, index) => ({
                    id: item.id || index,
                    date: item.date || 'N/A',
                    time: item.time || 'N/A',
                    description: item.taskDescription || 'No description provided.',
                    challenges: item.challengesFaced || '',
                    solution: item.solutionImplemented || '',
                    status: item.status || 'PENDING',
                    challengesFiles: item.uploadScreenshots ? [{
                        name: item.uploadScreenshots,
                        type: 'image/png', // Guessing type
                        url: '#' // URL would come from a file server in production
                    }] : [],
                    solutionFiles: item.uploadSolutionDocuments ? [{
                        name: item.uploadSolutionDocuments,
                        type: 'application/pdf',
                        url: '#'
                    }] : []
                }));

                setReports(formattedReports.reverse()); // Show newest first
            } catch (err) {
                console.error("Failed to fetch reports:", err);
                setError("Unable to load history from server.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const renderFilePreview = (files) => {
        if (!files || files.length === 0) return null
        return (
            <div className='flex flex-wrap gap-2 mt-2'>
                {files.map((file, idx) => (
                    <div key={idx} className='relative group'>
                        {file.type.startsWith('image/') ? (
                            <div className='w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center'>
                                <ImageIcon className="text-gray-300" size={32} />
                            </div>
                        ) : (
                            <div className='w-24 h-24 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center p-3 text-center'>
                                <File size={24} className='text-blue-500 mb-1' />
                                <span className='text-[10px] text-gray-500 font-medium line-clamp-2 leading-tight break-all'>{file.name}</span>
                            </div>
                        )}
                        <button
                            title="View Attachment"
                            className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg cursor-pointer'
                        >
                            <ExternalLink size={16} className='text-white' />
                        </button>
                    </div>
                ))}
            </div>
        )
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center h-64 gap-3 text-gray-400'>
                <Loader2 className="animate-spin" size={40} />
                <p className="font-medium">Fetching history...</p>
            </div>
        );
    }

    return (
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar pb-24'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h2 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                            <Clock className='text-blue-600' /> Report History
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Review your previously submitted daily work reports.</p>
                    </div>
                    <button
                        onClick={onBack}
                        className='flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all shadow-sm font-semibold'
                    >
                        <ArrowLeft size={18} /> Back to Form
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm mb-6 flex items-center gap-3">
                        <AlertTriangle size={18} />
                        {error}
                    </div>
                )}

                <div className='space-y-6'>
                    {reports.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-lg font-bold text-gray-400">No reports found</h3>
                            <p className="text-gray-400 text-sm">You haven't submitted any daily reports yet.</p>
                        </div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden group'>
                                <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {report.status}
                                </div>
                                
                                <div className='flex justify-between items-start mb-6 border-b border-gray-50 pb-5'>
                                    <div className='flex items-center gap-4'>
                                        <div className='px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm flex items-center gap-2 border border-blue-100'>
                                            <Calendar size={14} /> {report.date}
                                        </div>
                                        <div className='px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm flex items-center gap-2 border border-gray-200'>
                                            <Clock size={14} /> {report.time}
                                        </div>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                                    <div>
                                        <h4 className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3'>Task Description</h4>
                                        <p className='text-gray-800 leading-relaxed font-medium mb-8 text-sm'>{report.description}</p>

                                        {report.challenges && (
                                            <div className="space-y-3">
                                                <h4 className='text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2'>
                                                    <AlertTriangle size={14} /> Challenges Faced
                                                </h4>
                                                <p className='text-gray-700 text-sm bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 leading-relaxed italic'>{report.challenges}</p>
                                                {renderFilePreview(report.challengesFiles)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        {report.solution && (
                                            <div className="space-y-3">
                                                <h4 className='text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-2'>
                                                    <CheckCircle size={14} /> Solution Implemented
                                                </h4>
                                                <p className='text-gray-700 text-sm bg-green-50/50 p-4 rounded-xl border border-green-100 leading-relaxed'>{report.solution}</p>
                                                {renderFilePreview(report.solutionFiles)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

// Add missing Icon
const ImageIcon = ({ size, className }) => (
    <div className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
    </div>
);

export default DailyReportHistory
