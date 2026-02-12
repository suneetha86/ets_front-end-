import React from 'react'

const DailyTasks = () => {
    // Mock data for daily updates
    const dailyUpdates = [
        { id: 1, employee: 'Arjun', date: '2024-02-09', content: 'Completed the homepage header design and fixed responsiveness issues on mobile.' },
        { id: 2, employee: 'Sneha', date: '2024-02-09', content: 'Optimized the database queries for the user login module. Reduced load time by 20%.' },
        { id: 3, employee: 'Ravi', date: '2024-02-08', content: 'Working on the presentation slides for the client meeting. Draft is 80% complete.' },
    ]

    return (
        <div className='bg-white shadow-sm border border-gray-200 p-8 rounded-xl h-full overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-3xl font-bold text-purple-900'>Employee Daily Updates</h2>
                    <p className='text-gray-500 text-xs mt-1'>Review progress reports and daily accomplishments from the team</p>
                </div>
                <div className='bg-purple-50 px-4 py-2 rounded-xl border border-purple-100'>
                    <span className='text-sm font-bold text-purple-900'>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            <div className='flex-1 overflow-auto pr-2 custom-scrollbar'>
                <div className='grid gap-6'>
                    {dailyUpdates.map(update => (
                        <div key={update.id} className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group relative overflow-hidden'>
                            <div className='absolute left-0 top-0 w-1 h-full bg-purple-600 transition-all opacity-0 group-hover:opacity-100'></div>
                            <div className='flex justify-between items-start mb-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700'>
                                        {update.employee.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-lg text-gray-900'>{update.employee}</h3>
                                        <span className='text-[10px] text-purple-600 font-black uppercase tracking-widest'>Core Team</span>
                                    </div>
                                </div>
                                <span className='text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100'>{update.date}</span>
                            </div>
                            <p className='text-gray-600 text-sm leading-relaxed pl-1'>"{update.content}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DailyTasks
