
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiResponse } from '@/lib/gemini';
import { getProjectData, getAirQualityStations, getStationByName } from './projectDataStore';
import { searchRelevantChunks } from './contentSearch';
import { getDocumentChunks } from './documentProcessor';

// Check if the query is related to air quality stations
export const isAirQualityStationQuery = (query: string): boolean => {
  const normalizedQuery = query.toLowerCase();
  return (
    (normalizedQuery.includes('stacj') || normalizedQuery.includes('punkt') || normalizedQuery.includes('czujnik')) &&
    (normalizedQuery.includes('pomiar') || normalizedQuery.includes('jakość') || normalizedQuery.includes('powietrz'))
  );
};

// Process air quality station query and return formatted response
export const processAirQualityStationQuery = (query: string): { text: string, visualizations?: any[] } => {
  const normalizedQuery = query.toLowerCase();
  const stations = getAirQualityStations();
  
  // Check if we have air quality data
  if (stations.length === 0) {
    return {
      text: "Przepraszam, nie mam dostępnych danych o stacjach pomiarowych jakości powietrza. Spróbuj ponownie za chwilę."
    };
  }
  
  // Extract potential station name from query
  const stationNames = stations.map(s => s.stationName.toLowerCase());
  const possibleStationName = stationNames.find(name => normalizedQuery.includes(name));
  
  // Try to extract location names from query
  const locationKeywords = ["gdańsk", "gdynia", "sopot", "wrzeszcz", "przymorze", "oliwa", "śródmieście"];
  const mentionedLocation = locationKeywords.find(loc => normalizedQuery.includes(loc));
  
  // Get station data based on query
  let station = null;
  if (possibleStationName) {
    station = getStationByName(possibleStationName);
  } else if (mentionedLocation) {
    station = getStationByName(mentionedLocation);
  }
  
  // If no specific station is mentioned or found, provide a summary
  if (!station && !mentionedLocation) {
    const stationsList = stations.slice(0, 5).map(s => `- ${s.stationName} (${s.region})`).join('\n');
    return {
      text: `Dostępne stacje pomiarowe jakości powietrza:\n${stationsList}\n\nAby uzyskać szczegółowe dane, zapytaj o konkretną stację, np. "Pokaż dane ze stacji Gdańsk Wrzeszcz".`
    };
  }
  
  // If we have a station, return its data
  if (station) {
    const measurements = station.measurements;
    const aqi = measurements.aqi;
    
    // Determine air quality level
    let qualityLevel = "";
    if (aqi <= 50) qualityLevel = "dobra";
    else if (aqi <= 100) qualityLevel = "umiarkowana";
    else if (aqi <= 150) qualityLevel = "niezdrowa dla osób wrażliwych";
    else if (aqi <= 200) qualityLevel = "niezdrowa";
    else if (aqi <= 300) qualityLevel = "bardzo niezdrowa";
    else qualityLevel = "niebezpieczna";
    
    // Format timestamp
    const timestamp = new Date(measurements.timestamp).toLocaleString('pl-PL');
    
    // Create visualization data
    const visualizationData = {
      stationName: station.stationName,
      region: station.region,
      timestamp: measurements.timestamp,
      measurements: {
        aqi: measurements.aqi,
        pm25: measurements.pm25,
        pm10: measurements.pm10,
        temperature: measurements.temperature,
        humidity: measurements.humidity
      }
    };
    
    return {
      text: `Dane ze stacji pomiarowej ${station.stationName} (${station.region}):\n\nIndeks jakości powietrza (AQI): ${aqi} - jakość ${qualityLevel}\nPM2.5: ${measurements.pm25} μg/m³\nPM10: ${measurements.pm10} μg/m³${measurements.temperature ? `\nTemperatura: ${measurements.temperature}°C` : ''}${measurements.humidity ? `\nWilgotność: ${measurements.humidity}%` : ''}\n\nOstatnia aktualizacja: ${timestamp}`,
      visualizations: [
        {
          type: "airQuality",
          title: `Stacja pomiarowa: ${station.stationName}`,
          data: visualizationData
        }
      ]
    };
  }
  
  // If we have a location but no specific station, try to find stations in that location
  const locationStations = stations.filter(s => 
    s.stationName.toLowerCase().includes(mentionedLocation!) || 
    s.region.toLowerCase().includes(mentionedLocation!)
  );
  
  if (locationStations.length > 0) {
    // Take the first station as primary
    const primaryStation = locationStations[0];
    const measurements = primaryStation.measurements;
    
    // Create visualization data for the primary station
    const visualizationData = {
      stationName: primaryStation.stationName,
      region: primaryStation.region,
      timestamp: measurements.timestamp,
      measurements: {
        aqi: measurements.aqi,
        pm25: measurements.pm25,
        pm10: measurements.pm10,
        temperature: measurements.temperature,
        humidity: measurements.humidity
      }
    };
    
    // List other stations in the area
    let otherStationsText = "";
    if (locationStations.length > 1) {
      const otherStationsList = locationStations.slice(1, 4).map(s => `- ${s.stationName}`).join('\n');
      otherStationsText = `\n\nInne stacje w okolicy:\n${otherStationsList}`;
    }
    
    return {
      text: `Dane ze stacji pomiarowej ${primaryStation.stationName} (${primaryStation.region}):\n\nIndeks jakości powietrza (AQI): ${measurements.aqi}\nPM2.5: ${measurements.pm25} μg/m³\nPM10: ${measurements.pm10} μg/m³${measurements.temperature ? `\nTemperatura: ${measurements.temperature}°C` : ''}${measurements.humidity ? `\nWilgotność: ${measurements.humidity}%` : ''}${otherStationsText}`,
      visualizations: [
        {
          type: "airQuality",
          title: `Stacja pomiarowa: ${primaryStation.stationName}`,
          data: visualizationData
        }
      ]
    };
  }
  
  // If we couldn't find a matching station
  return {
    text: "Nie znalazłem stacji pomiarowej odpowiadającej Twojemu zapytaniu. Dostępne stacje to:\n" + 
          stations.slice(0, 5).map(s => `- ${s.stationName} (${s.region})`).join('\n')
  };
};

