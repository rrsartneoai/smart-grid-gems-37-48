
import { Button } from "@/components/ui/button";

interface RecommendationsDisplayProps {
  showRecommendations: boolean;
  setShowRecommendations: (show: boolean) => void;
  recommendations: string[];
}

export function RecommendationsDisplay({ showRecommendations, setShowRecommendations, recommendations }: RecommendationsDisplayProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowRecommendations(!showRecommendations)}
        variant="outline"
        className="text-xs"
        size="sm"
      >
        {showRecommendations ? "Ukryj rekomendacje" : "Pokaż rekomendacje"}
      </Button>

      {showRecommendations && (
        <div className="bg-muted p-3 rounded-md mb-4 text-sm">
          <h4 className="font-medium mb-2">Rekomendacje:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-xs">{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
