
import { useState, useEffect } from 'react';
import { useCompanyStore } from "@/components/CompanySidebar";
import { useToast } from "@/hooks/use-toast";
import { getProjectData } from "@/utils/rag";
import { detectAnomalies, generateRecommendations } from "@/utils/advancedAnalysis";
import { useSensorReadings, SensorReading } from "@/hooks/chat/useSensorReadings";

export const useAnomaliesAndRecommendations = () => {
  const [showAnomalies, setShowAnomalies] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSensorReadings, setShowSensorReadings] = useState(false);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const { selectedCompanyId } = useCompanyStore();
  const { toast } = useToast();
  const { getSensorReadings } = useSensorReadings();

  useEffect(() => {
    // Check for anomalies in project data when selected company changes
    const projectData = getProjectData();
    if (projectData) {
      const detectedAnomalies = detectAnomalies(projectData);
      setAnomalies(detectedAnomalies);
      
      if (detectedAnomalies.length > 0) {
        // Show toast for critical anomalies
        const criticalAnomalies = detectedAnomalies.filter(a => a.severity === 'high');
        if (criticalAnomalies.length > 0) {
          toast({
            title: "Wykryto krytyczne anomalie",
            description: criticalAnomalies[0].message,
            variant: "destructive"
          });
        }
      }
      
      // Generate recommendations based on project data
      generateRecommendations(projectData).then(recs => {
        setRecommendations(recs);
      });
      
      // Get sensor readings
      const readings = getSensorReadings();
      setSensorReadings(readings);
    }
  }, [selectedCompanyId, toast]);

  const generateReport = async () => {
    return "Wygeneruj raport na temat aktualnego stanu jakości powietrza i zużycia energii w projekcie.";
  };

  return {
    showAnomalies,
    setShowAnomalies,
    anomalies,
    recommendations,
    showRecommendations,
    setShowRecommendations,
    showSensorReadings,
    setShowSensorReadings,
    sensorReadings,
    generateReport
  };
};
