
import { useState } from 'react';
import { getProjectData } from '@/utils/rag';
import { detectAnomalies, generateRecommendations, simulateScenario } from '@/utils/advancedAnalysis';
import { useToast } from '@/hooks/use-toast';
import { ProjectData } from '@/components/types/ProjectData';

export const useAdvancedRagProcessing = () => {
  const { toast } = useToast();
  const [anomalyCount, setAnomalyCount] = useState(0);
  const [recommendationsCount, setRecommendationsCount] = useState(0);
  
  /**
   * Analyzes the project data to detect anomalies and generates recommendations
   * Returns true if project data is available, false otherwise
   */
  const analyzeProjectData = async (): Promise<boolean> => {
    const projectData = getProjectData();
    if (!projectData) {
      toast({
        title: "Brak danych projektu",
        description: "Wygeneruj projekt w sekcji 'Przestrzenie' lub wczytaj dane.",
        variant: "destructive"
      });
      return false;
    }
    
    // Detect anomalies
    const anomalies = detectAnomalies(projectData);
    setAnomalyCount(anomalies.length);
    
    // Check for critical anomalies and show a toast
    const criticalAnomalies = anomalies.filter(a => a.severity === 'high');
    if (criticalAnomalies.length > 0) {
      toast({
        title: "Wykryto krytyczne anomalie",
        description: criticalAnomalies[0].message,
        variant: "destructive"
      });
    }
    
    // Generate recommendations
    const recommendations = await generateRecommendations(projectData);
    setRecommendationsCount(recommendations.length);
    
    return true;
  };
  
  /**
   * Simulates a scenario and returns the simulation results
   */
  const runScenarioSimulation = (
    scenarioType: 'renewable_increase' | 'technology_upgrade' | 'weather_change'
  ): { 
    original: ProjectData | null; 
    simulated: ProjectData | null; 
    success: boolean; 
    message: string;
  } => {
    const projectData = getProjectData();
    
    if (!projectData) {
      return {
        original: null,
        simulated: null,
        success: false,
        message: "Brak danych projektu. Wygeneruj projekt w sekcji 'Przestrzenie' lub wczytaj dane."
      };
    }
    
    try {
      const simulatedData = simulateScenario(projectData, scenarioType);
      
      // Generate descriptive message based on scenario type
      let message = '';
      switch (scenarioType) {
        case 'renewable_increase':
          message = `Symulacja pokazuje, że zwiększenie udziału energii odnawialnej o 20% mogłoby zredukować poziom zanieczyszczeń powietrza o około 15% i zwiększyć wydajność systemu o około 10%.`;
          break;
        case 'technology_upgrade':
          message = `Symulacja pokazuje, że modernizacja technologii mogłaby zwiększyć wydajność systemu o około 15% i zredukować zużycie energii o około 20%.`;
          break;
        case 'weather_change':
          message = `Symulacja pokazuje, że ekstremalne warunki pogodowe mogłyby pogorszyć jakość powietrza o około 30% i zwiększyć zużycie energii o około 25%.`;
          break;
      }
      
      return {
        original: projectData,
        simulated: simulatedData,
        success: true,
        message
      };
    } catch (error) {
      console.error("Error in scenario simulation:", error);
      return {
        original: projectData,
        simulated: null,
        success: false,
        message: "Wystąpił błąd podczas symulacji scenariusza."
      };
    }
  };
  
  return {
    analyzeProjectData,
    runScenarioSimulation,
    anomalyCount,
    recommendationsCount
  };
};
