
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SpacesHeaderProps {
  onGenerateProject: () => void;
  onExport: (format: 'pdf' | 'jpg') => void;
}

export function SpacesHeader({ onGenerateProject, onExport }: SpacesHeaderProps) {
  return (
    <div className="flex justify-between gap-2 mb-4">
      <Button
        variant="default"
        onClick={onGenerateProject}
        className="bg-primary text-primary-foreground"
      >
        Generuj nowy projekt
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onExport('jpg')}
        >
          Eksportuj do JPG
        </Button>
        <Button
          variant="outline"
          onClick={() => onExport('pdf')}
        >
          Eksportuj do PDF
        </Button>
      </div>
    </div>
  );
}
