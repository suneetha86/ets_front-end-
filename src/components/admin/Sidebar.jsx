import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users, FileText, Code, CheckSquare, Send, UserPlus, LogOut, Layout, Clock, BarChart2, ChevronDown, ChevronRight, ClipboardList, PenTool, LayoutDashboard } from 'lucide-react'
import { AuthContext } from '../../context/AuthProvider'

const Sidebar = ({ changeUser, isCollapsed, setIsCollapsed }) => {
    const [tasksOpen, setTasksOpen] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const { setCurrentUser } = useContext(AuthContext)

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'employees', icon: Users, label: 'Employees', path: '/admin/employees' },
        { id: 'departments', icon: Layout, label: 'Departments', path: '/admin/departments' },
        {
            id: 'tasks-group',
            icon: FileText,
            label: 'Tasks',
            subItems: [
                { id: 'assign-task', label: 'Assign Task', icon: PenTool, path: '/admin/assign-task' },
                { id: 'task-status', label: 'Task Status', icon: ClipboardList, path: '/admin/task-status' }
            ]
        },
        { id: 'attendance', icon: Clock, label: 'Attendance', path: '/admin/attendance' },
        { id: 'reports', icon: BarChart2, label: 'Reports', path: '/admin/reports' },
        { id: 'coding', icon: Code, label: 'Coding Program', path: '/admin/coding' },
        { id: 'daily', icon: CheckSquare, label: 'Daily Tasks', path: '/admin/daily' },
        { id: 'submissions', icon: Send, label: 'Submissions', path: '/admin/submissions' },
        { id: 'addUser', icon: UserPlus, label: 'Add Users', path: '/admin/addUser' },
    ]

    const logOutUser = () => {
        localStorage.removeItem('loggedInUser')
        setCurrentUser(null)
        navigate('/login')
    }

    return (
        <div className={`h-full ${isCollapsed ? 'w-20' : 'w-64'} bg-purple-900 flex flex-col justify-between p-4 border-r-2 border-purple-500/30 shadow-[4px_0_24px_rgba(0,0,0,0.1)] sticky top-0 font-sans transition-all duration-300 ease-in-out`}>
            <div className='flex-1 overflow-y-auto custom-scrollbar pr-1'>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8 mt-2 px-2`}>
                    {!isCollapsed && (
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20'>
                                <span className='font-bold text-purple-900 text-lg'>A</span>
                            </div>
                            <h1 className='text-xl font-bold tracking-tight text-white'>Admin</h1>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className='p-1.5 hover:bg-white/10 rounded-lg text-purple-200 transition-colors'
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} className='rotate-90' />}
                    </button>
                </div>

                <nav className='flex flex-col gap-1'>
                    {!isCollapsed && <p className='text-xs font-semibold text-purple-200 uppercase tracking-wider px-3 mb-2 mt-2'>Menu</p>}
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        // Handle Group Items (Dropdowns)
                        if (item.subItems) {
                            const isChildActive = item.subItems.some(sub => location.pathname.includes(sub.path))
                            const isOpen = (tasksOpen || isChildActive) && !isCollapsed

                            return (
                                <div key={item.id} className='flex flex-col gap-1'>
                                    <button
                                        onClick={() => !isCollapsed && setTasksOpen(!tasksOpen)}
                                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all duration-200 group relative w-full
                                            ${isChildActive ? 'bg-white/10 text-white' : 'text-purple-200 hover:bg-purple-800 hover:text-white'}`}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <Icon size={18} className={isChildActive ? 'text-white' : 'text-purple-300 group-hover:text-white'} />
                                            {!isCollapsed && <span className='text-sm font-medium'>{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (tasksOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                                    </button>

                                    {isOpen && (
                                        <div className='flex flex-col gap-1 pl-4 mb-2'>
                                            {item.subItems.map((subItem) => {
                                                const SubIcon = subItem.icon
                                                const isSubActive = location.pathname.includes(subItem.path)
                                                return (
                                                    <button
                                                        key={subItem.id}
                                                        onClick={() => navigate(subItem.path)}
                                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative
                                                            ${isSubActive
                                                                ? 'bg-white/10 text-white'
                                                                : 'text-purple-300 hover:bg-purple-800/50 hover:text-white'
                                                            }`}
                                                    >
                                                        {isSubActive && <div className='absolute left-0 w-0.5 h-4 bg-white rounded-r-full -ml-4'></div>}
                                                        <SubIcon size={16} className={isSubActive ? 'text-white' : 'text-purple-400 group-hover:text-white'} />
                                                        <span className='text-xs font-medium'>{subItem.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        // Handle Regular Items
                        const isActive = location.pathname.includes(item.path) || (item.id === 'dashboard' && location.pathname === '/admin')
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                                    }`}
                                title={isCollapsed ? item.label : ''}
                            >
                                {isActive && <div className='absolute left-0 w-1 h-5 bg-white rounded-r-full'></div>}
                                <Icon size={18} className={isActive ? 'text-white' : 'text-purple-300 group-hover:text-white'} />
                                {!isCollapsed && <span className='text-sm font-medium'>{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className='pt-4 mt-4 border-t border-purple-800'>
                <button
                    onClick={logOutUser}
                    className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-all duration-200 text-sm font-medium w-full`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut size={18} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    )
}

export default Sidebar
