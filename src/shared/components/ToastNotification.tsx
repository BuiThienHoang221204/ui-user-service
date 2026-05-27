import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bg: 'bg-slate-900/90 border-green-500/30 text-green-400',
      icon: <CheckCircle2 className="text-green-400 shrink-0" size={18} />,
      progress: 'bg-green-500',
    },
    error: {
      bg: 'bg-slate-900/90 border-red-500/30 text-red-400',
      icon: <AlertTriangle className="text-red-400 shrink-0" size={18} />,
      progress: 'bg-red-500',
    },
    info: {
      bg: 'bg-slate-900/90 border-violet-500/30 text-violet-400',
      icon: <Info className="text-violet-400 shrink-0" size={18} />,
      progress: 'bg-violet-500',
    },
  };

  const current = config[type];

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex flex-col overflow-hidden rounded-xl border ${current.bg} shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-in min-w-[300px] max-w-sm`}>
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3">
          {current.icon}
          <span className="text-sm font-medium text-slate-100">{message}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-slate-800"
        >
          <X size={16} />
        </button>
      </div>
      <div className="h-1 w-full bg-slate-800">
        <div 
          className={`h-full ${current.progress} transition-all duration-300 animate-toast-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};
