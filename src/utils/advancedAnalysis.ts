
import { ProjectData } from '@/components/types/ProjectData';

export interface Anomaly {
  message: string;
  severity: 'low' | 'medium' | 'high';
  source: string;
}

// Detects anomalies in project data
export const detectAnomalies = (projectData: ProjectData): Anomaly[] => {
  const anomalies: Anomaly[] = [];
  
  // Check for efficiency anomalies
  if (projectData.efficiency) {
    const efficiencyValues = projectData.efficiency.map(item => item.value);
    const avgEfficiency = efficiencyValues.reduce((sum, val) => sum + val, 0) / efficiencyValues.length;
    
    projectData.efficiency.forEach(item => {
      if (item.value < avgEfficiency * 0.8) {
        anomalies.push({
          message: `Niska wydajność (${item.value}%) w okresie ${item.name}`,
          severity: 'medium',
          source: 'efficiency'
        });
      }
    });
  }
  
  // Check air quality anomalies
  if (projectData.airQuality && projectData.airQuality.historical) {
    const values = projectData.airQuality.historical.map(item => item.value);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    projectData.airQuality.historical.forEach(item => {
      if (item.value > avgValue * 1.5) {
        anomalies.push({
          message: `Wyraźnie podwyższony poziom zanieczyszczeń (${item.value}) w okresie ${item.time}`,
          severity: 'high',
          source: 'air_quality'
        });
      }
    });
  }
  
  // Check for consumption anomalies
  if (projectData.correlation) {
    const consumptionValues = projectData.correlation.map(item => item.consumption);
    const avgConsumption = consumptionValues.reduce((sum, val) => sum + val, 0) / consumptionValues.length;
    
    projectData.correlation.forEach(item => {
      if (item.consumption > avgConsumption * 1.3) {
        anomalies.push({
          message: `Wysokie zużycie energii (${item.consumption}) w okresie ${item.name}`,
          severity: 'medium',
          source: 'consumption'
        });
      }
    });
  }
  
  return anomalies;
};

export interface CorrelationResult {
  message: string;
  factors: Array<{
    factor1: string;
    factor2: string;
    correlationScore: number;
  }>;
}

// Identifies correlations between different data points
export const identifyCorrelations = (projectData: ProjectData): CorrelationResult => {
  const correlations = {
    message: "Analiza korelacji dla projektu",
    factors: [] as Array<{
      factor1: string;
      factor2: string;
      correlationScore: number;
    }>
  };
  
  // Correlation between efficiency and consumption if data exists
  if (projectData.correlation && projectData.correlation.length > 0) {
    const efficiencyValues = projectData.correlation.map(item => item.efficiency);
    const consumptionValues = projectData.correlation.map(item => item.consumption);
    
    const correlation = calculateCorrelation(efficiencyValues, consumptionValues);
    
    correlations.factors.push({
      factor1: "Wydajność",
      factor2: "Zużycie energii",
      correlationScore: correlation
    });
    
    if (correlation < -0.5) {
      correlations.message = "Wykryto silną odwrotną korelację między wydajnością a zużyciem energii - wzrost wydajności przekłada się na spadek zużycia.";
    } else if (correlation > 0.5) {
      correlations.message = "Uwaga: Wykryto dodatnią korelację między wydajnością a zużyciem energii - to może wskazywać na problem.";
    } else {
      correlations.message = "Nie wykryto silnej korelacji między wydajnością a zużyciem energii.";
    }
  }
  
  return correlations;
};

// Helper function to calculate correlation coefficient
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

// Generate recommendations based on project data
export const generateRecommendations = async (projectData: ProjectData): Promise<string[]> => {
  const recommendations: string[] = [];
  
  // Add general recommendations
  recommendations.push("Rozważ instalację monitoringu zużycia energii w czasie rzeczywistym");
  recommendations.push("Wprowadź systematyczne przeglądy i konserwację sprzętu, aby utrzymać optymalną wydajność");
  
  // Add specific recommendations based on data analysis
  if (projectData.airQuality) {
    if (projectData.airQuality.sources.coal > 30) {
      recommendations.push(`Zmniejsz zależność od węgla jako źródła energii (obecnie ${projectData.airQuality.sources.coal}%)`);
    }
    
    if (projectData.airQuality.current > 30) {
      recommendations.push("Wdrażaj bardziej restrykcyjne kontrole jakości powietrza i filtry przemysłowe");
    }
  }
  
  // Check efficiency trends
  if (projectData.efficiency && projectData.efficiency.length >= 2) {
    const lastIndex = projectData.efficiency.length - 1;
    const previousIndex = projectData.efficiency.length - 2;
    
    if (projectData.efficiency[lastIndex].value < projectData.efficiency[previousIndex].value) {
      recommendations.push("Przeprowadź audyt wydajności - wykryto trend spadkowy w ostatnim okresie");
    }
  }
  
  // Check consumption and efficiency correlation
  if (projectData.correlation && projectData.correlation.length > 0) {
    const hasHighConsumption = projectData.correlation.some(item => item.consumption > 110);
    
    if (hasHighConsumption) {
      recommendations.push("Zidentyfikuj i rozwiąż problemy związane z okresami wysokiego zużycia energii");
    }
  }
  
  return recommendations;
};

