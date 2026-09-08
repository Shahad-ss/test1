import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';
type ToastValue = { message: string; kind: ToastKind } | null;
const ToastContext = createContext<{ notify: (message: string, kind?: ToastKind) => void }>({ notify: () => undefined });

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastValue>(null);
  const notify = useCallback((message: string, kind: ToastKind = 'info') => setToast({ message, kind }), []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  return <ToastContext.Provider value={{ notify }}>
    {children}
    {toast && <div className={`mm-toast ${toast.kind}`} role="status" data-testid="status-toast">
      {toast.kind === 'success' ? <Check size={16} /> : <X size={16} />} {toast.message}
    </div>}
  </ToastContext.Provider>;
};

export const useToast = () => useContext(ToastContext);