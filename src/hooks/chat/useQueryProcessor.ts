
import { SensorResponse } from "@/types/chat";
import { isMapDataQuery, processMapDataQuery, getAvailableStations } from "./queryProcessors/mapDataProcessor";
import { isSensorRelatedQuery, processSensorRelatedQuery, processLocalAirQualityData } from "./queryProcessors/sensorProcessor";
import { processRagQuery } from "./queryProcessors/ragProcessor";
import { getProjectData } from "@/utils/rag"; 
import { useSensorReadings } from "./useSensorReadings";
import { isAirQualityStationQuery, processStationDataQuery } from "./queryProcessors/stationDataProcessor";

export const useQueryProcessor = () => {
  const processQuery = async (input: string): Promise<SensorResponse> => {
    // Check for project data queries first as they take precedence
    const projectData = getProjectData();
    const queryLower = input.toLowerCase();
    
    const isProjectAnalysisQuery = queryLower.includes('projekt') || 
                                  queryLower.includes('analiz') ||
                                  queryLower.includes('dane projektowe') ||
                                  queryLower.includes('raport');
    
    // Check if it's a sensor reading query from the project
    const isSensorReadingQuery = queryLower.includes('pm') || 
                               queryLower.includes('czujnik') ||
                               queryLower.includes('odczyt') ||
                               queryLower.includes('pomiar') ||
                               queryLower.includes('o3') ||
                               queryLower.includes('ozon') ||
                               queryLower.includes('no2') ||
                               queryLower.includes('so2') ||
                               queryLower.includes('co') ||
                               queryLower.includes('caqi') ||
                               queryLower.includes('wilgotność') ||
                               queryLower.includes('wilgotnosc');
    
    // Check if it's a station data query - this is the new part
    if (isAirQualityStationQuery(input)) {
      console.log("Processing air quality station query:", input);
      return processStationDataQuery(input);
    }
    
    // If it's a project-related query and project data exists, process it with RAG
    if ((isProjectAnalysisQuery || isSensorReadingQuery) && projectData) {
      console.log("Processing project analysis or sensor query with RAG:", input);
      return processRagQuery(input);
    }
    
    // Handle map data queries
    if (isMapDataQuery(input)) {
      // If asking for list of stations
      if (input.toLowerCase().includes("lista stacji") || 
          input.toLowerCase().includes("dostępne stacje") ||
          input.toLowerCase().includes("jakie stacje") ||
          input.toLowerCase().includes("pokaż stacje")) {
        return getAvailableStations();
      }
      
      try {
        console.log("Processing map data query:", input);
        const mapDataResponse = await processMapDataQuery(input);
        return mapDataResponse;
      } catch (error) {
        console.error("Error processing map data query:", error);
        return {
          text: "Wystąpił błąd podczas przetwarzania zapytania o dane z mapy. Spróbuj zapytać inaczej lub o inną stację."
        };
      }
    }
    
    // Check if it's a sensor-related query
    if (isSensorRelatedQuery(input)) {
      return await processSensorRelatedQuery(input);
    }
    
    // Then check if we have local air quality data
    const localData = processLocalAirQualityData(input);
    if (localData.text !== "Nie znalazłem tej informacji w dostępnych danych.") {
      return localData;
    }
    
    // Advanced analysis queries should be processed with RAG
    if (queryLower.includes('anomali') || 
        queryLower.includes('korelacj') || 
        queryLower.includes('prognoz') || 
        queryLower.includes('scenariusz') ||
        queryLower.includes('symulacj') ||
        queryLower.includes('rekomendacj') ||
        queryLower.includes('zaleceni')) {
      return await processRagQuery(input);
    }
    
    // Finally, fall back to RAG response
    return await processRagQuery(input);
  };

  return { processQuery };
};
