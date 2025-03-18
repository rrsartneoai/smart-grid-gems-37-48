
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { SensorReading } from "@/hooks/chat/useSensorReadings";

interface SensorReadingsDisplayProps {
  showSensorReadings: boolean;
  setShowSensorReadings: (show: boolean) => void;
  sensorReadings: SensorReading[];
}

export function SensorReadingsDisplay({ showSensorReadings, setShowSensorReadings, sensorReadings }: SensorReadingsDisplayProps) {
  if (sensorReadings.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowSensorReadings(!showSensorReadings)}
        variant="outline"
        className="text-xs"
        size="sm"
      >
        {showSensorReadings ? "Ukryj odczyty czujników" : "Pokaż odczyty czujników"}
      </Button>

      {showSensorReadings && (
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-sm">Aktualne odczyty czujników:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {sensorReadings.map((sensor, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium">{sensor.name}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-1 rounded dark:bg-green-900 dark:text-green-100">
                      {sensor.status}
                    </span>
                  </div>
                  <p className="text-xl font-bold">
                    {sensor.value}
                    <span className="text-xs font-normal ml-1">{sensor.unit}</span>
                  </p>
                  {sensor.trend && (
                    <div className="flex items-center text-xs mt-1">
                      {sensor.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                      ) : sensor.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <Minus className="h-3 w-3 text-gray-500 mr-1" />
                      )}
                      <span className="text-muted-foreground text-xs">{sensor.trendValue || sensor.description}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
