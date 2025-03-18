import { SensorResponse } from "@/types/chat";
import { 
  getAirQualityStations, 
  getStationByName,
  fetchAirQualityStations 
} from "@/utils/rag/projectDataStore";
import { fetchAqicnData } from "@/services/airQuality/aqicnService";
import { getAqiLevelInfo } from "@/services/airQuality/aqicnDataTransformation";

/**
 * Process queries related to air quality station data
 */
export const processStationDataQuery = async (query: string): Promise<SensorResponse> => {
  try {
    // First check if we need to refresh station data
    const stationData = getAirQualityStations();
    if (stationData.length === 0) {
      await fetchAirQualityStations();
    }

    // Process the query to identify the station
    const lowerQuery = query.toLowerCase();
    let stationId = "@2684"; // Default to Gdańsk Wrzeszcz
    let stationName = "Gdańsk Wrzeszcz";

    // Map query keywords to station IDs
    if (lowerQuery.includes("sopot")) {
      stationId = "@2688";
      stationName = "Sopot";
    } else if (lowerQuery.includes("gdynia")) {
      stationId = "@2686";
      stationName = "Gdynia Śródmieście";
    } else if (lowerQuery.includes("stogi")) {
      stationId = "@2685";
      stationName = "Gdańsk Stogi";
    }

    // Fetch real-time data from WAQI API
    const data = await fetchAqicnData(stationId);
    if (!data) {
      return {
        text: `Unable to fetch data from ${stationName} station. Please try again later.`,
        visualizations: []
      };
    }

    // Transform WAQI data into standardized format with detailed metrics
    const timestamp = new Date(data.time.iso);
    const formattedTime = timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = timestamp.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });

    const sensorData = {
      location: stationName,
      provider: "WAQI",
      timestamp: data.time?.iso || new Date().toISOString(),
      airQualityIndex: data.aqi,
      readings: {
        "PM2.5": { value: data.iaqi?.pm25?.v || "N/A", unit: "μg/m³" },
        "PM10": { value: data.iaqi?.pm10?.v || "N/A", unit: "μg/m³" },
        "O3": { value: data.iaqi?.o3?.v || "N/A", unit: "μg/m³" },
        "NO2": { value: data.iaqi?.no2?.v || "N/A", unit: "μg/m³" }
      },
      temperature: data.iaqi?.t?.v || "N/A",
      humidity: data.iaqi?.h?.v || "N/A",
      pressure: data.iaqi?.p?.v || "N/A"
    };

    // Get AQI level information
    const aqiInfo = getAqiLevelInfo(data.aqi);

    // Prepare response text with comprehensive information
    const responseText = `Air Quality Report for ${stationName}:\n\n` +
      `AQI: ${data.aqi} (${aqiInfo.description})\n` +
      `Status: ${aqiInfo.level}\n` +
      `Health Advice: ${aqiInfo.advice}\n\n` +
      `Detailed Measurements:\n` +
      `- PM2.5: ${sensorData.readings["PM2.5"].value} μg/m³\n` +
      `- PM10: ${sensorData.readings["PM10"].value} μg/m³\n` +
      `- Temperature: ${sensorData.temperature}°C\n` +
      `- Humidity: ${sensorData.humidity}%\n` +
      `- Pressure: ${sensorData.pressure} hPa`;

    return {
      text: responseText,
      visualizations: [{
        type: "sensorReading",
        title: `Air Quality Station: ${stationName}`,
        data: sensorData
      }]
    };
  } catch (error) {
    console.error("Error processing station data query:", error);
    return {
      text: "An error occurred while processing your request. Please try again later.",
      visualizations: []
    };
  }
};

export const isAirQualityStationQuery = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return lowerQuery.includes("air quality") || lowerQuery.includes("aqi");
};
// Export the detection function for use in the main query processor
