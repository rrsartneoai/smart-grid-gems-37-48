import { AirlyMap } from "@/components/pomerania/AirlyMap";

export interface AirQualityData {
    id: string;
    stationName: string;
    region: string;
    coordinates: [number, number];
    measurements: {
      aqi: number;
      pm25: number;
      pm10: number;
      temperature?: number;
      humidity?: number;
      timestamp: string;
    };
  }
  
export const fetchAirQualityData = async (): Promise<AirQualityData[]> => {
  try {
    //TODO: use a server action instead of directly fetching from client component
    const token = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';
    const baseUrl = 'https://api.waqi.info/feed/';

    const stationIds = [
      '@2684',  // Gdańsk-Wrzeszcz
      '@2679',  // Gdańsk-Nowy Port
      '@2681',   // Gdańsk-Szadółki
      'A465595',
      'A361813',
      'A232498', 
      'A63073',
      'A96541',
      'A251428',
      'A197050',
      'A192988',
      'A232498', // Duplicated, but including for completeness
      'A63073',  // Duplicated
      'A251428', // Duplicated
      'A77089',
      'A237496',
      '@2685',
      'A96541',  // Duplicated
      'A479593',
      'A72403',
      'A103345',
      'A62983',
      'A203761',
      'A93433',
      'A252829',
      '@2677',
      '@2678',
      'A176593',
      'A64192',
      'A197041',
      'A192865',
      'A370810',
      'A101890',
      'A467518',
      'A509191',
      'A251821',
      'A251821', // Duplicated
      'A104527'
    ];

    const responses = await Promise.all(
      stationIds.map(id => fetch(baseUrl + id + '/?token=' + token))
    );

    const results = await Promise.all(
      responses.map(async response => {
        if (!response.ok) {
          console.error('Failed to fetch data for ' + response.url);
          return null; // Return null for failed requests
        }
        return response.json();
      })
    );

    const stations: AirQualityData[] = [];

    results.forEach((result, index) => {
      // Use nullish coalescing operator to handle possible null values
      if (result?.status === 'ok') {
        const data = result.data;
        stations.push({
          id: 'aqicn-' + data.idx,
          stationName: data.city.name,
          region: 'Gdańsk',  // region information.
          coordinates: data.city.geo,
          measurements: {
            aqi: data.aqi,
            pm25: data.iaqi.pm25?.v || 0,
            pm10: data.iaqi.pm10?.v || 0,
            temperature: data.iaqi.t?.v,
            humidity: data.iaqi.h?.v,
            timestamp: data.time.iso
          }
        });
      } else {
        console.log("result", result, "index", index, "stationIds", stationIds[index]);
      }
    });

    return stations;
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return [];
  }
};