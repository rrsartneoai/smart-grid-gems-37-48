
import { FloatingChatbot } from "../FloatingChatbot";
import { Card } from "@/components/ui/card";
import { useCompanyStore } from "@/components/CompanySidebar";
import { companiesData } from "@/data/companies";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  Legend, Area, AreaChart, ComposedChart, Scatter,
} from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { UploadOptions } from "./UploadOptions";
import { ExportButtons } from "./ExportButtons";
import { ProjectData } from "../types/ProjectData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const calculateForecast = (data: any[]) => {
  if (!data || data.length === 0) return [];
  
  return data.map((item, index) => ({
    ...item,
    consumption: item.consumption ? item.consumption * 1.1 : undefined,
    production: item.production ? item.production * 1.15 : undefined,
    efficiency: item.efficiency ? Math.min(item.efficiency * 1.05, 100) : undefined,
    value: item.value ? Math.min(item.value * 0.9, 100) : undefined,
    forecastValue: item.value ? Math.min(item.value * 0.85, 100) : undefined
  }));
};

// Mock data for when real data is not available
const defaultProjectData: ProjectData = {
  name: "Domyślny Projekt",
  airQuality: {
    historical: [
      { time: "Styczeń", value: 25 },
      { time: "Luty", value: 28 },
      { time: "Marzec", value: 32 },
      { time: "Kwiecień", value: 22 },
      { time: "Maj", value: 18 },
      { time: "Czerwiec", value: 15 }
    ],
    current: 22,
    sources: {
      coal: 30,
      wind: 25,
      biomass: 20,
      other: 25
    }
  },
  efficiency: [
    { name: "Styczeń", value: 65 },
    { name: "Luty", value: 68 },
    { name: "Marzec", value: 72 },
    { name: "Kwiecień", value: 78 },
    { name: "Maj", value: 82 },
    { name: "Czerwiec", value: 85 }
  ],
  correlation: [
    { name: "Styczeń", consumption: 120, efficiency: 65 },
    { name: "Luty", consumption: 115, efficiency: 68 },
    { name: "Marzec", consumption: 118, efficiency: 72 },
    { name: "Kwiecień", consumption: 110, efficiency: 78 },
    { name: "Maj", consumption: 105, efficiency: 82 },
    { name: "Czerwiec", consumption: 100, efficiency: 85 }
  ]
};

export function CompanyAnalysis() {
  const { toast } = useToast();
  const { selectedCompanyId } = useCompanyStore();
  const selectedCompany = companiesData.find(
    (company) => company.id === selectedCompanyId
  );
  const [showForecast, setShowForecast] = useState(false);
  
  // Jeśli nie ma danych z wybranej firmy, użyj defaultProjectData
  // W prawdziwej implementacji tutaj pobralibyśmy dane projektu z bazy danych lub kontekstu
  const projectData: ProjectData = selectedCompanyId.startsWith("Nowy Projekt") 
    ? { ...defaultProjectData, name: selectedCompanyId }
    : defaultProjectData;

  const handleExport = async (format: 'pdf' | 'jpg' | 'xlsx' | 'csv') => {
    try {
      const element = document.getElementById('company-analysis');
      if (!element) {
        throw new Error('Export element not found');
      }

      if (format === 'pdf' || format === 'jpg') {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          scale: 2
        });
        
        if (format === 'jpg') {
          const link = document.createElement('a');
          link.download = `company-analysis-${Date.now()}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 1.0);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const imgData = canvas.toDataURL('image/png', 1.0);
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm'
          });
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`company-analysis-${Date.now()}.pdf`);
        }
      } else {
        // Przygotuj dane do eksportu w formacie XLSX/CSV
        const airQualityHistorical = projectData.airQuality?.historical || [];
        const dataToExport = [
          ...airQualityHistorical.map(item => ({
            category: 'Jakość powietrza',
            period: item.time,
            value: item.value,
            forecast: showForecast ? (item.value * 0.85) : null
          })),
          ...projectData.efficiency.map(item => ({
            category: 'Wydajność',
            period: item.name,
            value: item.value,
            forecast: showForecast ? (item.value * 1.05) : null
          })),
          ...projectData.correlation.map(item => ({
            category: 'Korelacja',
            period: item.name,
            consumption: item.consumption,
            efficiency: item.efficiency,
            forecast_consumption: showForecast ? (item.consumption * 1.1) : null,
            forecast_efficiency: showForecast ? (item.efficiency * 1.05) : null
          }))
        ];
        
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Analysis Data");
        
        if (format === 'csv') {
          XLSX.writeFile(wb, `company-analysis-${Date.now()}.csv`);
        } else {
          XLSX.writeFile(wb, `company-analysis-${Date.now()}.xlsx`);
        }
      }

      toast({
        title: "Export completed",
        description: `File exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred during export. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Przygotuj dane do wykresów
  const airQualityData = showForecast && projectData.airQuality?.historical
    ? [...projectData.airQuality.historical, ...calculateForecast(projectData.airQuality.historical)] 
    : projectData.airQuality?.historical || [];
    
  const efficiencyData = showForecast
    ? [...projectData.efficiency, ...calculateForecast(projectData.efficiency)]
    : projectData.efficiency;
    
  const correlationData = showForecast
    ? [...projectData.correlation, ...calculateForecast(projectData.correlation)]
    : projectData.correlation;
    
  const sourcesData = projectData.airQuality ? [
    { name: "Energia węglowa", value: projectData.airQuality.sources.coal },
    { name: "Energia wiatrowa", value: projectData.airQuality.sources.wind },
    { name: "Biomasa", value: projectData.airQuality.sources.biomass },
    { name: "Inne źródła", value: projectData.airQuality.sources.other },
  ] : [];

  return (
    <div className="relative">
      <div className="grid gap-6" id="company-analysis">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-bold">
            Analiza dla projektu - {projectData.name}
          </h2>
          <ExportButtons 
            onExport={handleExport}
            onGenerateForecast={() => setShowForecast(true)}
            showForecast={showForecast}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trendy stanu jakości powietrza</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={airQualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="forecastValue"
                    name="Przewidywane"
                    stroke="#8884d8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Aktualne"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analiza wydajności</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Wydajność"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  {showForecast && (
                    <Area
                      type="monotone"
                      dataKey="forecastValue"
                      name="Przewidywana wydajność"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      strokeDasharray="5 5"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Źródła zanieczyszczeń</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analiza korelacji</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consumption" name="Zużycie" fill="#8884d8" />
                  <Scatter dataKey="efficiency" name="Wydajność" fill="#82ca9d" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <UploadOptions />
      </div>
      <FloatingChatbot />
    </div>
  );
}
