
import { AirQualityData, AirQualitySource } from '../../types/airQuality';

const AQICN_STATIONS = [
  { id: '2684', name: 'Gdańsk-Wrzeszcz', region: 'Gdańsk' },
  { id: '2683', name: 'Gdańsk-Śródmieście', region: 'Gdańsk' },
  { id: '2685', name: 'Gdańsk-Stogi', region: 'Gdańsk' },
  { id: '2682', name: 'Gdańsk-Nowy Port', region: 'Gdańsk' },
  { id: '2687', name: 'Gdynia-Pogórze', region: 'Gdynia' },
  { id: '2686', name: 'Gdynia-Śródmieście', region: 'Gdynia' },
  { id: '2688', name: 'Sopot', region: 'Sopot' }
] as const;

export async function fetchAQICNData(): Promise<AirQualityData[]> {
  const AQICN_TOKEN = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';

  try {
    const results = await Promise.all(
      AQICN_STATIONS.map(async (station) => {
        try {
          const response = await fetch(
            `https://api.waqi.info/feed/@${station.id}/?token=${AQICN_TOKEN}`
          );
          const data = await response.json();
          
          if (data.status === 'ok' && data.data) {
            const result: AirQualityData = {
              id: `aqicn-${station.id}`,
              stationName: station.name,
              region: station.region,
              coordinates: data.data.city.geo,
              measurements: {
                aqi: data.data.aqi,
                pm25: data.data.iaqi.pm25?.v || 0,
                pm10: data.data.iaqi.pm10?.v || 0,
                o3: data.data.iaqi.o3?.v,
                no2: data.data.iaqi.no2?.v,
                so2: data.data.iaqi.so2?.v,
                co: data.data.iaqi.co?.v,
                temperature: data.data.iaqi.t?.v,
                humidity: data.data.iaqi.h?.v,
                pressure: data.data.iaqi.p?.v,
                wind: data.data.iaqi.w?.v,
                timestamp: data.data.time.iso,
                source: 'AQICN'
              }
            };
            return result;
          }
        } catch (error) {
          console.error(`AQICN - Błąd dla stacji ${station.name}:`, error);
        }
        return null;
      })
    );

    return results.filter((result): result is AirQualityData => result !== null);
  } catch (error) {
    console.error('AQICN - Błąd ogólny:', error);
    return [];
  }
}
