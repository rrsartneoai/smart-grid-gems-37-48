
import { getStationsInBounds } from './services/waqiService';
import { getPowerStats } from '../services/powerStatsService';

export async function generateResponse(query: string) {
  if (query.includes('Lista wszystkich stacji pomiarowych')) {
    try {
      // Default coordinates for Poland (Warsaw)
      const defaultLat = 52.2297;
      const defaultLng = 21.0122;
      
      const stations = await getStationsInBounds(defaultLat, defaultLng);
      
      if (!stations || stations.length === 0) {
        return "Aktualnie nie znaleziono żadnych stacji pomiarowych w okolicy.";
      }

      const stationsList = stations
        .map(station => `- Stacja ${station.station.name}:\n  • AQI: ${station.aqi}\n  • Lokalizacja: ${station.station.geo[0]}, ${station.station.geo[1]}`)
        .join('\n\n');

      return `Znalezione stacje pomiarowe w okolicy:\n\n${stationsList}`;
    } catch (error) {
      console.error('Error fetching stations:', error);
      return "Wystąpił błąd podczas pobierania danych o stacjach pomiarowych. Proszę spróbować później.";
    }
  }
  
  // New report generation handling
  if (query.includes('Wygeneruj raport')) {
    try {
      const airQualityData = await generateAirQualitySection();
      const powerStatsData = await generatePowerStatsSection();
      
      const report = `**Raport: Aktualny Stan Jakości Powietrza - Projekt PP**

**1. Wprowadzenie**
Niniejszy raport przedstawia aktualną analizę jakości powietrza w ramach Projektu PP.

**2. Analiza Danych**

**2.1. Jakość Powietrza (PM2.5):**
${powerStatsData}

**2.2. Dane ze stacji pomiarowych:**
${airQualityData}

**2.3. Interpretacja Wyników:**
${generateAirQualityInterpretation()}

**3. Wnioski i Rekomendacje**
${generateRecommendations()}`;

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      return "Wystąpił błąd podczas generowania raportu. Proszę spróbować później.";
    }
  }
  
  return null;
}

async function generatePowerStatsSection() {
  try {
    const stats = await getPowerStats();
    
    return `**Aktualne stężenie PM2.5:**
* Wartość: ${stats.pm25} µg/m³
* Status: ${stats.status}
* Interpretacja: ${getInterpretation(stats.pm25, stats.status)}`;
  } catch (error) {
    return "Nie udało się pobrać aktualnych danych o stężeniu PM2.5.";
  }
}

function getInterpretation(pm25: number, status: string): string {
  if (pm25 <= 12) {
    return "Bardzo niskie stężenie, bezpieczne dla zdrowia";
  } else if (pm25 <= 35) {
    return "Umiarkowane stężenie, akceptowalne dla większości osób";
  } else {
    return "Podwyższone stężenie, zalecana ostrożność";
  }
}

async function generateAirQualitySection() {
  try {
    const defaultLat = 52.2297;
    const defaultLng = 21.0122;
    const stations = await getStationsInBounds(defaultLat, defaultLng);
    
    if (!stations || stations.length === 0) {
      return "Brak dostępnych danych o jakości powietrza.";
    }

    const avgAQI = stations.reduce((sum, station) => sum + (typeof station.aqi === 'number' ? station.aqi : parseInt(station.aqi) || 0), 0) / stations.length;
    
    let stationsDetail = stations
      .map(station => `- ${station.station.name}: AQI ${station.aqi}`)
      .join('\n');

    return `**Aktualne Pomiary:**
* Średni wskaźnik AQI: ${Math.round(avgAQI)}
* Liczba stacji pomiarowych: ${stations.length}

**Szczegółowe dane ze stacji:**
${stationsDetail}`;
  } catch (error) {
    return "Nie udało się pobrać aktualnych danych o jakości powietrza.";
  }
}

function generateAirQualityInterpretation() {
  return `**Skala AQI (Air Quality Index):**
* 0-50: Dobra
* 51-100: Umiarkowana
* 101-150: Niezdrowa dla wrażliwych grup
* 151-200: Niezdrowa
* 201-300: Bardzo niezdrowa
* 300+: Niebezpieczna`;
}

function generateRecommendations() {
  return `**Rekomendacje:**
* Monitorowanie jakości powietrza w czasie rzeczywistym
* Instalacja dodatkowych czujników w kluczowych lokalizacjach
* Rozwój systemu powiadomień o przekroczeniach norm
* Współpraca z lokalnymi władzami w zakresie poprawy jakości powietrza`;
}
