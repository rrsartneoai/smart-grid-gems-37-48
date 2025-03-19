
import { useState, useCallback } from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
      const id = Date.now().toString();
      const newToast = { id, title, description, variant, duration };
      
      sonnerToast(title || "", {
        description,
        duration,
      });
      
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

export { sonnerToast as toast };
