
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "@/hooks/use-toast";

// Użyj klucza API z zmiennej środowiskowej lub użyj domyślnego
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "AIzaSyBicTIEjL3cvBSFUhlRX3vmMQZlqLXc0AQ";

// Sprawdź czy klucz API jest dostępny, ale nie wyświetlaj błędu, jeśli użyto wartości domyślnej
if (!import.meta.env.VITE_GOOGLE_API_KEY) {
  console.warn("Używam domyślnego klucza API dla Gemini. Zalecane jest dodanie własnego klucza poprzez VITE_GOOGLE_API_KEY.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_RETRIES = 3;
const BASE_DELAY = 2000; // 2 seconds initial delay

const isRateLimitError = (error: any) => {
  return error?.status === 429 || 
         error?.body?.includes("RATE_LIMIT_EXCEEDED") ||
         error?.body?.includes("RESOURCE_EXHAUSTED") ||
         (error?.message && (
           error.message.includes("RATE_LIMIT_EXCEEDED") || 
           error.message.includes("RESOURCE_EXHAUSTED") || 
           error.message.includes("429")
         ));
};

export const generateGeminiResponse = async (prompt: string, retryCount = 0): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error with Gemini API:", error);

    if (isRateLimitError(error) && retryCount < MAX_RETRIES) {
      const waitTime = BASE_DELAY * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Rate limited. Retrying in ${waitTime}ms...`);
      
      // Show toast to inform user about the retry
      toast({
        title: "Przekroczono limit zapytań",
        description: `Ponowna próba za ${waitTime/1000} sekund...`
      });
      
      await delay(waitTime);
      return generateGeminiResponse(prompt, retryCount + 1);
    }

    if (isRateLimitError(error)) {
      toast({
        title: "Przekroczono limit zapytań",
        description: "Proszę spróbować ponownie za kilka minut.",
        variant: "destructive"
      });
      return "Przepraszam, ale przekroczono limit zapytań do API. Proszę odczekać kilka minut i spróbować ponownie.";
    }

    // Authentication or API key issues
    if (error?.status === 403 || (error?.message && error.message.includes("API Key"))) {
      toast({
        title: "Problem z kluczem API",
        description: "Sprawdź czy klucz API Gemini jest poprawnie skonfigurowany.",
        variant: "destructive"
      });
      return "Przepraszam, wystąpił problem z uwierzytelnieniem klucza API. Proszę sprawdzić konfigurację klucza Gemini API.";
    }

    toast({
      title: "Błąd",
      description: "Wystąpił błąd podczas przetwarzania zapytania.",
      variant: "destructive"
    });
    return "Przepraszam, wystąpił błąd podczas przetwarzania zapytania. Proszę spróbować ponownie za chwilę.";
  }
};

// Alias for backward compatibility
export const getGeminiResponse = generateGeminiResponse;
