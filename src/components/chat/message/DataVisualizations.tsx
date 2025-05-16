
import { useTheme } from 'next-themes';
import { SensorWidget } from './SensorWidget';
import { TemperatureWidget } from './TemperatureWidget';
import { HumidityWidget } from './HumidityWidget';
import { AirQualityWidget } from './AirQualityWidget';

interface DataVisualizationsProps {
  visualizations: Array<{
    type: "airQuality" | "temperature" | "humidity" | "sensorReading";
    title: string;
    data?: any;
  }>;
}

export function DataVisualizations({ visualizations }: DataVisualizationsProps) {
  const { theme } = useTheme();
  
  if (!visualizations || visualizations.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4 space-y-4">
      {visualizations.map((viz, index) => {
        // Choose the appropriate visualization component based on type
        switch (viz.type) {
          case "airQuality":
            return <AirQualityWidget key={index} data={viz.data} title={viz.title} />;
          case "temperature":
            return <TemperatureWidget key={index} data={viz.data} title={viz.title} />;
          case "humidity":
            return <HumidityWidget key={index} data={viz.data} title={viz.title} />;
          case "sensorReading":
            return <SensorWidget key={index} data={viz.data} title={viz.title} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
