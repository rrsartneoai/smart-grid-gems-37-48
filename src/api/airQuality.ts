interface AQICNResponse {
  status: string;
  data: {
    aqi: number;
    idx: number;
    city: {
      geo: [number, number];
      name: string;
    };
    iaqi: {
      pm25: { v: number };
      pm10: { v: number };
      co?: { v: number };
      no2?: { v: number };
      so2?: { v: number };
      o3?: { v: number };
      t?: { v: number };
      h?: { v: number };
    };
    time: {
      iso: string;
    };
  };
}

interface StationInfo {
  id: string;
  name: string;
  region: 'Gdańsk' | 'Gdynia' | 'Sopot';
}

const TROJMIASTO_STATIONS: StationInfo[] = [
  { id: '2677', name: 'Gdańsk-Śródmieście', region: 'Gdańsk' },
  { id: '2684', name: 'Gdańsk-Wrzeszcz', region: 'Gdańsk' },
  { id: '2685', name: 'Gdańsk-Stogi', region: 'Gdańsk' },
  { id: '2682', name: 'Gdańsk-Nowy Port', region: 'Gdańsk' },
  { id: '2687', name: 'Gdynia-Pogórze', region: 'Gdynia' },
  { id: '2686', name: 'Gdynia-Śródmieście', region: 'Gdynia' },
  { id: '2688', name: 'Sopot', region: 'Sopot' }
];

export const fetchAirQualityData = async () => {
  const AQICN_TOKEN = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';
  
  try {
    const promises = TROJMIASTO_STATIONS.map(station => 
      fetch(`https://api.waqi.info/feed/@${station.id}/?token=${AQICN_TOKEN}`)
        .then(response => response.json())
        .then((data: AQICNResponse) => {
          if (data.status === 'ok') {
            return {
              id: `aqicn-${data.data.idx}-${station.name}`,
              lat: data.data.city.geo[0],
              lng: data.data.city.geo[1],
              source: 'AQICN',
              stationName: station.name,
              region: station.region,
              pm25: data.data.iaqi.pm25?.v || 0,
              pm10: data.data.iaqi.pm10?.v || 0,
              timestamp: data.data.time.iso,
              additionalData: {
                aqi: data.data.aqi !== undefined ? data.data.aqi : null,
                temperature: data.data.iaqi.t?.v,
                humidity: data.data.iaqi.h?.v,
                co: data.data.iaqi.co?.v,
                no2: data.data.iaqi.no2?.v,
                so2: data.data.iaqi.so2?.v,
                o3: data.data.iaqi.o3?.v,
              }
            };
          }
          return null;
        })
    );

    const results = await Promise.all(promises);
    return results.filter(result => result !== null);
  } catch (error) {
    console.error('Błąd podczas pobierania danych z AQICN:', error);
    return [];
  }
};