export const generateRAGResponse = async (query: string): Promise<string> => {
  console.log('Generuję odpowiedź dla zapytania:', query);

  // Check if this is an air quality station query
  if (isAirQualityStationQuery(query)) {
    const response = processAirQualityStationQuery(query);
    return response.text;
  }

  const isAirQualityRelated = query.toLowerCase().includes('powietrz') || 
                             query.toLowerCase().includes('pm') ||
                             query.toLowerCase().includes('zanieczyszcz');
                             
  const isEnergyRelated = query.toLowerCase().includes('energi') ||
                          query.toLowerCase().includes('zużyci') ||
                          query.toLowerCase().includes('wydajnoś');
                          
  const isDataAnalysisQuery = query.toLowerCase().includes('analiz') ||
                              query.toLowerCase().includes('dane') ||
                              query.toLowerCase().includes('korelacj') ||
                              query.toLowerCase().includes('prognoz') ||
                              query.toLowerCase().includes('anomali');

  // Add project data context if available and relevant
  let projectContext = '';
  const projectData = getProjectData();
  if (projectData && (isAirQualityRelated || isEnergyRelated || isDataAnalysisQuery)) {
    projectContext = `
      Kontekst projektu:
      Nazwa projektu: ${projectData.name || 'Projekt'}
      Aktualna jakość powietrza: ${projectData.airQuality?.current || 'brak danych'}
      Źródła energii: ${projectData.airQuality ? JSON.stringify(projectData.airQuality.sources) : 'brak danych'}
      Średnia wydajność: ${projectData.efficiency ? 
        (projectData.efficiency.reduce((sum, item) => sum + item.value, 0) / projectData.efficiency.length).toFixed(1) + '%' : 
        'Brak danych'}
    `;
  }

  const documentChunks = getDocumentChunks();
  if (documentChunks.length === 0) {
    console.log('Brak dokumentów w pamięci');
    
    // Even without documents, try to provide a meaningful response
    const enhancedPrompt = `Odpowiedz na pytanie: ${query}. 
      ${isAirQualityRelated ? 'Skup się na informacjach dotyczących wpływu na zdrowie i zalecanych działaniach profilaktycznych.' : ''}
      ${isEnergyRelated ? 'Uwzględnij informacje o efektywności energetycznej i możliwościach redukcji zużycia.' : ''}
      ${isDataAnalysisQuery ? 'Uwzględnij metody analizy danych i wykrywania wzorców.' : ''}
      ${projectContext}
      Odpowiedz w sposób przyjazny i pomocny.`;
    
    return getGeminiResponse(enhancedPrompt);
  }

  const relevantChunks = searchRelevantChunks(query);
  
  if (relevantChunks.length === 0) {
    console.log('Nie znaleziono pasujących fragmentów');
    
    // If no relevant chunks found, still try to provide a helpful response
    const enhancedPrompt = `Odpowiedz na pytanie: ${query}. 
      ${isAirQualityRelated ? 'Uwzględnij wpływ na zdrowie i zalecane działania profilaktyczne.' : ''}
      ${isEnergyRelated ? 'Uwzględnij informacje o efektywności energetycznej i możliwościach redukcji zużycia.' : ''}
      ${isDataAnalysisQuery ? 'Uwzględnij metody analizy danych i wykrywania wzorców.' : ''}
      ${projectContext}
      Odpowiedz w sposób przyjazny i pomocny.`;
    
    return getGeminiResponse(enhancedPrompt);
  }

  const context = relevantChunks.join('\n\n');
  const prompt = `Na podstawie poniższego kontekstu, ${query === 'podsumuj' ? 'przedstaw krótkie podsumowanie głównych punktów dokumentu' : 'odpowiedz na pytanie'}. 
  ${isAirQualityRelated ? 'Zwróć szczególną uwagę na informacje dotyczące jakości powietrza i ich wpływu na zdrowie.' : ''}
  ${isEnergyRelated ? 'Zwróć szczególną uwagę na informacje o efektywności energetycznej i sposobach redukcji zużycia.' : ''}
  ${isDataAnalysisQuery ? 'Zwróć szczególną uwagę na metody analizy danych, wykrywania wzorców i korelacji.' : ''}
  Jeśli odpowiedź nie znajduje się w kontekście, powiedz, że nie masz tej informacji, ale spróbuj pomóc na podstawie swojej ogólnej wiedzy.

  ${projectContext}

  Kontekst:
  ${context}

  ${query === 'podsumuj' ? 'Podsumuj najważniejsze informacje z dokumentu.' : `Pytanie: ${query}`}`;

  console.log('Wysyłam zapytanie do Gemini z kontekstem długości:', context.length);
  return getGeminiResponse(prompt);
};
