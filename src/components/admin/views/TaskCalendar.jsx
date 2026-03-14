import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Target } from 'lucide-react';

const TaskCalendar = ({ tasks = [], onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);
    
    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        // Pad empty days at the start
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Add actual days
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(year, month, i));
        }
        setDaysInMonth(days);
    }, [currentDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        const sel = new Date(selectedDate);
        return date.getDate() === sel.getDate() && 
               date.getMonth() === sel.getMonth() && 
               date.getFullYear() === sel.getFullYear();
    };

    const getTasksForDate = (date) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return tasks.filter(t => (t.date || t.taskDate) === dateStr);
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-700">
            {/* Calendar Header */}
            <div className="bg-purple-900 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black tracking-tight">{monthName} {year}</h3>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Strategic Mission Timeline</p>
            </div>

            {/* Calendar Grid */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                            {day}
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((date, idx) => {
                        const dayTasks = getTasksForDate(date);
                        const hasTasks = dayTasks.length > 0;
                        const active = isSelected(date);
                        const today = isToday(date);

                        return (
                            <div 
                                key={idx} 
                                onClick={() => date && onDateSelect(date.toISOString().split('T')[0])}
                                className={`
                                    min-h-[80px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1
                                    ${!date ? 'border-transparent bg-transparent cursor-default' : 
                                      active ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100' : 
                                      today ? 'border-purple-200 bg-slate-50' : 'border-slate-50 hover:border-purple-200 hover:bg-slate-50'}
                                `}
                            >
                                {date && (
                                    <>
                                        <span className={`text-xs font-black ${today ? 'text-purple-600' : 'text-slate-400'}`}>
                                            {date.getDate()}
                                        </span>
                                        <div className="flex flex-col gap-1 mt-auto">
                                            {dayTasks.map((t, i) => (
                                                <div key={i} className="w-full h-1.5 rounded-full bg-purple-500" title={t.taskTitle} />
                                            ))}
                                            {hasTasks && dayTasks.length > 2 && (
                                                <span className="text-[8px] font-black text-purple-400">+{dayTasks.length - 2} MORE</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Selected Date Tasks */}
            {selectedDate && (
                <div className="p-6 bg-slate-50 border-t border-gray-100 max-h-[250px] overflow-y-auto">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Target size={12} className="text-purple-600" /> Objectives on {selectedDate}
                    </h4>
                    <div className="space-y-3">
                        {getTasksForDate(new Date(selectedDate)).length === 0 ? (
                            <p className="text-xs font-bold text-slate-400 italic">No tactical missions assigned for this date.</p>
                        ) : (
                            getTasksForDate(new Date(selectedDate)).map((t, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3 group hover:border-purple-200 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                        <Target size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-slate-800 truncate">{t.taskTitle}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-bold text-purple-500 uppercase">{t.assignTo || t.employeeName}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{t.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCalendar;
