
// Define the toast types to be used across the project
declare module '@/hooks/use-toast' {
  export interface ToastProps {
    id?: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
    duration?: number;
    action?: React.ReactNode;
  }
  
  export function useToast(): {
    toast: (props: ToastProps) => string;
    dismiss: (id: string) => void;
    toasts: ToastProps[];
  };
  
  export const toast: (props: ToastProps) => void;
}
