
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import { useTheme } from 'next-themes';

interface TemperatureWidgetProps {
  data: {
    value: number;
    unit?: string;
    timestamp?: string;
  };
  title: string;
}

export function TemperatureWidget({ data, title }: TemperatureWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Get color based on temperature value
  const getTemperatureColor = (value: number) => {
    if (value < 0) return "text-blue-500";
    if (value < 15) return "text-blue-400";
    if (value < 25) return "text-green-500";
    if (value < 30) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 p-4">
        <CardTitle className="text-sm font-medium flex items-center">
          <Thermometer className="h-4 w-4 mr-2" />
          {title || "Temperatura"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className={`text-2xl font-bold ${getTemperatureColor(data.value)}`}>
              {data.value}
            </span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">{data.unit || "°C"}</span>
          </div>
          {data.timestamp && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(data.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
