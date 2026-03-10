import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X, Info } from 'lucide-react';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    message, 
    type = 'success', 
    onConfirm, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    isConfirm = false 
}) => {
    if (!isOpen) return null;

    const icons = {
        success: <CheckCircle2 className="text-emerald-500" size={48} />,
        error: <XCircle className="text-red-500" size={48} />,
        warning: <AlertTriangle className="text-amber-500" size={48} />,
        info: <Info className="text-blue-500" size={48} />
    };

    const colors = {
        success: 'border-emerald-100 bg-emerald-50/30',
        error: 'border-red-100 bg-red-50/30',
        warning: 'border-amber-100 bg-amber-50/30',
        info: 'border-blue-100 bg-blue-50/30'
    };

    const buttonColors = {
        success: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
        error: 'bg-red-600 hover:bg-red-700 shadow-red-200',
        warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
        info: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`w-full max-w-md bg-white rounded-[2.5rem] border ${colors[type]} p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden`}>
                {/* Decorative background element */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-10 ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="mb-6 p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50">
                        {icons[type]}
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
                        {title}
                    </h3>
                    
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        {message}
                    </p>

                    <div className="flex gap-4 w-full">
                        {isConfirm ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-6 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 ${buttonColors[type]}`}
                                >
                                    {confirmText}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className={`w-full px-6 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 ${buttonColors[type]}`}
                            >
                                Dismiss
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
