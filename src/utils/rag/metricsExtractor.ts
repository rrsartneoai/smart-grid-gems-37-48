
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

// Extract key metrics from text documents
export const extractKeyMetrics = async (text: string): Promise<Record<string, number | string>> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro"
    });
    
    const prompt = `
      Przeanalizuj poniższy tekst i wyodrębnij kluczowe wartości liczbowe dotyczące jakości powietrza, 
      zużycia energii lub wskaźników środowiskowych. Zwróć wyniki w formacie JSON.
      Przykładowy format odpowiedzi:
      {
        "PM10": 45.2,
        "PM2.5": 22.1,
        "zużycie_energii": 120.5,
        "emisja_CO2": 85.4
      }
      
      Tekst do analizy:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const metricsString = response.text();
    
    try {
      const cleanMetricsString = metricsString.replace(/```(json)?\n?|```/g, '').trim();
      console.log("Original metricsString:", metricsString);
      console.log("Cleaned metricsString:", cleanMetricsString);
      if (!cleanMetricsString || cleanMetricsString === "{}") {
          console.warn("Brak metryk do wyodrębnienia lub pusty JSON.");
          return { error: "Nie udało się wyodrębnić metryk w odpowiednim formacie" };
      }
      try {
        return JSON.parse(cleanMetricsString);
      } catch (e) {
        console.error('Błąd parsowania JSON z metrykami:', e, "String to parse:", cleanMetricsString);
        return { error: "Nie udało się wyodrębnić metryk w odpowiednim formacie" };
      }
    } catch (e) {
      console.error('Błąd parsowania JSON z metrykami:', e);
      return { error: "Nie udało się wyodrębnić metryk w odpowiednim formacie" };
    }
  } catch (error) {
    console.error('Błąd podczas ekstrakcji metryk:', error);
    return { error: "Wystąpił błąd podczas analizy dokumentu" };
  }
};
