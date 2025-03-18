
import { SensorReading } from "@/hooks/chat/useSensorReadings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface SensorReadingsPanelProps {
  readings: SensorReading[];
}

export function SensorReadingsPanel({ readings }: SensorReadingsPanelProps) {
  if (!readings || readings.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Odczyty Czujników</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Brak danych z czujników</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Odczyty Czujników</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {readings.map((reading, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{reading.name}</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">
                    {reading.status}
                  </span>
                </div>

                <div className="text-3xl font-bold mb-1">
                  {reading.value}
                  <span className="text-base font-normal ml-1">{reading.unit}</span>
                </div>

                {reading.trend && (
                  <div className="flex items-center text-sm">
                    {reading.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : reading.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-500 mr-1" />
                    )}
                    <span className="text-muted-foreground">{reading.trendValue || reading.description}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
