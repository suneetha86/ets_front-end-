import React, { useState, useEffect } from 'react'
import { Code, ExternalLink, BookOpen, X, Loader2 } from 'lucide-react'
import { fetchChallenges, fetchSolveUrl, fetchChallengeSolution } from '../../../api/challengesApi'

const CodingList = () => {
    const [challenges, setChallenges] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSolution, setSelectedSolution] = useState(null)
    const [isSolvingId, setIsSolvingId] = useState(null)
    const [isFetchingSolutionId, setIsFetchingSolutionId] = useState(null)

    // Example Solution Codes mapping (since Backend only has metadata)
    const solutionCodes = {
        1: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
        2: `function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
        3: `function isPalindrome(s) {
    s = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
}`
    }

    useEffect(() => {
        const loadChallenges = async () => {
            try {
                setLoading(true)
                const data = await fetchChallenges()
                setChallenges(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to load challenges:", error)
            } finally {
                setLoading(false)
            }
        }
        loadChallenges()
    }, [])

    const handleSolve = async (id, fallbackLink) => {
        try {
            setIsSolvingId(id)
            const data = await fetchSolveUrl(id)
            window.open(data.solveUrl || fallbackLink || 'https://www.onlinegdb.com/', '_blank')
        } catch (error) {
            console.error("Link Retrieval Failure:", error)
            window.open(fallbackLink || 'https://www.onlinegdb.com/', '_blank')
        } finally {
            setIsSolvingId(null)
        }
    }

    const handleViewSolution = async (problem) => {
        try {
            setIsFetchingSolutionId(problem.id)
            const solutionData = await fetchChallengeSolution(problem.id)
            
            // Format data based on backend response which user described
            // "I got link with the matter and the code"
            let logicDisplay = "// Protocol Logic Initialization failed.";
            
            if (typeof solutionData === 'string') {
                logicDisplay = solutionData;
            } else if (solutionData.solutionCode || solutionData.code) {
                logicDisplay = solutionData.solutionCode || solutionData.code;
            } else if (solutionData.content) {
                logicDisplay = solutionData.content;
            } else {
                 logicDisplay = JSON.stringify(solutionData, null, 2);
            }

            setSelectedSolution({
                ...problem,
                solutionCode: logicDisplay,
                meta: solutionData.meta || null
            })
        } catch (error) {
            console.error("Logic Retrieval Failure:", error)
            alert("Security Protocol: Unable to decrypt logic for this node.")
        } finally {
            setIsFetchingSolutionId(null)
        }
    }

    const closeSolution = () => {
        setSelectedSolution(null)
    }

    return (
        <div className='bg-white p-8 rounded-3xl h-full overflow-y-auto scrollbar-hide shadow-sm border border-gray-100 relative'>
            <div className='flex items-center gap-3 mb-8 pb-6 border-b border-gray-100'>
                <div className='p-3 bg-blue-50 text-blue-600 rounded-2xl'>
                    <Code size={28} />
                </div>
                <div>
                    <h2 className='text-3xl font-black tracking-tight text-gray-900'>Challenge Terminal</h2>
                    <p className='text-gray-400 text-xs font-bold uppercase tracking-widest mt-1'>Algorithmic Integrity Test Suite</p>
                </div>
            </div>

            {loading ? (
                <div className='flex flex-col items-center justify-center h-64 gap-4'>
                    <Loader2 className='text-blue-500 animate-spin' size={40} />
                    <p className='text-slate-400 text-[10px] font-black uppercase tracking-widest'>Syncing nodes...</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {challenges.map(prob => (
                        <div key={prob.id || prob.title} className='bg-gray-50 p-6 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between group h-full'>
                            <div>
                                <div className='flex justify-between items-start mb-4'>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                        prob.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                                        prob.difficulty === 'HARD' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>{prob.difficulty}</span>
                                    <div className='flex items-center gap-1.5'>
                                        <div className={`w-1.5 h-1.5 rounded-full ${prob.status === 'SOLVED' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${prob.status === 'SOLVED' ? 'text-emerald-600' : 'text-slate-400'}`}>{prob.status}</span>
                                    </div>
                                </div>
                                <h3 className='text-xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight'>{prob.title}</h3>
                                <p className='text-gray-500 text-[11px] font-medium leading-relaxed mb-6 opacity-70'>{prob.description}</p>
                            </div>

                            <div className='flex gap-3 mt-4'>
                                <button
                                    onClick={() => handleSolve(prob.id, prob.solveUrl)}
                                    disabled={isSolvingId === prob.id}
                                    className='flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50'
                                >
                                    {isSolvingId === prob.id ? <Loader2 size={14} className='animate-spin' /> : <ExternalLink size={14} />}
                                    {isSolvingId === prob.id ? 'Decrypting Link...' : 'Execute Solve'}
                                </button>
                                {prob.status === 'SOLVED' && (
                                    <button
                                        onClick={() => handleViewSolution(prob)}
                                        disabled={isFetchingSolutionId === prob.id}
                                        className='px-4 py-4 bg-white border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl transition-all active:scale-95 shadow-sm disabled:opacity-50'
                                        title="View Logic"
                                    >
                                        {isFetchingSolutionId === prob.id ? <Loader2 size={18} className='animate-spin' /> : <BookOpen size={18} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Solution Modal */}
            {selectedSolution && (
                <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300'>
                    <div className='bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20'>
                        <div className='p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50'>
                            <div>
                                <h3 className='text-2xl font-black text-slate-900 tracking-tight uppercase'>{selectedSolution.title}</h3>
                                <p className='text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1'>Credential Decryption Successful</p>
                            </div>
                            <button onClick={closeSolution} className='p-3 hover:bg-slate-200/50 rounded-2xl transition-colors text-slate-400 hover:text-slate-900'>
                                <X size={24} />
                            </button>
                        </div>
                        <div className='p-0 overflow-auto bg-[#0d1117]'>
                            <pre className='p-8 text-xs font-mono leading-relaxed text-blue-300/90'>
                                <code>{selectedSolution.solutionCode}</code>
                            </pre>
                        </div>
                        <div className='p-6 border-t border-slate-100 bg-white flex justify-end gap-3 px-8'>
                            <button onClick={closeSolution} className='px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95'>Close Protocol</button>
                            <button onClick={() => {
                                navigator.clipboard.writeText(selectedSolution.solutionCode)
                                alert('Code synchronized with clipboard.')
                            }} className='px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-200 active:scale-95'>Copy Logic</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CodingList

