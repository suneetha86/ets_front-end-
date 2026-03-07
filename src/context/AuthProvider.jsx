import React, { createContext, useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    // localStorage.clear()

    const [userData, setUserData] = useState(null)
    const [currentUser, setCurrentUser] = useState(() => {
        const loggedInUser = localStorage.getItem('loggedInUser')
        return loggedInUser ? JSON.parse(loggedInUser) : null
    })
    const [isAuthLoading, setIsAuthLoading] = useState(true)

    useEffect(() => {
        // Only set default values if they don't exist to prevent wiping user progress
        if (!localStorage.getItem('employees')) {
            setLocalStorage()
        }
        
        const { employees } = getLocalStorage()
        setUserData(employees)
        
        // Finalize loading
        setIsAuthLoading(false)
    }, [])

    return (
        <AuthContext.Provider value={{
            userData,
            setUserData,
            currentUser,
            setCurrentUser,
            isAuthLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
