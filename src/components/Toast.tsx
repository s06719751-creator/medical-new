import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const getConfig = () => {
    switch (message.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
          border: 'border-rose-500/30',
          bg: 'bg-rose-950/20'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-cyan-400" />,
          border: 'border-cyan-500/30',
          bg: 'bg-cyan-950/20'
        };
    }
  };

  const config = getConfig();

  return (
    <div className="fixed bottom-6 left-6 z-[9999] animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)] max-w-sm">
      <div className={`glass-panel-heavy rounded-xl p-4 border ${config.border} ${config.bg} flex items-start gap-3 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5)]`}>
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-slate-100">{message.text}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
