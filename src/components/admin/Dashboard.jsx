import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Employees from './views/Employees'
import Tasks from './views/Tasks'
import Coding from './views/Coding'
import DailyTasks from './views/DailyTasks'
import Submissions from './views/Submissions'
import AddUser from './views/AddUser'
import Departments from './views/Departments'
import Attendance from './views/Attendance'
import Reports from './views/Reports'
import AssignTask from './views/AssignTask'
import TaskStatus from './views/TaskStatus'
import AdminDashboardHome from './views/AdminDashboardHome'

const Dashboard = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className='flex h-screen w-full bg-white overflow-hidden'>
      <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar changeUser={props.changeUser} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      <div className='flex-1 p-8 overflow-hidden h-full'>
        <div className='h-full w-full'>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardHome />} />
            <Route path="employees" element={<Employees />} />
            <Route path="departments" element={<Departments />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="assign-task" element={<AssignTask />} />
            <Route path="task-status" element={<TaskStatus />} />
            <Route path="attendance" element={<Attendance />} />  
            <Route path="reports" element={<Reports />} />
            <Route path="coding" element={<Coding />} />
            <Route path="daily" element={<DailyTasks />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="addUser" element={<AddUser />} />
            <Route path="*" element={<Navigate to="employees" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard