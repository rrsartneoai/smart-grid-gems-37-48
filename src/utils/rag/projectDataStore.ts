
import { ProjectData as SpacesTabProjectData } from '@/components/tabs/SpacesTab';
import { ProjectData } from '@/components/types/ProjectData';
import { fetchAirQualityData, AirQualityData } from "@/services/airQualityService";

// Store project data for context-enhanced responses
interface AirQualityInfo {
  stations: AirQualityData[];
}

let projectData: ProjectData | null = null;
let airQualityStationsData: AirQualityData[] = [];

export const setProjectData = (data: SpacesTabProjectData) => {
  // Convert SpacesTabProjectData to ProjectData
  projectData = {
    name: data.name,
    efficiency: data.efficiency,
    correlation: data.correlation,
    sensorReadings: data.sensorReadings,
    airQuality: data.airQuality
  };
};

export const getProjectData = (): ProjectData | null => {
  return projectData;
};

// Fetch and store air quality station data
export const fetchAirQualityStations = async (): Promise<AirQualityData[]> => {
  try {
    airQualityStationsData = await fetchAirQualityData();
    return airQualityStationsData;
  } catch (error) {
    console.error("Error fetching air quality stations data:", error);
    return airQualityStationsData;
  }
};

// Get cached air quality stations data
export const getAirQualityStations = (): AirQualityData[] => {
  return airQualityStationsData;
};

// Get specific station data by name or region
export const getStationByName = (name: string): AirQualityData | null => {
  const normalizedQuery = name.toLowerCase();
  
  // Try to find by exact station name match
  const station = airQualityStationsData.find(
    station => station.stationName.toLowerCase().includes(normalizedQuery)
  );
  
  if (station) return station;
  
  // Try to find by region if no station name match
  const regionStation = airQualityStationsData.find(
    station => station.region.toLowerCase().includes(normalizedQuery)
  );
  
  return regionStation || null;
};

export const fetchProjectDataWithAirQuality = async (): Promise<ProjectData | null> => {
  try {
    const airQualityInfo: AirQualityInfo = {
      stations: await fetchAirQualityData(),
    };
    
    if (!projectData) return null;
    
    const averageAqi = airQualityInfo.stations.reduce((sum, station) => sum + station.measurements.aqi, 0) / airQualityInfo.stations.length;
    
    // Create a new object with the updated airQuality property
    const updatedProjectData: ProjectData = {
      ...projectData,
      airQuality: {
        ...(projectData.airQuality || {}),
        current: averageAqi,
        sources: {
          coal: 60,
          wind: 15,
          biomass: 10,
          other: 15,
        },
        // Ensure historical property exists
        historical: projectData.airQuality?.historical || []
      }
    };
    
    // Update the global project data
    projectData = updatedProjectData;
    
    // Update stations data
    airQualityStationsData = airQualityInfo.stations;
    
    return projectData;
  } catch (error) {
    console.error("Error fetching air quality data for project data:", error);
    return projectData; // Return existing project data even if air quality data fails
  }
};
