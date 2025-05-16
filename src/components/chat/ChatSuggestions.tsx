
import React from "react";
import { Button } from "../ui/button";

const suggestions = [
  "Jaki jest aktualny stan jakości powietrza?",
  "Pokaż analizę zanieczyszczeń powietrza",
  "Jakie są trendy w jakości powietrza?",
  "Wygeneruj raport stanu powietrza",
  "Porównaj jakość powietrza między lokalizacjami",
  "Podaj dane z czujników z projektu",
  "Pokaż wszystkie odczyty czujników",
  "Prognoza jakości powietrza",
  "Rekomendacje",
  "Lista wszystkich stacji pomiarowych w okolicy"  // Replaced empty string with actual suggestion
];

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
