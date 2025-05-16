
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-current border-t-transparent text-primary",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
