
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SensorData } from "../types/sensors";

interface RemoveSensorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (sensorId: string) => void;
  sensors?: SensorData[];
}

export function RemoveSensorDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  sensors = []
}: RemoveSensorDialogProps) {
  const [selectedSensorId, setSelectedSensorId] = useState<string>("");

  const handleSubmit = () => {
    if (selectedSensorId) {
      onSubmit(selectedSensorId);
      setSelectedSensorId("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] z-[9999]">
        <DialogHeader>
          <DialogTitle>Usuń czujnik</DialogTitle>
          <DialogDescription>
            Wybierz czujnik, który chcesz usunąć z mapy.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {sensors.length === 0 ? (
            <p className="text-center text-muted-foreground">Brak dodanych czujników</p>
          ) : (
            <div className="space-y-2">
              {sensors.map((sensor) => (
                <div 
                  key={sensor.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedSensorId === sensor.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedSensorId(sensor.id)}
                >
                  <h4 className="font-medium">{sensor.stationName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Region: {sensor.region}, AQI: {sensor.additionalData?.aqi || 'N/A'}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Dodano: {new Date(sensor.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              setSelectedSensorId("");
            }}
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedSensorId || sensors.length === 0}
          >
            Usuń
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
