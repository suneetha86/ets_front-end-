import React, { useState } from 'react'

const Coding = () => {
    // Mock state for coding problems
    const [problems, setProblems] = useState([
        { id: 1, title: 'Two Sum', difficulty: 'Easy', assignedTo: 'All' },
        { id: 2, title: 'Reverse Linked List', difficulty: 'Medium', assignedTo: 'Developers' },
    ])

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [difficulty, setDifficulty] = useState('Easy')


    const handleAddProblem = (e) => {
        e.preventDefault()
        const newProblem = {
            id: problems.length + 1,
            title,
            difficulty,
            assignedTo: 'All' // simplified logic
        }
        setProblems([...problems, newProblem])
        setTitle('')
        setDesc('')

    }

    return (
        <div className='flex gap-8 h-full bg-white p-8 rounded-xl shadow-sm border border-gray-100'>
            <div className='w-1/3 p-8 bg-purple-50 rounded-2xl border border-purple-100 h-fit'>
                <h2 className='text-2xl font-bold mb-6 text-purple-900'>Assign Coding Problem</h2>
                <form onSubmit={handleAddProblem} className='flex flex-col gap-5'>
                    <div>
                        <label className='text-xs font-bold text-purple-700 uppercase tracking-wider mb-1.5 block'>Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder='e.g. Matrix Rotation'
                            className='w-full p-3.5 bg-white rounded-xl border border-purple-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-gray-800'
                        />
                    </div>
                    <div>
                        <label className='text-xs font-bold text-purple-700 uppercase tracking-wider mb-1.5 block'>Difficulty Level</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className='w-full p-3.5 bg-white rounded-xl border border-purple-200 outline-none focus:border-purple-500 transition-all text-gray-800 cursor-pointer'
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className='text-xs font-bold text-purple-700 uppercase tracking-wider mb-1.5 block'>Problem Statement</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            required
                            placeholder='Provide clear instructions...'
                            className='w-full p-3.5 bg-white rounded-xl border border-purple-200 outline-none focus:border-purple-500 h-32 resize-none text-gray-800'
                        ></textarea>
                    </div>
                    <button className='bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl transition-all font-bold shadow-lg shadow-purple-200 hover:-translate-y-0.5 active:scale-95'>
                        Assign Problem
                    </button>
                </form>
            </div>

            <div className='w-2/3 p-8 bg-gray-50 rounded-2xl border border-gray-100 h-full overflow-auto'>
                <h2 className='text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2'>
                    Active Programs
                    <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full'>{problems.length} total</span>
                </h2>
                <div className='grid gap-4'>
                    {problems.map(prob => (
                        <div key={prob.id} className='p-5 bg-white rounded-2xl flex justify-between items-center border border-gray-100 shadow-sm hover:border-purple-300 transition-all group'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-2 h-10 rounded-full ${prob.difficulty === 'Hard' ? 'bg-red-500' : prob.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                                <div>
                                    <h3 className='font-bold text-lg text-gray-900'>{prob.title}</h3>
                                    <div className='flex items-center gap-2 mt-0.5'>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${prob.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : prob.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-600'}`}>{prob.difficulty}</span>
                                        <span className='text-[10px] text-gray-400 font-bold uppercase'>Assigned to: {prob.assignedTo}</span>
                                    </div>
                                </div>
                            </div>
                            <button className='text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors'>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Coding
