
import { useState, useCallback } from "react";
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
      const id = Date.now().toString();
      const newToast = { id, title, description, variant, duration };
      
      if (title && description) {
        sonnerToast(title, {
          description,
          duration,
        });
      } else if (title) {
        sonnerToast(title, {
          duration,
        });
      } else if (description) {
        sonnerToast(description, {
          duration,
        });
      }
      
      setToasts((toasts) => [...toasts, newToast]);
      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  return { toast, dismiss, toasts };
}

// Export a simpler version for direct use
export const toast = (message: string | ToastProps) => {
  if (typeof message === 'string') {
    return sonnerToast(message);
  } else {
    const { title, description, duration } = message;
    if (title && description) {
      return sonnerToast(title, { description, duration });
    } else if (title) {
      return sonnerToast(title, { duration });
    } else if (description) {
      return sonnerToast(description, { duration });
    }
  }
};
