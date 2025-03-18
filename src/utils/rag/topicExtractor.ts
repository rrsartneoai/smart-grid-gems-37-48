
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

export async function extractMainTopics(text: string): Promise<string[]> {
  try {
    console.log('Rozpoczynam ekstrakcję głównych tematów...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro"
    });
    
    const prompt = `
      Przeanalizuj poniższy tekst i wypisz 8 najważniejszych zagadnień lub tematów.
      Wypisz je w formie krótkich, zwięzłych haseł (maksymalnie 3-4 słowa na temat).
      
      Tekst do analizy:
      ${text}
      
      Zwróć dokładnie 8 głównych tematów, każdy w nowej linii, bez numeracji i dodatkowych oznaczeń.
      Format odpowiedzi - tylko tematy, jeden pod drugim:
      Temat pierwszy
      Temat drugi
      Temat trzeci
      Temat czwarty
      Temat piąty
      Temat szósty
      Temat siódmy
      Temat ósmy
    `;

    console.log('Wysyłam zapytanie do modelu Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const topicsString = response.text();
    
    console.log('Otrzymano odpowiedź od modelu:', topicsString);
    
    const topics = topicsString
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 8);

    console.log('Przetworzone tematy:', topics);
    
    if (topics.length !== 8) {
      console.warn('Nieoczekiwana liczba tematów:', topics.length);
      while (topics.length < 8) {
        topics.push('Analizowanie treści...');
      }
    }

    return topics;
  } catch (error) {
    console.error('Błąd podczas ekstrakcji tematów:', error);
    throw new Error("Wystąpił błąd podczas analizy dokumentu. Spróbuj ponownie później.");
  }
}
