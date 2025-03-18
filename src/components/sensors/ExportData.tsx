
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { sensorsData } from "./SensorsData";
import { SensorData } from "./types/SensorDataTypes";

export interface ExportDataProps {
  sensors: SensorData[];
  city: string;
}

export const ExportData = ({ sensors, city }: ExportDataProps) => {
  const { toast } = useToast();

  const exportToExcel = () => {
    try {
      const data = sensors.map(sensor => ({
        Name: sensor.name,
        Value: sensor.value,
        Unit: sensor.unit,
        Status: sensor.status,
        City: sensorsData[city as keyof typeof sensorsData].name
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sensor Data");
      XLSX.writeFile(wb, "sensor-data.xlsx");

      toast({
        title: "Eksport zakończony",
        description: "Dane zostały wyeksportowane do pliku Excel."
      });
    } catch (error) {
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować danych.",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    try {
      const data = sensors.map(sensor => ({
        Name: sensor.name,
        Value: sensor.value,
        Unit: sensor.unit,
        Status: sensor.status,
        City: sensorsData[city as keyof typeof sensorsData].name
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sensor-data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Eksport zakończony",
        description: "Dane zostały wyeksportowane do pliku CSV."
      });
    } catch (error) {
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować danych.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Button onClick={exportToExcel}>
        Eksportuj do Excel
      </Button>
      <Button onClick={exportToCSV}>
        Eksportuj do CSV
      </Button>
    </div>
  );
};
