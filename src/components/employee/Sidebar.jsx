import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, FileText, Code, CheckSquare, Github, LogOut, Clock, LayoutDashboard, ChevronLeft, ChevronRight, Wallet, Bell, KeyRound } from 'lucide-react'
import { AuthContext } from '../../context/AuthProvider'
import { fetchUnreadNotifications } from '../../api/notificationApi'


const Sidebar = ({ changeUser, firstName, isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { setCurrentUser } = useContext(AuthContext)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const getUnread = async () => {
            try {
                const unread = await fetchUnreadNotifications()
                setUnreadCount(Array.isArray(unread) ? unread.length : 0)
            } catch (err) {
                // Silently ignore network errors (backend offline)
                if (err?.code !== 'ERR_NETWORK' && err?.message !== 'Network Error') {
                    console.error("Unread Sync Failure", err)
                }
            }
        }
        getUnread()
        const interval = setInterval(getUnread, 60000)
        return () => clearInterval(interval)
    }, [])


    const menuItems = [
        { id: 'tasks', icon: LayoutDashboard, label: 'Dashboard', path: '/employee/dashboard' },
        { id: 'profile', icon: User, label: 'Profile', path: '/employee/profile' },
        { id: 'attendance', icon: Clock, label: 'Attendance', path: '/employee/attendance' },
        { id: 'salary', icon: Wallet, label: 'Salary', path: '/employee/salary' },
        { id: 'notifications', icon: Bell, label: 'Notifications', path: '/employee/notifications', badge: unreadCount },
        { id: 'coding', icon: Code, label: 'Coding', path: '/employee/coding' },
        { id: 'daily', icon: CheckSquare, label: 'Daily Task', path: '/employee/daily' },
        { id: 'reset-password', icon: KeyRound, label: 'Reset Password', path: '/employee/reset-password' },
        { id: 'github', icon: Github, label: 'GitHub', path: '/employee/github' },
    ]


    const logOutUser = () => {
        localStorage.removeItem('loggedInUser')
        setCurrentUser(null)
        navigate('/login')
    }

    return (
        <div className={`h-full ${isCollapsed ? 'w-20' : 'w-64'} bg-blue-900 flex flex-col justify-between p-4 border-r border-blue-800 sticky top-0 font-sans shadow-sm transition-all duration-300 ease-in-out`}>
            <div>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2 mb-8 mt-4`}>
                    {!isCollapsed && (
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 text-blue-900'>
                                <span className='font-bold text-lg'>E</span>
                            </div>
                            <div>
                                <h1 className='text-sm font-black tracking-tighter text-white uppercase'>Employee</h1>
                                <p className='text-[10px] text-blue-300'>Welcome, {firstName}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className='p-1.5 hover:bg-white/10 rounded-lg text-blue-200 transition-colors'
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className='flex flex-col gap-1'>
                    {!isCollapsed && <p className='text-xs font-bold text-blue-300 uppercase tracking-widest px-3 mb-2 mt-4'>Menu</p>}
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname.includes(item.path) || (item.id === 'tasks' && location.pathname === '/employee')
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-all duration-200 group relative font-medium
                                    ${isActive
                                        ? 'bg-white text-blue-900 shadow-sm'
                                        : 'text-blue-200 hover:bg-blue-800 hover:text-white hover:shadow-sm'
                                    }`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon size={18} className={`transition-colors flex-shrink-0 ${isActive ? 'text-blue-900' : 'text-blue-300 group-hover:text-white'}`} />
                                {!isCollapsed && <span className='text-sm whitespace-nowrap'>{item.label}</span>}
                                {!isCollapsed && item.badge > 0 && (
                                    <span className='ml-auto bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-blue-900'>
                                        {item.badge}
                                    </span>
                                )}
                                {isCollapsed && item.badge > 0 && (
                                    <div className='absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-blue-900'></div>
                                )}

                            </button>
                        )
                    })}
                </nav>
            </div>

            <button
                onClick={logOutUser}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 text-sm font-medium mt-auto mb-2`}
                title={isCollapsed ? 'Logout' : ''}
            >
                <LogOut size={18} />
                {!isCollapsed && <span>Logout</span>}
            </button>
        </div>
    )
}

export default Sidebar
