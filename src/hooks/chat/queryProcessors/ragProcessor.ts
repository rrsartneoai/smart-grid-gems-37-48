import { SensorResponse } from "@/types/chat";
import { generateRAGResponse, generateReport, getProjectData } from "@/utils/rag";
import { SensorReading, useSensorReadings } from "../useSensorReadings";
import { 
  detectAnomalies, 
  generateForecast, 
  identifyCorrelations, 
  generateRecommendations, 
  simulateScenario 
} from "@/utils/advancedAnalysis";
import { ProjectData } from "@/components/types/ProjectData";
import { toast } from "@/hooks/use-toast";

export const processRagQuery = async (query: string): Promise<SensorResponse> => {
  try {
    // First, check for special query types that require specialized handling
    const queryLower = query.toLowerCase();
    
    // Get sensor readings from useSensorReadings hook
    const { getSensorReadings, getSensorReading } = useSensorReadings();
    const allSensorReadings = getSensorReadings();
    
    // Check if this is a sensor reading query
    const sensorTypes = ["pm2.5", "pm10", "o3", "ozon", "so2", "co", "no2", "caqi", "wilgotność", "wilgotnosc"];
    const isSensorQuery = sensorTypes.some(type => queryLower.includes(type)) || 
                          queryLower.includes("czujnik") || 
                          queryLower.includes("odczyt") ||
                          queryLower.includes("pomiar");
    
    if (isSensorQuery) {
      // ... keep existing code (sensor query handling)
      const matchingSensor = sensorTypes.find(type => queryLower.includes(type));
      
      if (matchingSensor) {
        const sensorReading = getSensorReading(matchingSensor);
        
        if (sensorReading) {
          return {
            text: `Aktualny odczyt dla ${sensorReading.name}: ${sensorReading.value}${sensorReading.unit}. ${sensorReading.description}`,
            visualizations: [
              {
                type: "sensorReading",
                title: `Czujnik ${sensorReading.name}`,
                data: {
                  name: sensorReading.name,
                  value: sensorReading.value.toString(),
                  unit: sensorReading.unit,
                  trend: sensorReading.trend || "stable",
                  description: sensorReading.description || ""
                }
              }
            ]
          };
        }
      }
      
      // If specific sensor not found but user is asking about sensors in general
      if (queryLower.includes("wszystkie") || 
          queryLower.includes("listę") || 
          queryLower.includes("liste") ||
          queryLower.includes("zestawienie")) {
        
        const sensorSummary = allSensorReadings.map(
          s => `${s.name}: ${s.value}${s.unit} (${s.description || s.status})`
        ).join("\n");
        
        return {
          text: `Oto aktualne odczyty ze wszystkich czujników:\n\n${sensorSummary}`,
          visualizations: allSensorReadings.slice(0, 3).map(s => ({
            type: "sensorReading" as const,
            title: `Czujnik ${s.name}`,
            data: {
              name: s.name,
              value: s.value.toString(),
              unit: s.unit,
              trend: s.trend || "stable",
              description: s.description || ""
            }
          }))
        };
      }
    }
    
    // Check for anomaly detection request
    if (queryLower.includes('anomali') || 
        queryLower.includes('wykryj') || 
        queryLower.includes('nietypow')) {
      const projectData = getProjectData();
      if (!projectData) {
        return { 
          text: "Nie mogę wykryć anomalii, ponieważ brak danych projektu. Wygeneruj projekt w sekcji 'Przestrzenie' lub wczytaj dane." 
        };
      }
      
      const anomalies = detectAnomalies(projectData);
      if (anomalies.length === 0) {
        return { text: "Nie wykryto żadnych anomalii w danych projektu." };
      }
      
      const anomalyText = anomalies.map(a => 
        `• ${a.message} (severity: ${a.severity === 'high' ? 'wysoka' : a.severity === 'medium' ? 'średnia' : 'niska'})`
      ).join('\n');
      
      return { 
        text: `Wykryto następujące anomalie w projekcie ${projectData.name || 'Bez nazwy'}:\n\n${anomalyText}` 
      };
    }
    
    // Check for forecast request
    if (queryLower.includes('prognoz') || 
        queryLower.includes('przewidywan') || 
        queryLower.includes('przyszł')) {
      const projectData = getProjectData();
      if (!projectData) {
        return { 
          text: "Nie mogę wygenerować prognozy, ponieważ brak danych projektu. Wygeneruj projekt w sekcji 'Przestrzenie' lub wczytaj dane." 
        };
      }
      
      const forecast = generateForecast(projectData);
      
      return { 
        text: `Prognoza dla projektu ${projectData.name || 'Bez nazwy'}:\n\n${forecast.message}\n\nWartości prognozowane:\n${
          forecast.forecast.map(f => `• ${f.time}: ${f.value.toFixed(1)}`).join('\n')
        }`,
        visualizations: [
          {
            type: "sensorReading",
            title: "Prognoza jakości powietrza",
            data: {
              name: "Prognoza",
              value: forecast.forecast[0].value.toFixed(1),
              unit: "AQI",
              trend: forecast.forecast[0].value < (projectData.airQuality?.current || 0) ? "down" : "up",
              description: forecast.message
            }
          }
        ]
      };
    }
    
    // Check for correlation analysis request
    if (queryLower.includes('korelacj') || 
        queryLower.includes('zależnoś') || 
        queryLower.includes('powiązan')) {
      const projectData = getProjectData();
      if (!projectData) {
        return { 
          text: "Nie mogę przeprowadzić analizy korelacji, ponieważ brak danych projektu. Wygeneruj projekt w sekcji 'Przestrzenie' lub wczytaj dane." 
        };
      }
      
      const correlations = identifyCorrelations(projectData);
      
      return { 
        text: `Analiza korelacji dla projektu ${projectData.name || 'Bez nazwy'}:\n\n${correlations.message}\n\n${
          correlations.factors.length > 0 
            ? `Zidentyfikowane korelacje:\n${correlations.factors.map(f => 
                `• ${f.factor1} vs ${f.factor2}: ${f.correlationScore.toFixed(2)}`
              ).join('\n')}`
            : "Nie zidentyfikowano istotnych korelacji w dostępnych danych."
        }`
      };
    }
    
    // Check for recommendations request
    if (queryLower.includes('rekomendacj') || 
        queryLower.includes('zaleceni') || 
        queryLower.includes('porad') ||
        queryLower.includes('co robić')) {
      const projectData = getProjectData();
      if (!projectData) {
        return { 
          text: "Nie mogę wygenerować rekomendacji, ponieważ brak danych projektu. Wygeneruj projekt w sekcji 'Przestrzenie' lub wczytaj dane." 
        };
      }
      
      const recommendations = await generateRecommendations(projectData);
      
      return { 
        text: `Rekomendacje dla projektu ${projectData.name || 'Bez nazwy'}:\n\n${recommendations.map(r => `• ${r}`).join('\n\n')}`
      };
    }
    
    // Check for scenario simulation request
    if (queryLower.includes('scenariusz') || 
        queryLower.includes('symulacj') || 
        queryLower.includes('co by było gdyby')) {
      const projectData = getProjectData();
      if (!projectData) {
        return { 
          text: "Nie mogę przeprowadzić symulacji, ponieważ brak danych projektu. Wygeneruj projekt w sekcji 'Przestrzenie' lub wczytaj dane." 
        };
      }
      
      let scenario: 'renewable_increase' | 'technology_upgrade' | 'weather_change' = 'renewable_increase';
      
      if (queryLower.includes('pogod') || queryLower.includes('klimat') || queryLower.includes('warunki atmosferyczne')) {
        scenario = 'weather_change';
      } else if (queryLower.includes('technologi') || queryLower.includes('modernizacj') || queryLower.includes('inwestycj')) {
        scenario = 'technology_upgrade';
      }
      
      const simulatedData = simulateScenario(projectData, scenario);
      
      let scenarioName = '';
      switch (scenario) {
        case 'renewable_increase':
          scenarioName = 'zwiększenie udziału energii odnawialnej o 20%';
          break;
        case 'technology_upgrade':
          scenarioName = 'modernizacja technologii';
          break;
        case 'weather_change':
          scenarioName = 'ekstremalne warunki pogodowe';
          break;
      }
      
      return { 
        text: `Symulacja scenariusza: ${scenarioName} dla projektu ${projectData.name || 'Bez nazwy'}:\n\n${
          scenario === 'weather_change' 
            ? `Wpływ na jakość powietrza: pogorszenie o około 30% (z ${projectData.airQuality?.current?.toFixed(1) || '?'} do ${simulatedData.airQuality?.current?.toFixed(1) || '?'})\n\nWpływ na zużycie energii: wzrost o około 25%`
            : scenario === 'technology_upgrade'
              ? `Wpływ na wydajność: poprawa o około 15%\n\nWpływ na zużycie energii: spadek o około 20%`
              : `Wpływ na jakość powietrza: poprawa o około 15% (z ${projectData.airQuality?.current?.toFixed(1) || '?'} do ${simulatedData.airQuality?.current?.toFixed(1) || '?'})\n\nWpływ na źródła energii: spadek udziału węgla z ${projectData.airQuality?.sources.coal || '?'}% do ${simulatedData.airQuality?.sources.coal || '?'}%, wzrost udziału OZE`
        }`
      };
    }
    
    // Check for report generation request
    if (queryLower.includes('raport') || 
        queryLower.includes('sprawozdani') || 
        queryLower.includes('podsumowani')) {
      try {
        const topic = query.replace(/raport|sprawozdanie|podsumowanie|wygeneruj|utwórz|o|na temat/gi, '').trim() || 
                      'jakość powietrza i zużycie energii';
        
        const report = await generateReport(topic);
        return { text: report };
      } catch (reportError) {
        console.error("Błąd generowania raportu:", reportError);
        toast({
          variant: "destructive",
          title: "Błąd generowania raportu",
          description: "Nie udało się wygenerować raportu. Spróbuj ponownie.",
          duration: 5000,
        });
        return { 
          text: "Przepraszam, wystąpił błąd podczas generowania raportu. Proszę sprawdzić, czy klucz API Gemini jest poprawnie skonfigurowany i spróbować ponownie."
        };
      }
    }
    
    // If user is asking about current air quality
    if (queryLower.includes("jakość powietrza") || 
        queryLower.includes("powietrze") || 
        queryLower.includes("poziom zanieczyszczeń")) {
      
      const projectData = getProjectData();
      if (!projectData) {
        return { 
          text: "Nie mam dostępu do danych o jakości powietrza. Sprawdź czy wygenerowano projekt w sekcji 'Przestrzenie'." 
        };
      }
      
      const airQualityIndex = allSensorReadings.find(s => s.name === "Indeks CAQI");
      const pm25 = allSensorReadings.find(s => s.name === "PM2.5");
      const pm10 = allSensorReadings.find(s => s.name === "PM10");
      
      let summary = `Aktualna jakość powietrza: ${projectData.airQuality?.current || 'brak danych'} (`;
      
      if (airQualityIndex) {
        summary += `Indeks CAQI: ${airQualityIndex.value}`;
      }
      
      summary += ").\n\n";
      
      if (pm25 && pm10) {
        summary += `Poziom PM2.5: ${pm25.value}${pm25.unit}\nPoziom PM10: ${pm10.value}${pm10.unit}\n\n`;
      }
      
      summary += `Główne źródła: Węgiel (${projectData.airQuality?.sources.coal || '?'}%), Wiatr (${projectData.airQuality?.sources.wind || '?'}%), Biomasa (${projectData.airQuality?.sources.biomass || '?'}%), Inne (${projectData.airQuality?.sources.other || '?'}%).`;
      
      return {
        text: summary,
        visualizations: [
          {
            type: "sensorReading",
            title: "Jakość powietrza",
            data: {
              name: "Indeks CAQI",
              value: airQualityIndex ? airQualityIndex.value.toString() : (projectData.airQuality?.current || 0).toString(),
              unit: "",
              trend: "stable",
              description: "Ogólna jakość powietrza"
            }
          }
        ]
      };
    }
    
    // Default RAG response for other queries
    try {
      const response = await generateRAGResponse(query);
      return { text: response };
    } catch (ragError) {
      console.error("Błąd generowania odpowiedzi RAG:", ragError);
      toast({
        variant: "destructive",
        title: "Błąd odpowiedzi",
        description: "Nie udało się wygenerować odpowiedzi. Sprawdź konfigurację API.",
        duration: 5000,
      });
      return { 
        text: "Przepraszam, nie mogę teraz odpowiedzieć na to pytanie. Proszę sprawdzić, czy klucz API Gemini jest poprawnie skonfigurowany."
      };
    }
  } catch (error) {
    console.error("Error generating RAG response:", error);
    return { 
      text: "Przepraszam, wystąpił błąd podczas przetwarzania zapytania. Proszę spróbować ponownie."
    };
  }
};