// Generate forecasts based on historical data
export const generateForecast = (projectData: ProjectData): {
  message: string;
  forecast: Array<{ time: string; value: number }>;
} => {
  let message = "Prognoza na kolejne okresy";
  const forecast: Array<{ time: string; value: number }> = [];
  
  // Generate forecast for air quality if historical data exists
  if (projectData.airQuality && projectData.airQuality.historical && projectData.airQuality.historical.length > 0) {
    const historicalData = projectData.airQuality.historical;
    const lastPeriod = historicalData[historicalData.length - 1];
    
    // Simple forecasting - for a more sophisticated app, you would use more complex algorithms
    const forecastValue = lastPeriod.value * (Math.random() > 0.5 ? 0.95 : 1.05);
    
    // Get next period name
    const periods = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", 
                     "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    
    const lastPeriodIndex = periods.indexOf(lastPeriod.time);
    const nextPeriodIndex = (lastPeriodIndex + 1) % periods.length;
    const nextPeriod = periods[nextPeriodIndex];
    
    forecast.push({ time: nextPeriod, value: forecastValue });
    
    // Add a few more forecasted periods
    for (let i = 1; i <= 3; i++) {
      const nextIndex = (nextPeriodIndex + i) % periods.length;
      const periodName = periods[nextIndex];
      const value = forecast[i-1].value * (Math.random() > 0.5 ? 0.98 : 1.02);
      forecast.push({ time: periodName, value });
    }
    
    // Update message based on trend
    if (forecastValue < lastPeriod.value) {
      message = "Prognoza wskazuje na poprawę jakości powietrza w najbliższych okresach";
    } else {
      message = "Prognoza wskazuje na pogorszenie jakości powietrza w najbliższych okresach";
    }
  } else {
    // Default forecast if no historical data
    const periods = ["Lipiec", "Sierpień", "Wrzesień", "Październik"];
    const baseValue = projectData.airQuality?.current || 20;
    
    periods.forEach((period, index) => {
      forecast.push({
        time: period,
        value: baseValue * (1 + (index - 1.5) * 0.05)
      });
    });
  }
  
  return { message, forecast };
};

// Simulate different scenarios and their impact on air quality and energy usage
export const simulateScenario = (
  projectData: ProjectData, 
  scenario: 'renewable_increase' | 'technology_upgrade' | 'weather_change'
): ProjectData => {
  // Create a deep copy of the project data
  const simulatedData = JSON.parse(JSON.stringify(projectData)) as ProjectData;
  
  switch (scenario) {
    case 'renewable_increase':
      // Simulate 20% increase in renewable energy usage
      if (simulatedData.airQuality) {
        // Reduce coal usage, increase wind and other renewables
        simulatedData.airQuality.sources.coal = Math.max(10, simulatedData.airQuality.sources.coal - 20);
        simulatedData.airQuality.sources.wind += 10;
        simulatedData.airQuality.sources.biomass += 5;
        simulatedData.airQuality.sources.other += 5;
        
        // Improve air quality
        simulatedData.airQuality.current = Math.max(5, simulatedData.airQuality.current * 0.85);
      }
      
      // Improve efficiency
      if (simulatedData.efficiency) {
        simulatedData.efficiency = simulatedData.efficiency.map(item => ({
          ...item,
          value: Math.min(100, item.value * 1.1)
        }));
      }
      break;
      
    case 'technology_upgrade':
      // Simulate technology improvements
      if (simulatedData.efficiency) {
        // Increase efficiency by 15%
        simulatedData.efficiency = simulatedData.efficiency.map(item => ({
          ...item,
          value: Math.min(100, item.value * 1.15)
        }));
      }
      
      // Reduce consumption
      if (simulatedData.correlation) {
        simulatedData.correlation = simulatedData.correlation.map(item => ({
          ...item,
          consumption: item.consumption * 0.8,
          efficiency: Math.min(100, item.efficiency * 1.15)
        }));
      }
      break;
      
    case 'weather_change':
      // Simulate extreme weather conditions
      if (simulatedData.airQuality) {
        // Worsen air quality
        simulatedData.airQuality.current = simulatedData.airQuality.current * 1.3;
      }
      
      // Increase energy consumption due to extreme conditions
      if (simulatedData.correlation) {
        simulatedData.correlation = simulatedData.correlation.map(item => ({
          ...item,
          consumption: item.consumption * 1.25,
          efficiency: item.efficiency * 0.9
        }));
      }
      break;
  }
  
  return simulatedData;
};
