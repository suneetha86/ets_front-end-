import React from 'react'
import CreateTask from '../../other/CreateTask'
import AllTask from '../../other/AllTask'

const Tasks = () => {
    return (
        <div className='h-full overflow-auto pr-2'>
            <CreateTask />
            <AllTask />
        </div>
    )
}

export default Tasks
