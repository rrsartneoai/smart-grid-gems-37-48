
import { SensorReading } from '@/hooks/chat/useSensorReadings';

export interface ProjectData {
  name: string;
  efficiency: Array<{ name: string; value: number; forecastValue?: number }>;
  correlation: Array<{ name: string; consumption: number; efficiency: number }>;
  sensorReadings?: SensorReading[];
  airQuality?: {
    current: number;
    historical?: Array<{ time: string; value: number; forecastValue?: number }>;
    sources: {
      coal: number;
      wind: number;
      biomass: number;
      other: number;
    };
  };
}
