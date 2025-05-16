
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, Thermometer, Droplets } from "lucide-react";

interface AirQualityWidgetProps {
  data: {
    stationName: string;
    region: string;
    timestamp: string;
    measurements: {
      aqi: number;
      pm25: number;
      pm10: number;
      temperature?: number;
      humidity?: number;
    }
  };
  title: string;
}

export function AirQualityWidget({ data, title }: AirQualityWidgetProps) {
  if (!data) return null;
  
  // Format timestamp
  const timestamp = new Date(data.timestamp);
  const formattedTime = format(timestamp, "HH:mm, dd MMM yyyy", { locale: pl });
  
  // Get AQI color and label
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500 text-white";
    if (aqi <= 100) return "bg-yellow-500 text-black";
    if (aqi <= 150) return "bg-orange-500 text-white";
    if (aqi <= 200) return "bg-red-500 text-white";
    if (aqi <= 300) return "bg-purple-500 text-white";
    return "bg-purple-900 text-white";
  };
  
  const getAqiLabel = (aqi: number) => {
    if (aqi <= 50) return "Dobra";
    if (aqi <= 100) return "Umiarkowana";
    if (aqi <= 150) return "Niezdrowa dla wrażliwych osób";
    if (aqi <= 200) return "Niezdrowa";
    if (aqi <= 300) return "Bardzo niezdrowa";
    return "Niebezpieczna";
  };
  
  return (
    <Card className="w-full max-w-[500px] shadow-lg border-2 border-muted">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{data.stationName}</CardTitle>
            <CardDescription>{data.region} • {formattedTime}</CardDescription>
          </div>
          <Badge variant="outline" className={`text-sm font-semibold ${getAqiColor(data.measurements.aqi)} ml-2`}>
            AQI: {data.measurements.aqi}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col p-3 bg-muted rounded-lg">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Badge variant="secondary" className="mr-2">PM2.5</Badge>
                <span>Pył zawieszony drobny</span>
              </div>
              <div className="text-xl font-semibold">{data.measurements.pm25} <span className="text-sm font-normal">µg/m³</span></div>
            </div>
            
            <div className="flex flex-col p-3 bg-muted rounded-lg">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Badge variant="secondary" className="mr-2">PM10</Badge>
                <span>Pył zawieszony</span>
              </div>
              <div className="text-xl font-semibold">{data.measurements.pm10} <span className="text-sm font-normal">µg/m³</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {data.measurements.temperature !== undefined && (
              <div className="flex items-center p-3 rounded-lg border">
                <Thermometer className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Temperatura</div>
                  <div className="font-semibold">{data.measurements.temperature}°C</div>
                </div>
              </div>
            )}
            
            {data.measurements.humidity !== undefined && (
              <div className="flex items-center p-3 rounded-lg border">
                <Droplets className="h-5 w-5 mr-2 text-blue-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Wilgotność</div>
                  <div className="font-semibold">{data.measurements.humidity}%</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center">
              <Wind className="h-5 w-5 mr-2 text-primary" />
              <div className="text-sm font-medium">Jakość powietrza: {getAqiLabel(data.measurements.aqi)}</div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {data.measurements.aqi <= 50 
                ? "Jakość powietrza jest dobra. Możesz bezpiecznie przebywać na zewnątrz."
                : data.measurements.aqi <= 100
                ? "Jakość powietrza jest akceptowalna. Osoby wrażliwe mogą odczuwać dyskomfort."
                : data.measurements.aqi <= 150
                ? "Osoby wrażliwe (dzieci, seniorzy, osoby z chorobami układu oddechowego) powinny ograniczyć wysiłek na zewnątrz."
                : "Jakość powietrza jest zła. Ogranicz czas spędzany na zewnątrz."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
