import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, FileText, AlertTriangle, CheckCircle, File, ExternalLink, ArrowLeft, Loader2, RefreshCw, X, Download, Image as ImageIcon } from 'lucide-react'

import { getTasks } from '../../../api/taskApi'

const DailyReportHistory = ({ onBack }) => {
    const navigate = useNavigate()
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastSynced, setLastSynced] = useState(null);
    const [isLive, setIsLive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleViewFile = (file) => {
        setSelectedFile(file);
    };


    // Static sample data - 6 daily reports
    const staticReports = [
        {
            id: 1,
            date: '2026-03-06',
            time: '09:00',
            description: 'Completed database schema design for the new employee module. Created tables for employee information, departments, and task assignments. Documented the relationships and constraints.',
            challenges: 'Had difficulty optimizing the query performance for large datasets. The JOIN operations were causing slow response times.',
            solution: 'Added proper indexes on foreign keys and used query optimization techniques. Response time improved from 2s to 200ms.',
            status: 'COMPLETED',
            challengesFiles: [{
                name: 'query-optimization-screenshot.png',
                type: 'image/png',
                url: '#'
            }],
            solutionFiles: [{
                name: 'database-optimization-report.pdf',
                type: 'application/pdf',
                url: '#'
            }]
        },
        {
            id: 2,
            date: '2026-03-05',
            time: '14:30',
            description: 'Implemented user authentication system with JWT tokens. Set up login and registration API endpoints with proper validation and error handling.',
            challenges: 'Password hashing and token expiration management needed careful consideration for security.',
            solution: 'Implemented bcrypt for password hashing and configured JWT with 24-hour expiration and refresh tokens.',
            status: 'COMPLETED',
            challengesFiles: [],
            solutionFiles: [{
                name: 'auth-implementation-doc.pdf',
                type: 'application/pdf',
                url: '#'
            }]
        },
        {
            id: 3,
            date: '2026-03-04',
            time: '11:15',
            description: 'Developed the task assignment feature for admin dashboard. Created form validation and task distribution logic across multiple employees.',
            challenges: 'Form validation with conditional fields and ensuring data consistency across the system.',
            solution: 'Used React hooks for state management and implemented server-side validation. Created helper functions for data consistency checks.',
            status: 'COMPLETED',
            challengesFiles: [{
                name: 'form-validation-error.png',
                type: 'image/png',
                url: '#'
            }],
            solutionFiles: []
        },
        {
            id: 4,
            date: '2026-03-03',
            time: '16:45',
            description: 'Built the attendance tracking system with real-time updates. Integrated with employee database and created automated reports generation.',
            challenges: 'Real-time synchronization across multiple user sessions and handling concurrent updates.',
            solution: 'Implemented WebSocket connections for real-time updates and database transactions for consistency.',
            status: 'PENDING',
            challengesFiles: [],
            solutionFiles: [{
                name: 'websocket-integration.pdf',
                type: 'application/pdf',
                url: '#'
            }]
        },
        {
            id: 5,
            date: '2026-03-02',
            time: '10:20',
            description: 'Created responsive dashboard UI components using Tailwind CSS. Implemented sidebar navigation, charts, and data visualization components.',
            challenges: 'Ensuring responsive design works across all screen sizes and multiple browser compatibility issues.',
            solution: 'Used Tailwind CSS media queries and tested across Chrome, Firefox, Safari, and Edge browsers.',
            status: 'COMPLETED',
            challengesFiles: [{
                name: 'responsive-design-test.png',
                type: 'image/png',
                url: '#'
            }],
            solutionFiles: []
        },
        {
            id: 6,
            date: '2026-03-01',
            time: '13:00',
            description: 'Set up project infrastructure including version control, CI/CD pipeline, and development environment documentation.',
            challenges: 'Configuring build tools and managing dependencies across frontend and backend environments.',
            solution: 'Created comprehensive setup documentation and automated build configuration using Vite for frontend.',
            status: 'COMPLETED',
            challengesFiles: [],
            solutionFiles: [{
                name: 'setup-documentation.pdf',
                type: 'application/pdf',
                url: '#'
            }]
        }
    ];

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getTasks();
                console.log("Strategic History Handshake:", data);
                
                const reportsArray = Array.isArray(data) ? data : (data ? [data] : []);

                if (reportsArray.length > 0) {
                    const formattedReports = reportsArray.map((item, index) => {
                        // Helper to split filenames and format into file objects
                        const formatFiles = (filenames, defaultType) => {
                            if (!filenames) return [];
                            return String(filenames).split(',').map(name => {
                                const trimmedName = name.trim();
                                if (!trimmedName) return null;
                                const ext = trimmedName.toLowerCase().split('.').pop();
                                
                                let type = 'image/png';
                                if (ext === 'pdf') type = 'application/pdf';
                                else if (['doc', 'docx'].includes(ext)) type = 'application/msword';
                                else if (ext === 'txt') type = 'text/plain';
                                
                                return {
                                    name: trimmedName,
                                    type: type,
                                    url: `/api/tasks/download/${trimmedName}` // Constructed download URL
                                };
                            }).filter(Boolean);
                        };

                        return {
                            id: item.id || index,
                            date: item.date || 'N/A',
                            time: item.time || 'N/A',
                            description: item.taskDescription || 'No description provided.',
                            challenges: item.challengesFaced || '',
                            solution: item.solutionImplemented || '',
                            status: item.status || 'PENDING',
                            challengesFiles: formatFiles(item.uploadScreenshots, 'image/png'),
                            solutionFiles: formatFiles(item.uploadSolutionDocuments, 'application/pdf')
                        };
                    });
                    setReports(formattedReports.reverse());
                    setIsLive(true);
                } else {
                    setReports(staticReports);
                    setIsLive(false);
                }
                setLastSynced(new Date().toLocaleTimeString());
            } catch (err) {
                console.error("History Handshake Failed:", err);
                setError("Protocol Breach: Failed to synchronize with mission logs.");
                setReports(staticReports);
                setIsLive(false);
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
                            <div className='w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative'>
                                <img 
                                    src={file.url} 
                                    alt={file.name} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <ImageIcon className="text-white drop-shadow-md" size={24} />
                                </div>
                            </div>
                        ) : (
                            <div className='w-24 h-24 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center p-3 text-center'>
                                <File size={24} className='text-blue-500 mb-1' />
                                <span className='text-[10px] text-gray-500 font-medium line-clamp-2 leading-tight break-all'>{file.name}</span>
                            </div>
                        )}
                        <button
                            title="View Attachment"
                            onClick={() => handleViewFile(file)}
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
                        <h2 className='text-3xl font-black text-gray-800 flex items-center gap-3 tracking-tight'>
                            <Clock className='text-blue-600' size={32} /> Operational Mission Archive
                        </h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-11">Review historical tactical logs</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => window.location.reload()}
                            className='p-3 bg-white text-gray-500 rounded-xl border border-gray-100 hover:text-blue-600 hover:shadow-lg transition-all active:rotate-180 duration-500'
                            title="Refresh Operational Archive"
                        >
                            <RefreshCw size={20} />
                        </button>

                        <button
                            onClick={() => navigate('../daily')}
                            className='flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all font-bold text-xs uppercase tracking-widest'
                        >
                            <ArrowLeft size={16} /> New Entry
                        </button>
                    </div>
                </div>

                <div className='flex items-center gap-6 mb-8 px-2'>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all duration-500 ${isLive ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isLive ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {isLive ? 'Vault: Live Handshake' : 'Offline: Archive Local'}
                        </span>
                    </div>
                    {lastSynced && (
                        <p className='text-[10px] text-slate-400 font-black uppercase tracking-widest'>
                            Last Uplink: <span className='text-slate-600'>{lastSynced}</span>
                        </p>
                    )}
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

            {/* File Viewer Modal */}
            {selectedFile && (
                <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300'>
                    <div className='bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col h-[85vh]'>
                        <div className='p-6 border-b flex items-center justify-between bg-gray-50'>
                            <div>
                                <h3 className='font-black text-xl text-gray-800 tracking-tight flex items-center gap-3'>
                                    <File className='text-blue-600' size={24} /> {selectedFile.name}
                                </h3>
                                <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5'>Secure Document Preview</p>
                            </div>
                            <div className='flex items-center gap-3'>
                                <a 
                                    href={selectedFile.url} 
                                    download={selectedFile.name}
                                    className='p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100'
                                    title="Download File"
                                >
                                    <Download size={20} />
                                </a>
                                <button 
                                    onClick={() => setSelectedFile(null)}
                                    className='p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95'
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className='flex-1 overflow-auto bg-gray-100 p-8 flex items-center justify-center'>
                            {selectedFile.type === 'application/pdf' ? (
                                <iframe 
                                    src={selectedFile.url} 
                                    className="w-full h-full rounded-xl shadow-inner border border-gray-200"
                                    title="PDF Document"
                                />
                            ) : selectedFile.type.includes('msword') || selectedFile.type.includes('plain') ? (
                                <div className='relative w-full h-full flex flex-col items-center justify-center gap-6'>
                                     <img 
                                        src="/api/tasks/preview/document" 
                                        alt="Document Preview" 
                                        className="max-w-[70%] max-h-full object-contain rounded-xl shadow-2xl border-8 border-white"
                                    />
                                    <div className='bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-xl text-center'>
                                        <p className='text-gray-800 font-black text-sm uppercase tracking-widest'>Protected Document Preview</p>
                                        <p className='text-gray-500 text-[10px] font-bold mt-1'>Editable formats (.docx, .txt) viewable as read-only snapshots.</p>
                                    </div>
                                </div>
                            ) : (
                                <img 
                                    src={selectedFile.url} 
                                    alt={selectedFile.name} 
                                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default DailyReportHistory
