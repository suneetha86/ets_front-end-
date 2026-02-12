import React from 'react'
import TaskListNumbers from '../../other/TaskListNumbers'
import TaskList from '../../TaskList/TaskList'
import Analytics from './Analytics'

const MyTasks = ({ data }) => {
    return (
        <div className='h-full overflow-auto pr-2'>
            <TaskListNumbers data={data} />
            <Analytics />
            <TaskList data={data} />
        </div>
    )
}

export default MyTasks
