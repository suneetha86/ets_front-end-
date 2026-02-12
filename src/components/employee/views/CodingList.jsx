import React, { useState } from 'react'
import { Code, ExternalLink, Check, BookOpen, X } from 'lucide-react'

const CodingList = () => {
    const [selectedSolution, setSelectedSolution] = useState(null)

    // Mock problems with Links and Solutions
    const problems = [
        {
            id: 1,
            title: 'Two Sum',
            difficulty: 'Easy',
            status: 'Solved',
            link: 'https://leetcode.com/problems/two-sum/',
            solutionCode: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
        },
        {
            id: 2,
            title: 'Reverse Linked List',
            difficulty: 'Medium',
            status: 'Pending',
            link: 'https://leetcode.com/problems/reverse-linked-list/',
            solutionCode: `function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
        },
        {
            id: 3,
            title: 'Valid Palindrome',
            difficulty: 'Easy',
            status: 'Pending',
            link: 'https://leetcode.com/problems/valid-palindrome/',
            solutionCode: `function isPalindrome(s) {
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
        },
    ]

    const handleSolve = (link) => {
        // Open online compiler or the specific problem link
        // User asked to "go to online compile page"
        window.open(link || 'https://www.onlinegdb.com/', '_blank')
    }

    const handleViewSolution = (problem) => {
        setSelectedSolution(problem)
    }

    const closeSolution = () => {
        setSelectedSolution(null)
    }

    return (
        <div className='bg-white p-6 rounded-xl h-full overflow-y-auto custom-scrollbar relative'>
            <h2 className='text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3'>
                <Code className='text-blue-600' /> Coding Challenges
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {problems.map(prob => (
                    <div key={prob.id} className='bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all flex flex-col justify-between group'>
                        <div>
                            <div className='flex justify-between items-start mb-4'>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${prob.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    prob.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                    }`}>{prob.difficulty}</span>
                                <span className={`text-xs font-bold ${prob.status === 'Solved' ? 'text-green-600' : 'text-gray-400'}`}>{prob.status}</span>
                            </div>
                            <h3 className='text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors'>{prob.title}</h3>
                            <p className='text-gray-500 text-sm mb-6'>Write a function to solve the {prob.title} problem efficiently.</p>
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => handleSolve(prob.link)}
                                className='flex-1 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-gray-400/20'
                            >
                                <ExternalLink size={16} /> Solve
                            </button>
                            {prob.status === 'Solved' && (
                                <button
                                    onClick={() => handleViewSolution(prob)}
                                    className='px-3 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-lg transition-all'
                                    title="View Solution"
                                >
                                    <BookOpen size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Solution Modal */}
            {selectedSolution && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
                    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200'>
                        <div className='p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50'>
                            <div>
                                <h3 className='text-xl font-bold text-gray-800'>{selectedSolution.title}</h3>
                                <p className='text-sm text-gray-500'>Solution Logic</p>
                            </div>
                            <button onClick={closeSolution} className='p-2 hover:bg-gray-200 rounded-full transition-colors'>
                                <X size={20} className='text-gray-500' />
                            </button>
                        </div>
                        <div className='p-0 overflow-auto bg-[#1e1e1e]'>
                            <pre className='p-6 text-sm font-mono text-gray-300'>
                                <code>{selectedSolution.solutionCode}</code>
                            </pre>
                        </div>
                        <div className='p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3'>
                            <button onClick={closeSolution} className='px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors'>Close</button>
                            <button onClick={() => {
                                navigator.clipboard.writeText(selectedSolution.solutionCode)
                                alert('Copied to clipboard!')
                            }} className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'>Copy Code</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CodingList
