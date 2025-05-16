
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { SensorData } from './types/SensorDataTypes';
import { useState, useEffect } from 'react';

export interface HistoricalChartProps {
  sensor: SensorData;
}

export const HistoricalChart = ({ sensor }: HistoricalChartProps) => {
  const [data, setData] = useState<Array<{ timestamp: string; value: number }>>([]);

  useEffect(() => {
    // Mock historical data for demonstration
    const generateMockData = () => {
      const now = new Date();
      return Array.from({ length: 24 }, (_, i) => {
        const time = new Date(now);
        time.setHours(time.getHours() - (23 - i));
        
        // Generate a value based on the real sensor value with some random variation
        const baseValue = parseFloat(sensor.value);
        const randomVariation = (Math.random() - 0.5) * 20; // +/- 10%
        const value = Math.max(0, baseValue + randomVariation);
        
        return {
          timestamp: `${time.getHours()}:00`,
          value: Math.round(value * 10) / 10
        };
      });
    };
    
    setData(generateMockData());
  }, [sensor]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{sensor.name} - Dane historyczne</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="timestamp" />
            <YAxis unit={sensor.unit} />
            <Tooltip 
              formatter={(value: number) => [`${value} ${sensor.unit}`, sensor.name]}
              labelFormatter={(label) => `Godzina: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
