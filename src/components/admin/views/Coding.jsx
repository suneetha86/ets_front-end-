import React, { useState, useEffect } from 'react'
import { Code, Plus, ChevronRight, Loader2, Target, Users, X } from 'lucide-react'
import { fetchChallenges, postChallenge, fetchChallengeById } from '../../../api/challengesApi'

const Coding = () => {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedProblem, setSelectedProblem] = useState(null)
    const [isFetchingDetail, setIsFetchingDetail] = useState(false)
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' })

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [difficulty, setDifficulty] = useState('EASY')

    useEffect(() => {
        const loadProblems = async () => {
            try {
                setLoading(true)
                const data = await fetchChallenges()
                setProblems(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Administrative Retrieval Error:", error)
            } finally {
                setLoading(false)
            }
        }
        loadProblems()
    }, [])

    const viewProtocolDetails = async (id) => {
        try {
            setIsFetchingDetail(true);
            const detail = await fetchChallengeById(id);
            setSelectedProblem(detail);
        } catch (error) {
            console.error("Detail Decryption Failure:", error);
            setModal({
                show: true,
                title: "Security Error",
                message: "Unable to retrieve protocol details. Decryption handshake failed.",
                type: 'error'
            });
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleAddProblem = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        const newChallenge = {
            title,
            description: desc,
            difficulty, // backend expects uppercase based on user response
            status: 'PENDING',
            solveUrl: 'https://leetcode.com/problems/' + title.toLowerCase().replace(/ /g, '-')
        }

        try {
            const response = await postChallenge(newChallenge)
            setProblems([response, ...problems])
            setTitle('')
            setDesc('')
            setModal({
                show: true,
                title: "Protocol Established",
                message: "New protocol established: Challenge distributed to all reachable nodes.",
                type: 'success'
            });
        } catch (error) {
            console.error("Assignment Synchronization Failure:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='flex gap-8 h-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden'>
            <div className='w-1/3 p-10 bg-purple-50/50 rounded-[3rem] border border-purple-100 h-fit relative'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl -z-10'></div>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200'>
                        <Plus size={24} />
                    </div>
                    <div>
                        <h2 className='text-2xl font-black text-purple-900 tracking-tight'>Deploy Logic</h2>
                        <p className='text-purple-400 text-[10px] font-black uppercase tracking-widest mt-0.5'>Broadcast Global Challenge</p>
                    </div>
                </div>

                <form onSubmit={handleAddProblem} className='flex flex-col gap-6 relative z-10'>
                    <div className='space-y-1.5'>
                        <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1'>Protocol Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isSubmitting}
                            placeholder='e.g. Matrix Rotation'
                            className='w-full p-4 bg-white rounded-2xl border border-purple-100 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm font-bold shadow-sm'
                        />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1'>Threat Level (Difficulty)</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            disabled={isSubmitting}
                            className='w-full p-4 bg-white rounded-2xl border border-purple-100 outline-none focus:border-purple-500 transition-all text-sm font-bold shadow-sm cursor-pointer appearance-none'
                        >
                            <option value="EASY">Level 01 - Easy</option>
                            <option value="MEDIUM">Level 02 - Medium</option>
                            <option value="HARD">Level 03 - Hard</option>
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1'>Instruction Payload</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            required
                            disabled={isSubmitting}
                            placeholder='Provide explicit algorithmic parameters...'
                            className='w-full p-4 bg-white rounded-2xl border border-purple-100 outline-none focus:border-purple-500 h-36 resize-none text-sm font-medium shadow-sm leading-relaxed'
                        ></textarea>
                    </div>
                    <button 
                        disabled={isSubmitting}
                        className='bg-purple-900 hover:bg-black text-white py-5 rounded-2xl transition-all font-black uppercase tracking-widest text-[11px] shadow-xl shadow-purple-100 active:scale-95 flex items-center justify-center gap-2 group'
                    >
                        {isSubmitting ? <Loader2 size={16} className='animate-spin' /> : <Target size={16} className='group-hover:scale-120 transition-transform' />}
                        {isSubmitting ? 'Syncing Modules...' : 'Initiate Distribution'}
                    </button>
                </form>
            </div>

            <div className='flex-1 p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 h-full overflow-y-auto scrollbar-hide'>
                <div className='flex items-center justify-between mb-10'>
                    <div className='flex items-center gap-4'>
                        <div className='p-3 bg-white rounded-2xl shadow-sm border border-slate-100'>
                            <Code size={24} className='text-slate-600' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-black text-slate-800 tracking-tight'>Active Programs</h2>
                            <p className='text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5'>Global Repository Overview</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2'>
                            <Users size={14} className='text-purple-600' />
                            <span className='text-[11px] font-black text-slate-600 uppercase tracking-widest'>{problems.length} Nodes Online</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center justify-center h-96 gap-4'>
                        <Loader2 className='text-purple-500 animate-spin' size={48} />
                        <span className='text-slate-400 text-[10px] font-black uppercase tracking-widest'>Decrypting Database...</span>
                    </div>
                ) : (
                    <div className='grid gap-4'>
                        {problems.map(prob => (
                            <div key={prob.id} className='p-6 bg-white rounded-[2rem] flex justify-between items-center border border-slate-100 shadow-sm hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 transition-all group animate-in slide-in-from-right duration-300'>
                                <div className='flex items-center gap-6'>
                                    <div className={`w-1.5 h-12 rounded-full ${prob.difficulty === 'HARD' ? 'bg-red-500' : prob.difficulty === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-500'} shadow-sm`}></div>
                                    <div>
                                        <h3 className='font-black text-lg text-slate-800 tracking-tight uppercase group-hover:text-purple-600 transition-colors'>{prob.title}</h3>
                                        <div className='flex items-center gap-3 mt-1'>
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg ${
                                                prob.difficulty === 'HARD' ? 'bg-red-50 text-red-600' : 
                                                prob.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 
                                                'bg-emerald-50 text-emerald-600'
                                            }`}>{prob.difficulty}</span>
                                            <span className='text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 border-l border-slate-200 pl-3'>
                                                <div className={`w-1 h-1 rounded-full ${prob.status === 'SOLVED' ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                                                {prob.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => viewProtocolDetails(prob.id)}
                                    disabled={isFetchingDetail}
                                    className='p-4 bg-slate-50 hover:bg-purple-600 text-slate-400 hover:text-white rounded-2xl transition-all shadow-sm active:scale-95 group-hover:rotate-12 disabled:opacity-50'
                                >
                                    {isFetchingDetail ? <Loader2 size={20} className='animate-spin' /> : <ChevronRight size={20} />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Program Detail Modal */}
            {selectedProblem && (
                <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300'>
                    <div className='bg-white rounded-[3rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in duration-300 border border-white/20'>
                        <div className='p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30'>
                            <div className='flex items-center gap-4'>
                                <div className='p-4 bg-purple-600 rounded-2xl text-white'>
                                    <Code size={32} />
                                </div>
                                <div>
                                    <h3 className='text-3xl font-black text-slate-900 tracking-tight uppercase'>{selectedProblem.title}</h3>
                                    <p className='text-purple-500 text-[10px] font-black uppercase tracking-widest mt-0.5'>Protocol # {selectedProblem.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedProblem(null)} className='p-3 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400'>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className='p-10 space-y-8'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='p-6 bg-slate-50 rounded-[2rem] border border-slate-100'>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>Protocol Level</p>
                                    <span className={`text-sm font-black uppercase tracking-widest ${
                                        selectedProblem.difficulty === 'HARD' ? 'text-red-600' : 
                                        selectedProblem.difficulty === 'MEDIUM' ? 'text-amber-600' : 
                                        'text-emerald-600'
                                    }`}>{selectedProblem.difficulty}</span>
                                </div>
                                <div className='p-6 bg-slate-50 rounded-[2rem] border border-slate-100'>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>System Status</p>
                                    <span className='text-sm font-black tracking-tight text-slate-700 uppercase'>{selectedProblem.status}</span>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest px-1'>Intelligence URL</p>
                                <a 
                                    href={selectedProblem.solveUrl} 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='block w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-blue-600 truncate hover:bg-slate-50 transition-colors'
                                >
                                    {selectedProblem.solveUrl}
                                </a>
                            </div>

                            <div className='space-y-3'>
                                <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest px-1'>Logic Briefing</p>
                                <div className='p-6 bg-slate-900 rounded-[2rem] text-slate-300 text-sm font-medium leading-relaxed border border-white/5'>
                                    {selectedProblem.description}
                                </div>
                            </div>
                        </div>

                        <div className='p-8 pt-0 flex justify-center'>
                            <button 
                                onClick={() => setSelectedProblem(null)}
                                className='w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-slate-200 active:scale-95'
                            >
                                Secure Terminal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL NOTIFICATION ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                        <div className={`p-8 flex flex-col items-center gap-4 relative overflow-hidden ${
                            modal.type === 'success' ? 'bg-emerald-500' : 
                            modal.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                        }`}>
                            <div className="absolute top-2 right-4 opacity-10 rotate-12">
                                <Target size={100} className="text-white" />
                            </div>
                            <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900">
                                {modal.type === 'success' ? <Target className="text-emerald-500" size={32} /> : 
                                 modal.type === 'error' ? <X size={32} className="text-rose-500" /> : 
                                 <Plus className="text-blue-500" size={32} />}
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

export default Coding

