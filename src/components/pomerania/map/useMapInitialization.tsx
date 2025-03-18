
import { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import { AirQualityData, AirQualitySource } from "../types/airQuality";

interface AQICNData {
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

export const useMapInitialization = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AQICNData[]>([]);

  useEffect(() => {
    const fetchAQICNData = async () => {
      const AQICN_TOKEN = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';
      const stations = [
        // Gdańsk stations
        { id: '2684', name: 'Gdańsk-Wrzeszcz', region: 'Gdańsk' },
        { id: '2679', name: 'Gdańsk-Nowy Port', region: 'Gdańsk' },
        { id: '2681', name: 'Gdańsk-Szadółki', region: 'Gdańsk' },
        { id: '2685', name: 'Gdańsk-Stogi', region: 'Gdańsk' },
        { id: '2677', name: 'Gdańsk Station', region: 'Gdańsk' },
        { id: '2678', name: 'Gdańsk Station', region: 'Gdańsk' },
        // Additional stations
        { id: 'A465595', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A361813', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A232498', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A63073', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A96541', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A251428', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A197050', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A192988', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A77089', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A237496', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A479593', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A72403', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A103345', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A62983', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A203761', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A93433', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A252829', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A176593', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A64192', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A197041', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A192865', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A370810', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A101890', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A467518', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A509191', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A251821', name: 'Air Quality Station', region: 'Trójmiasto' },
        { id: 'A104527', name: 'Air Quality Station', region: 'Trójmiasto' }
      ];

      try {
        const promises = stations.map(station =>
          fetch(`https://api.waqi.info/feed/@${station.id}/?token=${AQICN_TOKEN}`)
            .then(res => res.json())
            .then(data => {
              if (data.status === 'ok') {
                return {
                  id: `aqicn-${station.id}`,
                  stationName: station.name,
                  region: station.region,
                  coordinates: data.data.city.geo as [number, number],
                  measurements: {
                    aqi: data.data.aqi,
                    pm25: data.data.iaqi.pm25?.v || 0,
                    pm10: data.data.iaqi.pm10?.v || 0,
                    temperature: data.data.iaqi.t?.v,
                    humidity: data.data.iaqi.h?.v,
                    timestamp: data.data.time.iso
                  }
                } as AQICNData;
              }
              return null;
            })
        );

        const results = await Promise.all(promises);
        const validResults = results.filter((result): result is AQICNData => result !== null);
        setStats(validResults);
        setIsLoading(false);
      } catch (err) {
        setError('Błąd podczas pobierania danych z czujników');
        setIsLoading(false);
      }
    };

    fetchAQICNData();
    const interval = setInterval(fetchAQICNData, 5 * 60 * 1000); // odświeżanie co 5 minut

    return () => clearInterval(interval);
  }, []);

  return { mapRef, isLoading, error, stats };
};
