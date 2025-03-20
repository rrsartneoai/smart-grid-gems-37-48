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
import { AirQualitySource } from "./types/airQuality";
import "react-toastify/dist/ReactToastify.css";

export const PomeranianAirQuality = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [customSensors, setCustomSensors] = useState<SensorData[]>([]);
  
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
      if (data.connectionType === 'url' && data.stationId) {
        toast({
          title: "Pobieranie danych",
          description: `Pobieranie danych dla stacji ${data.stationId}...`
        });
        
        const stationId = data.stationId;
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
          region: result.data.city.name || 'Custom',
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
          stationName: data.name,
          region: 'Custom Region',
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

  const handleSearchSensor = (location: string, radius: number) => {
    console.log("Searching for sensors near:", location, "within radius:", radius, "km");
    
    toast({
      title: "Wyszukiwanie czujników",
      description: `Wyszukiwanie czujników w pobliżu ${location} (promień: ${radius}km)`
    });
    
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
      
      <AirlyMap customSensors={customSensors} />
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
