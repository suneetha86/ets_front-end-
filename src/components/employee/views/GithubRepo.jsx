import React, { useState } from 'react'
import { Github, Upload, File, Folder, X, Trash2 } from 'lucide-react'

const GithubRepo = () => {
    const [repoLink, setRepoLink] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [files, setFiles] = useState([
        { name: 'README.md', type: 'file', size: '2 KB' },
        { name: 'src', type: 'folder', size: '-' },
        { name: 'public', type: 'folder', size: '-' },
        { name: 'package.json', type: 'file', size: '1 KB' },
    ])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (repoLink) {
            setIsConnected(true)
            alert("Repository Linked Successfully!")
        }
    }

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files)
        const newFiles = uploadedFiles.map(file => ({
            name: file.name,
            type: 'file',
            size: `${(file.size / 1024).toFixed(1)} KB`
        }))
        setFiles([...files, ...newFiles])
    }

    const handleDelete = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
    }

    return (
        <div className='p-6 bg-white h-full overflow-y-auto rounded-xl custom-scrollbar'>

            {!isConnected ? (
                <div className='flex items-center justify-center h-full'>
                    <div className='w-full max-w-lg bg-white p-10 rounded-2xl border border-gray-200 shadow-xl text-center'>
                        <div className='w-20 h-20 bg-gray-900 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-gray-500/20'>
                            <Github className='text-white' size={40} />
                        </div>
                        <h2 className='text-2xl font-bold mb-2 text-gray-800'>Connect GitHub Repository</h2>
                        <p className='text-gray-500 mb-8'>Link your repository to sync daily coding tasks and documents.</p>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <input
                                value={repoLink}
                                onChange={(e) => setRepoLink(e.target.value)}
                                type="url"
                                placeholder='https://github.com/username/repo'
                                className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-gray-800 transition-all font-medium'
                                required
                            />
                            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 uppercase tracking-widest text-[10px]'>
                                <Github size={20} /> Connect Repository
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className='max-w-5xl mx-auto'>
                    <div className='bg-gradient-to-r from-blue-600 via-blue-400 to-white p-8 rounded-2xl shadow-lg border-b mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
                        <div className='flex items-center gap-4'>
                            <div className='bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl'>
                                <Github className="text-white" size={32} />
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-sm truncate max-w-[200px] md:max-w-md'>
                                    {repoLink.replace('https://github.com/', '') || 'Repository'}
                                </h2>
                                <p className='text-blue-50 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span> Source Sync Active
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setIsConnected(false); setRepoLink('') }} 
                            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200'
                        >
                            Disconnect Terminal
                        </button>
                    </div>

                    <div 
                        style={{ backgroundColor: '#81e3e3' }}
                        className='p-8 rounded-3xl shadow-xl border border-cyan-100'
                    >
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                            {/* File Upload Area */}
                            <div className='lg:col-span-1'>
                                <div className='bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/50 h-full shadow-inner'>
                                    <h3 className='font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tighter text-sm'>
                                        <Upload size={18} className='text-blue-600' /> Upload Terminal
                                    </h3>
                                    <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-white/50 border-dashed rounded-xl cursor-pointer bg-white/20 hover:bg-white/40 transition-all group'>
                                        <div className='flex flex-col items-center justify-center pt-5 pb-6 text-center'>
                                            <div className='w-14 h-14 bg-white/60 rounded-full flex items-center justify-center mb-3 text-blue-600 shadow-lg group-hover:scale-110 transition-transform'>
                                                <Upload size={24} />
                                            </div>
                                            <p className='mb-2 text-xs text-slate-800 font-black uppercase tracking-widest'>Push to Main</p>
                                            <p className='text-[10px] text-slate-600 font-bold'>Drag & drop files here</p>
                                        </div>
                                        <input type="file" className="hidden" multiple onChange={handleFileUpload} />
                                    </label>
                                    <div className='mt-6 p-4 bg-blue-600/10 rounded-xl border border-blue-600/20'>
                                        <p className='text-[10px] text-blue-700 font-black uppercase tracking-widest leading-relaxed'>
                                            Syncing with repository branch...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* File List */}
                            <div className='lg:col-span-2'>
                                <div className='bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden shadow-inner h-full'>
                                    <div className='p-5 bg-white/40 border-b border-white/50 flex justify-between items-center'>
                                        <h3 className='font-black text-slate-800 uppercase tracking-tighter text-sm'>Workspace Explorer</h3>
                                        <span className='text-[10px] font-black bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg'>{files.length} ASSETS SYNCED</span>
                                    </div>
                                    <div className='divide-y divide-white/20 h-[400px] overflow-y-auto custom-scrollbar-light'>
                                        {files.map((file, index) => (
                                            <div key={index} className='p-5 flex items-center justify-between hover:bg-white/40 transition-all group'>
                                                <div className='flex items-center gap-4'>
                                                    {file.type === 'folder' ? (
                                                        <div className='w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center'>
                                                            <Folder className='text-blue-600' size={20} />
                                                        </div>
                                                    ) : (
                                                        <div className='w-10 h-10 bg-slate-500/10 rounded-xl flex items-center justify-center'>
                                                            <File className='text-slate-600' size={20} />
                                                        </div>
                                                    )}
                                                    <div className='flex flex-col'>
                                                        <span className='text-sm font-black text-slate-800'>{file.name}</span>
                                                        <span className='text-[10px] text-slate-500 font-bold uppercase tracking-widest'>{file.type}</span>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-6'>
                                                    <span className='text-[10px] text-slate-600 font-black bg-white/50 px-3 py-1 rounded-lg border border-white/50'>{file.size}</span>
                                                    {file.type === 'file' && (
                                                        <button 
                                                            onClick={() => handleDelete(index)} 
                                                            className='w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm'
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GithubRepo
