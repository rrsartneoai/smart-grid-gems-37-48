
import { Button } from "@/components/ui/button";
import { AnomaliesDisplay } from "./AnomaliesDisplay";
import { RecommendationsDisplay } from "./RecommendationsDisplay";
import { SensorReadingsDisplay } from "./SensorReadingsDisplay";
import { useAnomaliesAndRecommendations } from "@/hooks/useAnomaliesAndRecommendations";
import { useChat } from "@/contexts/ChatContext";

export function InsightsPanel() {
  const {
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
  } = useAnomaliesAndRecommendations();

  const { setInput, handleSubmit } = useChat();

  const handleGenerateReport = async () => {
    const reportQuery = await generateReport();
    setInput(reportQuery);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  // If there's no insight data, don't render the panel
  if (anomalies.length === 0 && recommendations.length === 0 && sensorReadings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <AnomaliesDisplay 
          showAnomalies={showAnomalies} 
          setShowAnomalies={setShowAnomalies} 
          anomalies={anomalies} 
        />
        
        <RecommendationsDisplay 
          showRecommendations={showRecommendations}
          setShowRecommendations={setShowRecommendations}
          recommendations={recommendations}
        />
        
        <SensorReadingsDisplay 
          showSensorReadings={showSensorReadings}
          setShowSensorReadings={setShowSensorReadings}
          sensorReadings={sensorReadings}
        />
        
        <Button
          onClick={handleGenerateReport}
          variant="outline"
          className="text-xs"
          size="sm"
        >
          Generuj raport
        </Button>
      </div>
    </div>
  );
}
