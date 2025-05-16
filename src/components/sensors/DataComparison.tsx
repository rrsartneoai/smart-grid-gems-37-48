
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sensorsData } from "./SensorsData";
import { HistoricalChart } from './HistoricalChart';
import { ComparisonChart } from './ComparisonChart';
import { SensorData } from './types/SensorDataTypes';

export interface DataComparisonProps {
  sensors: SensorData[];
}

export const DataComparison = ({ sensors }: DataComparisonProps) => {
  const [city1, setCity1] = useState('gdansk');
  const [city2, setCity2] = useState('sopot');
  const [parameter, setParameter] = useState('PM2.5');

  const cities = Object.keys(sensorsData);
  const parameters = sensors.map(s => s.name);

  // Mock historical data - in real app, this would come from API
  const mockHistoricalData = (cityName: string) => {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${i}:00`,
      value: Math.random() * 50
    }));
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Porównanie danych</h3>
      <div className="grid gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <Select value={city1} onValueChange={setCity1}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz miasto 1" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>
                  {sensorsData[city as keyof typeof sensorsData].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={city2} onValueChange={setCity2}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz miasto 2" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>
                  {sensorsData[city as keyof typeof sensorsData].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={parameter} onValueChange={setParameter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz parametr" />
            </SelectTrigger>
            <SelectContent>
              {parameters.map(param => (
                <SelectItem key={param} value={param}>
                  {param}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          <ComparisonChart
            data1={mockHistoricalData(city1)}
            data2={mockHistoricalData(city2)}
            title={`${parameter} - porównanie`}
            city1={city1}
            city2={city2}
            unit="µg/m³"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <HistoricalChart
              sensor={sensors.find(s => s.name === parameter) || sensors[0]}
            />
            <HistoricalChart
              sensor={sensors.find(s => s.name === parameter) || sensors[0]}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
