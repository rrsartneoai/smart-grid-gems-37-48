import { CityData } from "../types/SensorDataTypes";
import { sensorDescriptions } from "../constants/sensorDescriptions";

export const sopotData: CityData = {
  name: "Sopot",
  coordinates: {
    lat: 54.352,
    lon: 18.6466
  },
  sensors: [
    {
      iconType: "temperature",
      name: "Temp",
      value: "0",
      unit: "°C",
      status: "Good",
      description: sensorDescriptions.temp,
    },
    {
      iconType: "co",
      name: "CO",
      value: "2.7",
      unit: "ppm",
      status: "Good",
      description: sensorDescriptions.co2,
    },
    {
      iconType: "pm25",
      name: "PM 2.5",
      value: "33",
      unit: "µg/m³",
      status: "Good",
      description: sensorDescriptions.pm25,
    },
    {
      iconType: "pm10",
      name: "PM10",
      value: "15",
      unit: "µg/m³",
      status: "Good",
      description: sensorDescriptions.pm10,
    },
    {
      iconType: "humidity",
      name: "Humidity",
      value: "80",
      unit: "%",
      status: "Good",
      description: sensorDescriptions.humidity,
    },
    {
      iconType: "pressure",
      name: "Pressure",
      value: "1011",
      unit: "hPa",
      status: "Good",
      description: sensorDescriptions.pressure,
    },
  ],
};
