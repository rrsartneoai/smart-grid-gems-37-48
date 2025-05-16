
export type AirQualitySource = 'AQICN' | 'GIOS' | 'Airly';
export type StationRegion = 'Sopot' | 'Gdynia' | 'Gdańsk';

export interface AirQualityMeasurements {
  aqi: number;
  pm25: number;
  pm10: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
  humidity?: number;
  pressure?: number;
  temperature?: number;
  wind?: number;
  timestamp: string;
  source: AirQualitySource;
}

export interface HistoricalData {
  timestamp: string;
  values: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
    humidity?: number;
    pressure?: number;
    temperature?: number;
    wind?: number;
  };
}

export interface AirQualityData {
  id: string;
  stationName: string;
  region: string;
  coordinates: [number, number];
  measurements: AirQualityMeasurements;
  history?: HistoricalData[];
}
