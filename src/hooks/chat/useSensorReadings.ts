
import { ProjectData } from "@/components/tabs/SpacesTab";
import { getProjectData } from "@/utils/rag"; // Updated import path

export interface SensorReading {
  name: string;
  value: number;
  unit: string;
  status: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  description?: string;
}

export const useSensorReadings = () => {
  const getSensorReadings = (): SensorReading[] => {
    const projectData = getProjectData();
    if (!projectData) return [];

    // Generate mock sensor readings based on project data
    // In a real app, these would come from actual sensors
    return [
      {
        name: "PM2.5",
        value: parseFloat((Math.random() * 15).toFixed(1)),
        unit: "µg/m³",
        status: "Good",
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: `${(Math.random() * 3).toFixed(1)}% od ostatniego pomiaru`,
        description: "Dobry poziom"
      },
      {
        name: "PM10",
        value: parseFloat((Math.random() * 30 + 5).toFixed(1)),
        unit: "µg/m³",
        status: "Good",
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: `${(Math.random() * 3).toFixed(1)}% od ostatniej godziny`,
        description: "Dobry poziom"
      },
      {
        name: "O₃",
        value: parseFloat((Math.random() * 120 + 70).toFixed(1)),
        unit: "µg/m³",
        status: "Good",
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: `${(Math.random() * 3).toFixed(1)}% od ostatniego odczytu`,
        description: "Dobry poziom ozonu"
      },
      {
        name: "NO₂",
        value: parseFloat((Math.random() * 40).toFixed(1)),
        unit: "µg/m³",
        status: "Good",
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: `${(Math.random() * 2).toFixed(1)}% od ostatniej godziny`,
        description: "Dobry poziom dwutlenku azotu"
      },
      {
        name: "SO₂",
        value: parseFloat((Math.random() * 30).toFixed(1)),
        unit: "µg/m³",
        status: "Good",
        trend: 'stable',
        trendValue: "Stabilny poziom",
        description: "Stabilny poziom dwutlenku siarki"
      },
      {
        name: "CO",
        value: Math.floor(Math.random() * 3000 + 1000),
        unit: "µg/m³",
        status: "Good",
        trend: 'stable',
        trendValue: "Dobry poziom",
        description: "Dobry poziom tlenku węgla"
      },
      {
        name: "Indeks CAQI",
        value: parseFloat((Math.random() * 40 + 10).toFixed(1)),
        unit: "",
        status: "Good",
        trend: 'stable',
        trendValue: "",
        description: "Dobra jakość powietrza"
      },
      {
        name: "Wilgotność",
        value: parseFloat((Math.random() * 25 + 45).toFixed(1)),
        unit: "%",
        status: "Good",
        trend: 'stable',
        trendValue: "",
        description: "Optymalna wilgotność"
      }
    ];
  };

  const getSensorReading = (sensorName: string): SensorReading | null => {
    const readings = getSensorReadings();
    const reading = readings.find(r => 
      r.name.toLowerCase() === sensorName.toLowerCase() ||
      r.name.toLowerCase().includes(sensorName.toLowerCase())
    );
    return reading || null;
  };

  return {
    getSensorReadings,
    getSensorReading
  };
};
