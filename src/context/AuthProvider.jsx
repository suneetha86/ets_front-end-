import React, { createContext, useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    // localStorage.clear()

    const [userData, setUserData] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        setLocalStorage()
        const { employees } = getLocalStorage()
        setUserData(employees)

        const loggedInUser = localStorage.getItem('loggedInUser')
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser))
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            userData,
            setUserData,
            currentUser,
            setCurrentUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
