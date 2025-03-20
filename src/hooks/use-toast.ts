
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
    (props: ToastProps | string) => {
      // Handle the case where props is a string
      if (typeof props === 'string') {
        const id = Date.now().toString();
        const newToast = { id, title: props, duration: 5000 };
        
        sonnerToast(props, { duration: 5000 });
        
        setToasts((toasts) => [...toasts, newToast]);
        return id;
      }
      
      // Handle the case where props is a ToastProps object
      const id = props.id || Date.now().toString();
      const newToast = { ...props, id };
      
      if (props.title && props.description) {
        sonnerToast(props.title, {
          description: props.description,
          duration: props.duration || 5000,
        });
      } else if (props.title) {
        sonnerToast(props.title, {
          duration: props.duration || 5000,
        });
      } else if (props.description) {
        sonnerToast(props.description, {
          duration: props.duration || 5000,
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
