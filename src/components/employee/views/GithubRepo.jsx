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
        <div className='p-6 bg-gray-50 h-full overflow-y-auto rounded-xl custom-scrollbar'>

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
                            <button className='w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
                                <Github size={20} /> Connect Repository
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className='max-w-5xl mx-auto'>
                    <div className='flex justify-between items-center mb-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-md'>
                                <Github className='text-white' size={24} />
                            </div>
                            <div>
                                <h2 className='text-xl font-bold text-gray-800'>{repoLink.replace('https://github.com/', '') || 'username/repository'}</h2>
                                <p className='text-sm text-green-600 font-medium flex items-center gap-1'>
                                    <span className='w-2 h-2 bg-green-500 rounded-full'></span> Connected
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { setIsConnected(false); setRepoLink('') }} className='text-sm text-red-500 hover:text-red-700 font-medium hover:underline'>
                            Disconnect
                        </button>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* File Upload Area */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full'>
                                <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                                    <Upload size={18} className='text-blue-500' /> Upload Files
                                </h3>
                                <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-blue-100 border-dashed rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors'>
                                    <div className='flex flex-col items-center justify-center pt-5 pb-6 text-center'>
                                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600'>
                                            <Upload size={24} />
                                        </div>
                                        <p className='mb-2 text-sm text-gray-600 font-bold'>Click to upload</p>
                                        <p className='text-xs text-gray-400'>Documents, Images, or Code</p>
                                    </div>
                                    <input type="file" className="hidden" multiple onChange={handleFileUpload} />
                                </label>
                                <p className='text-xs text-gray-400 mt-4 text-center'>
                                    Files will be automatically pushed to the repository main branch.
                                </p>
                            </div>
                        </div>

                        {/* File List */}
                        <div className='lg:col-span-2'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
                                <div className='p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
                                    <h3 className='font-bold text-gray-800'>Repository Files</h3>
                                    <span className='text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded'>{files.length} items</span>
                                </div>
                                <div className='divide-y divide-gray-100 max-h-[500px] overflow-y-auto'>
                                    {files.map((file, index) => (
                                        <div key={index} className='p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group'>
                                            <div className='flex items-center gap-3'>
                                                {file.type === 'folder' ? (
                                                    <Folder className='text-blue-400' size={20} />
                                                ) : (
                                                    <File className='text-gray-400' size={20} />
                                                )}
                                                <span className='text-sm font-medium text-gray-700'>{file.name}</span>
                                            </div>
                                            <div className='flex items-center gap-6'>
                                                <span className='text-xs text-gray-400 font-mono'>{file.size}</span>
                                                {file.type === 'file' && (
                                                    <button onClick={() => handleDelete(index)} className='text-gray-300 hover:text-red-500 transition-colors'>
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
            )}
        </div>
    )
}

export default GithubRepo
