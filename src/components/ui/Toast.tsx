import React, { useEffect, useState, createContext, useContext } from 'react';
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from 'lucide-react';
import { Toast, ToastVariant } from '../../types';
interface ToastContextType {
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export function ToastProvider({ children }: {children: ReactNode;}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (
  message: string,
  variant: ToastVariant = 'info',
  duration: number = 3000) =>
  {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [
    ...prev,
    {
      id,
      message,
      variant,
      duration
    }]
    );
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return (
    <ToastContext.Provider
      value={{
        addToast
      }}>
      
      {children}
      <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) =>
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)} />

        )}
      </div>
    </ToastContext.Provider>);

}
function ToastItem({
  toast,
  onRemove



}: {toast: Toast;onRemove: () => void;}) {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    error: <XCircleIcon className="w-5 h-5 text-red-500" />,
    info: <InfoIcon className="w-5 h-5 text-blue-500" />
  };
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg pointer-events-auto max-w-sm w-full animate-in slide-in-from-top-5 fade-in duration-300 ${variants[toast.variant]}`}
      role="alert">
      
      {icons[toast.variant]}
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onRemove}
        className="p-1 rounded-md hover:bg-black/5 transition-colors"
        aria-label="Close">
        
        <XIcon className="w-4 h-4 opacity-50" />
      </button>
    </div>);

}
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}