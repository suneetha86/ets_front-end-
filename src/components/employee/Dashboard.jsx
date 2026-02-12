import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import MyTasks from './views/MyTasks'
import Profile from './views/Profile'
import EditProfile from './views/EditProfile'
import CodingList from './views/CodingList'
import DailyReport from './views/DailyReport'
import DailyReportHistory from './views/DailyReportHistory'
import GithubRepo from './views/GithubRepo'
import Attendance from './views/Attendance'

const Dashboard = (props) => {
  return (
    <div className='flex h-screen w-full bg-white overflow-hidden'>
      <div className='w-64 flex-shrink-0'>
        <Sidebar changeUser={props.changeUser} firstName={props.data?.firstName} />
      </div>

      <div className='flex-1 p-8 overflow-hidden h-full'>
        <div className='h-full w-full'>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MyTasks data={props.data} />} />
            <Route path="profile" element={<Profile data={props.data} />} />
            <Route path="edit-profile" element={<EditProfile data={props.data} onSave={props.onProfileUpdate} />} />
            <Route path="attendance" element={<Attendance data={props.data} />} />
            <Route path="coding" element={<CodingList />} />
            <Route path="daily" element={<DailyReport />} />
            <Route path="daily-history" element={<DailyReportHistory />} />
            <Route path="github" element={<GithubRepo />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard