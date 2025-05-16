import { useState, useEffect } from "react";
import { InfoCard } from "./InfoCard";
import { ActionButtons } from "./ActionButtons";
import { AirlyMap } from "./AirlyMap";
import { AqicnMapEmbed } from "./maps/AqicnMapEmbed";
import { AirlyMapEmbed } from "./maps/AirlyMapEmbed";
import { AirQualitySpaces } from "./AirQualitySpaces";
import { AddSensorDialog, SensorFormValues } from "./dialogs/AddSensorDialog";
import { RemoveSensorDialog } from "./dialogs/RemoveSensorDialog";
import { SearchSensorDialog } from "./dialogs/SearchSensorDialog";
import { toast } from "@/hooks/use-toast";
import { SensorData } from "./types/sensors";
import { searchStationsNear } from "@/utils/services/waqiService";
import { isInTriCity } from "@/utils/locationUtils";

export const PomeranianAirQuality = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [customSensors, setCustomSensors] = useState<SensorData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  
  useEffect(() => {
    const savedSensors = localStorage.getItem('customAirQualitySensors');
    if (savedSensors) {
      try {
        setCustomSensors(JSON.parse(savedSensors));
      } catch (error) {
        console.error('Error loading saved sensors:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (customSensors.length > 0) {
      localStorage.setItem('customAirQualitySensors', JSON.stringify(customSensors));
    }
  }, [customSensors]);
  
  const handleAddSensor = async (data: SensorFormValues) => {
    try {
      if (data.connectionType === 'url' && data.connectionValue) {
        toast({
          title: "Pobieranie danych",
          description: `Pobieranie danych dla stacji...`
        });
        
        let stationId = '';
        if (data.connectionValue.includes('@')) {
          const matches = data.connectionValue.match(/@(\d+)/);
          if (matches && matches[1]) {
            stationId = matches[1];
          }
        } else if (data.connectionValue.includes('feed/')) {
          const matches = data.connectionValue.match(/feed\/(\d+)/);
          if (matches && matches[1]) {
            stationId = matches[1];
          }
        }
        
        if (!stationId) {
          throw new Error('Nie można rozpoznać ID stacji z podanego URL');
        }
        
        const AQICN_TOKEN = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';
        
        const response = await fetch(`https://api.waqi.info/feed/@${stationId}/?token=${AQICN_TOKEN}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching station data: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status !== 'ok') {
          throw new Error(`API error: ${result.status}`);
        }
        
        const newSensor: SensorData = {
          id: `custom-aqicn-${stationId}`,
          stationName: data.name || result.data.city.name || `Stacja ${stationId}`,
          region: result.data.city.name || 'Trójmiasto',
          lat: result.data.city.geo[0],
          lng: result.data.city.geo[1],
          pm25: result.data.iaqi.pm25?.v || 0,
          pm10: result.data.iaqi.pm10?.v || 0,
          timestamp: result.data.time.iso,
          additionalData: {
            aqi: result.data.aqi,
            temperature: result.data.iaqi.t?.v,
            humidity: result.data.iaqi.h?.v,
            co: result.data.iaqi.co?.v,
            no2: result.data.iaqi.no2?.v,
            so2: result.data.iaqi.so2?.v,
            o3: result.data.iaqi.o3?.v,
            source: 'AQICN'
          }
        };
        
        setCustomSensors(prev => [...prev, newSensor]);
        
        toast({
          title: "Sukces",
          description: `Dodano czujnik: ${newSensor.stationName}`
        });
      } else {
        toast({
          title: "Dodano czujnik",
          description: `Dodano czujnik: ${data.name} (dane demonstracyjne)`
        });
        
        const newSensor: SensorData = {
          id: `custom-${Date.now()}`,
          stationName: data.name || 'Nowa stacja',
          region: 'Trójmiasto',
          lat: 54.372158,
          lng: 18.638306,
          pm25: Math.floor(Math.random() * 50),
          pm10: Math.floor(Math.random() * 80),
          timestamp: new Date().toISOString(),
          additionalData: {
            aqi: Math.floor(Math.random() * 100),
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 30,
            source: 'AQICN'
          }
        };
        
        setCustomSensors(prev => [...prev, newSensor]);
      }
    } catch (error) {
      console.error('Error adding sensor:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się dodać czujnika: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
    
    setIsAddDialogOpen(false);
  };

  const handleRemoveSensor = (sensorId: string) => {
    const sensor = customSensors.find(s => s.id === sensorId);
    
    if (sensor) {
      setCustomSensors(prev => prev.filter(s => s.id !== sensorId));
      toast({
        title: "Usunięto czujnik", 
        description: `Usunięto czujnik: ${sensor.stationName}`
      });
    } else {
      toast({
        title: "Błąd",
        description: "Nie znaleziono czujnika o podanym ID",
        variant: "destructive"
      });
    }
    
    setIsRemoveDialogOpen(false);
  };

  const handleSearchSensor = async (location: string, radius: number, coordinates: {lat: number, lng: number} | null) => {
    console.log("Searching for sensors near:", location, "within radius:", radius, "km");
    
    toast({
      title: "Wyszukiwanie czujników",
      description: `Wyszukiwanie czujników w pobliżu ${location} (promień: ${radius}km)`
    });
    
    if (!coordinates) {
      toast({
        title: "Błąd",
        description: "Nie można znaleźć współrzędnych dla podanej lokalizacji",
        variant: "destructive"
      });
      return;
    }
    
    setMapCenter([coordinates.lat, coordinates.lng]);
    
    try {
      setIsSearching(true);
      const stations = await searchStationsNear(coordinates.lat, coordinates.lng, radius);
      
      if (!stations || stations.length === 0) {
        toast({
          title: "Brak wyników",
          description: `Nie znaleziono stacji pomiarowych w pobliżu ${location}`
        });
        setIsSearching(false);
        return;
      }
      
      const newSensors: SensorData[] = stations.map(station => {
        if (!station || !station.station || !Array.isArray(station.station.geo) || station.station.geo.length < 2) {
          console.log("Invalid station data:", station);
          return null;
        }
        
        return {
          id: `search-aqicn-${station.uid}`,
          stationName: station.station.name,
          region: isInTriCity(station.station.geo[0], station.station.geo[1]) ? 'Trójmiasto' : location,
          lat: station.station.geo[0],
          lng: station.station.geo[1],
          pm25: 0,
          pm10: 0,
          timestamp: new Date().toISOString(),
          additionalData: {
            aqi: typeof station.aqi === 'string' ? parseInt(station.aqi) : station.aqi,
            source: 'AQICN'
          }
        };
      }).filter(Boolean) as SensorData[];
      
      setCustomSensors(prev => {
        const filteredPrev = prev.filter(s => !s.id.startsWith('search-'));
        return [...filteredPrev, ...newSensors];
      });
      
      toast({
        title: "Znaleziono stacje",
        description: `Znaleziono ${newSensors.length} stacji pomiarowych w pobliżu ${location}`
      });
      
    } catch (error) {
      console.error("Error searching for sensors:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas wyszukiwania stacji",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
    
    setIsSearchDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <InfoCard />
      
      <ActionButtons 
        onAddClick={() => setIsAddDialogOpen(true)}
        onRemoveClick={() => setIsRemoveDialogOpen(true)}
        onSearchClick={() => setIsSearchDialogOpen(true)}
      />
      
      <AirlyMap customSensors={customSensors} center={mapCenter} />
      <AqicnMapEmbed />
      <AirlyMapEmbed />
      <AirQualitySpaces />

      <AddSensorDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddSensor}
      />
      
      <RemoveSensorDialog 
        isOpen={isRemoveDialogOpen} 
        onOpenChange={setIsRemoveDialogOpen}
        onSubmit={handleRemoveSensor}
        sensors={customSensors}
      />
      
      <SearchSensorDialog 
        isOpen={isSearchDialogOpen} 
        onOpenChange={setIsSearchDialogOpen}
        onSubmit={handleSearchSensor}
      />
    </div>
  );
};
