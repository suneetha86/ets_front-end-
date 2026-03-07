import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../components/Landing/LandingPage'
import Login from '../components/Auth/Login'
import AdminDashboard from '../components/admin/Dashboard'
import EmployeeDashboard from '../components/employee/Dashboard'
import { AuthContext } from '../context/AuthProvider'

function AppRoutes() {
  const { currentUser, setCurrentUser, userData, setUserData, isAuthLoading } = useContext(AuthContext)

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-xl"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing AJA Core...</p>
        </div>
      </div>
    )
  }

  // Use currentUser from context which is reactive
  const role = currentUser?.role

  const handleProfileUpdate = (updatedEmployee) => {
    // 1. Update currentUser state (for immediate UI update)
    const updatedUser = { ...currentUser, data: updatedEmployee }
    setCurrentUser(updatedUser)

    // 2. Update localStorage 'loggedInUser'
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))

    // 3. Update the big 'employees' list in localStorage
    const employees = JSON.parse(localStorage.getItem('employees')) || []
    const updatedEmployees = employees.map(emp =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    )
    localStorage.setItem('employees', JSON.stringify(updatedEmployees))

    // 4. Update AuthContext userData
    if (setUserData) {
      setUserData(updatedEmployees)
    }
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        role === 'admin' ? (
          <AdminDashboard changeUser={() => { }} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Employee Routes */}
      <Route path="/employee/*" element={
        role === 'employee' ? (
          <EmployeeDashboard data={currentUser?.data} onProfileUpdate={handleProfileUpdate} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes