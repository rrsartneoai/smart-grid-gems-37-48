
import { getProjectData } from './projectDataStore';
import { getDocumentChunks } from './documentProcessor';
import { getGeminiResponse } from '@/lib/gemini';

// Automatically generate report based on documents and project data
export const generateReport = async (topic: string): Promise<string> => {
  try {
    const documentChunks = getDocumentChunks();
    const projectData = getProjectData();
    
    if (documentChunks.length === 0 && !projectData) {
      return "Brak danych do wygenerowania raportu. Wgraj dokumenty lub utwórz projekt.";
    }
    
    let context = '';
    
    // Add document chunks context
    if (documentChunks.length > 0) {
      context += "Kontekst z dokumentów:\n" + 
                documentChunks.slice(0, 3).map(chunk => chunk.text).join('\n\n');
    }
    
    // Add project data context if available
    if (projectData) {
      context += `\n\nDane projektu ${projectData.name || 'Brak nazwy'}:
        - Jakość powietrza: ${projectData.airQuality?.current || 'brak danych'}
        - Źródła energii: ${projectData.airQuality ? 
          `węgiel (${projectData.airQuality.sources.coal}%), 
          wiatr (${projectData.airQuality.sources.wind}%), 
          biomasa (${projectData.airQuality.sources.biomass}%),
          inne (${projectData.airQuality.sources.other}%)` : 'brak danych'}
        - Trendy: ${projectData.airQuality?.historical ? 
          projectData.airQuality.historical.map(h => `${h.time}: ${h.value}`).join(', ') : 
          'brak danych'}
      `;
    }
    
    const prompt = `
      Wygeneruj profesjonalny raport na temat: "${topic}".
      
      Użyj następującego kontekstu:
      ${context}
      
      Raport powinien zawierać:
      1. Wprowadzenie
      2. Analiza danych
      3. Wnioski
      4. Rekomendacje
      
      Format raportu powinien być przejrzysty, z nagłówkami i podpunktami.
    `;
    
    const report = await getGeminiResponse(prompt);
    return report;
  } catch (error) {
    console.error('Błąd podczas generowania raportu:', error);
    return "Wystąpił błąd podczas generowania raportu. Spróbuj ponownie później.";
  }
};
