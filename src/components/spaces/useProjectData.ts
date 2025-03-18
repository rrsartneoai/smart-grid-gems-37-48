
import { useState, useEffect } from 'react';
import { ProjectData } from '@/components/types/ProjectData';
import { useToast } from "@/hooks/use-toast";
import { setProjectData as setGlobalProjectData } from "@/utils/rag";
import { useCompanyStore } from "@/components/CompanySidebar";
import { SensorReading } from '@/hooks/chat/useSensorReadings';

export function useProjectData() {
  const { toast } = useToast();
  const { selectedCompanyId, setSelectedCompanyId } = useCompanyStore();

  const [projectData, setProjectDataState] = useState<ProjectData>({
    name: "Projekt Trójmiasto",
    airQuality: {
      historical: [
        { time: "Styczeń", value: 25, forecastValue: 22 },
        { time: "Luty", value: 28, forecastValue: 26 },
        { time: "Marzec", value: 32, forecastValue: 30 },
        { time: "Kwiecień", value: 22, forecastValue: 21 },
        { time: "Maj", value: 18, forecastValue: 17 },
        { time: "Czerwiec", value: 15, forecastValue: 14 }
      ],
      current: 22,
      sources: {
        coal: 30,
        wind: 25,
        biomass: 20,
        other: 25
      }
    },
    efficiency: [
      { name: "Styczeń", value: 65 },
      { name: "Luty", value: 68 },
      { name: "Marzec", value: 72 },
      { name: "Kwiecień", value: 78 },
      { name: "Maj", value: 82 },
      { name: "Czerwiec", value: 85 }
    ],
    correlation: [
      { name: "Styczeń", consumption: 120, efficiency: 65 },
      { name: "Luty", consumption: 115, efficiency: 68 },
      { name: "Marzec", consumption: 118, efficiency: 72 },
      { name: "Kwiecień", consumption: 110, efficiency: 78 },
      { name: "Maj", consumption: 105, efficiency: 82 },
      { name: "Czerwiec", consumption: 100, efficiency: 85 }
    ],
    sensorReadings: []
  });
  
  // Update the global project data state whenever the local state changes
  useEffect(() => {
    // Make the project data available to the RAG system
    setGlobalProjectData(projectData);
  }, [projectData]);

  // Generate sensor readings
  const generateSensorReadings = (): SensorReading[] => {
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

  // Generowanie danych dla projektu
  const generateProjectData = () => {
    const newData: ProjectData = {
      name: "Nowy Projekt " + Math.floor(Math.random() * 100),
      airQuality: {
        historical: Array.from({ length: 6 }, (_, i) => ({
          time: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec"][i],
          value: Math.floor(Math.random() * 30) + 10,
          forecastValue: Math.floor(Math.random() * 30) + 10
        })),
        current: Math.floor(Math.random() * 30) + 10,
        sources: {
          coal: Math.floor(Math.random() * 40) + 10,
          wind: Math.floor(Math.random() * 40) + 10,
          biomass: Math.floor(Math.random() * 30) + 10,
          other: Math.floor(Math.random() * 30) + 10
        }
      },
      efficiency: Array.from({ length: 6 }, (_, i) => ({
        name: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec"][i],
        value: Math.floor(Math.random() * 30) + 60
      })),
      correlation: Array.from({ length: 6 }, (_, i) => ({
        name: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec"][i],
        consumption: Math.floor(Math.random() * 50) + 90,
        efficiency: Math.floor(Math.random() * 30) + 60
      })),
      sensorReadings: generateSensorReadings()
    };
    
    setProjectDataState(newData);
    // Update global project data for RAG
    setGlobalProjectData(newData);
    // Przekaż dane do globalnego stanu projektu
    setSelectedCompanyId(newData.name);

    toast({
      title: "Wygenerowano nowy projekt",
      description: `Utworzono projekt: ${newData.name}`,
    });
  };

  return { 
    projectData, 
    setProjectDataState, 
    generateProjectData 
  };
}
