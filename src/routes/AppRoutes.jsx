import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../components/Landing/LandingPage'
import Login from '../components/Auth/Login'
import AdminDashboard from '../components/admin/Dashboard'
import EmployeeDashboard from '../components/employee/Dashboard'
import { AuthContext } from '../context/AuthProvider'

function AppRoutes() {
  const { currentUser, setCurrentUser, userData, setUserData } = useContext(AuthContext)

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