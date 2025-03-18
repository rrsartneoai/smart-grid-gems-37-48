
import { Button } from "@/components/ui/button";

interface AnomaliesDisplayProps {
  showAnomalies: boolean;
  setShowAnomalies: (show: boolean) => void;
  anomalies: any[];
}

export function AnomaliesDisplay({ showAnomalies, setShowAnomalies, anomalies }: AnomaliesDisplayProps) {
  if (anomalies.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowAnomalies(!showAnomalies)}
        variant={anomalies.some(a => a.severity === 'high') ? "destructive" : "outline"}
        className="text-xs"
        size="sm"
      >
        {showAnomalies ? "Ukryj anomalie" : `Wykryte anomalie (${anomalies.length})`}
      </Button>

      {showAnomalies && (
        <div className="bg-muted p-3 rounded-md mb-4 text-sm">
          <h4 className="font-medium mb-2">Wykryte anomalie:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {anomalies.map((anomaly, index) => (
              <li key={index} className={`text-xs ${
                anomaly.severity === 'high' ? 'text-destructive' : 
                anomaly.severity === 'medium' ? 'text-amber-500' : 'text-muted-foreground'
              }`}>
                {anomaly.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
