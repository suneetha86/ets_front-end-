import React, { useState } from 'react'
import { Calendar, Clock, FileText, AlertTriangle, CheckCircle, File, ExternalLink, ArrowLeft } from 'lucide-react'

const DailyReportHistory = ({ onBack }) => {
    // Static data with a Java program image example
    const [reports] = useState([
        {
            id: 1,
            date: '2024-02-10',
            time: '18:00',
            description: 'Completed the initial setup of the user authentication module using JWT. Implemented login and registration endpoints.',
            challenges: 'Had some issues with token expiration handling and refresh token logic.',
            solution: 'Researched best practices and implemented a silent refresh mechanism using an interceptor.',
            challengesFiles: [],
            solutionFiles: [
                {
                    name: 'AuthInterceptor.java',
                    type: 'image/png', // Mocking as image for preview
                    url: 'https://placehold.co/600x400/png?text=Java+Program+Code+Snapshot'
                }
            ]
        },
        {
            id: 2,
            date: '2024-02-09',
            time: '17:30',
            description: 'Worked on the frontend dashboard layout. Integrated the sidebar and top navigation bar with responsive design.',
            challenges: 'CSS grid alignment was tricky on smaller screens.',
            solution: 'Used flexbox for the main layout and media queries to adjust the sidebar visibility.',
            challengesFiles: [
                {
                    name: 'GridIssue.png',
                    type: 'image/png',
                    url: 'https://placehold.co/600x400/png?text=CSS+Grid+Issue'
                }
            ],
            solutionFiles: []
        }
    ])

    const renderFilePreview = (files) => {
        if (!files || files.length === 0) return null
        return (
            <div className='flex flex-wrap gap-2 mt-2'>
                {files.map((file, idx) => (
                    <div key={idx} className='relative group'>
                        {file.type.startsWith('image/') ? (
                            <div className='w-32 h-32 rounded-lg overflow-hidden border border-gray-200'>
                                <img src={file.url} alt={file.name} className='w-full h-full object-cover' />
                            </div>
                        ) : (
                            <div className='w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center p-2 text-center'>
                                <File size={24} className='text-gray-400 mb-1' />
                                <span className='text-[10px] text-gray-500 line-clamp-2 leading-tight break-all'>{file.name}</span>
                            </div>
                        )}
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg'
                        >
                            <ExternalLink size={16} className='text-white' />
                        </a>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                        <Clock className='text-blue-600' /> Report History
                    </h2>
                    <button
                        onClick={onBack}
                        className='flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm'
                    >
                        <ArrowLeft size={16} /> Back to Form
                    </button>
                </div>

                <div className='space-y-6'>
                    {reports.map((report) => (
                        <div key={report.id} className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                            <div className='flex justify-between items-start mb-4 border-b border-gray-100 pb-4'>
                                <div className='flex items-center gap-4'>
                                    <div className='px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm flex items-center gap-2'>
                                        <Calendar size={14} /> {report.date}
                                    </div>
                                    <div className='px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-sm flex items-center gap-2'>
                                        <Clock size={14} /> {report.time}
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div>
                                    <h4 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-2'>Task Description</h4>
                                    <p className='text-gray-800 leading-relaxed mb-6'>{report.description}</p>

                                    {report.challenges && (
                                        <>
                                            <h4 className='text-sm font-bold text-yellow-600 uppercase tracking-wider mb-2 flex items-center gap-2'>
                                                <AlertTriangle size={14} /> Challenges
                                            </h4>
                                            <p className='text-gray-700 mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-100'>{report.challenges}</p>
                                            {renderFilePreview(report.challengesFiles)}
                                        </>
                                    )}
                                </div>

                                <div>
                                    {report.solution && (
                                        <>
                                            <h4 className='text-sm font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-2'>
                                                <CheckCircle size={14} /> Solution
                                            </h4>
                                            <p className='text-gray-700 mb-6 bg-green-50 p-3 rounded-lg border border-green-100'>{report.solution}</p>
                                            {renderFilePreview(report.solutionFiles)}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DailyReportHistory
